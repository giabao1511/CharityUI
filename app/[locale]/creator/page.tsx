import { getTranslations } from "next-intl/server";
import { StatsOverview } from "@/components/creator/stats-overview";
import { RecentActivity } from "@/components/creator/recent-activity";
import { Heading, BodyText } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  mockCreatorUser,
  mockCreatorStats,
  getCreatorActivity,
} from "@/lib/mock-creator-data";
import Link from "next/link";
import { PlusCircle, LayoutDashboard } from "lucide-react";

export default async function CreatorDashboardPage() {
  const t = await getTranslations("creator");

  // Simulate RBAC - get data only for the mock creator user
  const creatorActivity = getCreatorActivity(mockCreatorUser.userId);

  return (
    <div className="container py-12 md:py-16">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <LayoutDashboard className="h-8 w-8 text-primary" />
          <Heading level={1}>{t("dashboard.title")}</Heading>
        </div>
        <BodyText size="lg" className="text-muted-foreground">
          {t("dashboard.welcome", {
            name: `${mockCreatorUser.firstName} ${mockCreatorUser.lastName}`,
          })}
        </BodyText>
        <BodyText size="sm" muted className="mt-1">
          {t("dashboard.subtitle")}
        </BodyText>
      </div>

      {/* Demo Notice */}
      <Card className="mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-500 text-white rounded-full p-2 shrink-0">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-100">
                Demo Creator Dashboard
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                This is a demonstration of Role-Based Access Control (RBAC). The
                dashboard shows only campaigns owned by the mock user (ID:{" "}
                {mockCreatorUser.userId}). In production, this would be replaced
                with actual authentication and authorization.
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                Owned Campaign IDs:{" "}
                {mockCreatorUser.ownedCampaignIds.join(", ")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Overview */}
      <div className="mb-8">
        <StatsOverview stats={mockCreatorStats} />
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/creator/campaigns">
              <Button className="w-full" variant="default">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                {t("campaigns.title")}
              </Button>
            </Link>
            <Link href="/creator/campaigns/new">
              <Button className="w-full mt-2" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                {t("campaigns.createNew")}
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <RecentActivity activities={creatorActivity} />
      </div>
    </div>
  );
}
