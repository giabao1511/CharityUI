/**
 * Fund Service
 * Handles all API calls related to funds (fundraising campaigns)
 */

import { apiClient, API_ENDPOINTS } from "@/lib/api-config";
import type {
  Fund,
  FundListResponse,
  FundQueryFilters,
  CreateFundRequest,
  UpdateFundRequest,
  FundCategory,
} from "@/types/fund";

/**
 * Get all funds with optional filters
 */
export async function getFunds(filters?: FundQueryFilters) {
  const queryParams = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  const url = `${API_ENDPOINTS.FUNDS.LIST}${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const result = await apiClient<{ data: FundListResponse }>(url);

  if (result.error) {
    console.log("API Error:", result.error, "URL:", url);
    throw new Error(result.error.message);
  }

  console.log("API Response:", result.data);

  // Handle different response structures from backend
  if (result.data?.data) {
    return result.data.data;
  }

  // Backend might return the data directly (with funds array)
  if (result.data && "funds" in result.data) {
    return result.data as unknown as FundListResponse;
  }

  throw new Error("Invalid response structure from API");
}

/**
 * Get a single fund by ID
 */
export async function getFundById(fundId: string | number): Promise<Fund> {
  const result = await apiClient<Fund>(
    API_ENDPOINTS.FUNDS.DETAIL(fundId)
  );

  if (result.error) {
    throw new Error(result.error.message);
  }

  if (!result.data) {
    throw new Error("Fund not found");
  }

  // apiClient returns { data: Fund } where Fund is from the backend response
  return result.data;
}

/**
 * Create a new fund
 */
export async function createFund(data: CreateFundRequest) {
  const result = await apiClient<{ data: Fund }>(API_ENDPOINTS.FUNDS.CREATE, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data!.data;
}

/**
 * Update an existing fund
 */
export async function updateFund(
  fundId: string | number,
  data: UpdateFundRequest
) {
  const result = await apiClient<{ data: Fund }>(
    API_ENDPOINTS.FUNDS.UPDATE(fundId),
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data!.data;
}

/**
 * Upload fund banner image
 */
export async function uploadFundBanner(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const result = await apiClient<{ data: { url: string; key: string } }>(
    API_ENDPOINTS.FUNDS.UPLOAD_BANNER,
    {
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type - let browser set it with boundary
      } as any,
    }
  );

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data!.data;
}

/**
 * Upload multiple fund media files
 */
export async function uploadFundMedia(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const result = await apiClient<{
    data: Array<{ url: string; key: string }>;
  }>(API_ENDPOINTS.FUNDS.UPLOAD_MEDIA, {
    method: "POST",
    body: formData,
    headers: {} as any, // Don't set Content-Type - let browser set it with boundary
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data!.data;
}

/**
 * Get all fund categories
 */
export async function getFundCategories(page = 1, limit = 100, search = "") {
  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) {
    queryParams.append("search", search);
  }

  const url = `${API_ENDPOINTS.FUND_CATEGORIES.LIST}?${queryParams.toString()}`;

  const result = await apiClient<{
    data: FundCategory[];
    pagination: { total: number; page: number; limit: number };
  }>(url);

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data!;
}

/**
 * Upload fund category icon
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
