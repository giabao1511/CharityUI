import { notFound } from "next/navigation";
import { CampaignTabs } from "@/components/campaigns/campaign-tabs";
import { ContributionSidebar } from "@/components/campaigns/contribution-sidebar";
import { CampaignRewardSection } from "@/components/campaigns/campaign-reward-section";
import { Heading, BodyText } from "@/components/ui/typography";
import { getCampaignById } from "@/lib/services/campaign.service";
import { campaignToMockFormat } from "@/lib/adapters/campaign-adapter";
import { mockCampaigns } from "@/lib/data";
import type { Fund } from "@/types";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function CampaignDetailPage({
  params
}: {
  readonly params: Promise<{ slug: string; locale: string }>
}) {
  const { slug } = await params;

  // Try to extract campaignId from slug (format: campaign-{campaignId})
  let campaign: Fund | null = null;
  let error = null;

  // Check if slug starts with 'campaign-' (API format) or is a regular slug (mock data)
  if (slug.startsWith('campaign-')) {
    // API campaign - extract ID
    const campaignId = slug.replace('campaign-', '');

    try {
      const apiCampaign = await getCampaignById(campaignId);
      campaign = campaignToMockFormat(apiCampaign);
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load campaign";
      console.error("Error fetching campaign from API:", err);
    }
  }

  // Fallback to mock data if API fails or slug is in mock format
  if (!campaign) {
    campaign = mockCampaigns.find(c => c.slug === slug) || null;

    if (!campaign) {
      notFound();
    }
  }

  const percentageFunded = Math.round((campaign.currentAmount / campaign.goalAmount) * 100);
  const daysLeft = Math.ceil(
    (new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="container py-12 md:py-16">
      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="font-semibold">⚠️ Using Demo Data</p>
          <p className="text-sm">Backend API error: {error}</p>
          <p className="text-sm mt-1">Showing mock campaign for demonstration. Please fix the backend database schema.</p>
        </div>
      )}

      {/* Campaign Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>{campaign.category}</span>
          <span>•</span>
          <span>by {campaign.creator}</span>
        </div>
        <Heading level={1} className="mb-4">{campaign.title}</Heading>
        <BodyText size="xl" muted>{campaign.shortDescription}</BodyText>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Campaign Image/Banner */}
          {campaign.imageUrl ? (
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={campaign.imageUrl}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : campaign.videoUrl ? (
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <iframe
                src={campaign.videoUrl}
                title={campaign.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div
              className="aspect-video w-full overflow-hidden rounded-lg bg-muted"
              aria-hidden="true"
            >
              <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="text-muted-foreground">Campaign Image</span>
              </div>
            </div>
          )}

          {/* Reward Tiers - Only show if campaign has rewards */}
          {campaign.rewardTiers && campaign.rewardTiers.length > 0 && (
            <CampaignRewardSection rewardTiers={campaign.rewardTiers} />
          )}

          {/* Campaign Tabs - Client Component */}
          <CampaignTabs campaign={campaign} />
        </div>

        {/* Sidebar - Client Component */}
        <ContributionSidebar
          goalAmount={campaign.goalAmount}
          currentAmount={campaign.currentAmount}
          backers={campaign.backers}
          daysLeft={daysLeft}
          percentageFunded={percentageFunded}
          rewardTiers={campaign.rewardTiers}
        />
      </div>
    </div>
  );
}
