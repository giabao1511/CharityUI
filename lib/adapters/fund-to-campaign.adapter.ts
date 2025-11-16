/**
 * Fund to Campaign Adapter
 *
 * This adapter converts Fund types from the backend API to the legacy Campaign
 * type used in existing UI components. This allows gradual migration of components
 * from mock data to real API data.
 *
 * @deprecated This is a temporary bridge. Components should be migrated to use
 * Fund types directly from types/fund.ts instead of Campaign types.
 */

import type { Fund as ApiFund, FundListItem } from "@/types/fund";
import type { Fund as Campaign } from "@/types";

/**
 * Convert a Fund or FundListItem to a Campaign object
 * Maps the backend Fund schema to the frontend Campaign interface
 *
 * @param fund - Fund or FundListItem from API
 * @returns Campaign object compatible with existing components
 */
export function fundToCampaign(fund: ApiFund | FundListItem): Campaign {
  // Generate slug from fundId if not available
  const slug = `fund-${fund.fundId}`;

  // Get category name from fundCategory relation if available
  const categoryName =
    "fundCategory" in fund && fund.fundCategory
      ? fund.fundCategory.categoryName
      : "Unknown";

  // Get creator name from creator relation if available
  const creatorName =
    "creator" in fund && fund.creator
      ? `${fund.creator.firstName} ${fund.creator.lastName}`
      : "Anonymous";

  // Get fund status (default to 'active' if not available)
  const fundStatus = "status" in fund ? fund.status : 2; // 2 = Active

  // Calculate backers (this field doesn't exist in Fund schema yet)
  // Using 0 as placeholder until backend provides backers count
  const backers = 0;

  // Get first video from fundMedia array if available
  const videoUrl =
    "fundMedia" in fund && fund.fundMedia && fund.fundMedia.length > 0
      ? fund.fundMedia.find((media) => media.mediaType === 2)?.url // MediaType.VIDEO = 2
      : undefined;

  return {
    id: fund.fundId.toString(),
    slug,
    title: fund.fundName,
    shortDescription:
      fund.description.substring(0, 150) +
      (fund.description.length > 150 ? "..." : ""),
    fullDescription: fund.description,
    category: categoryName,
    goalAmount: fund.targetAmount,
    currentAmount: fund.currentAmount,
    currency: "USD", // Default currency, not in Fund schema
    backers,
    startDate: fund.startDate,
    endDate: fund.endDate,
    creator: creatorName,
    imageUrl: fund.bannerUrl,
    videoUrl,
    status: getFundStatusAsCampaignStatus(fundStatus),

    // Arrays that don't exist in Fund schema yet
    updates: [],
    rewardTiers: [],
    contributors: [],
    comments: [],

    // Milestones mapping
    milestones:
      "milestones" in fund && fund.milestones
        ? fund.milestones.map((milestone) => ({
            id: milestone.milestoneId.toString(),
            title: milestone.title,
            description: milestone.description,
            fundingRequired: milestone.targetAmount,
            status: getMilestoneStatus(milestone.milestoneStatusId),
            achievedDate:
              milestone.milestoneStatusId === 3 ? milestone.endDate : undefined,
          }))
        : [],
  };
}

/**
 * Convert multiple Funds/FundListItems to Campaign array
 *
 * @param funds - Array of Funds or FundListItems from API
 * @returns Array of Campaign objects
 */
export function fundsToCampaigns(funds: (ApiFund | FundListItem)[]): Campaign[] {
  return funds.map(fundToCampaign);
}

/**
 * Map milestone status ID to status string
 * 1 = Pending, 2 = In Progress, 3 = Completed
 */
function getMilestoneStatus(
  statusId: number
): "pending" | "in-progress" | "achieved" {
  switch (statusId) {
    case 1:
      return "pending";
    case 2:
      return "in-progress";
    case 3:
      return "achieved"; // Map "completed" to "achieved" for Campaign type
    default:
      return "pending";
  }
}

/**
 * Map fund status ID to campaign status string
 * 1 = Draft, 2 = Active, 3 = Suspended, 4 = Completed, 5 = Cancelled
 */
function getFundStatusAsCampaignStatus(
  statusId: number
): "active" | "completed" | "cancelled" {
  switch (statusId) {
    case 1: // Draft
    case 2: // Active
    case 3: // Suspended (treat as active)
      return "active";
    case 4: // Completed
      return "completed";
    case 5: // Cancelled
      return "cancelled";
    default:
      return "active";
  }
}

/**
 * Get fund status as user-friendly string
 */
export function getFundStatusLabel(statusId: number): string {
  switch (statusId) {
    case 1:
      return "Draft";
    case 2:
      return "Active";
    case 3:
      return "Suspended";
    case 4:
      return "Completed";
    case 5:
      return "Cancelled";
    default:
      return "Unknown";
  }
}

/**
 * Get fundraising method as user-friendly string
 */
export function getFundMethodLabel(methodId: number): string {
  switch (methodId) {
    case 1:
      return "Milestone-based";
    case 2:
      return "Time-based";
    default:
      return "Unknown";
  }
}
