"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { BodyText } from "@/components/ui/typography";
import { useFriends } from "@/contexts/friend-request-context";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { User, UserPlus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

/* ================= Skeleton ================= */
function ListFriendSkeleton() {
  return (
    <div className="flex gap-3 p-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-3 w-24" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function ListFriendDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const t = useTranslations("friends");

  const {
    friendRequests,
    loading,
    loadingCount,
    totalRequest,
    hasMore,
    loadMore,
    acceptRequest,
    declineRequest,
  } = useFriends();

  /* ===== Close on outside click ===== */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  /* ===== IntersectionObserver Load More ===== */
  useEffect(() => {
    if (!isOpen || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { root: null, threshold: 1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isOpen, hasMore, loading, loadMore]);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen((v) => !v)}
      >
        <User className="h-5 w-5" />

        {loadingCount && (
          <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gray-400 animate-pulse" />
        )}

        {totalRequest > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
          >
            {totalRequest > 9 ? "9+" : totalRequest}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 mt-2 w-[420px] z-50 shadow-xl">
          <CardHeader className="pb-2 flex-row justify-between items-center">
            <CardTitle>{t("friendRequests")}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-[420px]">
              <div className="divide-y">
                {friendRequests?.map((fr) => (
                  <div
                    key={fr.friendRequestId}
                    className={cn("flex gap-3 p-4 hover:bg-muted")}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          fr.sender?.avatar ||
                          "/assets/images/avatar-fallback.png"
                        }
                      />
                      <AvatarFallback>
                        {fr.sender?.firstName?.[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <BodyText weight="semibold">
                        {fr.sender?.firstName} {fr.sender?.lastName}
                      </BodyText>

                      <BodyText size="xs" muted className="mt-1">
                        {formatDistanceToNow(new Date(fr.updatedAt), {
                          addSuffix: true,
                        })}
                      </BodyText>

                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => acceptRequest(fr.friendRequestId)}
                        >
                          {t("confirm")}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => declineRequest(fr.friendRequestId)}
                        >
                          {t("decline")}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {!loading && friendRequests.length === 0 && (
                  <div className="p-4">
                    <BodyText size="sm" className="text-center" muted>
                      {t("noFriendRequests")}
                    </BodyText>
                  </div>
                )}

                {loading && <ListFriendSkeleton />}
                {hasMore && <div ref={sentinelRef} className="h-[1px]" />}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
