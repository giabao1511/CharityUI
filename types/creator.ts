/**
 * Creator Dashboard Types
 * Types for the Creator/Fund Manager role-based dashboard
 */

/**
 * Volunteer Registration
 */
export interface VolunteerRegistration {
  volunteerId: number;
  fundId: number;
  userId: number;
  userName: string;
  userEmail: string;
  registeredAt: string;
  status: "pending" | "approved" | "rejected" | "active" | "inactive";
  skills?: string[];
  availability?: string;
  notes?: string;
}

/**
 * Recent Activity Item
 */
export interface ActivityItem {
  id: string;
  type: "donation" | "volunteer" | "milestone" | "comment" | "update";
  campaignId: number;
  campaignName: string;
  description: string;
  amount?: number;
  userName?: string;
  timestamp: string;
}

/**
 * Creator Dashboard Statistics
 */
export interface CreatorStats {
  totalRaised: number;
  activeCampaignsCount: number;
  totalVolunteers: number;
  totalDonations: number;
  totalBackers: number;
}

/**
 * Campaign List Item for Creator
 */
export interface CreatorCampaignItem {
  fundId: number;
  fundName: string;
  bannerUrl: string;
  status: number;
  statusName: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  backersCount: number;
  volunteersCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Mock User (for RBAC simulation)
 */
export interface MockCreatorUser {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "creator" | "admin" | "user";
  ownedCampaignIds: number[]; // IDs of campaigns this user owns
}
