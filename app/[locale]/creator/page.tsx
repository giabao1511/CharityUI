"use client";

import { useState, useEffect } from "react";
import { StatsOverview } from "@/components/creator/stats-overview";
import { RecentActivity } from "@/components/creator/recent-activity";
import { Heading, BodyText } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCreatorStats, getCreatorActivity } from "@/lib/services/creator.service";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { PlusCircle, LayoutDashboard, Loader2 } from "lucide-react";
import type { CreatorStats, ActivityItem } from "@/types/creator";

export default function CreatorDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<CreatorStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      if (authLoading) return;

      if (!user) {
        setError("Please sign in to access the creator dashboard");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // Clear old data when refetching
        setStats(null);
        setActivities([]);

        // Fetch stats and recent activity in parallel
        const [statsData, activityData] = await Promise.all([
          getCreatorStats(),
          getCreatorActivity({ limit: 10 }),
        ]);

        setStats(statsData);
        setActivities(activityData.activities);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user, authLoading]);

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="container py-12 md:py-16">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <BodyText muted>Loading dashboard...</BodyText>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !user) {
    return (
      <div className="container py-12 md:py-16">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <LayoutDashboard className="h-12 w-12 text-red-600 dark:text-red-400 mb-4" />
              <Heading level={3} className="mb-2">
                Access Required
              </Heading>
              <BodyText muted className="mb-4">
                {error || "Please sign in to access the creator dashboard"}
              </BodyText>
              <Link href="/auth">
                <Button>Sign In</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-16">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <LayoutDashboard className="h-8 w-8 text-primary" />
          <Heading level={1}>Creator Dashboard</Heading>
        </div>
        <BodyText size="lg" className="text-muted-foreground">
          Welcome back, {user.firstName} {user.lastName}!
        </BodyText>
        <BodyText size="sm" muted className="mt-1">
          Manage your campaigns and track your impact
        </BodyText>
      </div>

      {/* Statistics Overview */}
      <div className="mb-8">
        {stats && <StatsOverview stats={stats} />}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card>
          <CardContent className="pt-6">
            <Heading level={3} className="mb-4">
              Quick Actions
            </Heading>
            <div className="space-y-3">
              <Link href="/creator/campaigns">
                <Button className="w-full" variant="default">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  My Campaigns
                </Button>
              </Link>
              <Link href="/creator/campaigns/new">
                <Button className="w-full" variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <RecentActivity activities={activities} />
      </div>
    </div>
  );
}
