/**
 * Transaction Types
 * Types for transaction-related data structures
 */

/**
 * Transaction Type
 */
export interface TransactionType {
  transactionTypeId: number;
  typeName: string;
}

/**
 * Transaction Status
 */
export interface TransactionStatus {
  transactionStatusId: number;
  statusName: string;
}

/**
 * Transaction
 */
export interface Transaction {
  transactionId: number;
  donationId: number | null;
  withdrawalId: number | null;
  walletId: number;
  balanceBefore: string;
  balanceAfter: string;
  amount: string;
  transactionTime: string;
  createdAt: string;
  updatedAt: string;
  type: TransactionType;
  status: TransactionStatus;
}

/**
 * Get Transactions Response
 */
export interface GetTransactionsResponse {
  data?: Transaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

/**
 * Transaction Query Params
 */
export interface TransactionQueryParams {
  page?: number;
  limit?: number;
  type?: "donation" | "withdrawal";
  walletId: number;
}
