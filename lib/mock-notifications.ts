import { Notification } from "@/types/notification";

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "donation",
    title: "New Donation Received",
    message: "Sarah Johnson donated $250 to your campaign 'Clean Water for Rural Communities'",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    read: false,
    actionUrl: "/creator/campaigns/clean-water/donations",
    metadata: {
      campaignId: "clean-water",
      campaignTitle: "Clean Water for Rural Communities",
      amount: 250,
      userName: "Sarah Johnson",
    },
  },
  {
    id: "notif-2",
    type: "volunteer",
    title: "New Volunteer Registration",
    message: "Alex Martinez has registered as a volunteer for 'Community Food Bank Initiative'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
    actionUrl: "/creator/campaigns/food-bank/volunteers",
    metadata: {
      campaignId: "food-bank",
      campaignTitle: "Community Food Bank Initiative",
      userName: "Alex Martinez",
    },
  },
  {
    id: "notif-3",
    type: "milestone",
    title: "Milestone Achieved!",
    message: "Your campaign 'Education for All' has reached 75% of its funding goal",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    read: false,
    actionUrl: "/creator/campaigns/education",
    metadata: {
      campaignId: "education",
      campaignTitle: "Education for All",
    },
  },
  {
    id: "notif-4",
    type: "comment",
    title: "New Comment on Your Campaign",
    message: "Jennifer Lee commented: 'This is such an inspiring initiative! Happy to support.'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    read: true,
    actionUrl: "/campaigns/clean-water#comments",
    metadata: {
      campaignId: "clean-water",
      userName: "Jennifer Lee",
    },
  },
  {
    id: "notif-5",
    type: "campaign",
    title: "Campaign Update Required",
    message: "It's been 2 weeks since your last update. Keep your backers informed!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
    actionUrl: "/creator/campaigns/education/updates",
    metadata: {
      campaignId: "education",
    },
  },
  {
    id: "notif-6",
    type: "donation",
    title: "Large Donation Alert",
    message: "Michael Chen donated $1,000 to 'Medical Equipment Fund'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
    read: true,
    actionUrl: "/creator/campaigns/medical-equipment/donations",
    metadata: {
      campaignId: "medical-equipment",
      campaignTitle: "Medical Equipment Fund",
      amount: 1000,
      userName: "Michael Chen",
    },
  },
  {
    id: "notif-7",
    type: "volunteer",
    title: "Volunteer Status Update",
    message: "You approved 3 new volunteers for 'Beach Cleanup Initiative'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    read: true,
    actionUrl: "/creator/campaigns/beach-cleanup/volunteers",
    metadata: {
      campaignId: "beach-cleanup",
      campaignTitle: "Beach Cleanup Initiative",
    },
  },
  {
    id: "notif-8",
    type: "system",
    title: "Monthly Report Available",
    message: "Your monthly impact report for November is ready to view",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    read: true,
    actionUrl: "/creator/reports",
  },
  {
    id: "notif-9",
    type: "milestone",
    title: "Campaign Goal Reached!",
    message: "Congratulations! 'Emergency Relief Fund' has reached 100% of its funding goal",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
    read: true,
    actionUrl: "/creator/campaigns/emergency-relief",
    metadata: {
      campaignId: "emergency-relief",
      campaignTitle: "Emergency Relief Fund",
    },
  },
  {
    id: "notif-10",
    type: "comment",
    title: "New Comment",
    message: "David Kim commented on 'Community Garden Project'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // 5 days ago
    read: true,
    actionUrl: "/campaigns/community-garden#comments",
    metadata: {
      campaignId: "community-garden",
      userName: "David Kim",
    },
  },
];
