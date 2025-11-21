/**
 * Admin Service
 * Handles all admin-related API calls
 */

import { apiClient, API_ENDPOINTS } from "@/lib/api-config";

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
  banks?: Array<{
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    branch?: string;
  }>;
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
  banks: Array<{
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    branch?: string;
  }>;
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
