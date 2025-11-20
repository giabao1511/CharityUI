"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, CheckCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BodyText } from "@/components/ui/typography";
import { useNotifications } from "@/contexts/notification-context";
import { Link } from "@/i18n/navigation";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { getSocket } from "@/lib/socket";
import { useAuth } from "@/lib/auth-context";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const { user } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getNotificationIcon = (type: string) => {
    const iconClass = "h-4 w-4";
    switch (type) {
      case "donation":
        return "💰";
      case "volunteer":
        return "🙋";
      case "milestone":
        return "🎯";
      case "campaign":
        return "📢";
      case "comment":
        return "💬";
      case "system":
        return "🔔";
      default:
        return "ℹ️";
    }
  };
  useEffect(() => {
    if (!user) return;

    const socket = getSocket();

    socket.on("connect", () => {
      console.log('join')
      socket.emit("join-notify", user.userId);
    });

    socket.on("notification", (notif) => {
      console.log("📩 New notif:", notif);
    });

    return () => {
      socket.off("connect");
      socket.off("notification");
    };
  }, [user]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <Card className="absolute right-0 mt-2 w-96 z-50 shadow-lg border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="h-8 text-xs"
                  >
                    <CheckCheck className="h-4 w-4 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <BodyText muted>No notifications yet</BodyText>
                  <BodyText size="sm" muted className="mt-1">
                    We'll notify you when something important happens
                  </BodyText>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 hover:bg-muted/50 transition-colors cursor-pointer relative",
                        !notification.read && "bg-primary/5"
                      )}
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.actionUrl) {
                          setIsOpen(false);
                        }
                      }}
                    >
                      {!notification.read && (
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
                      )}

                      <div className="flex items-start gap-3 ml-2">
                        <div className="text-2xl mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          {notification.actionUrl ? (
                            <Link
                              href={notification.actionUrl}
                              className="block"
                            >
                              <BodyText
                                weight="semibold"
                                size="sm"
                                className="mb-1 hover:text-primary transition-colors"
                              >
                                {notification.title}
                              </BodyText>
                              <BodyText
                                size="sm"
                                muted
                                className="line-clamp-2"
                              >
                                {notification.message}
                              </BodyText>
                            </Link>
                          ) : (
                            <>
                              <BodyText
                                weight="semibold"
                                size="sm"
                                className="mb-1"
                              >
                                {notification.title}
                              </BodyText>
                              <BodyText
                                size="sm"
                                muted
                                className="line-clamp-2"
                              >
                                {notification.message}
                              </BodyText>
                            </>
                          )}

                          <BodyText size="xs" muted className="mt-1">
                            {formatDistanceToNow(
                              new Date(notification.timestamp),
                              {
                                addSuffix: true,
                              }
                            )}
                          </BodyText>
                        </div>

                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {notifications.length > 0 && (
              <div className="p-3 border-t bg-muted/30">
                <Link href="/notifications">
                  <Button variant="ghost" size="sm" className="w-full">
                    View all notifications
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
