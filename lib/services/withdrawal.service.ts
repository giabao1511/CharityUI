/**
 * Withdrawal Service
 * Handles all API calls related to withdrawals
 */

import { apiClient, API_ENDPOINTS } from "@/lib/api-config";
import type {
  CreateWithdrawalRequest,
  CreateWithdrawalResponse,
  WithdrawalQueryFilters,
  GetWithdrawalsResponse,
  Withdrawal,
} from "@/types/withdrawal";

/**
 * Create a new withdrawal request
 */
export async function createWithdrawal(data: CreateWithdrawalRequest) {
  const result = await apiClient<CreateWithdrawalResponse>(
    API_ENDPOINTS.WITHDRAWALS.CREATE,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data!;
}

/**
 * Get withdrawals with optional filters
 */
export async function getWithdrawals(filters?: WithdrawalQueryFilters) {
  const queryParams = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  const url = `${API_ENDPOINTS.WITHDRAWALS.LIST}${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const result = await apiClient<any>(url);

  if (result.error) {
    throw new Error(result.error.message);
  }

  // Handle nested data structure: { data: { data: [...], pagination: {...} } }
  if (result.data?.data && Array.isArray(result.data.data)) {
    return {
      data: result.data.data,
      pagination: result.data.pagination,
    };
  }

  // Handle direct data structure: { data: [...], pagination: {...} }
  if (result.data && Array.isArray(result.data)) {
    return {
      data: result.data,
      pagination: result.pagination,
    };
  }

  throw new Error("Invalid response structure from API");
}

/**
 * Approve a withdrawal request
 */
export async function approveWithdrawal(withdrawalId: number) {
  const result = await apiClient<{ data: Withdrawal }>(
    API_ENDPOINTS.WITHDRAWALS.APPROVE(withdrawalId),
    {
      method: "POST",
    }
  );

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data!.data;
}

/**
 * Reject a withdrawal request
 */
export async function rejectWithdrawal(
  withdrawalId: number,
  reasonRejected: string
) {
  const result = await apiClient<{ data: Withdrawal }>(
    API_ENDPOINTS.WITHDRAWALS.REJECT(withdrawalId),
    {
      method: "POST",
      body: JSON.stringify({ reasonRejected }),
    }
  );

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data!.data;
}
