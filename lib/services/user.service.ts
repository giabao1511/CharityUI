/**
 * User Service
 *
 * Handles all user-related API calls
 */

import { API_ENDPOINTS, apiClient } from "@/lib/api-config";

// Response types based on API documentation
export interface UserProfile {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phoneNumber?: string | null;
  roleId: number;
  isActive: boolean;
  avatar?: string | null;
  refreshToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiResult<T> {
  data?: T;
  error?: {
    message: string;
    statusCode: number;
    errors?: Array<{
      field: string;
      message: string;
    }>;
  };
}

/**
 * Get current user's profile
 */
export async function getMyProfile(): Promise<ApiResult<UserProfile>> {
  return apiClient<UserProfile>(API_ENDPOINTS.USER.MY_PROFILE, {
    method: "GET",
  });
}

/**
 * Update current user's profile
 */
export async function updateMyProfile(
  data: UpdateProfileData
): Promise<ApiResult<UserProfile>> {
  return apiClient<UserProfile>(API_ENDPOINTS.USER.UPDATE_PROFILE, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Change user password
 */
export async function changePassword(
  data: ChangePasswordData
): Promise<ApiResult<boolean>> {
  return apiClient<boolean>(API_ENDPOINTS.USER.CHANGE_PASSWORD, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Upload user avatar
 */
export async function uploadAvatar(
  file: File
): Promise<ApiResult<{ url: string; key: string }>> {
  try {
    const accessToken = localStorage.getItem("accessToken");
    
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(API_ENDPOINTS.USER.UPLOAD_AVATAR, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: {
          message: result.message || "Upload failed",
          statusCode: result.statusCode || response.status,
          errors: result.errors,
        },
      };
    }

    return { data: result.data };
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : "Network error",
        statusCode: 500,
      },
    };
  }
}
