/**
 * Campaign Adapter
 * Converts API campaign format to mock/UI format
 * This adapter bridges the backend API structure with the frontend UI expectations
 */

import type { Fund, Volunteer } from "@/types";
import type {
  CreatorCampaignItem,
  VolunteerRegistration,
} from "@/types/creator";
import { CampaignItem } from "@/types/fund";

/**
 * Transform API volunteer (VolunteerRegistration) to public Volunteer type
 */
export function transformVolunteerForPublic(
  apiVolunteer: VolunteerRegistration
): Volunteer {
  // Map API statuses to public volunteer statuses
  let status: "pending" | "active" | "rejected" = "pending";
  if (apiVolunteer.status === "active" || apiVolunteer.status === "approved") {
    status = "active";
  } else if (
    apiVolunteer.status === "rejected" ||
    apiVolunteer.status === "inactive"
  ) {
    status = "rejected";
  } else if (apiVolunteer.status === "pending") {
    status = "pending";
  }

  return {
    id: `${apiVolunteer.volunteerId}`,
    name: apiVolunteer.userName,
    registeredAt: apiVolunteer.registeredAt,
    status: status,
    skills: apiVolunteer.skills || [],
    availability: apiVolunteer.availability || "",
  };
}

/**
 * Convert a single API campaign to mock format
 * Handles the actual API response structure from /v1/campaigns/detail/:id
 * @param apiCampaign - Campaign data from API
 * @param volunteers - Optional volunteer data (should be fetched separately from /v1/volunteers/:campaignId)
 */
export function campaignToMockFormat(
  apiCampaign: any,
  volunteers: VolunteerRegistration[] = []
): Fund {
  // Handle new API response structure
  const campaignId = apiCampaign.campaignId || apiCampaign.fundId;
  const title = apiCampaign.title || apiCampaign.fundName;
  const category =
    apiCampaign.category?.categoryName ||
    apiCampaign.fundCategory?.categoryName ||
    "General";

  // Get banner from media array (first image) or bannerUrl
  const bannerUrl = apiCampaign.media?.[0]?.url || apiCampaign.bannerUrl || "";

  // Get all media URLs
  const mediaUrls = apiCampaign.media?.map((media: any) => media.url) || [];

  // Determine status (new API uses status.campaignStatusId, old uses fundStatus.fundStatusId or status number)
  let status: "active" | "completed" | "cancelled" = "active";
  if (apiCampaign.status?.campaignStatusId) {
    status = apiCampaign.status.campaignStatusId === 1 ? "active" : "completed";
  } else if (apiCampaign.fundStatus?.fundStatusId) {
    status = apiCampaign.fundStatus.fundStatusId === 2 ? "active" : "completed";
  } else if (typeof apiCampaign.status === "number") {
    status = apiCampaign.status === 2 ? "active" : "completed";
  }

  // Get creator name (might not be in new API response)
  const creatorName = apiCampaign.creator
    ? `${apiCampaign.creator.firstName} ${apiCampaign.creator.lastName}`.trim()
    : apiCampaign.organization?.orgName || "Unknown Creator";

  return {
    id: `${campaignId}`,
    slug: `${campaignId}`,
    title: title,
    shortDescription: apiCampaign.description?.substring(0, 150) + "..." || "",
    fullDescription: apiCampaign.description || "",
    creator: creatorName,
    category: category,
    goalAmount: apiCampaign.targetAmount,
    currentAmount: apiCampaign.currentAmount,
    currency: "USD",
    imageUrl: bannerUrl,
    mediaUrls: mediaUrls,
    videoUrl: undefined,
    startDate: apiCampaign.startDate,
    endDate: apiCampaign.endDate,
    status: status,
    backers: 0,
    milestones: (apiCampaign.milestones || []).map((milestone: any) => ({
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
    volunteers: volunteers.map(transformVolunteerForPublic),
    comments: [],
    organization: apiCampaign.organization
      ? {
          orgId: apiCampaign.organization.orgId,
          orgName: apiCampaign.organization.orgName,
          avatar: apiCampaign.organization.avatar,
        }
      : undefined,
  };
}

/**
 * Convert API campaign list items to mock format
 * Handles both old and new API structures
 */
export function campaignListToMockFormat(apiCampaigns: any[]): Fund[] {
  return apiCampaigns.map((apiCampaign) => {
    // Handle both old and new API structures
    const campaignId = apiCampaign.campaignId || apiCampaign.fundId;
    const title = apiCampaign.title || apiCampaign.fundName;

    // Get creator/organization name
    const creatorName = apiCampaign.creator
      ? `${apiCampaign.creator.firstName} ${apiCampaign.creator.lastName}`.trim()
      : apiCampaign.organization?.orgName || "Unknown Creator";

    // Get category name (new API: category object, old API: fundCategory object)
    const categoryName =
      apiCampaign.category?.categoryName ||
      apiCampaign.fundCategory?.categoryName ||
      "General";

    // Get banner URL (new API: from media array, old API: bannerUrl field)
    const bannerUrl =
      apiCampaign.media?.[0]?.url || apiCampaign.bannerUrl || "";

    // Get all media URLs (new API provides media array)
    const mediaUrls = apiCampaign.media?.map((media: any) => media.url) || [];

    // Get status (new API: status.campaignStatusId, old API: fundStatus.fundStatusId)
    let status: "active" | "completed" | "cancelled" = "active";
    if (apiCampaign.status?.campaignStatusId) {
      status =
        apiCampaign.status.campaignStatusId === 1 ? "active" : "completed";
    } else if (apiCampaign.fundStatus?.fundStatusId) {
      status =
        apiCampaign.fundStatus.fundStatusId === 2 ? "active" : "completed";
    }

    return {
      id: `${campaignId}`,
      slug: `${campaignId}`,
      title: title,
      shortDescription:
        apiCampaign.description?.substring(0, 150) + "..." || "",
      fullDescription: apiCampaign.description || "",
      creator: creatorName,
      category: categoryName,
      goalAmount: apiCampaign.targetAmount,
      currentAmount: apiCampaign.currentAmount,
      currency: "USD",
      imageUrl: bannerUrl,
      mediaUrls: mediaUrls,
      videoUrl: undefined,
      startDate: apiCampaign.startDate,
      endDate: apiCampaign.endDate,
      status: status,
      backers: 0,
      milestones: [],
      updates: [],
      rewardTiers: [],
      contributors: [],
      volunteers: [],
      comments: [],
      organization: apiCampaign.organization
        ? {
            orgId: apiCampaign.organization.orgId,
            orgName: apiCampaign.organization.orgName,
            avatar: apiCampaign.organization.avatar,
          }
        : undefined,
    };
  });
}

/**
 * Convert API CampaignListItem to CreatorCampaignItem format
 * Used for the creator dashboard campaigns table
 * Handles both old API structure (fundId, fundName) and new structure (campaignId, title)
 */
export function campaignListItemToCreatorItem(
  apiCampaign: any
): CreatorCampaignItem {
  // Handle both old and new API structures for ID
  const fundId = apiCampaign.campaignId || apiCampaign.fundId;

  // Handle both old and new API structures for name
  const fundName = apiCampaign.title || apiCampaign.fundName;

  // Handle banner URL - new API uses media array, old API has bannerUrl field
  const bannerUrl = apiCampaign.media?.[0]?.url || apiCampaign.bannerUrl || "";

  // Get status information - new API: status.campaignStatusId, old API: fundStatus.fundStatusId
  let status = 2; // Default to ACTIVE
  let statusName = "Active";

  if (apiCampaign.status?.campaignStatusId) {
    status = apiCampaign.status.campaignStatusId;
    statusName = apiCampaign.status.statusName || "Active";
  } else if (apiCampaign.fundStatus?.fundStatusId) {
    status = apiCampaign.fundStatus.fundStatusId;
    statusName = apiCampaign.fundStatus.fundStatusName || "Active";
  }

  return {
    fundId: fundId,
    fundName: fundName,
    bannerUrl: bannerUrl,
    status: status,
    statusName: statusName,
    targetAmount: apiCampaign.targetAmount,
    currentAmount: apiCampaign.currentAmount,
    startDate: apiCampaign.startDate,
    endDate: apiCampaign.endDate,
    backersCount: 0, // Backend doesn't provide this yet, will be 0
    volunteersCount: 0, // Backend doesn't provide this yet, will be 0
    createdAt: apiCampaign.createdAt,
    updatedAt: apiCampaign.updatedAt,
  };
}

/**
 * Convert array of API CampaignListItem to CreatorCampaignItem array
 */
export function campaignListToCreatorItems(
  apiCampaigns: CampaignItem[]
): CreatorCampaignItem[] {
  return apiCampaigns.map(campaignListItemToCreatorItem);
}
