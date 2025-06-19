import Image from "next/image";
import { AnnouncementBadge } from "./announcement-badge";

export function HeroSection() {
  return (
    <div className="text-center space-y-6 mb-12 px-4">
      <AnnouncementBadge />
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
          <span className="block sm:inline">Build something with</span>
          <span className="inline-flex items-center justify-center gap-1 sm:gap-2 mt-2 sm:mt-0 sm:ml-3">
            <Image
              src="/logos/obby/obby-logo-min.webp"
              className="inline-block"
              alt="Obby Logo"
              width={40}
              height={40}
              sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, (max-width: 1024px) 56px, 64px"
              style={{
                width: "clamp(40px, 8vw, 64px)",
                height: "clamp(40px, 8vw, 64px)",
              }}
            />
            <span>Obby</span>
          </span>
        </h1>
        <p className="text-lg sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
          Open source v0 alternative. Create beautiful React components by
          simply describing what you want to build.
        </p>
      </div>
    </div>
  );
}
