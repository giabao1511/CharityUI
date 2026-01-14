/**
 * Chat Service - Mock Data Layer
 *
 * Provides mock data for the chat module until backend API is ready.
 * All functions follow the same interface as the future API implementation,
 * making it easy to swap this mock service with real API calls later.
 */

import {
  ConversationType,
  MessageType,
  MessageStatus,
} from "@/types/chat";
import type {
  ChatConversation,
  ChatMessage,
  ChatParticipant,
  CreateMessageDTO,
  CreateConversationDTO,
  UserSearchResult,
} from "@/types/chat";

// ============================================================================
// MOCK DATA - PARTICIPANTS
// ============================================================================

export const mockParticipants: ChatParticipant[] = [
  // Current user (you)
  {
    participantId: "user-1",
    userId: 1,
    name: "You",
    avatar: "/avatars/user-1.jpg",
    isOnline: true,
  },
  // Other users
  {
    participantId: "user-2",
    userId: 2,
    name: "Jane Smith",
    avatar: "/avatars/user-2.jpg",
    isOnline: true,
    lastSeen: "2026-01-12T10:00:00Z",
  },
  {
    participantId: "user-3",
    userId: 3,
    name: "John Doe",
    avatar: "/avatars/user-3.jpg",
    isOnline: false,
    lastSeen: "2026-01-11T22:30:00Z",
  },
  {
    participantId: "user-4",
    userId: 4,
    name: "Bob Johnson",
    avatar: "/avatars/user-4.jpg",
    isOnline: true,
  },
  {
    participantId: "user-5",
    userId: 5,
    name: "Alice Williams",
    avatar: "/avatars/user-5.jpg",
    isOnline: false,
    lastSeen: "2026-01-12T09:15:00Z",
  },
  // Organizations
  {
    participantId: "org-1",
    orgId: 1,
    name: "Red Cross Vietnam",
    avatar: "/orgs/redcross.jpg",
    isOnline: true,
  },
  {
    participantId: "org-2",
    orgId: 2,
    name: "Save the Children",
    avatar: "/orgs/savechildren.jpg",
    isOnline: true,
  },
  // Admin
  {
    participantId: "admin-1",
    userId: 99,
    name: "Support Team",
    avatar: "/avatars/support.jpg",
    isOnline: true,
    role: "admin",
  },
];

// ============================================================================
// MOCK DATA - MESSAGES
// ============================================================================

const mockMessagesData: Record<string, ChatMessage[]> = {
  "conv-1": [
    {
      messageId: "msg-1-1",
      conversationId: "conv-1",
      senderId: "user-2",
      type: MessageType.TEXT,
      content: "Hey! How are you doing?",
      status: MessageStatus.READ,
      timestamp: "2026-01-12T08:00:00Z",
    },
    {
      messageId: "msg-1-2",
      conversationId: "conv-1",
      senderId: "user-1",
      type: MessageType.TEXT,
      content: "I'm doing great! Thanks for asking. How about you?",
      status: MessageStatus.READ,
      timestamp: "2026-01-12T08:05:00Z",
    },
    {
      messageId: "msg-1-3",
      conversationId: "conv-1",
      senderId: "user-2",
      type: MessageType.TEXT,
      content: "Pretty good! Just wanted to check if you're interested in volunteering for the upcoming charity event?",
      status: MessageStatus.READ,
      timestamp: "2026-01-12T08:10:00Z",
    },
    {
      messageId: "msg-1-4",
      conversationId: "conv-1",
      senderId: "user-1",
      type: MessageType.TEXT,
      content: "Absolutely! I'd love to help out. What do you need from me?",
      status: MessageStatus.READ,
      timestamp: "2026-01-12T08:15:00Z",
    },
    {
      messageId: "msg-1-5",
      conversationId: "conv-1",
      senderId: "user-2",
      type: MessageType.IMAGE,
      content: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600",
      status: MessageStatus.READ,
      timestamp: "2026-01-12T08:20:00Z",
      metadata: {
        width: 800,
        height: 600,
        mimeType: "image/jpeg",
      },
    },
    {
      messageId: "msg-1-6",
      conversationId: "conv-1",
      senderId: "user-2",
      type: MessageType.TEXT,
      content: "Here's the event poster! It's going to be amazing 🎉",
      status: MessageStatus.READ,
      timestamp: "2026-01-12T08:21:00Z",
    },
    {
      messageId: "msg-1-7",
      conversationId: "conv-1",
      senderId: "user-1",
      type: MessageType.TEXT,
      content: "Looks fantastic! Count me in. When do we start?",
      status: MessageStatus.DELIVERED,
      timestamp: "2026-01-12T10:30:00Z",
    },
  ],
  "conv-2": [
    {
      messageId: "msg-2-1",
      conversationId: "conv-2",
      senderId: "user-1",
      type: MessageType.TEXT,
      content: "Hello, I have a question about your disaster relief campaign.",
      status: MessageStatus.READ,
      timestamp: "2026-01-12T09:00:00Z",
    },
    {
      messageId: "msg-2-2",
      conversationId: "conv-2",
      senderId: "org-1",
      type: MessageType.TEXT,
      content: "Hello! Thank you for reaching out. How can we help you today?",
      status: MessageStatus.READ,
      timestamp: "2026-01-12T09:05:00Z",
    },
    {
      messageId: "msg-2-3",
      conversationId: "conv-2",
      senderId: "user-1",
      type: MessageType.TEXT,
      content: "I'd like to make a donation. What's the best way to contribute?",
      status: MessageStatus.READ,
      timestamp: "2026-01-12T09:10:00Z",
    },
    {
      messageId: "msg-2-4",
      conversationId: "conv-2",
      senderId: "org-1",
      type: MessageType.TEXT,
      content: "That's wonderful! You can donate directly through our campaign page. We accept VNPay and bank transfers.",
      status: MessageStatus.READ,
      timestamp: "2026-01-12T09:15:00Z",
    },
    {
      messageId: "msg-2-5",
      conversationId: "conv-2",
      senderId: "org-1",
      type: MessageType.FILE,
      content: "/mock-files/donation-guide.pdf",
      fileName: "donation-guide.pdf",
      fileSize: 2048000,
      status: MessageStatus.READ,
      timestamp: "2026-01-12T09:16:00Z",
      metadata: {
        mimeType: "application/pdf",
      },
    },
    {
      messageId: "msg-2-6",
      conversationId: "conv-2",
      senderId: "org-1",
      type: MessageType.TEXT,
      content: "Here's a detailed guide on how to donate. Let me know if you have any questions!",
      status: MessageStatus.DELIVERED,
      timestamp: "2026-01-12T09:17:00Z",
    },
  ],
  "conv-3": [
    {
      messageId: "msg-3-1",
      conversationId: "conv-3",
      senderId: "system",
      type: MessageType.SYSTEM,
      content: "You created the group \"Disaster Relief Team\"",
      status: MessageStatus.SENT,
      timestamp: "2026-01-10T14:00:00Z",
    },
    {
      messageId: "msg-3-2",
      conversationId: "conv-3",
      senderId: "system",
      type: MessageType.SYSTEM,
      content: "Jane Smith joined the conversation",
      status: MessageStatus.SENT,
      timestamp: "2026-01-10T14:01:00Z",
    },
    {
      messageId: "msg-3-3",
      conversationId: "conv-3",
      senderId: "system",
      type: MessageType.SYSTEM,
      content: "John Doe joined the conversation",
      status: MessageStatus.SENT,
      timestamp: "2026-01-10T14:02:00Z",
    },
    {
      messageId: "msg-3-4",
      conversationId: "conv-3",
      senderId: "user-1",
      type: MessageType.TEXT,
      content: "Welcome everyone! Let's coordinate our relief efforts here.",
      status: MessageStatus.READ,
      timestamp: "2026-01-10T14:05:00Z",
    },
    {
      messageId: "msg-3-5",
      conversationId: "conv-3",
      senderId: "user-2",
      type: MessageType.TEXT,
      content: "Great idea! I can help with logistics.",
      status: MessageStatus.READ,
      timestamp: "2026-01-10T14:10:00Z",
    },
    {
      messageId: "msg-3-6",
      conversationId: "conv-3",
      senderId: "user-3",
      type: MessageType.TEXT,
      content: "I'll coordinate with local volunteers. When's our first meeting?",
      status: MessageStatus.READ,
      timestamp: "2026-01-10T14:15:00Z",
    },
    {
      messageId: "msg-3-7",
      conversationId: "conv-3",
      senderId: "user-1",
      type: MessageType.TEXT,
      content: "How about tomorrow at 3 PM? We can meet at the community center.",
      status: MessageStatus.READ,
      timestamp: "2026-01-10T14:20:00Z",
    },
    {
      messageId: "msg-3-8",
      conversationId: "conv-3",
      senderId: "user-2",
      type: MessageType.TEXT,
      content: "Perfect! I'll be there.",
      status: MessageStatus.READ,
      timestamp: "2026-01-10T14:25:00Z",
    },
    {
      messageId: "msg-3-9",
      conversationId: "conv-3",
      senderId: "user-3",
      type: MessageType.TEXT,
      content: "Sounds good to me!",
      status: MessageStatus.DELIVERED,
      timestamp: "2026-01-11T16:45:00Z",
    },
  ],
  "conv-4": [
    {
      messageId: "msg-4-1",
      conversationId: "conv-4",
      senderId: "user-1",
      type: MessageType.TEXT,
      content: "Hi! Are you available to help with the fundraising event next week?",
      status: MessageStatus.READ,
      timestamp: "2026-01-11T10:00:00Z",
    },
    {
      messageId: "msg-4-2",
      conversationId: "conv-4",
      senderId: "user-3",
      type: MessageType.TEXT,
      content: "Hey! Yes, I should be available. What time?",
      status: MessageStatus.DELIVERED,
      timestamp: "2026-01-11T11:30:00Z",
    },
  ],
  "conv-5": [
    {
      messageId: "msg-5-1",
      conversationId: "conv-5",
      senderId: "admin-1",
      type: MessageType.TEXT,
      content: "Hello! This is the Support Team. How can we assist you today?",
      status: MessageStatus.SENT,
      timestamp: "2026-01-12T10:00:00Z",
    },
  ],
};

// ============================================================================
// MOCK DATA - CONVERSATIONS
// ============================================================================

const mockConversationsData: ChatConversation[] = [
  {
    conversationId: "conv-1",
    type: ConversationType.DIRECT,
    participants: [mockParticipants[0], mockParticipants[1]], // You + Jane
    lastMessage: mockMessagesData["conv-1"][mockMessagesData["conv-1"].length - 1],
    unreadCount: 2,
    isPinned: false,
    isMuted: false,
    createdAt: "2026-01-12T08:00:00Z",
    updatedAt: "2026-01-12T10:30:00Z",
  },
  {
    conversationId: "conv-2",
    type: ConversationType.USER_ORG,
    participants: [mockParticipants[0], mockParticipants[5]], // You + Red Cross
    lastMessage: mockMessagesData["conv-2"][mockMessagesData["conv-2"].length - 1],
    unreadCount: 0,
    isPinned: true,
    isMuted: false,
    createdAt: "2026-01-12T09:00:00Z",
    updatedAt: "2026-01-12T09:17:00Z",
    metadata: { orgId: 1, campaignId: 1 },
  },
  {
    conversationId: "conv-3",
    type: ConversationType.GROUP,
    title: "Disaster Relief Team",
    avatar: "/groups/disaster-relief.jpg",
    participants: [
      { ...mockParticipants[0], role: "owner" },  // You
      { ...mockParticipants[1], role: "member" }, // Jane
      { ...mockParticipants[2], role: "member" }, // John
    ],
    lastMessage: mockMessagesData["conv-3"][mockMessagesData["conv-3"].length - 1],
    unreadCount: 5,
    isPinned: true,
    isMuted: false,
    createdAt: "2026-01-10T14:00:00Z",
    updatedAt: "2026-01-11T16:45:00Z",
  },
  {
    conversationId: "conv-4",
    type: ConversationType.DIRECT,
    participants: [mockParticipants[0], mockParticipants[2]], // You + John
    lastMessage: mockMessagesData["conv-4"][mockMessagesData["conv-4"].length - 1],
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    createdAt: "2026-01-11T10:00:00Z",
    updatedAt: "2026-01-11T11:30:00Z",
  },
  {
    conversationId: "conv-5",
    type: ConversationType.ADMIN,
    participants: [mockParticipants[0], mockParticipants[7]], // You + Support
    lastMessage: mockMessagesData["conv-5"][0],
    unreadCount: 1,
    isPinned: false,
    isMuted: false,
    createdAt: "2026-01-12T10:00:00Z",
    updatedAt: "2026-01-12T10:00:00Z",
  },
];

// ============================================================================
// SERVICE FUNCTIONS
// ============================================================================

/**
 * Get all conversations for the current user
 * @returns Promise resolving to array of conversations
 */
export async function getConversations(): Promise<ChatConversation[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Return sorted by updatedAt (most recent first), with pinned at top
  return [...mockConversationsData].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

/**
 * Get messages for a specific conversation
 * @param conversationId - ID of the conversation
 * @param offset - Pagination offset (for infinite scroll)
 * @param limit - Number of messages to return
 * @returns Promise resolving to array of messages
 */
export async function getMessages(
  conversationId: string,
  offset = 0,
  limit = 50
): Promise<ChatMessage[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const messages = mockMessagesData[conversationId] || [];

  // Return messages in chronological order (oldest first)
  return messages.slice(offset, offset + limit);
}

/**
 * Send a new message in a conversation
 * @param conversationId - ID of the conversation
 * @param message - Message DTO
 * @returns Promise resolving to created message
 */
export async function sendMessage(
  conversationId: string,
  message: CreateMessageDTO
): Promise<ChatMessage> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newMessage: ChatMessage = {
    messageId: `msg-${Date.now()}`,
    conversationId,
    senderId: "user-1", // Current user
    type: message.type,
    content: message.content,
    fileName: message.fileName,
    fileSize: message.fileSize,
    status: MessageStatus.SENT,
    timestamp: new Date().toISOString(),
    replyTo: message.replyTo,
    metadata: message.metadata,
  };

  // Add to mock data
  if (!mockMessagesData[conversationId]) {
    mockMessagesData[conversationId] = [];
  }
  mockMessagesData[conversationId].push(newMessage);

  // Update conversation's last message
  const conversation = mockConversationsData.find((c) => c.conversationId === conversationId);
  if (conversation) {
    conversation.lastMessage = newMessage;
    conversation.updatedAt = new Date().toISOString();
  }

  return newMessage;
}

/**
 * Mark all messages in a conversation as read
 * @param conversationId - ID of the conversation
 */
export async function markAsRead(conversationId: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Update conversation unread count
  const conversation = mockConversationsData.find((c) => c.conversationId === conversationId);
  if (conversation) {
    conversation.unreadCount = 0;
  }

  // Update message statuses
  const messages = mockMessagesData[conversationId] || [];
  messages.forEach((msg) => {
    if (msg.senderId !== "user-1" && msg.status !== MessageStatus.READ) {
      msg.status = MessageStatus.READ;
    }
  });
}

/**
 * Start a new conversation
 * @param dto - Conversation creation DTO
 * @returns Promise resolving to conversation ID
 */
export async function startConversation(
  dto: CreateConversationDTO
): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const conversationId = `conv-${Date.now()}`;
  const participants = dto.participantIds.map(
    (id) => mockParticipants.find((p) => p.participantId === id)!
  );

  // Include current user if not already in list
  if (!participants.find((p) => p.participantId === "user-1")) {
    participants.unshift(mockParticipants[0]);
  }

  const newConversation: ChatConversation = {
    conversationId,
    type: dto.type,
    participants,
    title: dto.title,
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: dto.metadata,
  };

  mockConversationsData.push(newConversation);
  mockMessagesData[conversationId] = [];

  return conversationId;
}

/**
 * Upload a file (mock implementation)
 * @param file - File to upload
 * @returns Promise resolving to file URL
 */
export async function uploadFile(file: File): Promise<string> {
  // Simulate upload delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return mock URL based on file type
  if (file.type.startsWith("image/")) {
    return `https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600`;
  }

  return `/mock-uploads/${file.name}`;
}

/**
 * Search for users and organizations to start conversations
 * @param query - Search query
 * @returns Promise resolving to search results
 */
export async function searchUsers(query: string): Promise<UserSearchResult[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const lowerQuery = query.toLowerCase();

  return mockParticipants
    .filter((p) =>
      p.participantId !== "user-1" && // Exclude current user
      p.name.toLowerCase().includes(lowerQuery)
    )
    .map((p) => ({
      participantId: p.participantId,
      userId: p.userId,
      orgId: p.orgId,
      name: p.name,
      avatar: p.avatar,
      type: p.orgId ? "organization" : "user",
      isOnline: p.isOnline,
    }));
}

/**
 * Pin/unpin a conversation
 * @param conversationId - ID of the conversation
 */
export async function togglePin(conversationId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const conversation = mockConversationsData.find((c) => c.conversationId === conversationId);
  if (conversation) {
    conversation.isPinned = !conversation.isPinned;
  }
}

/**
 * Mute/unmute a conversation
 * @param conversationId - ID of the conversation
 */
export async function toggleMute(conversationId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const conversation = mockConversationsData.find((c) => c.conversationId === conversationId);
  if (conversation) {
    conversation.isMuted = !conversation.isMuted;
  }
}

// ============================================================================
// REAL API FUNCTIONS
// ============================================================================

import { API_ENDPOINTS, apiClient } from "@/lib/api-config";

// API Types
export interface ApiMediaType {
  mediaTypeId: number;
  mediaName: string;
}

export interface ApiMessageMedia {
  messageMediaId: number;
  messageId: number;
  mediaUrl: string;
  mediaTypeId: number;
  createdAt: string;
  updatedAt: string;
  mediaType: ApiMediaType;
}

export interface ApiMessageMediaInput {
  mediaTypeId: number;
  url: string;
}

export interface ApiMessageSender {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

export interface ApiMessageConversation {
  conversationId: number;
  type: string;
  name: string | null;
}

export interface ApiMessage {
  messageId: number;
  conversationId: number;
  senderId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  sender?: ApiMessageSender;
  conversation?: ApiMessageConversation;
  media?: ApiMessageMedia[];
}

export interface ApiMessagesResponse {
  data: ApiMessage[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface GetApiMessagesParams {
  conversationId: number;
  page?: number;
  limit?: number;
}

export interface SendApiMessageParams {
  conversationId: number;
  content: string;
  media?: ApiMessageMediaInput[];
}

export interface ApiUploadResponse {
  data: {
    url: string;
    mediaTypeId: number;
  }[];
}

/**
 * Get messages for a conversation from API
 */
export async function getApiMessages(
  params: GetApiMessagesParams
): Promise<ApiMessagesResponse> {
  try {
    const { conversationId, page = 1, limit = 20 } = params;

    const query = new URLSearchParams({
      conversationId: String(conversationId),
      page: String(page),
      limit: String(limit),
    }).toString();

    const result = await apiClient<ApiMessagesResponse>(
      `${API_ENDPOINTS.CHAT.MESSAGES}?${query}`,
      {
        method: "GET",
      }
    );

    if (result.error || !result.data) {
      console.error("Error fetching messages:", result.error);
      return {
        data: [],
        pagination: {
          total: 0,
          page,
          limit,
        },
      };
    }

    return result as any;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return {
      data: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 20,
      },
    };
  }
}

/**
 * Send a message via API
 */
export async function sendApiMessage(
  params: SendApiMessageParams
): Promise<ApiMessage | null> {
  try {
    console.log("sendApiMessage params:", params);
    console.log("sendApiMessage endpoint:", API_ENDPOINTS.CHAT.SEND_MESSAGE);

    const result = await apiClient<ApiMessage>(API_ENDPOINTS.CHAT.SEND_MESSAGE, {
      method: "POST",
      body: JSON.stringify(params),
    });

    console.log("sendApiMessage result:", result);

    if (result.error) {
      console.error("Error sending message:", result.error);
      return null;
    }

    // Handle both { data: message } and direct message response
    return result.data || (result as any) || null;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
}

/**
 * Upload files for messages via API
 */
export async function uploadApiMessageFiles(
  files: File[]
): Promise<ApiUploadResponse["data"] | null> {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    // Get access token
    const accessToken =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    const response = await fetch(API_ENDPOINTS.CHAT.UPLOAD, {
      method: "POST",
      headers: {
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Error uploading files:", result);
      return null;
    }

    return result.data || null;
  } catch (error) {
    console.error("Error uploading files:", error);
    return null;
  }
}

// Conversation Types
export interface ApiConversationUser {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

export interface ApiConversationMember {
  conversationMemberId: number;
  role: string;
  createdAt: string;
  updatedAt: string;
  user: ApiConversationUser;
}

export interface ApiConversation {
  conversationId: number;
  type: string;
  name: string | null;
  members: ApiConversationMember[];
  lastMessage?: ApiMessage;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiConversationsResponse {
  data: ApiConversation[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

/**
 * Get all conversations for the current user from API
 */
export async function getApiConversations(
  page = 1,
  limit = 20
): Promise<ApiConversationsResponse> {
  try {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    }).toString();

    const result = await apiClient<ApiConversationsResponse>(
      `${API_ENDPOINTS.CHAT.CONVERSATIONS}?${query}`,
      {
        method: "GET",
      }
    );

    if (result.error || !result.data) {
      console.error("Error fetching conversations:", result.error);
      return {
        data: [],
        pagination: {
          total: 0,
          page,
          limit,
        },
      };
    }

    return result as any;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return {
      data: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 20,
      },
    };
  }
}
