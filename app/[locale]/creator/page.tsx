"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BodyText, Heading } from "@/components/ui/typography";
import { useAuth } from "@/lib/auth-context";
import {
  Building2,
  LayoutDashboard,
  Loader2,
  PlusCircle,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CreatorDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
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

      {/* Quick Actions Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Campaigns Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <Heading level={3}>Campaigns</Heading>
            </div>
            <BodyText muted className="mb-4">
              Manage your fundraising campaigns and track their progress
            </BodyText>
            <div className="space-y-2">
              <Link href="/creator/campaigns" className="block">
                <Button className="w-full" variant="default">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  View All Campaigns
                </Button>
              </Link>
              <Link href="/creator/campaigns/new" className="block">
                <Button className="w-full" variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Organizations Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <Heading level={3}>Organizations</Heading>
            </div>
            <BodyText muted className="mb-4">
              Manage your organizations and their settings
            </BodyText>
            <div className="space-y-2">
              <Link href="/creator/organizations" className="block">
                <Button className="w-full" variant="default">
                  <Building2 className="mr-2 h-4 w-4" />
                  View Organizations
                </Button>
              </Link>
              <Link href="/organizations/create" className="block">
                <Button className="w-full" variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Organization
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                <LayoutDashboard className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <Heading level={3}>Quick Access</Heading>
            </div>
            <BodyText muted className="mb-4">
              Shortcuts to frequently used actions
            </BodyText>
            <div className="space-y-2">
              <Link href="/creator/campaigns" className="block">
                <Button className="w-full" variant="outline">
                  View All Campaigns
                </Button>
              </Link>
              <Link href="/wallet" className="block">
                <Button className="w-full" variant="outline">
                  Manage Wallet
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
