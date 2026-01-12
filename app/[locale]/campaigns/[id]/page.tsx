import { CampaignBannerSlideshow } from "@/components/campaigns/campaign-banner-slideshow";
import { CampaignTabs } from "@/components/campaigns/campaign-tabs";
import { ContributionSidebar } from "@/components/campaigns/contribution-sidebar";
import { ReportDialog } from "@/components/campaigns/report-dialog";
import { BodyText, Heading } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";
import { getCampaignById } from "@/lib/services/campaign.service";
import { getCampaignVolunteers } from "@/lib/services/creator.service";
import { getCampaignDonations } from "@/lib/services/donation.service";
import type { Donation } from "@/types";
import { CampaignItem, Volunteer } from "@/types/fund";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function CampaignDetailPage({
  params,
}: {
  readonly params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("campaigns");

  let campaign: CampaignItem | null = null;
  let volunteers: {
    volunteers: Volunteer[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
  } | null = null;
  let donations: Donation[] = [];
  let totalDonations = 0;
  let error = null;

  // Try to fetch from API using the slug as campaign ID
  try {
    // Fetch campaign, volunteers, and donations in parallel (first page only)
    const [detailCampaign, volunteersData, donationsData] = await Promise.all([
      getCampaignById(id),
      getCampaignVolunteers(id),
      getCampaignDonations(id, { page: 1, limit: 10 }),
    ]);

    volunteers = volunteersData;
    campaign = detailCampaign;
    donations = donationsData.data || [];
    totalDonations = donationsData.pagination?.total || 0;
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load campaign";
    console.error("Error fetching campaign from API:", err);
  }

  if (!campaign) {
    notFound();
  }

  // Note: Organization status is not included in the campaign detail API response
  // If you need to check organization status, fetch it separately using getOrganizationById

  const percentageFunded = Math.round(
    (campaign.currentAmount / campaign.targetAmount) * 100
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
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{campaign.category.categoryName}</span>
          </div>
          <ReportDialog
            campaignId={parseInt(String(campaign.campaignId))}
            campaignTitle={campaign.title}
          />
        </div>
        <Heading level={1} className="mb-4">
          {campaign.title}
        </Heading>
        <BodyText size="xl" muted>
          {campaign.description}
        </BodyText>
        <div className="mt-4 text-sm text-muted-foreground">
          {t("card.by")}{" "}
          {campaign.organization && (
            <Link
              href={`/organizations/${campaign.organization.orgId}`}
              className="font-medium text-foreground hover:text-primary transition-colors hover:underline"
            >
              {campaign.organization.orgName}
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Campaign Banner Slideshow */}
          {campaign.media && campaign.media.length > 0 && (
            <CampaignBannerSlideshow
              images={campaign.media.map((item) => item.url)}
              alt={campaign.title}
            />
          )}

          {/* Campaign Tabs - Client Component */}
          <CampaignTabs
            volunteers={volunteers!}
            campaign={campaign}
            initialDonations={donations}
            totalDonations={totalDonations}
          />
        </div>

        {/* Sidebar - Client Component */}
        <ContributionSidebar
          campaignId={campaign.campaignId}
          goalAmount={campaign.targetAmount}
          currentAmount={campaign.currentAmount}
          daysLeft={daysLeft}
          percentageFunded={percentageFunded}
          campaignStatus={campaign.status.campaignStatusId}
        />
      </div>
    </div>
  );
}
