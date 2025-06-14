import { UserNav } from "../layout/user-nav";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { Logo } from "../logo";
import Link from "next/link";
import FeedbackModal from "../app-layout/feedback-dialog";

export async function ChatPageHeader() {
  const { user, role } = await withAuth({ ensureSignedIn: true });

  return (
    <header className="bg-background flex w-full items-center border-none">
      <div className="flex w-full justify-between pt-2">
        <div className="justify-center flex items-center">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className="pr-9">
          <div className="flex gap-3 items-center">
            <FeedbackModal />
            <UserNav user={user} role={role} />
          </div>
        </div>
      </div>
    </header>
  );
}
