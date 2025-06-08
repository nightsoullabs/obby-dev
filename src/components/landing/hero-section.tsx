import Image from "next/image";
import { AnnouncementBadge } from "./announcement-badge";

export function HeroSection() {
  return (
    <div className="text-center space-y-6 mb-12">
      <AnnouncementBadge />
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight flex items-center justify-center gap-1">
          Build something with
          <span className="inline-flex items-center">
            <Image
              src="/logos/obby/obby-logo-min.webp"
              className="inline-block mr-1"
              alt="Obby Logo"
              width={56}
              height={56}
            />
            <span>Obby</span>
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create full-stack applications, mobile apps, and websites by simply
          describing what you want to build
        </p>
      </div>
    </div>
  );
}
