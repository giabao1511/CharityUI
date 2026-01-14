"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { BodyText } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/lib/auth-context";
import { getSocket } from "@/lib/socket";
import {
  getApiMessages,
  ApiMessage,
} from "@/lib/services/chat.service";
import { MessageInput } from "./message-input";

interface MessageAreaProps {
  conversationId: number;
  onBack: () => void;
}

function MessageSkeleton() {
  return (
    <div className="flex gap-2 p-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

export function MessageArea({ conversationId, onBack }: MessageAreaProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle incoming real-time message
  const handleNewMessage = useCallback((newMessage: ApiMessage) => {
    console.log("📨 Received new message:", newMessage);

    // Only add if it's for this conversation
    if (newMessage.conversationId === conversationId) {
      setMessages((prev) => {
        // Check for duplicates (in case we sent the message ourselves)
        const exists = prev.some((m) => m.messageId === newMessage.messageId);
        if (exists) {
          return prev;
        }
        return [...prev, newMessage];
      });
    }
  }, [conversationId]);

  // Socket.IO: Join room and listen for messages
  useEffect(() => {
    const socket = getSocket();

    // Join the conversation room
    console.log("🔌 Joining conversation room:", conversationId);
    socket.emit("join-conversation", conversationId);

    // Listen for new messages
    socket.on("newMessage", handleNewMessage);

    // Cleanup: leave room and remove listener
    return () => {
      console.log("🔌 Leaving conversation room:", conversationId);
      socket.emit("leave-conversation", conversationId);
      socket.off("newMessage", handleNewMessage);
    };
  }, [conversationId, handleNewMessage]);

  // Load messages
  useEffect(() => {
    async function loadMessages() {
      setLoading(true);
      setPage(1);
      try {
        const data = await getApiMessages({
          conversationId,
          page: 1,
          limit: 20,
        });
        // Reverse to show oldest first (newest at bottom)
        setMessages((data.data || []).reverse());
        setHasMore((data.data?.length || 0) >= 20);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, [conversationId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load more (older) messages
  async function loadMore() {
    if (!hasMore || loading) return;

    try {
      const nextPage = page + 1;
      const data = await getApiMessages({
        conversationId,
        page: nextPage,
        limit: 20,
      });

      if (data.data && data.data.length > 0) {
        // Reverse older messages and prepend them
        const olderMessages = [...data.data].reverse();
        setMessages((prev) => [...olderMessages, ...prev]);
        setPage(nextPage);
        setHasMore(data.data.length >= 20);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more messages:", error);
    }
  }

  // Handle new message sent (optimistic update, socket will handle the actual update)
  const handleMessageSent = (newMessage: ApiMessage) => {
    setMessages((prev) => {
      // Check for duplicates
      const exists = prev.some((m) => m.messageId === newMessage.messageId);
      if (exists) {
        return prev;
      }
      return [...prev, newMessage];
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 p-3 space-y-3">
          <MessageSkeleton />
          <MessageSkeleton />
          <MessageSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        {hasMore && (
          <button
            onClick={loadMore}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground py-2"
          >
            Load earlier messages
          </button>
        )}

        <div className="space-y-3">
          {messages.map((message) => {
            const isOwn = message.senderId === user?.userId;

            return (
              <div
                key={message.messageId}
                className={cn("flex gap-2", isOwn && "flex-row-reverse")}
              >
                {!isOwn && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={message.sender?.avatar || "/assets/images/avatar-fallback.png"}
                    />
                    <AvatarFallback>
                      {message.sender?.firstName?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    "max-w-[70%] rounded-lg px-3 py-2",
                    isOwn
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <BodyText size="sm">{message.content}</BodyText>

                  {/* Media attachments */}
                  {message.media && message.media.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.media.map((item) => (
                        <div key={item.messageMediaId}>
                          {item.mediaTypeId === 1 ? (
                            // Image
                            <img
                              src={item.mediaUrl}
                              alt="Attachment"
                              className="max-w-full rounded-md"
                            />
                          ) : item.mediaTypeId === 2 ? (
                            // Video
                            <video
                              src={item.mediaUrl}
                              controls
                              className="max-w-full rounded-md"
                            />
                          ) : (
                            // Other file
                            <a
                              href={item.mediaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm underline"
                            >
                              {item.mediaType?.mediaName || "View attachment"}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <BodyText
                    size="xs"
                    className={cn(
                      "mt-1",
                      isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}
                  >
                    {formatDistanceToNow(new Date(message.createdAt), {
                      addSuffix: true,
                    })}
                  </BodyText>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <MessageInput
        conversationId={conversationId}
        onMessageSent={handleMessageSent}
      />
    </div>
  );
}
