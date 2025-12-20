/**
 * Wallet Service
 * Handles wallet-related API calls
 */

import { apiClient, API_ENDPOINTS } from "@/lib/api-config";
import { Wallet, GetWalletsResponse } from "@/types/wallet";

/**
 * Get all wallets for a specific user
 * @param userId - User ID to get wallets for
 * @returns List of wallets for the user
 */
export async function getUserWallets(userId: number): Promise<Wallet[]> {
  try {
    const result = await apiClient<GetWalletsResponse>(
      API_ENDPOINTS.WALLETS.LIST(userId)
    );

    if (result.error) {
      throw new Error(result.error.message || "Failed to fetch user wallets");
    }

    console.log("dataa", result.data);

    // API returns { data: { data: [...] } }
    return result.data?.data || [];
  } catch (error) {
    console.error("Error fetching user wallets:", error);
    throw error;
  }
}

/**
 * Get wallet detail by wallet ID
 * @param walletId - Wallet ID to get details for
 * @returns Wallet details
 */
export async function getWalletDetail(walletId: number) {
  try {
    const result = await apiClient<Wallet>(
      API_ENDPOINTS.WALLETS.DETAIL(walletId)
    );

    if (result.error) {
      throw new Error(result.error.message || "Failed to fetch wallet details");
    }

    if (!result.data) {
      throw new Error("No data returned from wallet details");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching wallet details:", error);
    throw error;
  }
}
