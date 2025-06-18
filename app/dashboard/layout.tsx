import { DashboardNav } from "components/layout/dashboard/dashboard-nav";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js B2B Starter Kit Dashboard",
  description:
    "Fully featured B2B dashboard with Next.js, shadcn/ui, and WorkOS",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="ml-9 mr-9 pt-5 gap-3 flex border-t border-border bg-muted/50">
      <DashboardNav />
      {children}
    </div>
  );
}
