import { UserNav } from "../layout/user-nav";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { SignInButton } from "@/components/app-layout/sign-in-button";
import { Logo } from "../logo";
import Link from "next/link";
import FeedbackModal from "./feedback-dialog";
import { SignUpButton } from "./sign-up-button";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";

export async function Header() {
  const { user, role } = await withAuth();

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-none">
      <div className="flex w-full justify-between pt-2">
        <div className="justify-center flex items-center">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className="pr-9">
          <div className="flex gap-3 items-center">
            {!user && (
              <>
                <Link
                  prefetch
                  href="/pricing"
                  className="text-sm hover:underline"
                >
                  Pricing
                </Link>
                <SignUpButton />
                <SignInButton />
              </>
            )}
            {user && (
              <>
                {!role && (
                  <Link
                    prefetch
                    href="/pricing"
                    className="text-sm hover:underline"
                  >
                    Pricing
                  </Link>
                )}
                <FeedbackModal />
                <Suspense
                  fallback={<Skeleton className="size-7 rounded-full" />}
                >
                  <UserNav user={user} role={role} />
                </Suspense>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
