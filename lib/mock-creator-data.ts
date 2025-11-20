import type {
  MockCreatorUser,
  CreatorStats,
  ActivityItem,
  VolunteerRegistration,
  CreatorCampaignItem,
} from "@/types/creator";
import { CampaignStatus } from "@/types/campaign";

/**
 * Mock Creator User for RBAC simulation
 * This simulates a logged-in creator who owns specific campaigns
 */
export const mockCreatorUser: MockCreatorUser = {
  userId: 1,
  email: "creator@example.com",
  firstName: "Jane",
  lastName: "Smith",
  role: "creator",
  ownedCampaignIds: [1, 2, 3], // This user owns campaigns with IDs 1, 2, and 3
};

/**
 * Mock Creator Statistics
 */
export const mockCreatorStats: CreatorStats = {
  totalRaised: 265800,
  activeCampaignsCount: 3,
  totalVolunteers: 24,
  totalDonations: 186,
  totalBackers: 3186,
};

/**
 * Mock Recent Activity Feed
 */
export const mockRecentActivity: ActivityItem[] = [
  {
    id: "act-1",
    type: "donation",
    campaignId: 1,
    campaignName: "Clean Water for Rural Africa",
    description: "New donation received",
    amount: 250,
    userName: "Sarah Johnson",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: "act-2",
    type: "volunteer",
    campaignId: 1,
    campaignName: "Clean Water for Rural Africa",
    description: "New volunteer registration",
    userName: "Michael Chen",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
  },
  {
    id: "act-3",
    type: "donation",
    campaignId: 2,
    campaignName: "Education for All: School Supplies Drive",
    description: "New donation received",
    amount: 100,
    userName: "Emily Rodriguez",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
  },
  {
    id: "act-4",
    type: "milestone",
    campaignId: 1,
    campaignName: "Clean Water for Rural Africa",
    description: "Milestone achieved: First 3 Wells Completed",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "act-5",
    type: "volunteer",
    campaignId: 2,
    campaignName: "Education for All: School Supplies Drive",
    description: "New volunteer registration",
    userName: "David Park",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: "act-6",
    type: "donation",
    campaignId: 1,
    campaignName: "Clean Water for Rural Africa",
    description: "New donation received",
    amount: 1000,
    userName: "Anonymous",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: "act-7",
    type: "comment",
    campaignId: 2,
    campaignName: "Education for All: School Supplies Drive",
    description: "New comment from Jennifer Williams",
    userName: "Jennifer Williams",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
  },
  {
    id: "act-8",
    type: "update",
    campaignId: 1,
    campaignName: "Clean Water for Rural Africa",
    description: "Campaign update posted: Third Well Successfully Completed!",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
];

/**
 * Mock Creator Campaigns
 * These are the campaigns owned by the mock creator user
 */
export const mockCreatorCampaigns: CreatorCampaignItem[] = [
  {
    fundId: 1,
    fundName: "Clean Water for Rural Africa",
    bannerUrl: "/api/placeholder/800/600",
    status: CampaignStatus.ACTIVE,
    statusName: "Active",
    targetAmount: 150000,
    currentAmount: 89500,
    startDate: "2024-01-15",
    endDate: "2025-06-30",
    backersCount: 1240,
    volunteersCount: 12,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-11-10T15:30:00Z",
  },
  {
    fundId: 2,
    fundName: "Education for All: School Supplies Drive",
    bannerUrl: "/api/placeholder/800/600",
    status: CampaignStatus.ACTIVE,
    statusName: "Active",
    targetAmount: 50000,
    currentAmount: 42300,
    startDate: "2024-02-01",
    endDate: "2024-12-31",
    backersCount: 856,
    volunteersCount: 8,
    createdAt: "2024-01-25T09:00:00Z",
    updatedAt: "2024-11-08T12:00:00Z",
  },
  {
    fundId: 3,
    fundName: "Community Health Clinic Construction",
    bannerUrl: "/api/placeholder/800/600",
    status: CampaignStatus.ACTIVE,
    statusName: "Active",
    targetAmount: 200000,
    currentAmount: 134000,
    startDate: "2024-03-01",
    endDate: "2025-12-31",
    backersCount: 2100,
    volunteersCount: 4,
    createdAt: "2024-02-15T11:00:00Z",
    updatedAt: "2024-11-05T14:20:00Z",
  },
];

/**
 * Mock Volunteer Registrations
 */
export const mockVolunteerRegistrations: VolunteerRegistration[] = [
  {
    volunteerId: 1,
    fundId: 1,
    userId: 101,
    userName: "Michael Chen",
    userEmail: "michael.chen@example.com",
    registeredAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: "active",
    skills: ["Engineering", "Project Management"],
    availability: "Weekends",
    notes: "Experienced in water infrastructure projects",
  },
  {
    volunteerId: 2,
    fundId: 1,
    userId: 102,
    userName: "Sarah Johnson",
    userEmail: "sarah.j@example.com",
    registeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    skills: ["Community Outreach", "Translation"],
    availability: "Flexible",
    notes: "Speaks multiple African languages",
  },
  {
    volunteerId: 3,
    fundId: 1,
    userId: 103,
    userName: "David Park",
    userEmail: "david.park@example.com",
    registeredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "approved",
    skills: ["Photography", "Videography"],
    availability: "Part-time",
  },
  {
    volunteerId: 4,
    fundId: 2,
    userId: 104,
    userName: "Emily Rodriguez",
    userEmail: "emily.r@example.com",
    registeredAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    skills: ["Teaching", "Education"],
    availability: "Weekdays",
    notes: "Former elementary school teacher",
  },
  {
    volunteerId: 5,
    fundId: 2,
    userId: 105,
    userName: "Jennifer Williams",
    userEmail: "jen.williams@example.com",
    registeredAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    skills: ["Logistics", "Supply Chain"],
    availability: "Full-time",
  },
  {
    volunteerId: 6,
    fundId: 1,
    userId: 106,
    userName: "Robert Martinez",
    userEmail: "r.martinez@example.com",
    registeredAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
    skills: ["Construction", "Plumbing"],
    availability: "Weekends",
    notes: "Available for field work",
  },
];

/**
 * Helper function to filter campaigns by creator user
 */
export function getCreatorCampaigns(userId: number): CreatorCampaignItem[] {
  const user = userId === mockCreatorUser.userId ? mockCreatorUser : null;
  if (!user) return [];

  return mockCreatorCampaigns.filter((campaign) =>
    user.ownedCampaignIds.includes(campaign.fundId)
  );
}

/**
 * Helper function to get volunteers for a specific campaign
 */
export function getVolunteersForCampaign(fundId: number): VolunteerRegistration[] {
  return mockVolunteerRegistrations.filter((v) => v.fundId === fundId);
}

/**
 * Helper function to get activity for creator's campaigns
 */
export function getCreatorActivity(userId: number): ActivityItem[] {
  const user = userId === mockCreatorUser.userId ? mockCreatorUser : null;
  if (!user) return [];

  return mockRecentActivity.filter((activity) =>
    user.ownedCampaignIds.includes(activity.campaignId)
  );
}
