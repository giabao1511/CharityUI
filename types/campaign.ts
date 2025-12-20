/**
 * Campaign Types
 * Based on actual API response structure
 */

// Campaign Status
export enum CampaignStatus {
  ACTIVE = 1,
  PAUSED = 2,
  COMPLETED = 3,
  CLOSED = 4,
}

export const CampaignStatusNames = {
  [CampaignStatus.ACTIVE]: "Active",
  [CampaignStatus.PAUSED]: "Paused",
  [CampaignStatus.COMPLETED]: "Completed",
  [CampaignStatus.CLOSED]: "Closed",
} as const;

// Media Types
export enum MediaType {
  IMAGE = 1,
  VIDEO = 2,
  DOCUMENT = 3,
}

export const MediaTypeNames = {
  [MediaType.IMAGE]: "Image",
  [MediaType.VIDEO]: "Video",
  [MediaType.DOCUMENT]: "Document",
} as const;

/**
 * Campaign Organization
 */
export interface CampaignOrganization {
  orgId: number;
  orgName: string;
  avatar: string;
}

/**
 * Campaign Category
 */
export interface CampaignCategory {
  categoryId: number;
  categoryName: string;
  logoIcon: string;
}

/**
 * Campaign Status Info
 */
export interface CampaignStatusInfo {
  campaignStatusId: number;
  statusName: string;
}

/**
 * Media Type Info
 */
export interface MediaTypeInfo {
  mediaTypeId: number;
  mediaName: string;
}

/**
 * Campaign Media
 */
export interface CampaignMedia {
  campaignMediaId: number;
  campaignId: number;
  url: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  mediaType: MediaTypeInfo;
}

/**
 * Campaign (List Item & Detail)
 */
export interface Campaign {
  campaignId: number;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  organization: CampaignOrganization;
  category: CampaignCategory;
  status: CampaignStatusInfo;
  media: CampaignMedia[];
}

/**
 * Campaign List Response (with pagination)
 */
export interface CampaignListResponse {
  data: Campaign[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

/**
 * Update Campaign Request
 */
export interface UpdateCampaignRequest {
  title?: string;
  description?: string;
  targetAmount?: number;
  startDate?: string;
  endDate?: string;
  statusId?: number;
}

/**
 * Campaign Query Filters
 */
export interface CampaignQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: number;
  categoryId?: number;
  organizationId?: number;
  sortBy?:
    | "title"
    | "startDate"
    | "createdAt"
    | "targetAmount"
    | "currentAmount";
  sortOrder?: "ASC" | "DESC";
}

/**
 * Helper function to calculate campaign progress percentage
 */
export function calculateCampaignProgress(campaign: Campaign): number {
  if (campaign.targetAmount === 0) return 0;
  return Math.min(
    100,
    Math.round((campaign.currentAmount / campaign.targetAmount) * 100)
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
 * Helper function to format campaign amount (VND)
 */
export function formatCampaignAmount(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Helper function to check if campaign is active
 */
export function isCampaignActive(campaign: Campaign): boolean {
  return campaign.status.campaignStatusId === CampaignStatus.ACTIVE;
}
