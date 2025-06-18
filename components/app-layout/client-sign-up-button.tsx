"use client";

import { Button } from "components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import Link from "next/link";
import { cn } from "lib/utils";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import signOut from "@/actions/signOut";

export function ClientSignUpButton({ large }: { large?: boolean }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Button
        disabled
        variant="outline"
        className={cn(large ? "h-10" : "h-8", "justify-center")}
      >
        Loading...
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex gap-3 items-center">
        <form action={signOut}>
          <Button type="submit" className={cn(large ? "h-10" : "h-8")}>
            Sign Out
          </Button>
        </form>
        <a href="/dashboard">
          <Avatar className={large ? "h-10 w-10" : "h-8 w-8"}>
            <AvatarImage src={user.profilePictureUrl as string} />
            <AvatarFallback>{user.firstName?.[0] || ""}</AvatarFallback>
          </Avatar>
        </a>
      </div>
    );
  }

  return (
    <Button
      asChild
      variant="outline"
      className={cn(large ? "h-10" : "h-8", "justify-center")}
    >
      <Link href="/register">Sign Up</Link>
    </Button>
  );
}
