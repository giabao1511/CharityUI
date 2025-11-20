"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { getCampaigns } from "@/lib/services/campaign.service";
import { campaignListToCreatorItems } from "@/lib/adapters/campaign-adapter";
import { CampaignsTable } from "@/components/creator/campaigns-table";
import type { CreatorCampaignItem } from "@/types/creator";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CampaignsListClient() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<CreatorCampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCampaigns() {
      // Check if user is authenticated
      if (!user) {
        setError("Please sign in to view your campaigns");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch all campaigns
        // TODO: Add filter for campaigns owned by current user when backend supports it
        const response = await getCampaigns({
          page: 1,
          limit: 100,
        });

        console.log("Campaigns API Response:", response);

        // Convert to CreatorCampaignItem format
        if (response.funds && Array.isArray(response.funds)) {
          const creatorCampaigns = campaignListToCreatorItems(response.funds);
          setCampaigns(creatorCampaigns);
        } else {
          console.warn("Unexpected campaigns response structure:", response);
          setCampaigns([]);
        }
      } catch (error) {
        console.error("Error loading campaigns:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load campaigns"
        );
      } finally {
        setLoading(false);
      }
    }

    loadCampaigns();
  }, [user]);

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              Loading your campaigns...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Campaigns</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error}
            </p>
            <div className="flex gap-3">
              {!user && (
                <Button asChild>
                  <Link href="/auth">Sign In</Link>
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Success state - render the table
  return <CampaignsTable campaigns={campaigns} />;
}
