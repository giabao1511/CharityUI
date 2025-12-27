/**
 * Transaction Service
 * Handles transaction-related API calls
 */

import { apiClient, API_ENDPOINTS } from "@/lib/api-config";
import type {
  TransactionQueryParams,
  Transaction,
  GetTransactionsResponse,
} from "@/types/transaction";

/**
 * Get transactions with filters
 */
export async function getTransactions(
  params: TransactionQueryParams
): Promise<GetTransactionsResponse> {
  try {
    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.append("page", (params.page || 1).toString());
    queryParams.append("limit", (params.limit || 10).toString());
    queryParams.append("walletId", params.walletId.toString());

    if (params.type) {
      queryParams.append("type", params.type);
    }

    const url = `${API_ENDPOINTS.TRANSACTIONS.LIST}?${queryParams.toString()}`;

    const result = await apiClient<Transaction[]>(url, {
      method: "GET",
    });

    if (result.error) {
      console.error("Error fetching transactions:", result.error);
      return {
        data: [],
        pagination: {
          total: 0,
          page: params.page || 1,
          limit: params.limit || 10,
        },
      };
    }

    console.log(result);

    return {
      data: result.data || [],
      pagination: result.pagination || {
        total: 0,
        page: params.page || 1,
        limit: params.limit || 10,
      },
    };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return {
      data: [],
      pagination: {
        total: 0,
        page: params.page || 1,
        limit: params.limit || 10,
      },
    };
  }
}
