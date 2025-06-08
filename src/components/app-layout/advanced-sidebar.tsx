// not using this atm as it messes up sidebar behavior
// I do want the floating sidebar somehow

"use client";

import {
  Clock,
  LayoutGrid,
  ChevronRight,
  ChevronDown,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { useEffect, useRef, useState } from "react";

// Sample data matching your design
const navigationItems = [
  {
    title: "History",
    icon: Clock,
    url: "#",
  },
  {
    title: "Projects",
    icon: LayoutGrid,
    url: "#",
  },
  // {
  //   title: "Community",
  //   icon: Users,
  //   url: "#",
  // },
];

const favoriteProjects = ["Design System", "Mobile App", "Landing Page"];

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
];

export function AppSidebar() {
  const { state } = useSidebar();
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsVisible(true);
    // Small delay to ensure the element is rendered before sliding in
    setTimeout(() => setIsHovering(true), 10);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovering(false);
      // Keep visible for animation out
      setTimeout(() => setIsVisible(false), 200);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Hover trigger area when collapsed */}
      {state === "collapsed" && (
        <div
          className="fixed left-0 top-0 w-8 h-full z-40"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}

      {/* Floating sidebar overlay when collapsed and hovering */}
      {state === "collapsed" && isVisible && (
        <div
          className="fixed inset-0 z-50 pointer-events-none"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Sliding sidebar */}
          <div
            className={`absolute left-0 top-0 bottom-10 w-64 pointer-events-auto transform transition-transform duration-300 ease-out ${
              isHovering ? "translate-x-0" : "-translate-x-full"
            }`}
            style={{
              transform:
                isVisible && !isHovering ? "translateX(-100%)" : undefined,
            }}
          >
            <div className="h-full bg-background border-r border-border overflow-hidden my-4 rounded-xl">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-4 border-b border-border/50">
                  <Button
                    variant="outline"
                    className="w-full justify-center h-12 bg-background/50 border-border/50 hover:bg-accent/50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Chat
                  </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 py-2">
                  {/* Main Navigation */}
                  <div className="space-y-1 mb-6">
                    {navigationItems.map((item) => (
                      <a
                        key={item.title}
                        href={item.url}
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent/50 transition-colors"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </a>
                    ))}
                  </div>

                  {/* Favorite Projects */}
                  <div className="mb-6">
                    <Collapsible defaultOpen={false}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                        Favorite Projects
                        <ChevronRight className="w-4 h-4 transition-transform group-data-[state=open]:rotate-90" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="space-y-1 mt-2">
                          {favoriteProjects.map((project) => (
                            <a
                              key={project}
                              href="/"
                              className="block px-3 py-1.5 text-sm rounded-md hover:bg-accent/50 transition-colors"
                            >
                              {project}
                            </a>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>

                  {/* Favorite Chats */}
                  <div className="mb-6">
                    <Collapsible defaultOpen={false}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                        Favorite Chats
                        <ChevronRight className="w-4 h-4 transition-transform group-data-[state=open]:rotate-90" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="space-y-1 mt-2">
                          {favoriteChats.map((chat) => (
                            <a
                              key={chat}
                              href="/"
                              className="block px-3 py-1.5 text-sm rounded-md hover:bg-accent/50 transition-colors"
                            >
                              {chat}
                            </a>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>

                  {/* Recents */}
                  <div>
                    <Collapsible defaultOpen={true}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                        Recents
                        <ChevronDown className="w-4 h-4 transition-transform group-data-[state=closed]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="space-y-1 mt-2">
                          {recentItems.map((item) => (
                            <a
                              key={item}
                              href="/"
                              className="block px-3 py-1.5 text-sm rounded-md hover:bg-accent/50 transition-colors"
                            >
                              {item}
                            </a>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border/50">
                  <div className="bg-background/50 border border-border/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">New Feature</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Introducing GitHub sync on v0
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regular sidebar when expanded */}
      {state === "expanded" && (
        <Sidebar
          variant="sidebar"
          collapsible="offcanvas"
          className="border-none"
        >
          <SidebarHeader className="p-4 bg-background">
            <Button
              variant="outline"
              className="w-full justify-center h-12 bg-background/50 border-border/50 hover:bg-accent/50"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </SidebarHeader>

          <SidebarContent className="px-4 bg-background">
            {/* Main Navigation */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className="h-10">
                        <a href={item.url}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Favorite Projects */}
            <SidebarGroup>
              <Collapsible defaultOpen={false}>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                    Favorite Projects
                    <ChevronRight className="w-4 h-4 transition-transform group-data-[state=open]:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {favoriteProjects.map((project) => (
                        <SidebarMenuItem key={project}>
                          <SidebarMenuButton asChild className="h-8 text-sm">
                            <a href="/">{project}</a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            </SidebarGroup>

            {/* Favorite Chats */}
            <SidebarGroup>
              <Collapsible defaultOpen={false}>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                    Favorite Chats
                    <ChevronRight className="w-4 h-4 transition-transform group-data-[state=open]:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {favoriteChats.map((chat) => (
                        <SidebarMenuItem key={chat}>
                          <SidebarMenuButton asChild className="h-8 text-sm">
                            <a href="/">{chat}</a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            </SidebarGroup>

            {/* Recents */}
            <SidebarGroup>
              <Collapsible defaultOpen={true}>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                    Recents
                    <ChevronDown className="w-4 h-4 transition-transform group-data-[state=closed]:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {recentItems.map((item) => (
                        <SidebarMenuItem key={item}>
                          <SidebarMenuButton asChild className="h-8 text-sm">
                            <a href="/">{item}</a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 bg-background">
            <div className="bg-background/50 border-border/50 hover:bg-accent/50 border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">New Feature</span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Introducing GitHub sync on v0
              </p>
            </div>
          </SidebarFooter>
        </Sidebar>
      )}
    </>
  );
}
