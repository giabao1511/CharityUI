export type NotificationType =
  | "donation"
  | "volunteer"
  | "milestone"
  | "campaign"
  | "comment"
  | "system";

export interface Friend {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  metadata?: {
    campaignId?: string;
    campaignTitle?: string;
    amount?: number;
    userName?: string;
    organizationId?: string;
  };
}
export interface FriendRequest {
  friendRequestId: number;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
  updatedAt: string;
  sender: {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: null;
  };
}

export interface FriendContextType {
  friendRequests: FriendRequest[];
  totalRequest: number;
  loading: boolean;
  loadingCount: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  acceptRequest: (friendRequestId: string | number) => Promise<void>;
  declineRequest: (friendRequestId: string | number) => Promise<void>;
}
