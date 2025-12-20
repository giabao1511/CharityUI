/**
 * Fund to Campaign Adapter
 *
 * This adapter converts Fund types from the backend API to the legacy Campaign
 * type used in existing UI components. This allows gradual migration of components
 * from mock data to real API data.
 *
 * @deprecated This is a temporary bridge. Components should be migrated to use
 * Fund types directly from types/fund.ts instead of Campaign types.
 */

/**
 * Map milestone status ID to status string
 * 1 = Pending, 2 = In Progress, 3 = Completed
 */
function getMilestoneStatus(
  statusId: number
): "pending" | "in-progress" | "achieved" {
  switch (statusId) {
    case 1:
      return "pending";
    case 2:
      return "in-progress";
    case 3:
      return "achieved"; // Map "completed" to "achieved" for Campaign type
    default:
      return "pending";
  }
}

/**
 * Map fund status ID to campaign status string
 * 1 = Draft, 2 = Active, 3 = Suspended, 4 = Completed, 5 = Cancelled
 */
function getFundStatusAsCampaignStatus(
  statusId: number
): "active" | "completed" | "cancelled" {
  switch (statusId) {
    case 1: // Draft
    case 2: // Active
    case 3: // Suspended (treat as active)
      return "active";
    case 4: // Completed
      return "completed";
    case 5: // Cancelled
      return "cancelled";
    default:
      return "active";
  }
}

/**
 * Get fund status as user-friendly string
 */
export function getFundStatusLabel(statusId: number): string {
  switch (statusId) {
    case 1:
      return "Draft";
    case 2:
      return "Active";
    case 3:
      return "Suspended";
    case 4:
      return "Completed";
    case 5:
      return "Cancelled";
    default:
      return "Unknown";
  }
}

/**
 * Get fundraising method as user-friendly string
 */
export function getFundMethodLabel(methodId: number): string {
  switch (methodId) {
    case 1:
      return "Milestone-based";
    case 2:
      return "Time-based";
    default:
      return "Unknown";
  }
}
