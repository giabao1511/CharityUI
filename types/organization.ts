/**
 * Organization Types
 * Based on models.instructions.md and api.instructions.md
 */

// Organization Status
export enum OrgStatus {
  PENDING = 1,
  ACTIVE = 2,
  SUSPENDED = 3,
  INACTIVE = 4,
}

export const OrgStatusNames: Record<number, string> = {
  [OrgStatus.PENDING]: "Pending",
  [OrgStatus.ACTIVE]: "Active",
  [OrgStatus.SUSPENDED]: "Suspended",
  [OrgStatus.INACTIVE]: "Inactive",
};

/**
 * Organization Status Info
 */
export interface OrgStatusInfo {
  orgStatusId: number;
  statusName: string;
}

/**
 * Organization Bank Account
 */
export interface OrgBank {
  bankAccountId: number;
  orgId: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branch: string;
}

/**
 * Organization Media
 */
export interface OrgMedia {
  orgMediaId: number;
  orgId: number;
  mediaTypeId: number;
  url: string;
  mediaType?: {
    mediaId: number;
    mediaName: string;
  };
}

/**
 * User Role in Organization
 */
export interface UserRole {
  userRoleId: number;
  userId: number;
  orgId: number;
  roleId: number;
  createdAt: string;
  updatedAt: string;
  role?: {
    roleId: number;
    roleName: string;
  };
  user?: {
    userId: number;
    username: string;
    email: string;
  };
}

/**
 * Organization Wallet
 */
export interface Wallet {
  walletId: number;
  ownerId: number;
  ownerType: "Organization" | "User";
  balance: number;
  statusId: number;
  createdAt: string;
  updatedAt: string;
  status?: {
    walletStatusId: number;
    statusName: string;
  };
}

/**
 * Campaign/Fund (simplified for organization reference)
 */
export interface OrganizationCampaign {
  campaignId: number;
  orgId: number;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  status: {
    campaignStatusId: number;
    statusName: string;
  };
}

/**
 * Main Organization Interface (complete structure)
 */
export interface Organization {
  orgId: number;
  orgName: string;
  email: string;
  phoneNumber: string;
  address: string;
  description: string;
  website: string;
  avatar: string;
  statusId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;

  // Relations (populated in GET requests)
  status?: OrgStatusInfo;
  banks?: OrgBank[];
  campaigns?: OrganizationCampaign[];
  userRoles?: UserRole[];
  media?: OrgMedia[];
  wallets?: Wallet[];
}

/**
 * Organization List Item (used in list views)
 */
export interface OrganizationListItem {
  orgId: number;
  orgName: string;
  email: string;
  phoneNumber: string;
  address: string;
  description: string;
  website: string;
  avatar: string;
  statusId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  status?: OrgStatusInfo;
}

/**
 * Create Organization Request Body
 */
export interface CreateOrganizationRequest {
  orgName: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  description?: string;
  website?: string;
  avatar?: string;
  banks: Array<{
    bankName: string;
    bankAccount: string;
    accountHolder: string;
    branch?: string;
  }>;
}

/**
 * Update Organization Request Body (all fields optional)
 */
export interface UpdateOrganizationRequest {
  orgName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  description?: string;
  website?: string;
  avatar?: string;
  media?: Array<{
    url: string;
    mediaType: number;
  }>;
  banks?: Array<{
    bankAccountId?: number;
    bankName: string;
    bankAccount: string;
    accountHolder: string;
    branch?: string;
  }>;
}

/**
 * Organization Query Filters
 */
export interface OrganizationQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "orgName" | "createdAt" | "updatedAt";
  sortOrder?: "ASC" | "DESC";
}

/**
 * Helper function to check if organization is active
 */
export function isOrganizationActive(
  org: Organization | OrganizationListItem
): boolean {
  return org.statusId === OrgStatus.ACTIVE;
}

/**
 * Helper function to get organization display name
 */
export function getOrganizationDisplayName(
  org: Organization | OrganizationListItem
): string {
  return org.orgName || "Unnamed Organization";
}
