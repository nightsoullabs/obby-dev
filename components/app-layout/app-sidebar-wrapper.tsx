"use client";

import { AppSidebar } from "./app-sidebar";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function AppSidebarWrapper() {
  const { user } = useAuth();

  const convexUser = useQuery(
    api.users.getByWorkOSIdQuery,
    user ? { workos_id: user.id } : "skip",
  );

  return <AppSidebar userId={convexUser?._id} isAuthenticated={!!user} />;
}
