"use client";

import { Alert, AlertDescription, AlertTitle } from "components/ui/alert";
import { Clock, Users, ChevronDown, Plus } from "lucide-react";
import { Button } from "components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "components/ui/sidebar";
import { generateArrayKey } from "lib/utils/array-utils";
import Link from "next/link";

// Sample data matching your design
const navigationItems = [
  {
    title: "History",
    icon: Clock,
    url: "#",
  },
  {
    title: "Community",
    icon: Users,
    url: "#",
  },
];

// const favoriteProjects = ["Design System", "Mobile App", "Landing Page"];

const favoriteChats = ["Team Discussion", "Client Feedback", "Project Updates"];

const recentItems = [
  "Modernize login page",
  "Neovim config template",
  "Fork of Reducing sidebar ...",
  "Stock penguins landing",
  "Company metrics compon...",
  "Simplify UI layout",
  "Financial page structure",
  "Shadcn carousel page",
  "FMP API Issue",
  "Newcomos-Dashboard",
  "Stock screener API",
  "Next.js web app builder",
  "Modernize login page",
  "Neovim config template",
  "Fork of Reducing sidebar ...",
  "Stock penguins landing",
  "Company metrics compon...",
  "Simplify UI layout",
  "Financial page structure",
  "Shadcn carousel page",
  "FMP API Issue",
  "Newcomos-Dashboard",
  "Stock screener API",
  "Next.js web app builder",
];

export function AppSidebar() {
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]! border-none">
      <SidebarHeader className="p-4 bg-background">
        <Button
          variant="outline"
          className="h-9 w-full justify-center bg-background/50 border-border/50 hover:bg-accent/50"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
        {/* Main Navigation */}
        {navigationItems.map((item) => (
          <Link
            key={item.title}
            href={item.url}
            className="h-9 w-full flex items-center gap-2 text-sm font-medium text-muted-foreground
              hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-md px-2"
          >
            <item.icon className="w-4 h-4" />
            <span>{item.title}</span>
          </Link>
        ))}
      </SidebarHeader>

      <SidebarContent className="px-4 bg-background">
        {/* Favorite Chats */}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Favorite Chats
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:-rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {favoriteChats.map((chat) => (
                    <SidebarMenuItem key={chat}>
                      <SidebarMenuButton
                        asChild
                        className="h-8 text-sm hover:bg-accent dark:hover:bg-accent/50"
                      >
                        <a href="/">{chat}</a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Recents */}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Recents
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:-rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {recentItems.map((item, index) => (
                    <SidebarMenuItem key={generateArrayKey(index)}>
                      <SidebarMenuButton
                        asChild
                        className="h-8 text-sm  hover:bg-accent dark:hover:bg-accent/50"
                      >
                        <a href="/">{item}</a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-background">
        <Alert
          variant="default"
          className="hover:border-accent-foreground/50 hover:-translate-y-1.5 transition-transform duration-300 ease-out"
        >
          <AlertTitle>New Feature!</AlertTitle>
          <AlertDescription>Introducing GitHub sync on Obby</AlertDescription>
        </Alert>
      </SidebarFooter>
    </Sidebar>
  );
}
