"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

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

const initialFiles = {
  "/App.js": `import React from 'react';

export default function App() {
  return <h1>Hello world</h1>
}
`,
  "/index.js": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
  "/package.json": `{
  "name": "react-playground",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}`,
};

/*
TODO: 
Few issues to solve:
- foldGutter() has a few bugs where it spawns extra chevrons. no idea why that happens
- full height is hiding the buttons. i probably have to use sandpack states
*/

export function CodePanel() {
  const [activeTab, setActiveTab] = useState("code");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save operation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="h-full w-full flex flex-col overflow-clip border border-accent rounded-lg pt-2 bg-accent/30">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-transparent flex justify-between items-center px-2">
          <div className="flex items-center gap-2">
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="console">Console</TabsTrigger>
          </div>
          {activeTab === "code" && (
            <Button
              variant="ghost"
              size="sm"
              disabled={isSaving}
              onClick={handleSave}
              className="h-7 px-2"
            >
              {isSaving ? (
                <>
                  <div className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="size-3 mr-2" />
                  Save
                </>
              )}
            </Button>
          )}
        </TabsList>

        <SandpackProvider
          files={initialFiles}
          theme={atomDark}
          template="react"
        >
          <TabsContent value="code" className="overflow-auto">
            <SandpackLayout
              style={{
                borderRadius: "0 0 0.5rem 0.5rem",
              }}
            >
              <SandpackFileExplorer style={{ height: "100vh" }} />
              <SandpackCodeEditor
                showRunButton
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
        </SandpackProvider>
      </Tabs>
    </div>
  );
}
