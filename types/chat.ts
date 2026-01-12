/**
 * Chat Module Type Definitions
 *
 * Defines all types for the Facebook-like chat system including:
 * - Conversation types (direct, group, user-org, admin)
 * - Message types (text, image, file, system)
 * - Participants (users, organizations)
 * - Real-time features (typing indicators, read receipts)
 */

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Types of conversations supported
 */
export enum ConversationType {
  DIRECT = "direct",           // User-to-User one-on-one
  USER_ORG = "user_org",       // User-to-Organization conversation
  ADMIN = "admin",             // Admin-to-Anyone (support/moderation)
  GROUP = "group",             // Group conversation (3+ participants)
}

/**
 * Types of messages that can be sent
 */
export enum MessageType {
  TEXT = "text",               // Plain text message
  IMAGE = "image",             // Image attachment
  FILE = "file",               // File attachment (PDF, docs, etc.)
  SYSTEM = "system",           // System message (user joined, left, etc.)
}

/**
 * Status of message delivery
 */
export enum MessageStatus {
  SENDING = "sending",         // Message being sent (optimistic update)
  SENT = "sent",               // Message sent to server
  DELIVERED = "delivered",     // Message delivered to recipient(s)
  READ = "read",               // Message read by recipient(s)
  FAILED = "failed",           // Message failed to send
}

// ============================================================================
// PARTICIPANT TYPES
// ============================================================================

/**
 * Represents a participant in a conversation
 * Can be either a regular user or an organization
 */
export interface ChatParticipant {
  participantId: string;       // Unique identifier (format: "user-{id}" or "org-{id}")
  userId?: number;             // User ID if participant is a regular user
  orgId?: number;              // Organization ID if participant is an organization
  name: string;                // Display name
  avatar?: string;             // Avatar URL
  isOnline: boolean;           // Online status
  lastSeen?: string;           // Last seen timestamp (ISO string)
  role?: "admin" | "member" | "owner";  // Role in group chats
}

// ============================================================================
// MESSAGE TYPES
// ============================================================================

/**
 * Core message structure
 */
export interface ChatMessage {
  messageId: string;           // Unique message ID
  conversationId: string;      // Parent conversation ID
  senderId: string;            // Participant ID of sender
  type: MessageType;           // Type of message
  content: string;             // Message content (text or file URL)
  fileName?: string;           // File name for attachments
  fileSize?: number;           // File size in bytes
  status: MessageStatus;       // Delivery status
  timestamp: string;           // Creation timestamp (ISO string)
  replyTo?: string;            // Message ID if this is a reply
  metadata?: {
    width?: number;            // Image width
    height?: number;           // Image height
    mimeType?: string;         // File MIME type
  };
}

/**
 * DTO for creating a new message
 */
export interface CreateMessageDTO {
  type: MessageType;
  content: string;
  fileName?: string;
  fileSize?: number;
  replyTo?: string;
  metadata?: {
    width?: number;
    height?: number;
    mimeType?: string;
  };
}

// ============================================================================
// CONVERSATION TYPES
// ============================================================================

/**
 * Represents a chat conversation
 */
export interface ChatConversation {
  conversationId: string;      // Unique conversation ID
  type: ConversationType;      // Type of conversation
  participants: ChatParticipant[];  // All participants
  title?: string;              // Title for group chats
  avatar?: string;             // Avatar for group chats
  lastMessage?: ChatMessage;   // Most recent message
  unreadCount: number;         // Number of unread messages
  isPinned: boolean;           // Is conversation pinned to top
  isMuted: boolean;            // Is conversation muted
  createdAt: string;           // Creation timestamp (ISO string)
  updatedAt: string;           // Last update timestamp (ISO string)
  metadata?: {
    orgId?: number;            // If conversation with organization
    campaignId?: number;       // If related to specific campaign
  };
}

/**
 * DTO for creating a new conversation
 */
export interface CreateConversationDTO {
  participantIds: string[];    // Array of participant IDs
  type: ConversationType;      // Type of conversation
  title?: string;              // Optional title for group chats
  metadata?: {
    orgId?: number;
    campaignId?: number;
  };
}

// ============================================================================
// TYPING INDICATOR
// ============================================================================

/**
 * Real-time typing indicator
 */
export interface TypingIndicator {
  conversationId: string;      // Conversation where user is typing
  participantId: string;       // ID of participant who is typing
  participantName: string;     // Name to display
}

// ============================================================================
// CONTEXT TYPE
// ============================================================================

/**
 * Chat context interface for global state management
 */
export interface ChatContextType {
  // State
  conversations: ChatConversation[];
  activeConversation: ChatConversation | null;
  messages: Record<string, ChatMessage[]>;  // Keyed by conversationId
  unreadCount: number;                      // Total unread messages across all conversations
  isWidgetOpen: boolean;                    // Is floating widget open
  isWidgetMinimized: boolean;               // Is widget minimized to button
  typingIndicators: TypingIndicator[];      // Active typing indicators
  isLoading: boolean;                       // Loading state

  // Actions
  setActiveConversation: (conversationId: string | null) => void;
  sendMessage: (conversationId: string, message: CreateMessageDTO) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  toggleWidget: () => void;
  minimizeWidget: () => void;
  maximizeWidget: () => void;
  closeWidget: () => void;
  openWidget: () => void;
  startConversation: (participantIds: string[], type: ConversationType, title?: string) => Promise<string>;
  uploadFile: (file: File) => Promise<string>;
  setTyping: (conversationId: string, isTyping: boolean) => void;
  loadMoreMessages: (conversationId: string) => Promise<void>;
  searchConversations: (query: string) => ChatConversation[];
  pinConversation: (conversationId: string) => Promise<void>;
  muteConversation: (conversationId: string) => Promise<void>;
}

// ============================================================================
// SOCKET.IO EVENT PAYLOADS
// ============================================================================

/**
 * Payload for new message socket event
 */
export interface NewMessageSocketPayload {
  message: ChatMessage;
  conversationId: string;
}

/**
 * Payload for typing indicator socket event
 */
export interface TypingSocketPayload {
  conversationId: string;
  participantId: string;
  participantName: string;
  isTyping: boolean;
}

/**
 * Payload for message status update socket event
 */
export interface MessageStatusSocketPayload {
  messageId: string;
  conversationId: string;
  status: MessageStatus;
}

/**
 * Payload for new conversation socket event
 */
export interface NewConversationSocketPayload {
  conversation: ChatConversation;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Filter for conversation list
 */
export type ConversationFilter = "all" | "unread" | "groups" | "direct";

/**
 * User search result for starting conversations
 */
export interface UserSearchResult {
  participantId: string;
  userId?: number;
  orgId?: number;
  name: string;
  avatar?: string;
  type: "user" | "organization";
  isOnline?: boolean;
}
