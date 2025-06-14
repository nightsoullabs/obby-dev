"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackFileExplorer,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
} from "@codesandbox/sandpack-react";
import { atomDark } from "@codesandbox/sandpack-themes";
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";

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
    <div className="h-full flex flex-col border rounded-lg">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-transparent flex justify-between items-center border">
          <div className="flex items-center gap-2">
            <TabsTrigger
              value="code"
              className="data-[state=active]:bg-muted data-[state=active]:shadow-sm rounded-lg"
            >
              Code
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-muted data-[state=active]:shadow-sm rounded-lg"
            >
              Preview
            </TabsTrigger>
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
          template="nextjs"
        >
          <TabsContent value="code">
            <SandpackLayout>
              <SandpackFileExplorer />
              <SandpackCodeEditor
                showTabs
                closableTabs
                showLineNumbers
                showInlineErrors
                wrapContent
                extensions={[autocompletion()]}
                extensionsKeymap={[...completionKeymap]}
              />
              <SandpackConsole />
            </SandpackLayout>
          </TabsContent>

          <TabsContent value="preview">
            <SandpackPreview
              showOpenInCodeSandbox={false}
              showRefreshButton={true}
            />
          </TabsContent>
        </SandpackProvider>
      </Tabs>
    </div>
  );
}
