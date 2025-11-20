import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ActivityItem } from "@/types/creator";
import { formatCampaignAmount } from "@/types/campaign";
import {
  DollarSign,
  Users,
  Target,
  MessageSquare,
  FileText,
  Clock,
} from "lucide-react";

// Simple time ago formatter
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? "" : "s"} ago`;
    }
  }

  return "just now";
}

interface RecentActivityProps {
  readonly activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "donation":
        return DollarSign;
      case "volunteer":
        return Users;
      case "milestone":
        return Target;
      case "comment":
        return MessageSquare;
      case "update":
        return FileText;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "donation":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20";
      case "volunteer":
        return "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20";
      case "milestone":
        return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20";
      case "comment":
        return "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20";
      case "update":
        return "text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getActivityBadgeVariant = (type: ActivityItem["type"]) => {
    switch (type) {
      case "donation":
        return "default";
      case "volunteer":
        return "secondary";
      case "milestone":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No recent activity to display
            </p>
          ) : (
            activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.type);

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.description}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.campaignName}
                        </p>
                      </div>
                      <Badge
                        variant={getActivityBadgeVariant(activity.type)}
                        className="capitalize shrink-0"
                      >
                        {activity.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {activity.userName && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {activity.userName}
                        </span>
                      )}
                      {activity.amount && (
                        <span className="flex items-center gap-1 font-semibold text-green-600 dark:text-green-400">
                          <DollarSign className="h-3 w-3" />
                          {formatCampaignAmount(activity.amount)}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(new Date(activity.timestamp))}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
