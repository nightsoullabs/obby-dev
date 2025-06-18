import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <div className="relative">
      <div className="absolute left-9 bottom-5">
        <p className="text-sm">
          Made with 💙 by{" "}
          <Link href="https://www.workos.com" className="hover:underline">
            WorkOS
          </Link>
        </p>
      </div>
      <div className="absolute right-9 bottom-5">
        <Link href="https://github.com/workos/b2b-starter-kit">
          <Image
            src="/logos/github_logo.svg"
            alt="Find on GitHub"
            width={24}
            height={24}
          />
        </Link>
      </div>
    </div>
  );
}
