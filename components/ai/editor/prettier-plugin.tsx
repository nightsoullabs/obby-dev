"use client";

import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { useSandpack } from "@codesandbox/sandpack-react";
import { Button } from "components/ui/button";
import { Check, AlertTriangle } from "lucide-react";

import { format } from "prettier/standalone";
import babelPlugin from "prettier/plugins/babel";
import htmlPlugin from "prettier/plugins/html";
import postcssPlugin from "prettier/plugins/postcss";
import typescriptPlugin from "prettier/plugins/typescript";
import estreePlugin from "prettier/plugins/estree";

// Prettier Plugin Button Component
export function PrettierPlugin() {
  const { error, success, prettifyCode } = usePrettier();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={prettifyCode}
      title="Format code with Prettier (Ctrl/Cmd+S)"
      className="absolute top-2 right-2 z-10 h-8 px-2 text-xs gap-1"
      style={{
        color: error ? "#ef4444" : success ? "#22c55e" : "#808080",
      }}
    >
      {error ? <AlertTriangle size={12} /> : <Check size={12} />}
      Prettier
    </Button>
  );
}

// Prettier Plugin Wrapper - conditionally shows the button
export function PrettierWrapper({ children }: { children: React.ReactNode }) {
  const { prettier } = useIsPrettier();

  return (
    <>
      {prettier && <PrettierPlugin />}
      {children}
    </>
  );
}

// Hook to check if Prettier is supported for current file
const useIsPrettier = () => {
  const [prettier, setPrettier] = useState(false);
  const { sandpack } = useSandpack();

  useEffect(() => {
    const activeFile = sandpack.files[sandpack.activeFile];
    if (!activeFile) return;

    const fileExtension = sandpack.activeFile.split(".").pop()?.toLowerCase();
    if (!fileExtension) return;

    const prettierExtensions = [
      "js",
      "ts",
      "jsx",
      "tsx",
      "scss",
      "css",
      "html",
    ];
    const isPrettierSupported = !(
      activeFile.readOnly || !prettierExtensions.includes(fileExtension)
    );

    setPrettier(isPrettierSupported);
  }, [sandpack.files, sandpack.activeFile]);

  return { prettier };
};

// Hook to handle Prettier formatting
const usePrettier = () => {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const { sandpack } = useSandpack();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        prettifyCode();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const debouncedUpdate = useCallback(
    debounce((code: string) => {
      sandpack.updateCurrentFile(code, false);
    }, 150),
    [],
  );

  const prettifyCode = async () => {
    const activeFile = sandpack.files[sandpack.activeFile];
    const currentCode = activeFile.code;

    try {
      const fileExtension = sandpack.activeFile.split(".").pop()?.toLowerCase();
      let formattedCode = currentCode;

      if (fileExtension === "scss" || fileExtension === "css") {
        formattedCode = await format(currentCode, {
          parser: "scss",
          plugins: [postcssPlugin],
        });
      } else if (fileExtension === "html") {
        formattedCode = await format(currentCode, {
          parser: "html",
          plugins: [htmlPlugin],
        });
      } else {
        formattedCode = await format(currentCode, {
          parser:
            fileExtension === "ts" || fileExtension === "tsx"
              ? "typescript"
              : "babel",
          plugins: [babelPlugin, typescriptPlugin, estreePlugin],
        });
      }

      setError(false);
      setSuccess(true);
      debouncedUpdate(formattedCode);
    } catch (err) {
      setError(true);
      console.error("Prettier formatting error:", err);
    } finally {
      setTimeout(() => {
        setSuccess(false);
      }, 500);
    }
  };

  return { error, success, prettifyCode };
};
