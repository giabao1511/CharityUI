/**
 * Creator Service
 * Handles all API calls related to creator/fund manager dashboard
 *
 * This service integrates with EXISTING backend API endpoints:
 * - Uses /v1/organizations for organization management
 * - Uses /v1/campaigns and /v1/fund-charity for campaign management
 * - Uses /v1/volunteers for volunteer management (real API)
 * - Uses /v1/donations for activity tracking
 * - Aggregates stats from campaigns and donations
 *
 * Note: Milestones are not yet implemented in the backend and use simulated responses
 */

import { apiClient, API_ENDPOINTS } from "@/lib/api-config";
import type {
  CreatorStats,
  CreatorCampaignItem,
  ActivityItem,
  VolunteerRegistration,
} from "@/types/creator";
import type { UpdateCampaignRequest } from "@/types/campaign";

/**
 * Get creator dashboard statistics
 * Aggregates data from user's campaigns using existing endpoints
 */
export async function getCreatorStats(): Promise<CreatorStats> {
  try {
    // Fetch all user's campaigns
    const { campaigns } = await getCreatorCampaigns({ limit: 1000 });

    // Calculate stats from campaigns
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter((c) => c.status === 1).length;
    const totalRaised = campaigns.reduce(
      (sum, c) => sum + (c.currentAmount || 0),
      0
    );
    const totalBackers = campaigns.reduce(
      (sum, c) => sum + (c.backersCount || 0),
      0
    );

    return {
      totalRaised,
      activeCampaignsCount: activeCampaigns,
      totalVolunteers: campaigns.reduce(
        (sum, c) => sum + (c.volunteersCount || 0),
        0
      ),
      totalDonations: totalBackers, // Using backers count as donation count
      totalBackers,
    };
  } catch (error) {
    console.error("Error getting creator stats:", error);
    // Return empty stats on error
    return {
      totalRaised: 0,
      activeCampaignsCount: 0,
      totalVolunteers: 0,
      totalDonations: 0,
      totalBackers: 0,
    };
  }
}

/**
 * Get campaigns owned/managed by the creator
 * Uses existing CAMPAIGNS API endpoint
 */
export async function getCreatorCampaigns(filters?: {
  status?: number;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{
  campaigns: CreatorCampaignItem[];
  pagination?: { page: number; limit: number; total: number };
}> {
  const queryParams = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  // Use existing campaigns list endpoint
  const url = `${API_ENDPOINTS.CAMPAIGNS.LIST}${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const result = await apiClient<any>(url);

  if (result.error) {
    throw new Error(result.error.message);
  }

  // Handle nested data structure
  const campaigns =
    result.data?.data || result.data?.funds || result.data || [];

  // Transform to CreatorCampaignItem format
  const transformedCampaigns: CreatorCampaignItem[] = campaigns.map(
    (campaign: any) => ({
      fundId: campaign.fundId || campaign.id,
      fundName: campaign.fundName || campaign.name,
      bannerUrl: campaign.bannerUrl || campaign.imageUrl || "",
      status: campaign.status || 1,
      statusName: campaign.statusName || "Active",
      targetAmount: campaign.targetAmount || campaign.goalAmount || 0,
      currentAmount: campaign.currentAmount || 0,
      startDate: campaign.startDate || "",
      endDate: campaign.endDate || "",
      backersCount: campaign.backersCount || campaign.backers || 0,
      volunteersCount: campaign.volunteersCount || 0,
      createdAt: campaign.createdAt || new Date().toISOString(),
      updatedAt: campaign.updatedAt || new Date().toISOString(),
    })
  );

  return {
    campaigns: transformedCampaigns,
    pagination: result.pagination,
  };
}

/**
 * Get recent activity for creator's campaigns
 * Aggregates activity from donations across all campaigns
 */
export async function getCreatorActivity(filters?: {
  campaignId?: number;
  type?: string;
  page?: number;
  limit?: number;
}): Promise<{
  activities: ActivityItem[];
  pagination?: { page: number; limit: number; total: number };
}> {
  try {
    const activities: ActivityItem[] = [];

    // Get creator's campaigns
    const { campaigns } = await getCreatorCampaigns({ limit: 1000 });

    // Filter by specific campaign if provided
    const campaignsToFetch = filters?.campaignId
      ? campaigns.filter((c) => c.fundId === filters.campaignId)
      : campaigns.slice(0, 10); // Fetch donations for up to 10 campaigns to avoid overload

    // Fetch donations for each campaign and convert to activity items
    for (const campaign of campaignsToFetch) {
      try {
        const { getCreatorCampaignDonations } = await import(
          "./donation.service"
        );
        const donationsResult = await getCreatorCampaignDonations(
          campaign.fundId,
          {
            limit: 20, // Get recent 20 donations per campaign
          }
        );

        // Convert donations to activity items
        const donationActivities: ActivityItem[] = (
          donationsResult.data || []
        ).map((donation: any) => ({
          id: `donation-${donation.donationId}`,
          type: "donation" as const,
          campaignId: campaign.fundId,
          campaignName: campaign.fundName,
          description: `New donation of ${donation.amount}`,
          userName: donation.isAnonymous
            ? "Anonymous"
            : donation.fullName || "Anonymous",
          amount: parseFloat(donation.amount),
          timestamp: donation.donateDate,
        }));

        activities.push(...donationActivities);
      } catch (error) {
        console.error(
          `Error fetching donations for campaign ${campaign.fundId}:`,
          error
        );
      }
    }

    // Sort by timestamp (most recent first)
    activities.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Apply type filter
    let filteredActivities = activities;
    if (filters?.type) {
      filteredActivities = activities.filter((a) => a.type === filters.type);
    }

    // Apply pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedActivities = filteredActivities.slice(start, end);

    return {
      activities: paginatedActivities,
      pagination: {
        page,
        limit,
        total: filteredActivities.length,
      },
    };
  } catch (error) {
    console.error("Error getting creator activity:", error);
    return {
      activities: [],
      pagination: { page: 1, limit: 20, total: 0 },
    };
  }
}

/**
 * Helper function to map API volunteer status ID to our status string
 */
function mapVolunteerStatus(statusId: number): VolunteerRegistration["status"] {
  switch (statusId) {
    case 1:
      return "pending";
    case 2:
      return "active";
    case 3:
      return "rejected";
    default:
      return "pending";
  }
}

/**
 * Helper function to map our status string to API status ID
 */
function mapStatusToId(status: VolunteerRegistration["status"]): number {
  switch (status) {
    case "pending":
      return 1;
    case "active":
    case "approved": // Map approved to active in API
      return 2;
    case "rejected":
      return 3;
    default:
      return 1;
  }
}

/**
 * Transform API volunteer response to VolunteerRegistration type
 */
function transformApiVolunteer(apiVolunteer: any): VolunteerRegistration {
  return {
    volunteerId: apiVolunteer.registrationId,
    fundId: apiVolunteer.campaignId,
    userId: apiVolunteer.userInfo.userId,
    userName: `${apiVolunteer.userInfo.firstName} ${apiVolunteer.userInfo.lastName}`,
    userEmail: apiVolunteer.userInfo.email,
    registeredAt: apiVolunteer.registeredAt,
    status: mapVolunteerStatus(apiVolunteer.status.volunteerStatusId),
    skills: apiVolunteer.skills || [],
    availability: apiVolunteer.availability || "",
    notes: apiVolunteer.notes || "",
  };
}

/**
 * Get volunteers for a specific campaign
 * Uses REAL API: GET /v1/volunteers/:campaignId
 */
export async function getCampaignVolunteers(
  campaignId: string | number,
  filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }
): Promise<{
  volunteers: VolunteerRegistration[];
  pagination?: { page: number; limit: number; total: number };
}> {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (filters?.page) queryParams.append("page", String(filters.page));
    if (filters?.limit) queryParams.append("limit", String(filters.limit));

    const url = `${API_ENDPOINTS.VOLUNTEERS.LIST(campaignId)}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const result = await apiClient<any>(url);

    if (result.error) {
      throw new Error(result.error.message);
    }

    // Transform API response to our VolunteerRegistration type
    const apiVolunteers = result.data || [];
    let volunteers = apiVolunteers.map(transformApiVolunteer);

    // Apply status filter client-side if provided
    if (filters?.status) {
      volunteers = volunteers.filter(
        (v: VolunteerRegistration) => v.status === filters.status
      );
    }

    return {
      volunteers,
      pagination: result.pagination || {
        page: filters?.page || 1,
        limit: filters?.limit || 10,
        total: volunteers.length,
      },
    };
  } catch (error) {
    console.error("Error getting campaign volunteers:", error);
    return {
      volunteers: [],
      pagination: { page: 1, limit: 10, total: 0 },
    };
  }
}

/**
 * Update volunteer status (approve, reject, activate, etc.)
 * Uses REAL API: PUT /v1/volunteers/status/:registrationId
 */
export async function updateVolunteerStatus(
  volunteerId: string | number,
  status: VolunteerRegistration["status"]
): Promise<VolunteerRegistration> {
  try {
    // Map our status to API status ID
    const statusId = mapStatusToId(status);

    // Call real API endpoint
    const result = await apiClient<any>(
      API_ENDPOINTS.VOLUNTEERS.UPDATE_STATUS(volunteerId),
      {
        method: "PUT",
        body: JSON.stringify({ statusId }),
      }
    );

    if (result.error) {
      throw new Error(result.error.message);
    }

    // Transform the response back to our format
    const updatedVolunteer = result.data;
    if (updatedVolunteer) {
      return transformApiVolunteer(updatedVolunteer);
    }

    // If no data returned, return a basic volunteer object with updated status
    return {
      volunteerId: Number(volunteerId),
      fundId: 0,
      userId: 0,
      userName: "",
      userEmail: "",
      registeredAt: new Date().toISOString(),
      status,
      skills: [],
      availability: "",
      notes: "",
    };
  } catch (error) {
    console.error("Error updating volunteer status:", error);
    throw error;
  }
}

/**
 * Create a new campaign as a creator
 * Uses existing CAMPAIGNS CREATE endpoint
 */
export async function createCreatorCampaign(
  organizationId: string | number,
  data: any
): Promise<any> {
  const result = await apiClient<{ data: any }>(
    API_ENDPOINTS.CAMPAIGNS.CREATE(organizationId),
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data?.data || result.data;
}

/**
 * Update an existing campaign as a creator
 * Uses existing CAMPAIGNS UPDATE endpoint
 */
export async function updateCreatorCampaign(
  campaignId: string | number,
  data: Partial<UpdateCampaignRequest>
): Promise<any> {
  const result = await apiClient<{ data: any }>(
    API_ENDPOINTS.CAMPAIGNS.UPDATE(campaignId),
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data?.data || result.data;
}

/**
 * Get campaign analytics/details for creator
 * Uses existing CAMPAIGN DETAIL endpoint
 */
export async function getCampaignAnalytics(campaignId: string | number) {
  const result = await apiClient<any>(
    API_ENDPOINTS.CAMPAIGNS.DETAIL(campaignId)
  );

  if (result.error) {
    throw new Error(result.error.message);
  }

  const campaign = result.data?.data || result.data;

  // Return in analytics format
  return {
    campaign,
    stats: {
      totalRaised: campaign.currentAmount || 0,
      backersCount: campaign.backersCount || campaign.backers || 0,
      volunteersCount: campaign.volunteersCount || 0,
      donationsCount: campaign.donationsCount || 0,
      averageDonation:
        campaign.currentAmount && campaign.backersCount
          ? campaign.currentAmount / campaign.backersCount
          : 0,
      recentDonations: [], // TODO: Add when donations endpoint is available
    },
  };
}

/**
 * Get campaign milestones
 *
 * Currently uses mock data
 * TODO: Backend to implement GET /v1/fund-charity/{campaignId}/milestones
 */
export async function getCampaignMilestones(campaignId: string | number) {
  try {
    // TODO: When backend implements, use:
    // const result = await apiClient<any>(
    //   `/v1/fund-charity/${campaignId}/milestones`
    // );

    // For now, return empty array or mock milestones
    // This could be expanded to return mock milestone data if needed
    return [];
  } catch (error) {
    console.error("Error getting campaign milestones:", error);
    return [];
  }
}

/**
 * Create a new milestone for a campaign
 *
 * Currently simulated
 * TODO: Backend to implement POST /v1/fund-charity/{campaignId}/milestones
 */
export async function createMilestone(
  campaignId: string | number,
  data: {
    title: string;
    description: string;
    targetAmount: number;
    order: number;
  }
) {
  // TODO: When backend implements, use:
  // const result = await apiClient<any>(
  //   `/v1/fund-charity/${campaignId}/milestones`,
  //   {
  //     method: "POST",
  //     body: JSON.stringify(data),
  //   }
  // );

  // For now, simulate successful creation
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    milestoneId: Date.now(),
    ...data,
    isCompleted: false,
  };
}

/**
 * Update a milestone
 *
 * Currently simulated
 * TODO: Backend to implement PUT /v1/fund-charity/milestones/{milestoneId}
 */
export async function updateMilestone(
  milestoneId: string | number,
  data: {
    title?: string;
    description?: string;
    targetAmount?: number;
    isCompleted?: boolean;
    order?: number;
  }
) {
  // TODO: When backend implements
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    milestoneId,
    ...data,
    completedAt: data.isCompleted ? new Date().toISOString() : undefined,
  };
}

/**
 * Delete a milestone
 *
 * Currently simulated
 * TODO: Backend to implement DELETE /v1/fund-charity/milestones/{milestoneId}
 */
export async function deleteMilestone(milestoneId: string | number) {
  // TODO: When backend implements
  await new Promise((resolve) => setTimeout(resolve, 500));

  return { success: true };
}

/**
 * Get donations for a specific campaign
 *
 * Currently uses mock data
 * TODO: Backend to implement GET /v1/fund-charity/{campaignId}/donations
 */
export async function getCampaignDonations(
  campaignId: string | number,
  filters?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }
) {
  try {
    // TODO: When backend implements, use real endpoint

    // For now, return empty array
    return {
      donations: [],
      pagination: {
        page: filters?.page || 1,
        limit: filters?.limit || 20,
        total: 0,
      },
    };
  } catch (error) {
    console.error("Error getting campaign donations:", error);
    return {
      donations: [],
      pagination: { page: 1, limit: 20, total: 0 },
    };
  }
}

/**
 * Post an update for a campaign
 *
 * Currently simulated
 * TODO: Backend to implement POST /v1/fund-charity/{campaignId}/updates
 */
export async function postCampaignUpdate(
  campaignId: string | number,
  data: {
    title: string;
    content: string;
    images?: string[];
  }
) {
  // TODO: When backend implements
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    updateId: Date.now(),
    ...data,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Get campaign updates/posts
 *
 * Currently uses mock data
 * TODO: Backend to implement GET /v1/fund-charity/{campaignId}/updates
 */
export async function getCampaignUpdates(
  campaignId: string | number,
  filters?: {
    page?: number;
    limit?: number;
  }
) {
  try {
    // TODO: When backend implements, use real endpoint

    // For now, return empty array
    return {
      updates: [],
      pagination: {
        page: filters?.page || 1,
        limit: filters?.limit || 10,
        total: 0,
      },
    };
  } catch (error) {
    console.error("Error getting campaign updates:", error);
    return {
      updates: [],
      pagination: { page: 1, limit: 10, total: 0 },
    };
  }
}
