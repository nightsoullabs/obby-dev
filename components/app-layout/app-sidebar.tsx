"use client";

import { Alert, AlertDescription, AlertTitle } from "components/ui/alert";
import {
  Clock,
  Users,
  ChevronDown,
  Plus,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";
import { Button } from "components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
} from "components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/ui/tooltip";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";

interface AppSidebarProps {
  userId?: Id<"users"> | null;
  isAuthenticated?: boolean;
}

export function AppSidebar({
  userId,
  isAuthenticated = false,
}: AppSidebarProps) {
  const [optimisticDeletes, setOptimisticDeletes] = useState<Set<Id<"chats">>>(
    new Set(),
  );
  const [optimisticFavorites, setOptimisticFavorites] = useState<
    Map<Id<"chats">, boolean>
  >(new Map());

  // Single optimized query to get all user chats
  const allUserChats = useQuery(
    api.chats.getAllUserChats,
    isAuthenticated && userId ? { user_id: userId } : "skip",
  );

  // Apply optimistic updates to the data
  const processedChats = [
    ...(allUserChats?.favoriteChats || []),
    ...(allUserChats?.recentChats || []),
  ]
    .filter((chat) => !optimisticDeletes.has(chat._id))
    .map((chat) => ({
      ...chat,
      isFavorite: optimisticFavorites.has(chat._id)
        ? (optimisticFavorites.get(chat._id) ?? chat.isFavorite)
        : chat.isFavorite,
    }));

  // Split into favorites and recents based on optimistic state
  const favoriteChats = processedChats.filter((chat) => chat.isFavorite);
  const recentChats = processedChats.filter((chat) => !chat.isFavorite);

  const toggleFavorite = useMutation(api.chats.toggleChatFavorite);
  const deleteChat = useMutation(api.chats.deleteChat);

  const handleToggleFavorite = async (
    chatId: Id<"chats">,
    isFavorite: boolean,
  ) => {
    setOptimisticFavorites((prev) => new Map(prev.set(chatId, !isFavorite)));

    try {
      await toggleFavorite({ id: chatId, isFavorite: !isFavorite });
      setOptimisticFavorites((prev) => {
        const newMap = new Map(prev);
        newMap.delete(chatId);
        return newMap;
      });
    } catch (error) {
      setOptimisticFavorites((prev) => {
        const newMap = new Map(prev);
        newMap.delete(chatId);
        return newMap;
      });
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleDeleteChat = async (chatId: Id<"chats">) => {
    try {
      if (confirm("Are you sure you want to delete this chat?")) {
        setOptimisticDeletes((prev) => new Set(prev.add(chatId)));

        await deleteChat({ id: chatId });
      }
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticDeletes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(chatId);
        return newSet;
      });
      console.error("Failed to delete chat:", error);
    }
  };

  const truncateTitle = (title: string, maxLength: number = 30) => {
    return title.length > maxLength
      ? `${title.substring(0, maxLength)}...`
      : title;
  };

  return (
    <TooltipProvider>
      <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]! border-none">
        <SidebarHeader className="p-4 bg-background">
          <Button
            variant="outline"
            className="h-9 w-full justify-center bg-background/50 border-border/50 hover:bg-accent/50"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>

          {/* History Navigation */}
          <Link
            href="/history"
            className="h-9 w-full flex items-center gap-2 text-sm font-medium text-muted-foreground
              hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-md px-2"
          >
            <Clock className="w-4 h-4" />
            <span>History</span>
          </Link>

          {/* Community - Disabled with tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-9 w-full flex items-center gap-2 text-sm font-medium text-muted-foreground/50 rounded-md px-2 cursor-not-allowed">
                <Users className="w-4 h-4" />
                <span>Community</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Coming Soon</p>
            </TooltipContent>
          </Tooltip>
        </SidebarHeader>

        <SidebarContent className="pl-2 pr-4 bg-background">
          {/* Favorite Chats */}
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger>
                  Favorite Chats
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:-rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {favoriteChats && favoriteChats.length > 0 ? (
                      favoriteChats.map((chat) => (
                        <SidebarMenuItem key={chat._id} className="group/item">
                          <div className="flex items-center w-full h-8 px-2 text-sm hover:bg-accent dark:hover:bg-accent/50 rounded-md overflow-hidden">
                            <Link
                              href={`/chat/${chat._id}`}
                              className="truncate flex-1 py-1 transition-all duration-200 group-hover/item:mr-2"
                            >
                              {truncateTitle(chat.title, 20)}
                            </Link>
                            <div className="flex items-center translate-x-[120%] group-hover/item:translate-x-0 transition-transform duration-200 ease-out">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleToggleFavorite(
                                    chat._id,
                                    chat.isFavorite || false,
                                  );
                                }}
                                className="p-1 hover:text-yellow-500 rounded flex-shrink-0"
                              >
                                <Star className="w-3 h-3 fill-current" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDeleteChat(chat._id);
                                }}
                                className="p-1 hover:text-red-500 rounded flex-shrink-0"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </SidebarMenuItem>
                      ))
                    ) : (
                      <div className="text-xs text-muted-foreground px-2 py-1">
                        No favorite chats yet
                      </div>
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>

          {/* Recent Chats */}
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger>
                  Recent Chats
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:-rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {recentChats && recentChats.length > 0 ? (
                      recentChats.map((chat) => (
                        <SidebarMenuItem key={chat._id} className="group/item">
                          <div className="flex items-center w-full h-8 px-2 text-sm hover:bg-accent dark:hover:bg-accent/50 rounded-md overflow-hidden">
                            <Link
                              href={`/chat/${chat._id}`}
                              className="truncate flex-1 py-1 transition-all duration-200 group-hover/item:mr-2"
                            >
                              {truncateTitle(chat.title, 20)}
                            </Link>
                            <div className="flex items-center translate-x-[120%] group-hover/item:translate-x-0 transition-transform duration-200 ease-out">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleToggleFavorite(
                                    chat._id,
                                    chat.isFavorite || false,
                                  );
                                }}
                                className="p-1 hover:text-yellow-500 rounded flex-shrink-0"
                              >
                                <StarOff className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDeleteChat(chat._id);
                                }}
                                className="p-1 hover:text-red-500 rounded flex-shrink-0"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </SidebarMenuItem>
                      ))
                    ) : (
                      <div className="text-xs text-muted-foreground px-2 py-1">
                        No recent chats yet
                      </div>
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        </SidebarContent>

        <SidebarFooter className="p-4 bg-background">
          <Alert
            variant="default"
            className="hover:border-accent-foreground/50 hover:-translate-y-1.5 transition-transform duration-300 ease-out"
          >
            <AlertTitle>Beta Version!</AlertTitle>
            <AlertDescription>
              Expect a lot of bugs at the moment. Will be ironed out in a few
              days
            </AlertDescription>
          </Alert>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}
