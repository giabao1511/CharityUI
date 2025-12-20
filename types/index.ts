/**
 * LEGACY MOCK TYPES - FOR DEMONSTRATION PURPOSES ONLY
 * 
 * These types represent the old mock data structure used for UI demos.
 * For actual API integration, use the types from './fund.ts' instead.
 * 
 * @deprecated Use Fund types from './fund.ts' for real API integration
 * 
 * Relationship:
 * - Mock "Campaign" → Real "Fund" (from API)
 * - Mock "Milestone" → Real "Milestone" (from API)
 * - Mock data is used in: lib/data.ts
 * - Real API types: types/fund.ts
 */

export interface Milestone {
  id: string;
  title: string;
  description: string;
  fundingRequired: number;
  status: "pending" | "achieved" | "in-progress";
  achievedDate?: string;
}

export interface RewardTier {
  id: string;
  title: string;
  description: string;
  amount: number;
  estimatedDelivery?: string;
  backerLimit?: number;
  backersCount: number;
  items: string[];
}

export interface Contributor {
  id: string;
  name: string;
  amount: number;
  date: string;
  rewardTier?: string;
  isAnonymous?: boolean;
}

export interface Volunteer {
  id: string;
  name: string;
  registeredAt: string;
  status: "pending" | "active" | "rejected";
  skills?: string[];
  availability?: string;
}

export interface DonationStatus {
  donationStatusId: number;
  statusName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Donation {
  donationId: number;
  campaignId: number;
  email: string | null;
  fullName: string | null;
  phoneNumber: string | null;
  address: string | null;
  isAnonymous: boolean;
  amount: string;
  donateDate: string;
  message: string | null;
  createdAt: string;
  updatedAt: string;
  user: any | null;
  status: DonationStatus;
}

// Legacy Comment interface for mock data
export interface CommentLegacy {
  id: string;
  author: string;
  content: string;
  date: string;
  replies?: CommentLegacy[];
}

// Comment media interface (for API)
export interface CommentMedia {
  mediaTypeId: number;
  url: string;
}

// Comment interface (for API)
export interface Comment {
  commentId: number;
  campaignId: number;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  media?: CommentMedia[];
}

// Create comment request interface
export interface CreateCommentRequest {
  campaignId: number;
  content: string;
  media?: CommentMedia[];
}

export interface ContributionHistory {
  id: string;
  campaignId: string;
  campaignName: string;
  amount: number;
  rewardReceived: string;
  date: string;
  status: "completed" | "pending" | "shipped";
}

export interface Fund {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  creator: string;
  category: string;
  goalAmount: number;
  currentAmount: number;
  currency: string;
  imageUrl: string;
  mediaUrls: string[];
  videoUrl?: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "cancelled";
  backers: number;
  milestones: Milestone[];
  updates: CampaignUpdate[];
  rewardTiers: RewardTier[];
  contributors: Contributor[];
  volunteers: Volunteer[];
  comments: CommentLegacy[]; // Using legacy comment type for mock data
  // Organization info (from API)
  organization?: {
    orgId: number;
    orgName: string;
    avatar?: string;
  };
}

export interface CampaignUpdate {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface PlatformStats {
  totalRaised: number;
  totalCampaigns: number;
  activeCampaigns: number;
  totalBackers: number;
}

// Report Reason interface
export interface ReportReason {
  reasonId: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

// Create Report Request interface
export interface CreateReportRequest {
  targetId: number;
  reasonId: number;
  description: string;
}

// Report interface (API response)
export interface Report {
  reportId: number;
  targetType: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  reason: {
    reasonId: number;
    title: string;
  };
  reporter: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  target: {
    campaignId: number;
    title: string;
  };
}

// Export wallet types
export * from "./wallet";
