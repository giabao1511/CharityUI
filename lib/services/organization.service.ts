/**
 * Organization Service
 * Handles all API calls related to organizations
 * Based on api.instructions.md
 */

import { API_ENDPOINTS, apiClient } from "@/lib/api-config";
import type {
  CreateOrganizationRequest,
  Organization,
  OrganizationListItem,
  OrganizationQueryFilters,
  UpdateOrganizationRequest,
} from "@/types/organization";

/**
 * Get all organizations with optional filters
 */
export async function getOrganizations(filters?: OrganizationQueryFilters) {
  const queryParams = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  const url = `${API_ENDPOINTS.ORGANIZATIONS.LIST}${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const result = await apiClient<OrganizationListItem[]>(url);

  if (result.error) {
    console.error("API Error:", result.error, "URL:", url);
    throw new Error(result.error.message);
  }

  if (!result.data) {
    throw new Error("Invalid response structure from API");
  }

  return result;
}

/**
 * Get a single organization by ID with all relations
 */
export async function getOrganizationById(
  orgId: string | number
): Promise<Organization> {
  const result = await apiClient<Organization>(
    API_ENDPOINTS.ORGANIZATIONS.DETAIL(orgId)
  );

  if (result.error) {
    throw new Error(result.error.message);
  }

  if (!result.data) {
    throw new Error("Organization not found");
  }

  return result.data;
}

/**
 * Create a new organization
 */
export async function createOrganization(data: CreateOrganizationRequest) {
  const result = await apiClient<{
    organization: Organization;
    role: any;
    banks: any;
    wallet: any;
  }>(API_ENDPOINTS.ORGANIZATIONS.CREATE, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}

/**
 * Update an existing organization
 */
export async function updateOrganization(
  orgId: string | number,
  data: UpdateOrganizationRequest
) {
  const result = await apiClient<{ data: Organization }>(
    API_ENDPOINTS.ORGANIZATIONS.UPDATE(orgId),
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
 * Upload organization avatar
 */
export async function uploadOrganizationAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const result = await apiClient<{
    data: { Location: string; Key: string; ETag: string; Bucket: string };
  }>(API_ENDPOINTS.ORGANIZATIONS.UPLOAD_AVATAR, {
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
 * Upload multiple organization media files
 */
export async function uploadOrganizationMedia(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const result = await apiClient<{
    data: Array<{
      Location: string;
      Key: string;
      ETag: string;
      Bucket: string;
    }>;
  }>(API_ENDPOINTS.ORGANIZATIONS.UPLOAD_MEDIA, {
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
 * Update organization media files (replaces existing media)
 */
export async function updateOrganizationMedia(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const result = await apiClient<{
    data: Array<{
      Location: string;
      Key: string;
      ETag: string;
      Bucket: string;
    }>;
  }>(API_ENDPOINTS.ORGANIZATIONS.UPLOAD_MEDIA, {
    method: "POST",
    body: formData,
    headers: {} as any,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data!.data;
}
