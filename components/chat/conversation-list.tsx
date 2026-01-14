"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { BodyText } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/lib/auth-context";
import { getApiConversations, ApiConversation } from "@/lib/services/chat.service";

interface ConversationListProps {
  onSelectConversation: (conversationId: number) => void;
}

function ConversationSkeleton() {
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

export function ConversationList({ onSelectConversation }: ConversationListProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ApiConversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConversations() {
      setLoading(true);
      try {
        const data = await getApiConversations();
        setConversations(data.data || []);
      } catch (error) {
        console.error("Failed to load conversations:", error);
      } finally {
        setLoading(false);
      }
    }

    loadConversations();
  }, []);

  if (loading) {
    return (
      <div className="divide-y">
        <ConversationSkeleton />
        <ConversationSkeleton />
        <ConversationSkeleton />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <BodyText muted className="text-center">
          No conversations yet
        </BodyText>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="divide-y">
        {conversations.map((conversation) => {
          // Find the other member (not the current user)
          const otherMember = conversation.members?.find(
            (member) => member.user.userId !== user?.userId
          );
          const otherUser = otherMember?.user;

          // Display name: use conversation name for groups, or other user's name for private
          const displayName = conversation.name
            || (otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : "Unknown");

          return (
            <div
              key={conversation.conversationId}
              className={cn(
                "flex gap-3 p-3 cursor-pointer hover:bg-muted transition-colors",
                (conversation.unreadCount ?? 0) > 0 && "bg-muted/50"
              )}
              onClick={() => onSelectConversation(conversation.conversationId)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={otherUser?.avatar || "/assets/images/avatar-fallback.png"}
                />
                <AvatarFallback>
                  {otherUser?.firstName?.[0] || "?"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <BodyText weight="semibold" className="truncate">
                    {displayName}
                  </BodyText>
                  {conversation.lastMessage && (
                    <BodyText size="xs" muted>
                      {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
                        addSuffix: false,
                      })}
                    </BodyText>
                  )}
                </div>

                <BodyText size="sm" muted className="truncate">
                  {conversation.lastMessage?.content || "Start a conversation"}
                </BodyText>
              </div>

              {(conversation.unreadCount ?? 0) > 0 && (
                <div className="flex items-center">
                  <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {(conversation.unreadCount ?? 0) > 9 ? "9+" : conversation.unreadCount}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
