import { FundListClient } from "@/components/funds/fund-list-client";
import { categories, mockCampaigns } from "@/lib/data";
import { Heading, BodyText } from "@/components/ui/typography";
import { getTranslations } from "next-intl/server";
import { getFunds } from "@/lib/services/fund.service";
import { fundsToCampaigns } from "@/lib/adapters/fund-to-campaign.adapter";
import type { Fund } from "@/types";

export default async function FundsPage() {
  const t = await getTranslations("funds");
  
  // Fetch funds from the API with fallback to mock data
  let funds: Fund[] = [];
  let error = null;

  try {
    // Fetch all funds from backend
    const response = await getFunds();
    // Filter for active funds on frontend (status 2 = Active)
    const activeFunds = response.funds.filter(fund => fund.fundStatus.fundStatusId === 2);
    funds = fundsToCampaigns(activeFunds);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load funds";
    console.error("Error fetching funds:", err);
    // Fallback to mock data if API fails
    funds = mockCampaigns;
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
          <p className="font-semibold">⚠️ Using Demo Data</p>
          <p className="text-sm">Backend API error: {error}</p>
          <p className="text-sm mt-1">Showing mock funds for demonstration. Please fix the backend database schema.</p>
        </div>
      )}

      {/* Client-side filtering and rendering */}
      <FundListClient funds={funds} categories={categories} />
    </div>
  );
}
