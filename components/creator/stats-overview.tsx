import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCampaignAmount } from "@/types/campaign";
import type { CreatorStats } from "@/types/creator";
import { DollarSign, TrendingUp, Users, Heart } from "lucide-react";

interface StatsOverviewProps {
  stats: CreatorStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const statsCards = [
    {
      title: "Total Raised",
      value: formatCampaignAmount(stats.totalRaised),
      description: "Across all campaigns",
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Active Campaigns",
      value: stats.activeCampaignsCount.toString(),
      description: "Currently running",
      icon: TrendingUp,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Total Volunteers",
      value: stats.totalVolunteers.toString(),
      description: "Registered helpers",
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Total Backers",
      value: stats.totalBackers.toLocaleString(),
      description: "People supporting you",
      icon: Heart,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
