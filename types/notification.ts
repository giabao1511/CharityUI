export type NotificationType = "donation" | "volunteer" | "milestone" | "campaign" | "comment" | "system";

export interface Notification {
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

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void;
}
