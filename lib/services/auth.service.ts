/**
 * Authentication Service
 *
 * Handles all authentication-related API calls
 */

import { API_ENDPOINTS } from "@/lib/api-config";
import type {
  SignInFormData,
  SignUpFormData,
} from "@/lib/validation/auth-schemas";

// Response types
export interface Role {
  roleId: number;
  roleName: string;
}

export interface Organization {
  orgId: number;
  orgName: string;
  statusId: number;
}

export interface UserRole {
  role: Role;
  organization: Organization | null;
}

export interface AuthResponse {
  data: {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    roleId?: number;
    roles?: UserRole[];
    createdAt?: string;
    updatedAt?: string;
    accessToken: string;
    refreshToken: string;
  };
}

export interface ErrorResponse {
  message: string;
  statusCode: number;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface ApiResult<T> {
  data?: T;
  error?: ErrorResponse;
}

/**
 * Sign in user
 */
export async function signIn(
  credentials: SignInFormData
): Promise<ApiResult<AuthResponse["data"]>> {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.SIGN_IN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: {
          message: result.message || "Sign in failed",
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

/**
 * Sign up new user
 */
export async function signUp(userData: SignUpFormData): Promise<
  ApiResult<{
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
  }>
> {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.SIGN_UP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: {
          message: result.message || "Sign up failed",
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

/**
 * Request password reset
 */
export async function forgotPassword(
  email: string
): Promise<ApiResult<boolean>> {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: {
          message: result.message || "Password reset request failed",
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

/**
 * Store authentication tokens and user data
 */
export function storeAuthData(data: AuthResponse["data"]): void {
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem(
    "user",
    JSON.stringify({
      userId: data.userId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      roles: data.roles || [],
    })
  );
}

/**
 * Clear authentication data (logout)
 */
export function clearAuthData(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

/**
 * Get stored user data
 */
export function getStoredUser(): {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
} | null {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    const user = JSON.parse(userStr);

    // Migration: Handle old format without roles
    if (!user.roles) {
      console.warn("User data in old format without roles. Clearing auth data. Please log in again.");
      clearAuthData();
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem("accessToken");
}

/**
 * Decode JWT token (without verification)
 * This is just for debugging - actual verification happens on the backend
 */
function decodeToken(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replaceAll('-', '+').replaceAll('_', '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.codePointAt(0)?.toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    // Token is malformed, return null
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}
