"use client";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

import { ChatPanel } from "./chat/chat-panel";
import { CodePanel } from "./editor/code-panel";

export function EditorClient() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full w-full font-mono p-2"
    >
      <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
        <ChatPanel />
      </ResizablePanel>

      <ResizableHandle className="bg-transparent hover:bg-accent rounded-full transition-colors mx-0.5 my-2 w-0.5" />
      <ResizablePanel defaultSize={70} minSize={40}>
        <CodePanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
