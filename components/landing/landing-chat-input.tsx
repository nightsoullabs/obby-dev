"use client";

import type React from "react";
import { useRef, useState, useCallback } from "react";
import { Button } from "components/ui/button";
import { Textarea } from "components/ui/textarea";
import { ArrowUp, Paperclip, X, Sparkles } from "lucide-react";
import { ModelSelector } from "./model-selector";
import { cn } from "lib/utils";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { useRouter } from "next/navigation";
import { createChatFromMessage } from "@/actions/createChat";
import { AuthDialog } from "components/ai/fragments/auth-dialog";

type Attachment = {
  url: string;
  name: string;
  contentType: string;
  file: File;
};

export function LandingChatInput({ className }: { className?: string }) {
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadQueue, setUploadQueue] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthDialogOpen, setAuthDialog] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, loading } = useAuth();
  const router = useRouter();

  // Auto-resize textarea
  const adjustHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  // Handle file selection
  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      if (!files.length) return;

      // Add to upload queue
      setUploadQueue(files.map((file) => file.name));

      // Process files
      setTimeout(() => {
        const newAttachments = files.map((file) => ({
          url: URL.createObjectURL(file),
          name: file.name,
          contentType: file.type,
          file,
        }));

        setAttachments((prev) => [...prev, ...newAttachments]);
        setUploadQueue([]);

        // Reset file input
        if (event.target) {
          event.target.value = "";
        }
      }, 500);
    },
    [],
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!input.trim() && !attachments.length) return;

      if (!user || loading) {
        setAuthDialog(true);
        return;
      }

      setIsSubmitting(true);

      try {
        // Create chat with message and files
        const files = attachments.map((attachment) => attachment.file);
        const result = await createChatFromMessage({
          message: input,
          files: files.length > 0 ? files : undefined,
        });

        if (result.success && result.chatId) {
          // Navigate to the new chat
          router.push(`/chat/${result.chatId}`);
        }
      } catch (error) {
        console.error("Failed to create chat:", error);
        // You might want to show a toast or error message here
      } finally {
        setIsSubmitting(false);
      }
    },
    [input, attachments, user, loading, router],
  );

  const handlePromptRewrite = useCallback(() => {
    if (!input.trim()) return;
    // You can implement prompt rewrite functionality here
    console.log("Rewriting prompt:", input);
  }, [input]);

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (!isSubmitting) {
        handleSubmit(e);
      }
    }
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      // Clean up URL object
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <>
      <AuthDialog open={isAuthDialogOpen} setOpen={setAuthDialog} />
      <div className={cn("relative w-full flex flex-col gap-4", className)}>
        {/* Hidden file input */}
        <input
          type="file"
          className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
          ref={fileInputRef}
          multiple
          accept="image/*"
          onChange={handleFileChange}
          tabIndex={-1}
        />

        {/* Attachment previews */}
        {(attachments.length > 0 || uploadQueue.length > 0) && (
          <div className="flex flex-row gap-2 overflow-x-auto items-end">
            {attachments.map((attachment, index) => (
              <div
                key={`${attachment.name}-${index}`}
                className="relative group flex-shrink-0 w-24 h-24 rounded-md border border-border overflow-hidden bg-muted"
              >
                {attachment.contentType.startsWith("image/") ? (
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-center p-2">
                    {attachment.name}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {uploadQueue.map((filename) => (
              <div
                key={filename}
                className="flex-shrink-0 w-24 h-24 rounded-md border border-border overflow-hidden bg-muted flex items-center justify-center"
              >
                <div className="text-xs text-center p-2">
                  <div className="animate-pulse">{filename}</div>
                  <div className="mt-2 text-muted-foreground">Uploading...</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input area */}
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            ref={textareaRef}
            placeholder="Ask Obby to build..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              adjustHeight();
            }}
            onKeyDown={handleKeyDown}
            className="min-h-[120px] max-h-[calc(75vh)] overflow-y-auto resize-none rounded-2xl text-base bg-muted pb-16 pr-4 focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-muted-foreground/50"
            disabled={isSubmitting}
          />

          {/* Bottom toolbar */}
          <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Model selector */}
              <ModelSelector />
            </div>
            <div className="flex items-center gap-2">
              {/* Prompt rewrite button */}
              <Button
                type="button"
                onClick={handlePromptRewrite}
                disabled={!input.trim() || isSubmitting}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-accent"
              >
                <Sparkles className="h-4 w-4" />
              </Button>
              {/* Attachment button */}
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-accent"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              {/* Send button */}
              <Button
                type="submit"
                disabled={
                  (!input.trim() && !attachments.length) ||
                  isSubmitting ||
                  uploadQueue.length > 0
                }
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
