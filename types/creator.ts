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
  status: "pending" | "rejected" | "active";
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
