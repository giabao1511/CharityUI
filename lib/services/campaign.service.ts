/**
 * Campaign Service
 * Handles all API calls related to campaigns (fundraising campaigns)
 * Campaigns are managed by organizations
 */

import { API_ENDPOINTS, apiClient } from "@/lib/api-config";
import type {
  Campaign,
  CampaignCategory,
  CampaignQueryFilters,
  UpdateCampaignRequest,
} from "@/types/campaign";

/**
 * Get all campaigns with optional filters
 */
export async function getCampaigns(filters?: CampaignQueryFilters) {
  const queryParams = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  const url = `${API_ENDPOINTS.CAMPAIGNS.LIST}${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const result = await apiClient<any>(url);

  if (result.error) {
    console.error("API Error:", result.error, "URL:", url);
    throw new Error(result.error.message);
  }

  if (result.data) {
    return {
      campaigns: result.data,
      pagination: result.pagination,
    };
  }

  throw new Error("Invalid response structure from API");
}

/**
 * Get a single campaign by ID
 */
export async function getCampaignById(
  campaignId: string | number
): Promise<any> {
  const result = await apiClient<any>(
    API_ENDPOINTS.CAMPAIGNS.DETAIL(campaignId)
  );

  if (result.error) {
    throw new Error(result.error.message);
  }

  // Handle nested data structure from API
  if (result.data?.data) {
    return result.data.data;
  }

  if (!result.data) {
    throw new Error("Campaign not found");
  }

  return result.data;
}

/**
 * Create a new campaign
 * Returns flexible type since API response structure may vary
 */
export async function createCampaign(orgId: string | number, data: any) {
  const result = await apiClient<{ data: any }>(
    API_ENDPOINTS.CAMPAIGNS.CREATE(orgId),
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data!.data;
}

/**
 * Update an existing campaign
 */
export async function updateCampaign(
  campaignId: string | number,
  data: UpdateCampaignRequest
) {
  const result = await apiClient<{ data: Campaign }>(
    API_ENDPOINTS.CAMPAIGNS.UPDATE(campaignId),
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );

  if (result.error) {
    throw new Error(result.error.message);
  }

  console.log(result)

  return result;
}

/**
 * Upload campaign banner image
 */
export async function uploadCampaignBanner(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const result = await apiClient<{ data: { url: string; key: string } }>(
    API_ENDPOINTS.CAMPAIGNS.UPLOAD_BANNER,
    {
      method: "POST",
      body: formData,
      headers: {} as any, // Don't set Content-Type - let browser set it with boundary
    }
  );

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data!.data;
}

/**
 * Upload multiple campaign media files
 */
export async function uploadCampaignMedia(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const result = await apiClient<{
    data: Array<{ url: string; key: string }>;
  }>(API_ENDPOINTS.CAMPAIGNS.UPLOAD_MEDIA, {
    method: "POST",
    body: formData,
    headers: {} as any,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data!.data;
}

/**
 * Get all campaign categories
 */
export async function getCampaignCategories(
  page = 1,
  limit = 100,
  search = ""
) {
  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) {
    queryParams.append("search", search);
  }

  const url = `${API_ENDPOINTS.FUND_CATEGORIES.LIST}?${queryParams.toString()}`;

  const result = await apiClient<{
    data: CampaignCategory[];
    pagination: { total: number; page: number; limit: number };
  }>(url);

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data!;
}

/**
 * Upload campaign category icon
 */
export async function uploadCategoryIcon(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const result = await apiClient<{ data: { url: string; key: string } }>(
    API_ENDPOINTS.FUND_CATEGORIES.UPLOAD_ICON,
    {
      method: "POST",
      body: formData,
      headers: {} as any,
    }
  );

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data!.data;
}
