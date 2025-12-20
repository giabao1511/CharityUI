/**
 * Comment Service
 * Handles comment-related API calls
 */

import { apiClient, API_ENDPOINTS } from "@/lib/api-config";
import { Comment, CreateCommentRequest } from "@/types";

export interface GetCommentsFilters {
  page?: number;
  limit?: number;
  sortBy?: string; // e.g., "createdAt"
  sortOrder?: "ASC" | "DESC";
}

/**
 * Get comments for a campaign
 * @param campaignId - Campaign ID
 * @param filters - Optional filters for pagination and sorting
 * @returns List of comments with pagination
 */
export async function getCampaignComments(
  campaignId: string | number,
  filters?: GetCommentsFilters
) {
  try {
    const queryParams = new URLSearchParams();
    if (filters?.page) queryParams.append("page", String(filters.page));
    if (filters?.limit) queryParams.append("limit", String(filters.limit));
    if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) queryParams.append("sortOrder", filters.sortOrder);

    const url = `${API_ENDPOINTS.COMMENTS.LIST(campaignId)}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const result = await apiClient<Comment[]>(url);

    if (result.error) {
      throw new Error(result.error.message || "Failed to fetch comments");
    }

    if (!result.data) {
      return {
        data: [],
        pagination: { total: 0, page: 1, limit: 10 },
      };
    }

    return result;
  } catch (error) {
    console.error("Error fetching campaign comments:", error);
    return {
      data: [],
      pagination: { total: 0, page: 1, limit: 10 },
    };
  }
}

/**
 * Create a new comment
 * @param commentData - Comment data including campaignId, content, and optional media
 * @returns Created comment
 */
export async function createComment(commentData: CreateCommentRequest) {
  try {
    const result = await apiClient<Comment>(API_ENDPOINTS.COMMENTS.CREATE, {
      method: "POST",
      body: JSON.stringify(commentData),
    });

    if (result.error) {
      throw new Error(result.error.message || "Failed to create comment");
    }

    if (!result.data) {
      throw new Error("No data returned from create comment");
    }

    return result.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
}

/**
 * Upload comment media files
 * @param files - Array of files to upload
 * @returns Array of uploaded media with URLs and mediaType
 */
export async function uploadCommentMedia(files: File[]) {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    // For FormData uploads, we need to bypass the default JSON content-type
    // and let the browser set the correct multipart/form-data with boundary
    const accessToken =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    const response = await fetch(API_ENDPOINTS.COMMENTS.UPLOAD_MEDIA, {
      method: "POST",
      body: formData,
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : undefined,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to upload media");
    }

    return result.data || [];
  } catch (error) {
    console.error("Error uploading comment media:", error);
    throw error;
  }
}

/**
 * Get display name for comment author
 */
export function getCommentAuthorName(comment: Comment): string {
  if (!comment.user) {
    return "Anonymous";
  }

  const { firstName, lastName } = comment.user;
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  if (firstName) {
    return firstName;
  }

  if (lastName) {
    return lastName;
  }

  return comment.user.email || "Anonymous";
}

/**
 * Format comment date for display
 */
export function formatCommentDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Less than a minute
  if (diffInSeconds < 60) {
    return "just now";
  }

  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  // More than a week, show actual date
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
