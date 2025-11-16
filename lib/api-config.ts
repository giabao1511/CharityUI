/**
 * API Configuration
 *
 * Configure the backend API URL here.
 * The backend server should be running separately (e.g., Express/Node.js server on port 5000)
 */

// Backend API base URL
// Default to localhost:5001 (change this to your backend server URL)
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// API endpoints
export const API_ENDPOINTS = {
  // Authentication endpoints (assuming your backend uses these paths from api.instructions.md)
  AUTH: {
    SIGN_UP: `${API_BASE_URL}/v1/users/sign-up`,
    SIGN_IN: `${API_BASE_URL}/v1/users/sign-in`,
    FORGOT_PASSWORD: `${API_BASE_URL}/v1/users/forgot-password`,
  },
  // User endpoints
  USER: {
    MY_PROFILE: `${API_BASE_URL}/v1/users/my-profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/v1/users/my-profile`,
    CHANGE_PASSWORD: `${API_BASE_URL}/v1/users/change-password`,
    UPLOAD_AVATAR: `${API_BASE_URL}/v1/users/upload-avatar`,
    REFRESH_TOKEN: `${API_BASE_URL}/v1/users/refresh-token`,
  },
  // Organization endpoints
  ORGANIZATIONS: {
    LIST: `${API_BASE_URL}/v1/organizations`,
    CREATE: `${API_BASE_URL}/v1/organizations`,
    DETAIL: (orgId: string | number) =>
      `${API_BASE_URL}/v1/organizations/${orgId}`,
    UPDATE: (orgId: string | number) =>
      `${API_BASE_URL}/v1/organizations/${orgId}`,
    UPLOAD_AVATAR: `${API_BASE_URL}/v1/organizations/upload-avatar`,
    UPLOAD_MEDIA: `${API_BASE_URL}/v1/organizations/upload-media`,
  },
  // Fund Categories endpoints
  FUND_CATEGORIES: {
    LIST: `${API_BASE_URL}/v1/fund-categories`,
    CREATE: `${API_BASE_URL}/v1/fund-categories`,
    UPLOAD_ICON: `${API_BASE_URL}/v1/fund-categories/upload-icon`,
  },
  // Campaign endpoints (fundraising campaigns managed by organizations)
  CAMPAIGNS: {
    LIST: `${API_BASE_URL}/v1/fund-charity`,
    CREATE: `${API_BASE_URL}/v1/fund-charity`,
    DETAIL: (campaignId: string | number) =>
      `${API_BASE_URL}/v1/fund-charity/${campaignId}`,
    UPDATE: (campaignId: string | number) =>
      `${API_BASE_URL}/v1/fund-charity/${campaignId}`,
    UPLOAD_BANNER: `${API_BASE_URL}/v1/fund-charity/upload-banner`,
    UPLOAD_MEDIA: `${API_BASE_URL}/v1/fund-charity/upload-media`,
  },
  // Legacy alias for backward compatibility (funds = campaigns)
  FUNDS: {
    LIST: `${API_BASE_URL}/v1/fund-charity`,
    CREATE: `${API_BASE_URL}/v1/fund-charity`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/v1/fund-charity/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/v1/fund-charity/${id}`,
    UPLOAD_BANNER: `${API_BASE_URL}/v1/fund-charity/upload-banner`,
    UPLOAD_MEDIA: `${API_BASE_URL}/v1/fund-charity/upload-media`,
  },
} as const;

/**
 * API Client helper
 *
 * Use this for making API calls with automatic token injection
 */
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{
  data?: T;
  pagination?: { page: number; limit: number; total: number };
  error?: { message: string; statusCode: number; errors?: any[] };
}> {
  try {
    // Get access token from localStorage (client-side only)
    const accessToken =
      globalThis.window === undefined
        ? null
        : localStorage.getItem("accessToken");
    // Prepare headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add authorization header if token exists
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Merge with options headers
    if (options?.headers) {
      Object.assign(headers, options.headers);
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      // Use response.status (HTTP status code) instead of result.statusCode
      // because the backend might return statusCode as a string
      return {
        error: {
          message: result.message || "Request failed",
          statusCode: response.status, // Use HTTP status code from response
          errors: result.errors,
        },
      };
    }

    return result;
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : "Network error",
        statusCode: 500,
      },
    };
  }
}
