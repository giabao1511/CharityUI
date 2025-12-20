/**
 * Wallet Types
 * Types for wallet-related data structures
 */

/**
 * Wallet Status
 */
export interface WalletStatus {
  walletStatusId: number;
  statusName: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Wallet Type
 */
export interface WalletType {
  walletTypeId: number;
  walletTypeName: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Wallet Owner (User)
 */
export interface WalletOwner {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Bank Information
 */
export interface BankInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branch?: string;
}

/**
 * Campaign Information (simplified)
 */
export interface WalletCampaign {
  campaignId: number;
  title: string;
  statusId: number;
  orgId: number;
}

/**
 * Wallet
 */
export interface Wallet {
  walletId: number;
  balance: string;
  receiveAmount: string;
  status: WalletStatus;
  type: WalletType;
  owner: WalletOwner;
  campaign: WalletCampaign | null;
  bankInfo: BankInfo | null;
}

/**
 * Get Wallets Response
 */
export interface GetWalletsResponse {
  data: Wallet[];
}
