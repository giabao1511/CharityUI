/**
 * Fund (Fundraising Campaign) Types
 * Based on api.instructions.md
 */

// Fund Fundraising Methods
export enum FundMethod {
  MILESTONE = 1, // Milestone-based fundraising
  TIME_BASED = 2, // Time-based fundraising
}

export const FundMethodNames = {
  [FundMethod.MILESTONE]: "Milestone",
  [FundMethod.TIME_BASED]: "Time-based",
} as const;

// Fund Status
export enum FundStatus {
  ACTIVE = 1,
  PAUSED = 2,
  COMPLETED = 3,
  CLOSED = 4,
}

export const FundStatusNames = {
  [FundStatus.ACTIVE]: "Active",
  [FundStatus.PAUSED]: "Paused",
  [FundStatus.COMPLETED]: "Completed",
  [FundStatus.CLOSED]: "Closed",
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
 * Fund Category
 */
export interface FundCategory {
  categoryFundId: number;
  categoryName: string;
  logoIcon: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fund Media
 */
export interface FundMedia {
  fundMediaId: number;
  fundId: number;
  mediaType: MediaType;
  url: string;
}

/**
 * Fund Milestone
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
 * Fund Creator (User)
 */
export interface FundCreator {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Fundraising Method Info
 */
export interface FundraisingMethod {
  methodId: FundMethod;
  methodName: string;
}

/**
 * Fund Status Info
 */
export interface FundStatusInfo {
  fundStatusId: FundStatus;
  fundStatusName: string;
}

/**
 * Fund Category Info (simplified)
 */
export interface FundCategoryInfo {
  categoryId: number;
  categoryName: string;
  logoIcon: string;
}

/**
 * Main Fund Interface (complete structure)
 */
export interface Fund {
  fundId: number;
  methodId: FundMethod;
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
  status: FundStatus;
  categoryFund: number;
  creatorId: number;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  createdAt: string;
  updatedAt: string;

  // Relations (populated in GET requests)
  creator?: FundCreator;
  fundraising?: FundraisingMethod;
  fundStatus?: FundStatusInfo;
  fundCategory?: FundCategoryInfo;
  fundMedia?: FundMedia[];
  milestones?: Milestone[];
}

/**
 * Campaign Item (used in list views)
 */
export interface CampaignItem {
  targetAmount: number;
  currentAmount: number;
  campaignId: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  organization: Organization;
  category: Category;
  status: Status;
  media: MediaTypeCampaign[];
}

export interface Category {
  categoryId: number;
  categoryName: string;
  logoIcon: string;
}

export interface Media {
  campaignMediaId: number;
  campaignId: number;
  url: string;
  description: null;
  createdAt: Date;
  updatedAt: Date;
  mediaType: MediaTypeCampaign;
}

export interface MediaTypeCampaign {
  mediaTypeId: number;
  mediaName: string;
}

export interface Organization {
  orgId: number;
  orgName: string;
  avatar: string;
}

export interface Status {
  campaignStatusId: number;
  statusName: string;
}

/**
 * Create Fund Request Body
 */
export interface CreateFundRequest {
  methodId: FundMethod;
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
 * Update Fund Request Body (all fields optional)
 */
export interface UpdateFundRequest {
  methodId?: FundMethod;
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
  status?: FundStatus;
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
 * Fund List Response (with pagination)
 */
export interface FundListResponse {
  funds: CampaignItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

/**
 * Fund Query Filters
 */
export interface FundQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  methodId?: FundMethod;
  categoryId?: number;
  status?: FundStatus;
  sortBy?:
    | "startDate"
    | "endDate"
    | "targetAmount"
    | "currentAmount"
    | "createdAt";
  sortOrder?: "asc" | "desc";
}

/**
 * Helper function to calculate fund progress percentage
 */
export function calculateFundProgress(fund: Fund | CampaignItem): number {
  if (fund.targetAmount === 0) return 0;
  return Math.min(
    100,
    Math.round((fund.currentAmount / fund.targetAmount) * 100)
  );
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
 * Helper function to format fund amount
 */
export function formatFundAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
