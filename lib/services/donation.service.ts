/**
 * Donation Service
 * Handles donation-related API calls
 */

import { apiClient, API_ENDPOINTS } from "@/lib/api-config";
import { Donation } from "@/types";

export interface GetDonationsFilters {
  page?: number;
  limit?: number;
  status?: number; // donationStatusId
}

/**
 * Get donations for a campaign (public endpoint)
 * @param campaignId - Campaign ID
 * @param filters - Optional filters for pagination and status
 * @returns List of donations with pagination
 */
export async function getCampaignDonations(
  campaignId: string | number,
  filters?: GetDonationsFilters
) {
  try {
    const queryParams = new URLSearchParams();
    if (filters?.page) queryParams.append("page", String(filters.page));
    if (filters?.limit) queryParams.append("limit", String(filters.limit));
    if (filters?.status) queryParams.append("status", String(filters.status));

    const url = `${API_ENDPOINTS.DONATIONS.LIST(campaignId)}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const result = await apiClient<Donation[]>(url);

    if (result.error) {
      throw new Error(result.error.message || "Failed to fetch donations");
    }

    if (!result.data) {
      return {
        data: [],
        pagination: { total: 0, page: 1, limit: 10 },
      };
    }

    return result;
  } catch (error) {
    console.error("Error fetching campaign donations:", error);
    return {
      data: [],
      pagination: { total: 0, page: 1, limit: 10 },
    };
  }
}

/**
 * Get donations for creator dashboard (may have different permissions/data)
 * @param campaignId - Campaign ID
 * @param filters - Optional filters
 * @returns List of donations with pagination
 */
export async function getCreatorCampaignDonations(
  campaignId: string | number,
  filters?: GetDonationsFilters
) {
  try {
    const queryParams = new URLSearchParams();
    if (filters?.page) queryParams.append("page", String(filters.page));
    if (filters?.limit) queryParams.append("limit", String(filters.limit));
    if (filters?.status) queryParams.append("status", String(filters.status));

    // Use creator endpoint which might show more details (like non-anonymous donor info)
    const url = `${API_ENDPOINTS.DONATIONS.LIST(campaignId)}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const result = await apiClient<Donation[]>(url);

    if (result.error) {
      throw new Error(result.error.message || "Failed to fetch donations");
    }

    if (!result.data) {
      return {
        data: [],
        pagination: { total: 0, page: 1, limit: 10 },
      };
    }

    return result;
  } catch (error) {
    console.error("Error fetching creator campaign donations:", error);
    return {
      data: [],
      pagination: { total: 0, page: 1, limit: 10 },
    };
  }
}

/**
 * Format donation amount (from string to number)
 */
export function parseDonationAmount(amount: string): number {
  return parseFloat(amount);
}

/**
 * Get display name for donor
 */
export function getDonorDisplayName(donation: Donation): string {
  if (donation.isAnonymous) {
    return "Anonymous";
  }

  if (donation.fullName) {
    return donation.fullName;
  }

  if (donation.email) {
    // Show only first part of email for privacy
    const emailParts = donation.email.split("@");
    if (emailParts[0]) {
      return emailParts[0];
    }
  }

  return "Anonymous Donor";
}

/**
 * Check if donation is completed
 */
export function isDonationCompleted(donation: Donation): boolean {
  // Assuming statusId 2 is "Completed" based on the example
  return donation.status.donationStatusId === 2;
}

/**
 * Get ALL donations for a campaign (for export purposes)
 * Fetches all donations without pagination
 * @param campaignId - Campaign ID
 * @returns All donations for the campaign
 */
export async function getAllCampaignDonations(
  campaignId: string | number
): Promise<Donation[]> {
  try {
    // Fetch with a very high limit to get all donations
    const url = `${API_ENDPOINTS.DONATIONS.LIST(campaignId)}`;

    const result = await apiClient<Donation[]>(url);

    if (result.error) {
      throw new Error(result.error.message || "Failed to fetch donations");
    }

    return result.data || [];
  } catch (error) {
    console.error("Error fetching all campaign donations:", error);
    throw error;
  }
}
