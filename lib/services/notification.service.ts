/**
 * Notification Service
 * Handles notification API calls
 */

import { apiClient, API_ENDPOINTS } from "@/lib/api-config";
import type { Notification } from "@/types/notification";

export interface NotificationResponse {
  notificationId: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  metadata?: any;
  createdAt: string;
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
    return result.data.map((notif) => ({
      id: notif.notificationId.toString(),
      type: notif.type as any,
      title: notif.title,
      message: notif.message,
      read: notif.isRead,
      timestamp: notif.createdAt,
      actionUrl: notif.actionUrl,
      metadata: notif.metadata,
    }));
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
        method: "PATCH",
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
        method: "PATCH",
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
