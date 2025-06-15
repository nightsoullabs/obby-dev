"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { atomDark } from "@codesandbox/sandpack-themes";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackFileExplorer,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
} from "@codesandbox/sandpack-react";
import {
  autocompletion,
  closeBrackets,
  completionKeymap,
  closeBracketsKeymap,
} from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import {
  bracketMatching,
  foldGutter,
  indentOnInput,
  indentUnit,
} from "@codemirror/language";
import { drawSelection, dropCursor, scrollPastEnd } from "@codemirror/view";
import { PrettierWrapper } from "./prettier-plugin";

/*
TODO: 
Few issues to solve:
- foldGutter() has a few bugs where it spawns extra chevrons. no idea why that happens
- full height is hiding the buttons. i probably have to use sandpack states
*/

export function CodePanel() {
  const [activeTab, setActiveTab] = useState("code");

  return (
    <div className="h-full w-full flex flex-col overflow-clip border border-accent rounded-lg pt-2 bg-accent/30">
      <SandpackProvider
        // files={initialFiles}
        theme={atomDark}
        template="react-ts"
        // customSetup={{
        //   dependencies: repoDependencies.dependencies,
        //   devDependencies: repoDependencies.devDependencies,
        //   // environment: "create-react-app-typescript",
        // }}
        // files={repoData.files}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent flex justify-between items-center px-2">
            <div className="flex items-center gap-2">
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="console">Console</TabsTrigger>
            </div>
            {/* {activeTab === "code" && <SandpackRefreshButton />} */}
          </TabsList>

          <TabsContent value="code" className="overflow-auto">
            <SandpackLayout
              style={{
                borderRadius: "0 0 0.5rem 0.5rem",
              }}
            >
              <SandpackFileExplorer style={{ height: "100vh" }} />
              <PrettierWrapper>
                <SandpackCodeEditor
                  showTabs
                  closableTabs
                  showLineNumbers
                  showInlineErrors
                  wrapContent
                  extensions={[
                    indentUnit.of("\t"),
                    bracketMatching(),
                    foldGutter(),
                    history(),
                    indentOnInput(),
                    autocompletion({ closeOnBlur: false }),
                    closeBrackets(),
                    scrollPastEnd(),
                    dropCursor(),
                    drawSelection(),
                    bracketMatching(),
                    indentOnInput(),
                  ]}
                  extensionsKeymap={[
                    ...completionKeymap,
                    ...closeBracketsKeymap,
                    ...defaultKeymap,
                    ...historyKeymap,
                  ]}
                  style={{ height: "100vh" }}
                />
              </PrettierWrapper>
            </SandpackLayout>
          </TabsContent>

          <TabsContent value="preview" className="overflow-auto">
            <SandpackLayout style={{ borderRadius: "0 0 0.5rem 0.5rem" }}>
              <SandpackPreview
                autoSave="true"
                showOpenNewtab
                // showNavigator
                showRefreshButton
                showOpenInCodeSandbox={true}
                style={{ height: "100vh" }}
              />
            </SandpackLayout>
          </TabsContent>

          <TabsContent value="console" className="overflow-auto">
            <SandpackLayout style={{ borderRadius: "0 0 0.5rem 0.5rem" }}>
              <SandpackConsole style={{ height: "100vh" }} />
            </SandpackLayout>
          </TabsContent>
        </Tabs>
      </SandpackProvider>
    </div>
  );
}
