"use client";

import { useAuth } from "@/lib/auth-context";
import {
  acceptFriendRequest,
  countFriendRequests,
  declineFriendRequest,
  getFriendRequests,
} from "@/lib/services/friend.service";
import { FriendContextType, FriendRequest } from "@/types/friend";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const PAGE_SIZE = 10;

const FriendContext = createContext<FriendContextType | undefined>(undefined);

export function FriendProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [loadingCount, setLoadingCount] = useState(false);
  const [friendRequestCount, setFriendRequestCount] = useState(0);

  const initializedRef = useRef(false);

  /* ================= COUNT ================= */
  const fetchCountFriendRequests = useCallback(async () => {
    if (!user) return;
    setLoadingCount(true);
    try {
      const count = await countFriendRequests();
      setFriendRequestCount(count);
    } finally {
      setLoadingCount(false);
    }
  }, [user]);

  /* ================= LOAD PAGE ================= */
  const loadMore = useCallback(async () => {
    if (!user || loading || !hasMore) return;

    setLoading(true);
    try {
      const { data } = await getFriendRequests({
        page,
        limit: PAGE_SIZE,
      });
      setFriendRequests((prev) => (page === 1 ? data : [...prev, ...data]));

      setHasMore(data.length === PAGE_SIZE);
      setPage((p) => p + 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user, loading, hasMore, page]);

  /* ================= INIT WHEN USER CHANGE ================= */
  useEffect(() => {
    if (!user) {
      setFriendRequests([]);
      setPage(1);
      setHasMore(true);
      initializedRef.current = false;
      return;
    }

    // reset
    setFriendRequests([]);
    setPage(1);
    setHasMore(true);
    initializedRef.current = true;

    loadMore(); // ✅ FETCH 1 LẦN DUY NHẤT
    fetchCountFriendRequests();
  }, [user]);

  /* ================= ACTIONS ================= */
  const acceptRequest = async (id: string | number) => {
    await acceptFriendRequest(id);
    setFriendRequests((prev) => prev.filter((r) => r.friendRequestId !== id));
    setFriendRequestCount((c) => Math.max(0, c - 1));
  };

  const declineRequest = async (id: string | number) => {
    await declineFriendRequest(id);
    setFriendRequests((prev) => prev.filter((r) => r.friendRequestId !== id));
    setFriendRequestCount((c) => Math.max(0, c - 1));
  };

  return (
    <FriendContext.Provider
      value={{
        friendRequests,
        totalRequest: friendRequestCount,
        loading,
        loadingCount,
        hasMore,
        loadMore,
        acceptRequest,
        declineRequest,
      }}
    >
      {children}
    </FriendContext.Provider>
  );
}

export function useFriends() {
  const ctx = useContext(FriendContext);
  if (!ctx) throw new Error("useFriends must be used within FriendProvider");
  return ctx;
}
