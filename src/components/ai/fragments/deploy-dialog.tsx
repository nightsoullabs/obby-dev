// import { publish } from '@/app/actions/publish'
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// import { usePostHog } from 'posthog-js/react'
import { useEffect, useState } from "react";
import Image from "next/image";

export function DeployDialog({
  url,
  sbxId: _1,
  teamID: _2,
  accessToken: _3,
}: {
  url: string;
  sbxId: string;
  teamID: string | undefined;
  accessToken: string | undefined;
}) {
  // const posthog = usePostHog()

  const [_publishedURL, setPublishedURL] = useState<string | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
  useEffect(() => {
    setPublishedURL(null);
  }, [url]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default">
          <Image
            src={"/logos/vercel_logo.svg"}
            width={16}
            height={16}
            className="mr-2"
            alt="Vercel"
          />
          Deploy to Vercel (Soon)
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-4 w-80 flex flex-col gap-2">
        <div className="text-sm font-semibold">
          <Image
            src={"/logos/vercel_logo.svg"}
            width={28}
            height={28}
            className="mr-2 bg-white rounded-full"
            alt="Vercel"
          />
          Deploy to Vercel
        </div>
        <div className="text-sm text-muted-foreground">
          You will be able to connect to your vercel account, and deploy this
          project soon.
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
