"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/_generated/api";
import type { Id } from "@/convex/_generated/_generated/dataModel";
import { UserNav } from "../layout/user-nav";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { Logo } from "../logo";
import Link from "next/link";
import FeedbackModal from "../app-layout/feedback-dialog";

export function DynamicChatHeader() {
  const params = useParams();
  const chatId = params?.id as Id<"chats"> | undefined;
  const { user, loading } = useAuth();

  // Load chat data if chatId is available
  const chatData = useQuery(
    api.chats.getChatById,
    chatId ? { id: chatId } : "skip",
  );

  if (loading) {
    return (
      <header className="bg-background flex w-full items-center border-none">
        <div className="flex w-full justify-between pt-2">
          <div className="justify-center flex items-center">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <div className="pr-9">
            <div className="h-8 w-8 animate-pulse bg-muted rounded-full" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-background flex w-full items-center border-none">
      <div className="flex w-full justify-between pt-2">
        <div className="justify-center flex items-center gap-4">
          <Link href="/">
            <Logo />
          </Link>
          {chatData && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">/</span>
              <h1 className="font-medium text-foreground">{chatData.title}</h1>
            </div>
          )}
        </div>
        <div className="pr-9">
          <div className="flex gap-3 items-center">
            <FeedbackModal />
            {user && <UserNav user={user} />}
          </div>
        </div>
      </div>
    </header>
  );
}
