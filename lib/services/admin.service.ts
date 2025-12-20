/**
 * Admin Service
 * Handles all admin-related API calls
 */

import { API_ENDPOINTS, apiClient } from "@/lib/api-config";
import type { Campaign, UpdateCampaignRequest } from "@/types/campaign";
import { CampaignItem } from "@/types/fund";

// Types
export interface AdminOrganization {
  orgId: number;
  orgName: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  description?: string;
  website?: string;
  avatar?: string;
  statusId: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  dateOfBirth?: string;
  isActive: boolean;
  createdAt: string;
  roles: Array<{
    role: {
      roleId: number;
      roleName: string;
    };
  }>;
}

export interface CreateOrganizationData {
  orgName: string;
  email: string;
  phoneNumber: string;
  address: string;
  description: string;
  website?: string;
  avatar?: string;
}

export interface UpdateUserData {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatar?: string;
  dateOfBirth?: string;
  roleId: number;
}

/**
 * Get all organizations (admin view)
 */
export async function getAdminOrganizations(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ organizations: AdminOrganization[]; total: number }> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.limit) queryParams.set("limit", params.limit.toString());
    if (params?.search) queryParams.set("search", params.search);

    const url = `${API_ENDPOINTS.ADMIN.ORGANIZATIONS.LIST}?${queryParams}`;
    const result = await apiClient<AdminOrganization[]>(url, {
      method: "GET",
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return {
      organizations: result.data || [],
      total: result.pagination?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching organizations:", error);
    throw error;
  }
}

/**
 * Create a new organization
 */
export async function createOrganization(
  data: CreateOrganizationData
): Promise<AdminOrganization> {
  try {
    const result = await apiClient<AdminOrganization>(
      API_ENDPOINTS.ADMIN.ORGANIZATIONS.CREATE,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  } catch (error) {
    console.error("Error creating organization:", error);
    throw error;
  }
}

/**
 * Update an organization
 */
export async function updateOrganization(
  orgId: number,
  data: CreateOrganizationData
): Promise<AdminOrganization> {
  try {
    const result = await apiClient<AdminOrganization>(
      API_ENDPOINTS.ADMIN.ORGANIZATIONS.UPDATE(orgId),
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  } catch (error) {
    console.error("Error updating organization:", error);
    throw error;
  }
}

/**
 * Get all users (admin view)
 */
export async function getAdminUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: "ASC" | "DESC";
  sortBy?: string;
  isActive?: boolean;
  role?: string;
}): Promise<{ users: AdminUser[]; total: number }> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.limit) queryParams.set("limit", params.limit.toString());
    if (params?.search) queryParams.set("search", params.search);
    if (params?.sortOrder) queryParams.set("sortOrder", params.sortOrder);
    if (params?.sortBy) queryParams.set("sortBy", params.sortBy);
    if (params?.isActive !== undefined)
      queryParams.set("isActive", params.isActive.toString());
    if (params?.role) queryParams.set("role", params.role);

    const url = `${API_ENDPOINTS.ADMIN.USERS.LIST}?${queryParams}`;
    const result = await apiClient<AdminUser[]>(url, {
      method: "GET",
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return {
      users: result.data || [],
      total: result.pagination?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

/**
 * Update user
 */
export async function updateUser(
  userId: number,
  data: UpdateUserData
): Promise<boolean> {
  try {
    const result = await apiClient(API_ENDPOINTS.ADMIN.USERS.UPDATE(userId), {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

/**
 * Delete user
 */
export async function deleteUser(userId: number): Promise<boolean> {
  try {
    const result = await apiClient(API_ENDPOINTS.ADMIN.USERS.DELETE(userId), {
      method: "DELETE",
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

/**
 * Get all campaigns (admin view)
 */
export async function getAdminCampaigns(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: number;
  categoryId?: number;
}): Promise<{ campaigns: CampaignItem[]; total: number }> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.limit) queryParams.set("limit", params.limit.toString());
    if (params?.search) queryParams.set("search", params.search);
    if (params?.status) queryParams.set("status", params.status.toString());
    if (params?.categoryId) queryParams.set("categoryId", params.categoryId.toString());

    const url = `${API_ENDPOINTS.CAMPAIGNS.LIST}?${queryParams}`;
    const result = await apiClient<CampaignItem[]>(url, {
      method: "GET",
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return {
      campaigns: result.data || [],
      total: result.pagination?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw error;
  }
}

/**
 * Get single campaign details (admin view)
 */
export async function getAdminCampaign(campaignId: number): Promise<Campaign> {
  try {
    const result = await apiClient<Campaign>(
      API_ENDPOINTS.CAMPAIGNS.DETAIL(campaignId),
      {
        method: "GET",
      }
    );

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  } catch (error) {
    console.error("Error fetching campaign:", error);
    throw error;
  }
}

/**
 * Update campaign (admin)
 */
export async function updateCampaign(
  campaignId: number,
  data: UpdateCampaignRequest
): Promise<Campaign> {
  try {
    const result = await apiClient<Campaign>(
      API_ENDPOINTS.CAMPAIGNS.UPDATE(campaignId),
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  } catch (error) {
    console.error("Error updating campaign:", error);
    throw error;
  }
}

/**
 * Delete campaign (admin)
 */
export async function deleteCampaign(campaignId: number): Promise<boolean> {
  try {
    const result = await apiClient(
      API_ENDPOINTS.CAMPAIGNS.UPDATE(campaignId),
      {
        method: "DELETE",
      }
    );

    if (result.error) {
      throw new Error(result.error.message);
    }

    return true;
  } catch (error) {
    console.error("Error deleting campaign:", error);
    throw error;
  }
}
