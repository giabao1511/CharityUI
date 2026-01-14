"use client";

import { useState } from "react";
import { MessageCircle, X, Minimize2, Maximize2, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { ConversationList } from "./conversation-list";
import { MessageArea } from "./message-area";
import { FriendsList } from "./friends-list";

type ViewType = "conversations" | "friends" | "chat";

export function ChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [view, setView] = useState<ViewType>("conversations");
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [unreadCount] = useState(0);

  if (!user) return null;

  const handleSelectConversation = (conversationId: number) => {
    setActiveConversationId(conversationId);
    setView("chat");
  };

  const handleBack = () => {
    if (view === "chat") {
      setActiveConversationId(null);
      setView("conversations");
    } else if (view === "friends") {
      setView("conversations");
    }
  };

  const getTitle = () => {
    switch (view) {
      case "chat":
        return "Chat";
      case "friends":
        return "Friends";
      default:
        return "Messages";
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card
          className={cn(
            "fixed bottom-6 right-6 z-50 shadow-2xl transition-all duration-200 flex flex-col",
            isMinimized ? "w-80 h-14" : "w-96 h-[600px]"
          )}
        >
          {/* Header */}
          <CardHeader className="p-3 border-b flex-row items-center justify-between space-y-0 shrink-0">
            <div className="flex items-center gap-2">
              {view !== "conversations" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <CardTitle className="text-base font-semibold">
                {getTitle()}
              </CardTitle>
            </div>
            <div className="flex items-center gap-1">
              {view === "conversations" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setView("friends")}
                  title="Find friends to chat"
                >
                  <Users className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setIsOpen(false);
                  setActiveConversationId(null);
                  setView("conversations");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Content */}
          {!isMinimized && (
            <div className="flex-1 overflow-hidden">
              {view === "chat" && activeConversationId ? (
                <MessageArea
                  conversationId={activeConversationId}
                  onBack={handleBack}
                />
              ) : view === "friends" ? (
                <FriendsList
                  onSelectConversation={handleSelectConversation}
                  onBack={handleBack}
                />
              ) : (
                <ConversationList
                  onSelectConversation={handleSelectConversation}
                />
              )}
            </div>
          )}
        </Card>
      )}
    </>
  );
}
