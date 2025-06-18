"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { atomDark, aquaBlue } from "@codesandbox/sandpack-themes";
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
import { dropCursor, scrollPastEnd } from "@codemirror/view";
import { PrettierWrapper } from "./prettier-plugin";
import { useTheme } from "next-themes";
import {
  ADDITIONAL_DEPENDENCIES,
  BASE_DEPENDENCIES,
  DEV_DEPENDENCIES,
} from "lib/templates/react/dependencies";
import { defaultFiles } from "lib/templates/react/files";
import { rewriteSandpackAliases } from "lib/utils/rewrite-path";

/*
TODO: 
Few issues to solve:
- foldGutter() has a few bugs where it spawns extra chevrons. no idea why that happens
- full height is hiding the buttons. i probably have to use sandpack states
*/

export function CodePanel() {
  const [activeTab, setActiveTab] = useState("code");
  const [mounted, setMounted] = useState(false);

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevents hydration mismatch
  }

  const sandpackFiles = {
    ...rewriteSandpackAliases(defaultFiles),
  };

  return (
    <div className="h-full w-full flex flex-col overflow-clip border border-accent rounded-lg pt-2 bg-accent/30">
      <SandpackProvider
        className="w-full h-full"
        theme={resolvedTheme === "dark" ? atomDark : aquaBlue}
        files={sandpackFiles}
        customSetup={{
          entry: "/src/main.tsx",
          dependencies: {
            ...BASE_DEPENDENCIES,
            ...ADDITIONAL_DEPENDENCIES,
          },
          devDependencies: {
            ...DEV_DEPENDENCIES,
          },
        }}
        options={{
          externalResources: [
            "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
          ],
          classes: {
            "sp-tabs": "background-color:bg-[#fff];",
          },
          recompileMode: "immediate",
          recompileDelay: 0,
          autorun: true,
          autoReload: true,
        }}
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
              <SandpackFileExplorer
                initialCollapsedFolder={[
                  "/src/components/",
                  "/src/components/ui/",
                  "/src/hooks/",
                  "/src/lib/",
                  "/src/pages/",
                ]}
              />

              <PrettierWrapper>
                <SandpackCodeEditor
                  showRunButton
                  showTabs={false}
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
                    bracketMatching(),
                    indentOnInput(),
                  ]}
                  extensionsKeymap={[
                    ...completionKeymap,
                    ...closeBracketsKeymap,
                    ...defaultKeymap,
                    ...historyKeymap,
                  ]}
                  style={{ height: "80vh" }}
                />
              </PrettierWrapper>
            </SandpackLayout>
          </TabsContent>

          <TabsContent value="preview" className="overflow-auto">
            <SandpackLayout style={{ borderRadius: "0 0 0.5rem 0.5rem" }}>
              <SandpackPreview
                autoSave="true"
                showOpenNewtab
                showNavigator
                showRefreshButton
                showOpenInCodeSandbox={true}
                style={{ height: "80vh" }}
              />
            </SandpackLayout>
          </TabsContent>

          <TabsContent value="console" className="overflow-auto">
            <SandpackLayout style={{ borderRadius: "0 0 0.5rem 0.5rem" }}>
              <SandpackConsole style={{ height: "80vh" }} />
            </SandpackLayout>
          </TabsContent>
        </Tabs>
      </SandpackProvider>
    </div>
  );
}
