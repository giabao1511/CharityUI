import { Suspense } from "react";
import { CampaignCard } from "@/components/campaigns/campaign-card";
import { CampaignFilters } from "@/components/campaigns/campaign-filters";
import { mockCampaigns } from "@/lib/data";
import { Heading, BodyText } from "@/components/ui/typography";
import { getTranslations } from "next-intl/server";
import { getCampaigns } from "@/lib/services/campaign.service";
import { campaignListToMockFormat } from "@/lib/adapters/campaign-adapter";
import type { Fund } from "@/types";

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    status?: string;
  }>;
}) {
  const t = await getTranslations("campaigns");
  const params = await searchParams;

  // Parse query parameters
  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "12");
  const search = params.search || "";
  const sortBy = params.sortBy || "startDate";
  const sortOrder = params.sortOrder || "DESC";
  const status = params.status ? parseInt(params.status) : undefined;

  // Fetch campaigns from the API with fallback to mock data
  let campaigns: Fund[] = [];
  let error = null;
  let totalCount = 0;
  let totalPages = 1;

  try {
    // Fetch campaigns from backend with filters
    const response = await getCampaigns({
      page,
      limit,
      search,
      sortBy: sortBy as any,
      sortOrder: sortOrder as "asc" | "desc",
      status,
    });
    campaigns = campaignListToMockFormat(response.funds);
    totalCount = response.pagination.total;
    totalPages = Math.ceil(totalCount / limit);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load campaigns";
    console.error("Error fetching campaigns:", err);
    // Fallback to mock data if API fails
    campaigns = mockCampaigns;
    totalCount = mockCampaigns.length;
    totalPages = Math.ceil(totalCount / limit);
  }

  return (
    <div className="container py-12 md:py-16">
      {/* Page Header */}
      <div className="mb-12">
        <Heading level={1} gutterBottom>{t("title")}</Heading>
        <BodyText size="lg" muted>
          {t("subtitle")}
        </BodyText>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="font-semibold">⚠️ {t("errors.usingDemoData")}</p>
          <p className="text-sm">{t("errors.backendError", { error })}</p>
          <p className="text-sm mt-1">{t("errors.demoDataDesc")}</p>
        </div>
      )}

      {/* Filters and Pagination */}
      <div className="mb-8">
        <CampaignFilters
          defaultValues={{
            search: search,
            status: status?.toString(),
            sortBy: sortBy,
            sortOrder: sortOrder,
          }}
          currentPage={page}
          totalPages={totalPages}
        />

        {/* Results Count */}
        <div className="text-sm text-muted-foreground mt-4">
          Showing {campaigns.length} of {totalCount} campaigns
        </div>
      </div>

      {/* Campaign Grid */}
      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BodyText size="lg" muted>
            No campaigns found matching your criteria.
          </BodyText>
        </div>
      )}
    </div>
  );
}
