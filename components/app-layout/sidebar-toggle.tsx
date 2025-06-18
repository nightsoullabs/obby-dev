"use client";

import { PanelLeft } from "lucide-react";
import { Button } from "components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/ui/tooltip";
import { useSidebar } from "components/ui/sidebar";
import { useEffect } from "react";

export function SidebarToggle() {
  const { toggleSidebar, state } = useSidebar();

  // handles keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "b") {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // copied this straight outta v0
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            <PanelLeft className={"h-4 w-4"} />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="flex items-center gap-3 bg-foreground text-background border-0 px-4 py-2 rounded-lg shadow-lg"
          sideOffset={8}
        >
          <span className="font-medium">
            {state === "expanded" ? "Collapse" : "Expand"} Sidebar
          </span>
          <div className="flex items-center gap-1">
            <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded bg-background/20 px-2 font-mono text-xs font-medium text-background">
              ⌘
            </kbd>
            <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded bg-background/20 px-2 font-mono text-xs font-medium text-background">
              B
            </kbd>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
