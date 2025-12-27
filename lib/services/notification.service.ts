/**
 * Notification Service
 * Handles notification API calls
 */

import { apiClient, API_ENDPOINTS } from "@/lib/api-config";
import type { Notification } from "@/types/notification";

export interface NotificationResponse {
  notificationId: number;
  userId: number;
  type: string | null;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
  };
  campaign: {
    campaignId: number;
    title: string;
    description: string;
  } | null;
}

/**
 * Fetch all notifications for the current user
 */
export async function getNotifications(): Promise<Notification[]> {
  try {
    const result = await apiClient<NotificationResponse[]>(
      API_ENDPOINTS.NOTIFICATIONS.LIST,
      {
        method: "GET",
      }
    );

    if (result.error) {
      console.error("Error fetching notifications:", result.error);
      return [];
    }

    if (!result.data || !Array.isArray(result.data)) {
      return [];
    }

    // Transform backend response to frontend format
    return result.data.map((notif) => {
      // Construct actionUrl from campaign if available
      const actionUrl = notif.campaign
        ? `/campaigns/${notif.campaign.campaignId}`
        : undefined;

      // Construct metadata from user and campaign info
      const metadata = {
        userName: `${notif.user.firstName} ${notif.user.lastName}`,
        campaignId: notif.campaign?.campaignId?.toString(),
        campaignTitle: notif.campaign?.title,
      };

      return {
        id: notif.notificationId.toString(),
        type: (notif.type || "donation") as Notification["type"],
        title: notif.title,
        message: notif.content,
        read: notif.isRead,
        timestamp: notif.createdAt,
        actionUrl,
        metadata,
      };
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(
  notificationId: string | number
): Promise<boolean> {
  try {
    const result = await apiClient(
      API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId),
      {
        method: "PUT",
      }
    );

    if (result.error) {
      console.error("Error marking notification as read:", result.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<boolean> {
  try {
    const result = await apiClient(
      API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ,
      {
        method: "PUT",
      }
    );

    if (result.error) {
      console.error("Error marking all notifications as read:", result.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return false;
  }
}
