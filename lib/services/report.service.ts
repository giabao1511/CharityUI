/**
 * Report Service
 * Handles report-related API calls
 */

import { apiClient, API_ENDPOINTS } from "@/lib/api-config";
import { ReportReason, CreateReportRequest, Report } from "@/types";

/**
 * Get all report reasons
 * @returns List of report reasons
 */
export async function getReportReasons() {
  try {
    const result = await apiClient<ReportReason[]>(API_ENDPOINTS.REPORTS.REASONS);

    if (result.error) {
      throw new Error(result.error.message || "Failed to fetch report reasons");
    }

    return result.data || [];
  } catch (error) {
    console.error("Error fetching report reasons:", error);
    throw error;
  }
}

/**
 * Create a new report
 * @param reportData - Report data including targetId, reasonId, and description
 * @returns Created report
 */
export async function createReport(reportData: CreateReportRequest) {
  try {
    const result = await apiClient<Report>(API_ENDPOINTS.REPORTS.CREATE, {
      method: "POST",
      body: JSON.stringify(reportData),
    });

    if (result.error) {
      throw new Error(result.error.message || "Failed to create report");
    }

    if (!result.data) {
      throw new Error("No data returned from create report");
    }

    return result.data;
  } catch (error) {
    console.error("Error creating report:", error);
    throw error;
  }
}

/**
 * Get reports by campaign ID
 * @param campaignId - Campaign ID to get reports for
 * @returns List of reports for the campaign
 */
export async function getReportsByCampaign(campaignId: number) {
  try {
    const result = await apiClient<any>(
      API_ENDPOINTS.REPORTS.LIST_BY_CAMPAIGN(campaignId)
    );

    if (result.error) {
      throw new Error(result.error.message || "Failed to fetch reports");
    }

    // API returns { data: [...], pagination: {...} }
    // Return the full response so caller can access pagination if needed
    return result;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
}

/**
 * Update report status
 * @param reportId - Report ID to update
 * @param status - New status (pending, reviewed, rejected, approved)
 * @returns Updated report
 */
export async function updateReportStatus(
  reportId: number,
  status: "pending" | "reviewed" | "rejected" | "approved"
) {
  try {
    const result = await apiClient<Report>(
      API_ENDPOINTS.REPORTS.UPDATE_STATUS(reportId),
      {
        method: "POST",
        body: JSON.stringify({ status }),
      }
    );

    if (result.error) {
      throw new Error(result.error.message || "Failed to update report status");
    }

    if (!result.data) {
      throw new Error("No data returned from update report");
    }

    return result.data;
  } catch (error) {
    console.error("Error updating report status:", error);
    throw error;
  }
}
