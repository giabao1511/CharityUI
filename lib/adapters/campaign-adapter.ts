/**
 * Campaign Adapter
 * Converts API campaign format to mock/UI format
 * This adapter bridges the backend API structure with the frontend UI expectations
 */

import type { Campaign, CampaignListItem } from "@/types/campaign";
import type { Fund } from "@/types";

/**
 * Convert a single API campaign to mock format
 */
export function campaignToMockFormat(apiCampaign: Campaign): Fund {
  const creatorName = apiCampaign.creator
    ? `${apiCampaign.creator.firstName} ${apiCampaign.creator.lastName}`.trim()
    : apiCampaign.organization?.orgName || "Unknown Creator";

  return {
    id: `campaign-${apiCampaign.fundId}`,
    slug: `campaign-${apiCampaign.fundId}`,
    title: apiCampaign.fundName,
    shortDescription: apiCampaign.description.substring(0, 150) + "...",
    fullDescription: apiCampaign.description,
    creator: creatorName,
    category: apiCampaign.fundCategory?.categoryName || "General",
    goalAmount: apiCampaign.targetAmount,
    currentAmount: apiCampaign.currentAmount,
    currency: "USD",
    imageUrl: apiCampaign.bannerUrl || "",
    videoUrl: undefined,
    startDate: apiCampaign.startDate,
    endDate: apiCampaign.endDate,
    status: apiCampaign.status === 2 ? "active" : "completed",
    backers: 0, // Not provided by API yet
    milestones: (apiCampaign.milestones || []).map((milestone) => ({
      id: `milestone-${milestone.milestoneId}`,
      title: milestone.title,
      description: milestone.description,
      fundingRequired: milestone.targetAmount,
      status:
        milestone.achievedAmount >= milestone.targetAmount
          ? "achieved"
          : milestone.achievedAmount > 0
          ? "in-progress"
          : "pending",
      achievedDate:
        milestone.achievedAmount >= milestone.targetAmount
          ? milestone.endDate
          : undefined,
    })),
    updates: [],
    rewardTiers: [],
    contributors: [],
    comments: [],
  };
}

/**
 * Convert API campaign list items to mock format
 */
export function campaignListToMockFormat(apiCampaigns: CampaignListItem[]): Fund[] {
  return apiCampaigns.map((apiCampaign) => {
    const creatorName = apiCampaign.creator
      ? `${apiCampaign.creator.firstName} ${apiCampaign.creator.lastName}`.trim()
      : apiCampaign.organization?.orgName || "Unknown Creator";

    return {
      id: `campaign-${apiCampaign.fundId}`,
      slug: `campaign-${apiCampaign.fundId}`,
      title: apiCampaign.fundName,
      shortDescription: apiCampaign.description.substring(0, 150) + "...",
      fullDescription: apiCampaign.description,
      creator: creatorName,
      category: apiCampaign.fundCategory?.categoryName || "General",
      goalAmount: apiCampaign.targetAmount,
      currentAmount: apiCampaign.currentAmount,
      currency: "USD",
      imageUrl: apiCampaign.bannerUrl || "",
      videoUrl: undefined,
      startDate: apiCampaign.startDate,
      endDate: apiCampaign.endDate,
      status: apiCampaign.fundStatus.fundStatusId === 2 ? "active" : "completed",
      backers: 0, // Not provided by API yet
      milestones: [],
      updates: [],
      rewardTiers: [],
      contributors: [],
      comments: [],
    };
  });
}
