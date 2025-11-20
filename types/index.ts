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

export interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  replies?: Comment[];
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
  comments: Comment[];
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
