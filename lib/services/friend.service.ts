import { API_ENDPOINTS, apiClient } from "@/lib/api-config";
import { FriendRequest } from "@/types/friend";

export interface FriendResponse {
  notificationId: number;
  userId: number;
  type: string | null;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
  };
  campaign: {
    campaignId: number;
    title: string;
    description: string;
  } | null;
}

export interface FriendRequestResponse {
  data: FriendRequest[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ListFriend {
  id: number;
  userId: number;
  friendId: number;
  createdAt: string; // Hoặc Date nếu bạn parse sau khi nhận
  updatedAt: string;
  User: {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
}

export interface ListFriendResponse {
  data: ListFriend[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface GetFriendRequestParams {
  page?: number;
  limit?: number;
}

export const countFriendRequests = async (): Promise<number> => {
  try {
    const result = await apiClient<{ count: number }>(
      API_ENDPOINTS.FRIENDS.COUNT_REQUEST,
      {
        method: "GET",
      }
    );
    if (result.error) {
      console.error("Error fetching friend request count:", result.error);
      return 0;
    }
    return result.data?.count || 0;
  } catch (error) {
    console.error("Error fetching friend request count:", error);
    return 0;
  }
};

export const acceptFriendRequest = async (
  friendRequestId: string | number
): Promise<boolean> => {
  try {
    const result = await apiClient(
      API_ENDPOINTS.FRIENDS.ACCEPT(friendRequestId),
      {
        method: "POST",
      }
    );
    if (result.error) {
      console.error("Error accepting friend request:", result.error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return false;
  }
};
export const declineFriendRequest = async (
  friendRequestId: string | number
): Promise<boolean> => {
  try {
    const result = await apiClient(
      API_ENDPOINTS.FRIENDS.DECLINE(friendRequestId),
      {
        method: "POST",
      }
    );

    if (result.error) {
      console.error("Error declining friend request:", result.error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error declining friend request:", error);
    return false;
  }
};
export async function getFriendRequests(
  params: GetFriendRequestParams = {}
): Promise<FriendRequestResponse> {
  try {
    const { page = 1, limit = 10 } = params;

    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    }).toString();

    const result = await apiClient<FriendRequestResponse>(
      `${API_ENDPOINTS.FRIENDS.LIST_REQUEST}?${query}`,
      {
        method: "GET",
      }
    );

    if (result.error || !result.data) {
      console.error("Error fetching friend requests:", result.error);
      return {
        data: [],
        pagination: {
          total: 0,
          page,
          limit,
        },
      };
    }

    return result as any;
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return {
      data: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
      },
    };
  }
}
export interface GetListFriendsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function getListFriends(
  params: GetListFriendsParams = {}
): Promise<ListFriendResponse> {
  try {
    const { page = 1, limit = 10, search = "" } = params;

    const queryParams: Record<string, string> = {
      page: String(page),
      limit: String(limit),
    };

    if (search) {
      queryParams.search = search;
    }

    const query = new URLSearchParams(queryParams).toString();

    const result = await apiClient<ListFriendResponse>(
      `${API_ENDPOINTS.FRIENDS.LIST}?${query}`,
      {
        method: "GET",
      }
    );

    if (result.error || !result.data) {
      console.error("Error fetching friends list:", result.error);
      return {
        data: [],
        pagination: {
          total: 0,
          page,
          limit,
        },
      };
    }

    return result as any;
  } catch (error) {
    console.error("Error fetching friends list:", error);
    return {
      data: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
      },
    };
  }
}
