import { SidebarToggle } from "components/app-layout/sidebar-toggle";
import { HeroSection } from "./landing/hero-section";
import { LandingChatInput } from "./landing/landing-chat-input";
import { LowProfileFooter } from "./landing/low-profile-footer";

export function MainContent() {
  return (
    <div className="flex flex-col bg-accent/30 border-2 border-accent h-full w-full rounded-lg shadow-sm">
      <header className="flex h-16 items-center gap-4 px-6">
        <SidebarToggle />
      </header>
      <main className="flex-1 p-6">
        <div className="space-y-6">
          <div className="max-w-3xl mx-auto">
            <HeroSection />
            <div className="mt-8">
              <LandingChatInput />
            </div>
          </div>
        </div>
      </main>
      <LowProfileFooter />
    </div>
  );
}
