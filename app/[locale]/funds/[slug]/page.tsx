import { notFound } from "next/navigation";
import { FundTabs } from "@/components/funds/fund-tabs";
import { ContributionSidebar } from "@/components/funds/contribution-sidebar";
import { FundRewardSection } from "@/components/funds/fund-reward-section";
import { Heading, BodyText } from "@/components/ui/typography";
import { getFundById } from "@/lib/services/fund.service";
import { fundToCampaign } from "@/lib/adapters/fund-to-campaign.adapter";
import { mockCampaigns } from "@/lib/data";
import type { Fund } from "@/types";

export default async function FundDetailPage({ 
  params 
}: { 
  readonly params: Promise<{ slug: string; locale: string }> 
}) {
  const { slug } = await params;
  
  // Try to extract fundId from slug (format: fund-{fundId})
  let campaign: Fund | null = null;
  let error = null;
  
  // Check if slug starts with 'fund-' (API format) or is a regular slug (mock data)
  if (slug.startsWith('fund-')) {
    // API fund - extract ID
    const fundId = slug.replace('fund-', '');
    
    try {
      const fund = await getFundById(fundId);
      campaign = fundToCampaign(fund);
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load fund";
      console.error("Error fetching fund from API:", err);
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
          <p className="text-sm mt-1">Showing mock fund for demonstration. Please fix the backend database schema.</p>
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
                <span className="text-muted-foreground">Fund Image</span>
              </div>
            </div>
          )}

          {/* Reward Tiers - Only show if fund has rewards */}
          {campaign.rewardTiers && campaign.rewardTiers.length > 0 && (
            <FundRewardSection rewardTiers={campaign.rewardTiers} />
          )}

          {/* Fund Tabs - Client Component */}
          <FundTabs fund={campaign} />
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
