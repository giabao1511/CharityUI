"use client";

import { CampaignsTable } from "@/components/creator/campaigns-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { useAuth } from "@/lib/auth-context";
import { getCampaigns } from "@/lib/services/campaign.service";
import { CampaignItem } from "@/types/fund";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 10;

export function CampaignsListClient() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

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

        // Fetch campaigns with pagination filtered by userId
        const campaignsList = await getCampaigns({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          userId: user.userId,
        });

        console.log("Campaigns API Response:", campaignsList);

        // Convert to CreatorCampaignItem format
        if (campaignsList.campaigns && Array.isArray(campaignsList.campaigns)) {
          setCampaigns(campaignsList.campaigns);

          // Set pagination info
          if (campaignsList.pagination) {
            setTotalItems(campaignsList.pagination.total || 0);
            setTotalPages(
              Math.ceil((campaignsList.pagination.total || 0) / ITEMS_PER_PAGE)
            );
          }
        } else {
          console.warn(
            "Unexpected campaigns response structure:",
            campaignsList
          );
          setCampaigns([]);
        }
      } catch (error) {
        console.error("Error loading campaigns:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load campaigns"
        );
      } finally {
        setLoading(false);
      }
    }

    loadCampaigns();
  }, [user, currentPage]);

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
            <h3 className="text-lg font-semibold mb-2">
              Error Loading Campaigns
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
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

  // Success state - render the table with pagination
  return (
    <div className="space-y-4">
      <CampaignsTable campaigns={campaigns} />
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
      {totalItems > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing {campaigns.length} of {totalItems} campaigns
        </p>
      )}
    </div>
  );
}
