import { CampaignListClient } from "@/components/campaigns/campaign-list-client";
import { categories, mockCampaigns } from "@/lib/data";
import { Heading, BodyText } from "@/components/ui/typography";
import { getTranslations } from "next-intl/server";
import { getCampaigns } from "@/lib/services/campaign.service";
import { campaignListToMockFormat } from "@/lib/adapters/campaign-adapter";
import type { Fund } from "@/types";

export default async function CampaignsPage() {
  const t = await getTranslations("campaigns");

  // Fetch campaigns from the API with fallback to mock data
  let campaigns: Fund[] = [];
  let error = null;

  try {
    // Fetch all campaigns from backend
    const response = await getCampaigns();
    // Filter for active campaigns on frontend (status 2 = Active)
    const activeCampaigns = response.funds.filter(campaign => campaign.fundStatus.fundStatusId === 2);
    campaigns = campaignListToMockFormat(activeCampaigns);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load campaigns";
    console.error("Error fetching campaigns:", err);
    // Fallback to mock data if API fails
    campaigns = mockCampaigns;
  }

  return (
    <div className="container py-12 md:py-16">
      {/* Page Header */}
      <div className="mb-12">
        <Heading level={1} gutterBottom>Campaigns</Heading>
        <BodyText size="lg" muted>
          Discover and support fundraising campaigns from verified organizations
        </BodyText>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="font-semibold">⚠️ Using Demo Data</p>
          <p className="text-sm">Backend API error: {error}</p>
          <p className="text-sm mt-1">Showing mock campaigns for demonstration. Please fix the backend database schema.</p>
        </div>
      )}

      {/* Client-side filtering and rendering */}
      <CampaignListClient campaigns={campaigns} categories={categories} />
    </div>
  );
}
