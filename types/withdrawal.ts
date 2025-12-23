/**
 * Withdrawal Types
 * Types for withdrawal-related data structures
 */

/**
 * Withdrawal Status
 */
export interface WithdrawalStatus {
  withdrawalStatusId: number;
  statusName: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Withdrawal Requester (User)
 */
export interface WithdrawalRequester {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Withdrawal Approver (User)
 */
export interface WithdrawalApprover {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Withdrawal Wallet
 */
export interface WithdrawalWallet {
  walletId: number;
  walletTypeId: number;
  ownerId: number;
  balance: string;
  receiveAmount: string;
  statusId: number;
  campaignId: number | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Withdrawal
 */
export interface Withdrawal {
  withdrawalId: number;
  campaignId: number;
  amount: string;
  purpose: string;
  reasonRejected: string | null;
  requestedAt: string;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  status: WithdrawalStatus;
  requester: WithdrawalRequester;
  approver: WithdrawalApprover | null;
  fromWallet: WithdrawalWallet;
  toWallet: WithdrawalWallet;
}

/**
 * Create Withdrawal Request
 */
export interface CreateWithdrawalRequest {
  amount: number;
  campaignId: number;
  fromWalletId: number;
  purpose: string;
}

/**
 * Create Withdrawal Response
 */
export interface CreateWithdrawalResponse {
  data: Withdrawal;
}

/**
 * Withdrawal Query Filters
 */
export interface WithdrawalQueryFilters {
  page?: number;
  limit?: number;
  status?: number;
  campaignId?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

/**
 * Get Withdrawals Response
 */
export interface GetWithdrawalsResponse {
  data: Withdrawal[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}
