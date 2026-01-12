/**
 * Chat Context Provider
 *
 * Manages global chat state including:
 * - Conversations list
 * - Messages for each conversation
 * - Active conversation
 * - Widget state (open/minimized)
 * - Real-time updates via Socket.IO
 * - Typing indicators
 *
 * Follows the same pattern as AuthContext and NotificationContext
 */

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useAuth } from "@/lib/auth-context";
import { getSocket } from "@/lib/socket";
import type {
  ChatContextType,
  ChatConversation,
  ChatMessage,
  TypingIndicator,
  CreateMessageDTO,
  ConversationType,
  MessageStatus,
  NewMessageSocketPayload,
  TypingSocketPayload,
  MessageStatusSocketPayload,
} from "@/types/chat";
import * as chatService from "@/lib/services/chat.service";

// Create context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  // State
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversation, setActiveConversationState] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [typingIndicators, setTypingIndicators] = useState<TypingIndicator[]>([]);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isWidgetMinimized, setIsWidgetMinimized] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Refs for debouncing and tracking
  const typingTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const unreadCount = useMemo(() => {
    return conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  }, [conversations]);

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  // Load conversations on mount
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  async function loadConversations() {
    try {
      setIsLoading(true);
      const data = await chatService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // ============================================================================
  // SOCKET.IO INTEGRATION
  // ============================================================================

  useEffect(() => {
    if (!user) return;

    const socket = getSocket();

    // Join user's chat room
    socket.emit("join-chat", user.userId);

    // Listen for new messages
    socket.on("new-message", handleNewMessageSocket);

    // Listen for typing indicators
    socket.on("user-typing", handleTypingSocket);

    // Listen for message status updates
    socket.on("message-status", handleMessageStatusSocket);

    // Listen for new conversations
    socket.on("new-conversation", handleNewConversationSocket);

    return () => {
      socket.off("new-message", handleNewMessageSocket);
      socket.off("user-typing", handleTypingSocket);
      socket.off("message-status", handleMessageStatusSocket);
      socket.off("new-conversation", handleNewConversationSocket);
    };
  }, [user, activeConversation]);

  function handleNewMessageSocket(payload: NewMessageSocketPayload) {
    const { message, conversationId } = payload;

    // Add message to messages state
    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), message],
    }));

    // Update conversation's last message and unread count
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.conversationId === conversationId) {
          return {
            ...conv,
            lastMessage: message,
            unreadCount:
              activeConversation?.conversationId === conversationId
                ? 0
                : conv.unreadCount + 1,
            updatedAt: message.timestamp,
          };
        }
        return conv;
      })
    );

    // Remove typing indicator for this sender
    setTypingIndicators((prev) =>
      prev.filter(
        (indicator) =>
          indicator.conversationId !== conversationId ||
          indicator.participantId !== message.senderId
      )
    );

    // Show notification if widget is closed and message is not from current user
    if (!isWidgetOpen && message.senderId !== `user-${user?.userId}`) {
      // You can integrate with NotificationContext here
      console.log("New message notification:", message);
    }
  }

  function handleTypingSocket(payload: TypingSocketPayload) {
    const { conversationId, participantId, participantName, isTyping } = payload;

    if (isTyping) {
      // Add typing indicator
      setTypingIndicators((prev) => {
        // Remove existing indicator for this participant
        const filtered = prev.filter((t) => t.participantId !== participantId);
        // Add new indicator
        return [...filtered, { conversationId, participantId, participantName }];
      });

      // Auto-remove after 5 seconds
      if (typingTimeoutRef.current[participantId]) {
        clearTimeout(typingTimeoutRef.current[participantId]);
      }
      typingTimeoutRef.current[participantId] = setTimeout(() => {
        setTypingIndicators((prev) => prev.filter((t) => t.participantId !== participantId));
      }, 5000);
    } else {
      // Remove typing indicator
      setTypingIndicators((prev) => prev.filter((t) => t.participantId !== participantId));
      if (typingTimeoutRef.current[participantId]) {
        clearTimeout(typingTimeoutRef.current[participantId]);
      }
    }
  }

  function handleMessageStatusSocket(payload: MessageStatusSocketPayload) {
    const { messageId, conversationId, status } = payload;

    // Update message status
    setMessages((prev) => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map((msg) =>
        msg.messageId === messageId ? { ...msg, status } : msg
      ),
    }));
  }

  function handleNewConversationSocket(payload: { conversation: ChatConversation }) {
    const { conversation } = payload;

    // Add new conversation to list
    setConversations((prev) => [conversation, ...prev]);
  }

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const setActiveConversation = useCallback(
    async (conversationId: string | null) => {
      if (!conversationId) {
        setActiveConversationState(null);
        return;
      }

      const conversation = conversations.find((c) => c.conversationId === conversationId);
      if (!conversation) return;

      setActiveConversationState(conversation);

      // Load messages if not already loaded
      if (!messages[conversationId]) {
        try {
          const conversationMessages = await chatService.getMessages(conversationId);
          setMessages((prev) => ({
            ...prev,
            [conversationId]: conversationMessages,
          }));
        } catch (error) {
          console.error("Failed to load messages:", error);
        }
      }

      // Mark as read
      if (conversation.unreadCount > 0) {
        await markAsRead(conversationId);
      }
    },
    [conversations, messages]
  );

  const sendMessage = useCallback(
    async (conversationId: string, messageDto: CreateMessageDTO) => {
      try {
        // Optimistic update
        const optimisticMessage: ChatMessage = {
          messageId: `temp-${Date.now()}`,
          conversationId,
          senderId: `user-${user?.userId}`,
          type: messageDto.type,
          content: messageDto.content,
          fileName: messageDto.fileName,
          fileSize: messageDto.fileSize,
          status: MessageStatus.SENDING,
          timestamp: new Date().toISOString(),
          replyTo: messageDto.replyTo,
          metadata: messageDto.metadata,
        };

        // Add to messages immediately
        setMessages((prev) => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), optimisticMessage],
        }));

        // Send to server
        const sentMessage = await chatService.sendMessage(conversationId, messageDto);

        // Replace optimistic message with real one
        setMessages((prev) => ({
          ...prev,
          [conversationId]: (prev[conversationId] || []).map((msg) =>
            msg.messageId === optimisticMessage.messageId ? sentMessage : msg
          ),
        }));

        // Update conversation last message
        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.conversationId === conversationId) {
              return {
                ...conv,
                lastMessage: sentMessage,
                updatedAt: sentMessage.timestamp,
              };
            }
            return conv;
          })
        );

        // Emit socket event
        const socket = getSocket();
        socket.emit("send-message", { conversationId, message: sentMessage });
      } catch (error) {
        console.error("Failed to send message:", error);

        // Mark message as failed
        setMessages((prev) => ({
          ...prev,
          [conversationId]: (prev[conversationId] || []).map((msg) =>
            msg.status === MessageStatus.SENDING ? { ...msg, status: MessageStatus.FAILED } : msg
          ),
        }));
      }
    },
    [user]
  );

  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      await chatService.markAsRead(conversationId);

      // Update local state
      setConversations((prev) =>
        prev.map((conv) =>
          conv.conversationId === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      );

      // Emit socket event
      const socket = getSocket();
      socket.emit("mark-read", { conversationId });
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  }, []);

  const toggleWidget = useCallback(() => {
    setIsWidgetOpen((prev) => !prev);
    if (!isWidgetOpen) {
      setIsWidgetMinimized(false);
    }
  }, [isWidgetOpen]);

  const minimizeWidget = useCallback(() => {
    setIsWidgetMinimized(true);
  }, []);

  const maximizeWidget = useCallback(() => {
    setIsWidgetMinimized(false);
    setIsWidgetOpen(true);
  }, []);

  const closeWidget = useCallback(() => {
    setIsWidgetOpen(false);
    setIsWidgetMinimized(true);
  }, []);

  const openWidget = useCallback(() => {
    setIsWidgetOpen(true);
    setIsWidgetMinimized(false);
  }, []);

  const startConversation = useCallback(
    async (
      participantIds: string[],
      type: ConversationType,
      title?: string
    ): Promise<string> => {
      try {
        const conversationId = await chatService.startConversation({
          participantIds,
          type,
          title,
        });

        // Reload conversations
        await loadConversations();

        // Set as active
        setActiveConversation(conversationId);

        // Open widget
        openWidget();

        return conversationId;
      } catch (error) {
        console.error("Failed to start conversation:", error);
        throw error;
      }
    },
    []
  );

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    try {
      return await chatService.uploadFile(file);
    } catch (error) {
      console.error("Failed to upload file:", error);
      throw error;
    }
  }, []);

  const setTyping = useCallback(
    (conversationId: string, isTyping: boolean) => {
      if (!user) return;

      const socket = getSocket();
      socket.emit("typing", {
        conversationId,
        participantId: `user-${user.userId}`,
        participantName: `${user.firstName} ${user.lastName}`,
        isTyping,
      });
    },
    [user]
  );

  const loadMoreMessages = useCallback(
    async (conversationId: string) => {
      try {
        const currentMessages = messages[conversationId] || [];
        const offset = currentMessages.length;

        const moreMessages = await chatService.getMessages(conversationId, offset);

        if (moreMessages.length > 0) {
          setMessages((prev) => ({
            ...prev,
            [conversationId]: [...moreMessages, ...currentMessages],
          }));
        }
      } catch (error) {
        console.error("Failed to load more messages:", error);
      }
    },
    [messages]
  );

  const searchConversations = useCallback(
    (query: string): ChatConversation[] => {
      if (!query.trim()) return conversations;

      const lowerQuery = query.toLowerCase();

      return conversations.filter((conv) => {
        // Search in conversation title
        if (conv.title?.toLowerCase().includes(lowerQuery)) return true;

        // Search in participant names
        return conv.participants.some((p) => p.name.toLowerCase().includes(lowerQuery));
      });
    },
    [conversations]
  );

  const pinConversation = useCallback(async (conversationId: string) => {
    try {
      await chatService.togglePin(conversationId);

      // Update local state
      setConversations((prev) =>
        prev.map((conv) =>
          conv.conversationId === conversationId ? { ...conv, isPinned: !conv.isPinned } : conv
        )
      );
    } catch (error) {
      console.error("Failed to pin conversation:", error);
    }
  }, []);

  const muteConversation = useCallback(async (conversationId: string) => {
    try {
      await chatService.toggleMute(conversationId);

      // Update local state
      setConversations((prev) =>
        prev.map((conv) =>
          conv.conversationId === conversationId ? { ...conv, isMuted: !conv.isMuted } : conv
        )
      );
    } catch (error) {
      console.error("Failed to mute conversation:", error);
    }
  }, []);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: ChatContextType = {
    // State
    conversations,
    activeConversation,
    messages,
    unreadCount,
    isWidgetOpen,
    isWidgetMinimized,
    typingIndicators,
    isLoading,

    // Actions
    setActiveConversation,
    sendMessage,
    markAsRead,
    toggleWidget,
    minimizeWidget,
    maximizeWidget,
    closeWidget,
    openWidget,
    startConversation,
    uploadFile,
    setTyping,
    loadMoreMessages,
    searchConversations,
    pinConversation,
    muteConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

// ============================================================================
// CUSTOM HOOK
// ============================================================================

/**
 * Hook to access chat context
 * Must be used within ChatProvider
 */
export function useChat(): ChatContextType {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }

  return context;
}
