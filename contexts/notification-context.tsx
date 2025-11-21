"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { Notification, NotificationContextType } from "@/types/notification";
import { getSocket } from "@/lib/socket";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from "@/lib/services/notification.service";

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch notifications from API when user logs in
  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }

    setLoading(true);
    try {
      const fetchedNotifications = await getNotifications();
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback(async (notificationId: string) => {
    // Optimistically update UI
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );

    // Call API to mark as read
    await markNotificationAsRead(notificationId);
  }, []);

  const markAllAsRead = useCallback(async () => {
    // Optimistically update UI
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );

    // Call API to mark all as read
    await markAllNotificationsAsRead();
  }, []);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp">) => {
      const newNotification: Notification = {
        ...notification,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
      };

      setNotifications((prev) => [newNotification, ...prev]);

      // Show toast notification
      toast.info(notification.title, {
        description: notification.message,
        duration: 5000,
      });
    },
    []
  );

  // Socket.IO integration for real-time notifications
  useEffect(() => {
    if (!user) {
      console.log("⚠️ No user logged in, skipping socket connection");
      return;
    }

    console.log("🔌 Setting up socket for user:", user.userId);
    const socket = getSocket();

    const handleConnect = () => {
      console.log("✅ Socket connected for notifications, Socket ID:", socket.id);
      console.log("📤 Emitting join-notify with userId:", user.userId);
      socket.emit("join-notify", user.userId);
    };

    const handleDisconnect = (reason: string) => {
      console.log("❌ Socket disconnected from notifications:", reason);
    };

    const handleNotification = (socketNotification: any) => {
      console.log("📩 New notification received via socket:", socketNotification);
      console.log("📩 Notification details:", {
        type: socketNotification.type,
        title: socketNotification.title,
        message: socketNotification.message,
        actionUrl: socketNotification.actionUrl,
        metadata: socketNotification.metadata,
      });

      // Add the notification from socket
      addNotification({
        type: socketNotification.type || "system",
        title: socketNotification.title,
        message: socketNotification.message,
        read: false,
        actionUrl: socketNotification.actionUrl,
        metadata: socketNotification.metadata,
      });
    };

    const handleError = (error: any) => {
      console.error("❌ Socket error in notification context:", error);
    };

    // Connect and listen
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("notification", handleNotification);
    socket.on("error", handleError);

    // If already connected, join room
    if (socket.connected) {
      console.log("✅ Socket already connected, joining notification room");
      handleConnect();
    } else {
      console.log("⏳ Socket not yet connected, will join room on connect event");
    }

    // Log all socket events for debugging
    socket.onAny((eventName, ...args) => {
      console.log(`🔔 Socket event received: ${eventName}`, args);
    });

    return () => {
      console.log("🧹 Cleaning up socket listeners");
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("notification", handleNotification);
      socket.off("error", handleError);
      socket.offAny();
    };
  }, [user, addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        refetchNotifications: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
