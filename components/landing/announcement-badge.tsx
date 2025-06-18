"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "components/ui/button";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { Skeleton } from "../ui/skeleton";

import Link from "next/link";

export function AnnouncementBadge() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center mb-8">
        <Skeleton className="h-9 w-68 rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex justify-center mb-8">
      {user ? (
        // For authenticated users - no link, just the badge
        <Button
          variant="outline"
          className="rounded-full h-auto p-0 overflow-hidden border-0 bg-transparent hover:bg-accent"
        >
          <div className="flex items-center">
            {/* New badge with animated gradient border */}
            <div className="relative inline-flex overflow-hidden rounded-full p-[1px]">
              <span
                className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite]"
                style={{
                  background:
                    "conic-gradient(from 90deg at 50% 50%, var(--obby-purple) 0%, var(--obby-violet) 25%, var(--obby-pink) 50%, var(--obby-orange) 75%, var(--obby-purple) 100%)",
                }}
              />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-accent px-3 py-1 text-xs font-medium text-foreground backdrop-blur-3xl">
                New
              </span>
            </div>

            <div className="px-4 py-2 text-sm text-foreground flex items-center gap-2">
              New users get
              <span className="font-semibold text-emerald-500">
                10 messages a day
              </span>
            </div>
          </div>
        </Button>
      ) : (
        // For non-authenticated users - keep the original with link
        <Button
          asChild
          variant="outline"
          className="rounded-full h-auto p-0 overflow-hidden border-0 bg-transparent hover:bg-accent"
        >
          <Link href={"https://cloneathon.t3.chat/"} target="_blank">
            <div className="flex items-center">
              {/* New badge with animated gradient border */}
              <div className="relative inline-flex overflow-hidden rounded-full p-[1px]">
                <span
                  className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite]"
                  style={{
                    background:
                      "conic-gradient(from 90deg at 50% 50%, var(--obby-purple) 0%, var(--obby-violet) 25%, var(--obby-pink) 50%, var(--obby-orange) 75%, var(--obby-purple) 100%)",
                  }}
                />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-accent px-3 py-1 text-xs font-medium text-foreground backdrop-blur-3xl">
                  WIP
                </span>
              </div>
              <div className="px-4 py-2 text-sm text-foreground flex items-center gap-2">
                Participating in t3 cloneathon
                <span className="font-semibold text-emerald-500">
                  Signups opening soon
                </span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        </Button>
      )}
    </div>
  );
}
