"use client";

import { useState, useMemo } from "react";
import { CampaignCard } from "@/components/campaigns/campaign-card";
import { CampaignFilters } from "@/components/campaigns/campaign-filters";
import { BodyText } from "@/components/ui/typography";
import { CampaignItem } from "@/types/fund";

interface CampaignListClientProps {
  campaigns: CampaignItem[];
  categories: string[];
}

export function CampaignListClient({
  campaigns,
  categories,
}: CampaignListClientProps) {
  const [filters, setFilters] = useState({
    searchQuery: "",
    selectedCategory: "All Categories",
    sortBy: "recent",
  });

  const filteredAndSortedCampaigns = useMemo(() => {
    // Filter campaigns
    let filtered = campaigns.filter((campaign) => {
      const matchesSearch =
        campaign.title
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase()) ||
        campaign.description
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase());

      const matchesCategory =
        filters.selectedCategory === "All Categories" ||
        campaign.category.categoryName === filters.selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort campaigns
    return [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case "recent":
          return (
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
        case "mostFunded":
          return b.currentAmount - a.currentAmount;
        case "endingSoon":
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        default:
          return 0;
      }
    });
  }, [campaigns, filters]);

  return (
    <>
      {/* Filters */}
      <div className="mb-8 space-y-4">
        <CampaignFilters />

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredAndSortedCampaigns.length} of {campaigns.length}{" "}
          campaigns
        </div>
      </div>

      {/* Campaign Grid */}
      {filteredAndSortedCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedCampaigns.map((campaign) => (
            <CampaignCard key={campaign.campaignId} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BodyText size="lg" muted>
            No campaigns found matching your criteria.
          </BodyText>
        </div>
      )}
    </>
  );
}
