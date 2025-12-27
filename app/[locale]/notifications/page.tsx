"use client";

import { useState, useMemo } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Filter,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heading, BodyText } from "@/components/ui/typography";
import { useNotifications } from "@/contexts/notification-context";
import { Link } from "@/i18n/navigation";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type FilterType = "all" | "unread" | "read";
type NotificationType = "all" | "donation" | "volunteer" | "milestone" | "campaign" | "comment" | "system";

export default function NotificationsPage() {
  const t = useTranslations("notifications");
  const { notifications, unreadCount, markAsRead, markAllAsRead, refetchNotifications } =
    useNotifications();
  const [filter, setFilter] = useState<FilterType>("all");
  const [typeFilter, setTypeFilter] = useState<NotificationType>("all");
  const [refreshing, setRefreshing] = useState(false);

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Filter by read status
    if (filter === "unread") {
      filtered = filtered.filter((n) => !n.read);
    } else if (filter === "read") {
      filtered = filtered.filter((n) => n.read);
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((n) => n.type === typeFilter);
    }

    return filtered;
  }, [notifications, filter, typeFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchNotifications();
    setRefreshing(false);
  };

  const getNotificationIcon = (type: string) => {
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "donation":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "volunteer":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "milestone":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      case "campaign":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
      case "comment":
        return "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300";
      case "system":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      {/* Header */}
      <div>
        <Heading level={1} gutterBottom>
          {t("title")}
        </Heading>
        <BodyText muted>
          {t("description")}
        </BodyText>
      </div>

      {/* Stats & Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <BodyText size="sm" muted className="mb-1">
                  {t("totalNotifications")}
                </BodyText>
                <BodyText size="lg" weight="bold">
                  {notifications.length}
                </BodyText>
              </div>
              <div>
                <BodyText size="sm" muted className="mb-1">
                  {t("unread")}
                </BodyText>
                <BodyText size="lg" weight="bold" className="text-primary">
                  {unreadCount}
                </BodyText>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
                {t("refresh")}
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={markAllAsRead}
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  {t("markAllRead")}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                <Filter className="h-4 w-4 inline mr-1" />
                {t("filterByStatus")}
              </label>
              <Select value={filter} onValueChange={(value) => setFilter(value as FilterType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allNotifications")}</SelectItem>
                  <SelectItem value="unread">{t("unread")}</SelectItem>
                  <SelectItem value="read">{t("read")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                <Filter className="h-4 w-4 inline mr-1" />
                {t("filterByType")}
              </label>
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as NotificationType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allTypes")}</SelectItem>
                  <SelectItem value="donation">{t("types.donation")}</SelectItem>
                  <SelectItem value="volunteer">{t("types.volunteer")}</SelectItem>
                  <SelectItem value="milestone">{t("types.milestone")}</SelectItem>
                  <SelectItem value="campaign">{t("types.campaign")}</SelectItem>
                  <SelectItem value="comment">{t("types.comment")}</SelectItem>
                  <SelectItem value="system">{t("types.system")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <Heading level={3} gutterBottom>
                {t("noNotifications")}
              </Heading>
              <BodyText muted>{t("noNotificationsDesc")}</BodyText>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "transition-all hover:shadow-md",
                !notification.read && "border-l-4 border-l-primary bg-primary/5"
              )}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-3xl shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <BodyText weight="semibold" className="text-base">
                            {notification.title}
                          </BodyText>
                          {!notification.read && (
                            <Badge variant="default" className="text-xs">
                              {t("new")}
                            </Badge>
                          )}
                        </div>
                        <Badge className={cn("text-xs", getTypeColor(notification.type))}>
                          {t(`types.${notification.type}`)}
                        </Badge>
                      </div>
                      <BodyText size="sm" muted className="shrink-0">
                        {formatDistanceToNow(new Date(notification.timestamp), {
                          addSuffix: true,
                        })}
                      </BodyText>
                    </div>

                    <BodyText className="mb-3">
                      {notification.message}
                    </BodyText>

                    {/* Metadata */}
                    {notification.metadata && (
                      <div className="flex flex-wrap gap-2 mb-3 text-sm text-muted-foreground">
                        {notification.metadata.userName && (
                          <span>👤 {notification.metadata.userName}</span>
                        )}
                        {notification.metadata.campaignTitle && (
                          <span>📢 {notification.metadata.campaignTitle}</span>
                        )}
                        {notification.metadata.amount && (
                          <span>💰 ${notification.metadata.amount.toLocaleString()}</span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {notification.actionUrl && (
                        <Link href={notification.actionUrl}>
                          <Button size="sm" variant="default">
                            {t("viewDetails")}
                          </Button>
                        </Link>
                      )}
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {t("markAsRead")}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
