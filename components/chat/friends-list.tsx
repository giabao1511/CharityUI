"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { BodyText } from "@/components/ui/typography";
import { Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getListFriends, ListFriend } from "@/lib/services/friend.service";
import { getApiConversations, ApiConversation } from "@/lib/services/chat.service";
import { useAuth } from "@/lib/auth-context";

interface FriendsListProps {
  onSelectConversation: (conversationId: number) => void;
  onBack: () => void;
}

function FriendSkeleton() {
  return (
    <div className="flex gap-3 p-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-36" />
      </div>
    </div>
  );
}

export function FriendsList({ onSelectConversation, onBack }: FriendsListProps) {
  const { user } = useAuth();
  const [friends, setFriends] = useState<ListFriend[]>([]);
  const [conversations, setConversations] = useState<ApiConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Load friends and conversations
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [friendsData, conversationsData] = await Promise.all([
          getListFriends({ limit: 50 }),
          getApiConversations(1, 100),
        ]);
        setFriends(friendsData.data || []);
        setConversations(conversationsData.data || []);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Handle search with debounce
  const handleSearchChange = (value: string) => {
    setSearch(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await getListFriends({ search: value, limit: 50 });
        setFriends(data.data || []);
      } catch (error) {
        console.error("Failed to search friends:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    setSearchTimeout(timeout);
  };

  // Find conversation for a friend
  const findConversationForFriend = (friendUserId: number): number | null => {
    const conversation = conversations.find((conv) =>
      conv.members?.some((member) => member.user.userId === friendUserId)
    );
    return conversation?.conversationId || null;
  };

  // Handle friend click
  const handleFriendClick = (friend: ListFriend) => {
    const friendUserId = friend.User.userId;
    const conversationId = findConversationForFriend(friendUserId);

    if (conversationId) {
      onSelectConversation(conversationId);
    } else {
      // No conversation found - this shouldn't happen if friend request creates conversation
      console.warn("No conversation found for friend:", friendUserId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b space-y-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <BodyText weight="semibold">Friends</BodyText>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search friends..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Friends List */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="divide-y">
            <FriendSkeleton />
            <FriendSkeleton />
            <FriendSkeleton />
          </div>
        ) : friends.length === 0 ? (
          <div className="flex items-center justify-center h-full p-8">
            <BodyText muted className="text-center">
              {search ? "No friends found" : "No friends yet"}
            </BodyText>
          </div>
        ) : (
          <div className="divide-y">
            {friends.map((friend) => {
              const hasConversation = findConversationForFriend(friend.User.userId) !== null;

              return (
                <div
                  key={friend.id}
                  className="flex gap-3 p-3 cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleFriendClick(friend)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={friend.User.avatar || "/assets/images/avatar-fallback.png"}
                    />
                    <AvatarFallback>
                      {friend.User.firstName?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <BodyText weight="semibold" className="truncate">
                      {friend.User.firstName} {friend.User.lastName}
                    </BodyText>
                    <BodyText size="sm" muted className="truncate">
                      {friend.User.email}
                    </BodyText>
                  </div>

                  {hasConversation && (
                    <div className="flex items-center">
                      <span className="text-xs text-muted-foreground">Chat</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
