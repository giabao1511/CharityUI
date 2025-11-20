import { CampaignRewardSection } from "@/components/campaigns/campaign-reward-section";
import { CampaignTabs } from "@/components/campaigns/campaign-tabs";
import { ContributionSidebar } from "@/components/campaigns/contribution-sidebar";
import { CampaignBannerSlideshow } from "@/components/campaigns/campaign-banner-slideshow";
import { BodyText, Heading } from "@/components/ui/typography";
import { campaignToMockFormat } from "@/lib/adapters/campaign-adapter";
import { mockCampaigns } from "@/lib/data";
import { getCampaignById } from "@/lib/services/campaign.service";
import { getCampaignVolunteers } from "@/lib/services/creator.service";
import type { Fund } from "@/types";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";

export default async function CampaignDetailPage({
  params,
}: {
  readonly params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations("campaigns");

  let campaign: Fund | null = null;
  let error = null;

  // Try to fetch from API using the slug as campaign ID
  try {
    // Fetch campaign and volunteers in parallel
    const [apiCampaign, volunteersData] = await Promise.all([
      getCampaignById(slug),
      getCampaignVolunteers(slug).catch(() => ({ volunteers: [] })), // Fallback to empty array if volunteers fetch fails
    ]);

    campaign = campaignToMockFormat(apiCampaign, volunteersData.volunteers);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load campaign";
    console.error("Error fetching campaign from API:", err);

    // Fallback to mock data if API fails
    campaign = mockCampaigns.find((c) => c.slug === slug) || null;
  }

  if (!campaign) {
    notFound();
  }

  const percentageFunded = Math.round(
    (campaign.currentAmount / campaign.goalAmount) * 100
  );
  const daysLeft = Math.ceil(
    (new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="container py-12 md:py-16">
      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="font-semibold">⚠️ {t("errors.usingDemoData")}</p>
          <p className="text-sm">{t("errors.backendError", { error })}</p>
          <p className="text-sm mt-1">{t("errors.demoDataDesc")}</p>
        </div>
      )}

      {/* Campaign Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>{campaign.category}</span>
        </div>
        <Heading level={1} className="mb-4">
          {campaign.title}
        </Heading>
        <BodyText size="xl" muted>
          {campaign.shortDescription}
        </BodyText>
        <div className="mt-4 text-sm text-muted-foreground">
          {t("card.by")}{" "}
          {campaign.organization ? (
            <Link
              href={`/organizations/${campaign.organization.orgId}`}
              className="font-medium text-foreground hover:text-primary transition-colors hover:underline"
            >
              {campaign.creator}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{campaign.creator}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Campaign Banner Slideshow */}
          {campaign.mediaUrls && campaign.mediaUrls.length > 0 ? (
            <CampaignBannerSlideshow
              images={campaign.mediaUrls}
              alt={campaign.title}
            />
          ) : campaign.imageUrl ? (
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
                <span className="text-muted-foreground">{t("card.image")}</span>
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
          campaignId={campaign.id}
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
