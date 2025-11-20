/**
 * Campaign (Fundraising Campaign) Types
 * Campaigns are created and managed by Organizations
 * Based on fund.ts but renamed to campaign and linked to organizations
 */

// Campaign Fundraising Methods
export enum CampaignMethod {
  MILESTONE = 1, // Milestone-based fundraising
  TIME_BASED = 2, // Time-based fundraising
}

export const CampaignMethodNames = {
  [CampaignMethod.MILESTONE]: "Milestone",
  [CampaignMethod.TIME_BASED]: "Time-based",
} as const;

// Campaign Status
export enum CampaignStatus {
  DRAFT = 1,
  ACTIVE = 2,
  SUSPENDED = 3,
  COMPLETED = 4,
  CANCELLED = 5,
}

export const CampaignStatusNames = {
  [CampaignStatus.DRAFT]: "Draft",
  [CampaignStatus.ACTIVE]: "Active",
  [CampaignStatus.SUSPENDED]: "Suspended",
  [CampaignStatus.COMPLETED]: "Completed",
  [CampaignStatus.CANCELLED]: "Cancelled",
} as const;

// Media Types
export enum MediaType {
  IMAGE = 1,
  VIDEO = 2,
  DOCUMENT = 3,
  AUDIO = 4,
  OTHER = 5,
}

// Milestone Status
export enum MilestoneStatus {
  PENDING = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
}

/**
 * Campaign Category
 */
export interface CampaignCategory {
  categoryFundId: number;
  categoryName: string;
  logoIcon: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Campaign Media
 */
export interface CampaignMedia {
  fundMediaId: number;
  fundId: number;
  mediaType: MediaType;
  url: string;
}

/**
 * Campaign Milestone
 */
export interface Milestone {
  milestoneId: number;
  fundId: number;
  title: string;
  description: string;
  targetAmount: number;
  achievedAmount: number;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  orderIndex: number;
  milestoneStatusId: MilestoneStatus;
}

/**
 * Campaign Creator (User)
 */
export interface CampaignCreator {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Fundraising Method Info
 */
export interface FundraisingMethod {
  methodId: CampaignMethod;
  methodName: string;
}

/**
 * Campaign Status Info
 */
export interface CampaignStatusInfo {
  fundStatusId: CampaignStatus;
  fundStatusName: string;
}

/**
 * Campaign Category Info (simplified)
 */
export interface CampaignCategoryInfo {
  categoryId: number;
  categoryName: string;
  logoIcon: string;
}

/**
 * Organization Info (for campaigns)
 */
export interface CampaignOrganization {
  orgId: number;
  orgName: string;
  email?: string;
  avatar?: string;
  description?: string;
  website?: string;
}

/**
 * Main Campaign Interface (complete structure)
 */
export interface Campaign {
  fundId: number;
  methodId: CampaignMethod;
  fundName: string;
  bannerUrl: string;
  description: string;
  bankAccountNumber: string;
  bankName: string;
  bankBranch: string;
  purpose: string;
  urlQrCode: string | null;
  targetAmount: number;
  currentAmount: number;
  status: CampaignStatus;
  categoryFund: number;
  creatorId: number;
  orgId?: number; // Link to organization
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  createdAt: string;
  updatedAt: string;

  // Relations (populated in GET requests)
  creator?: CampaignCreator;
  fundraising?: FundraisingMethod;
  fundStatus?: CampaignStatusInfo;
  fundCategory?: CampaignCategoryInfo;
  fundMedia?: CampaignMedia[];
  milestones?: Milestone[];
  organization?: CampaignOrganization; // Organization that owns this campaign
}

/**
 * Campaign List Item (used in list views)
 */
export interface CampaignListItem {
  fundId: number;
  fundName: string;
  bannerUrl: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  creator: CampaignCreator;
  fundraising: FundraisingMethod;
  fundStatus: CampaignStatusInfo;
  fundCategory: CampaignCategoryInfo;
  organization?: CampaignOrganization;
}

/**
 * Create Campaign Request Body
 */
export interface CreateCampaignRequest {
  methodId: CampaignMethod;
  fundName: string;
  bannerUrl: string;
  description: string;
  bankAccountNumber: string;
  bankName: string;
  bankBranch: string;
  purpose: string;
  urlQrCode?: string;
  targetAmount?: number;
  categoryFund: number;
  orgId?: number; // Organization ID
  startDate?: string; // ISO 8601
  endDate?: string; // ISO 8601
  mediaFund?: Array<{
    mediaType: MediaType;
    url: string;
  }>;
  milestones?: Array<{
    title: string;
    description: string;
    targetAmount: number;
    achievedAmount: number;
    startDate: string;
    endDate: string;
    orderIndex: number;
  }>;
}

/**
 * Update Campaign Request Body (all fields optional)
 */
export interface UpdateCampaignRequest {
  methodId?: CampaignMethod;
  fundName?: string;
  bannerUrl?: string;
  description?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankBranch?: string;
  purpose?: string;
  urlQrCode?: string;
  targetAmount?: number;
  categoryFund?: number;
  startDate?: string;
  endDate?: string;
  status?: CampaignStatus;
  mediaFund?: Array<{
    mediaType: MediaType;
    url: string;
  }>;
  milestones?: Array<{
    title: string;
    description: string;
    targetAmount: number;
    achievedAmount: number;
    startDate: string;
    endDate: string;
    orderIndex: number;
  }>;
}

/**
 * Campaign List Response (with pagination)
 */
export interface CampaignListResponse {
  funds: CampaignListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

/**
 * Campaign Query Filters
 */
export interface CampaignQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  methodId?: CampaignMethod;
  categoryId?: number;
  status?: CampaignStatus;
  orgId?: number; // Filter by organization
  sortBy?: "startDate" | "endDate" | "targetAmount" | "currentAmount" | "createdAt";
  sortOrder?: "asc" | "desc";
}

/**
 * Helper function to calculate campaign progress percentage
 */
export function calculateCampaignProgress(campaign: Campaign | CampaignListItem): number {
  if (campaign.targetAmount === 0) return 0;
  return Math.min(100, Math.round((campaign.currentAmount / campaign.targetAmount) * 100));
}

/**
 * Helper function to calculate days remaining
 */
export function calculateDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Helper function to format campaign amount
 */
export function formatCampaignAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Helper function to check if campaign is active
 */
export function isCampaignActive(campaign: Campaign | CampaignListItem): boolean {
  if ('status' in campaign && typeof campaign.status === 'number') {
    return campaign.status === CampaignStatus.ACTIVE;
  }
  if ('fundStatus' in campaign) {
    return campaign.fundStatus?.fundStatusId === CampaignStatus.ACTIVE;
  }
  return false;
}

/**
 * Helper function to get campaign slug
 */
export function getCampaignSlug(campaign: Campaign | CampaignListItem): string {
  return `${campaign.fundId}`;
}
