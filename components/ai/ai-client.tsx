"use client";

import { AuthDialog } from "./fragments/auth-dialog";
import { Chat } from "./fragments/chat";
import { ChatInput } from "./fragments/chat-input";
import { ChatPicker } from "./fragments/chat-picker";
import { ChatSettings } from "./fragments/chat-settings";
import { Preview } from "./fragments/preview";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { type Message, toAISDKMessages, toMessageImage } from "lib/ai/messages";
import { AI_MODELS, type ModelInfo } from "lib/ai/models";
import { type FragmentSchema, fragmentSchema as schema } from "lib/fragment";
import templates, { type TemplateId } from "lib/templates";
import type { ExecutionResult } from "lib/types";
import type { DeepPartial } from "ai";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import type { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// import { usePostHog } from "posthog-js/react";
import { type SetStateAction, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { toast } from "sonner";

interface AIClientProps {
  chatId?: Id<"chats">;
  initialChatData?: {
    _id: Id<"chats">;
    _creationTime: number;
    user_id: Id<"users">;
    title: string;
    messages: Message[];
    fileData?: unknown;
    fragments?: DeepPartial<FragmentSchema>[];
    visibility: "private" | "public";
  };
}

export default function AIClient({ chatId, initialChatData }: AIClientProps) {
  const [chatInput, setChatInput] = useLocalStorage("chat", "");
  const [files, setFiles] = useState<File[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<"auto" | TemplateId>(
    "auto",
  );
  const [languageModel, setLanguageModel] = useLocalStorage<ModelInfo>(
    "languageModel",
    {
      id: "obbylabs:fast-chat",
    },
  );

  //   const posthog = usePostHog();

  const [result, setResult] = useState<ExecutionResult>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [fragment, setFragment] = useState<DeepPartial<FragmentSchema>>();
  const [currentTab, setCurrentTab] = useState<"code" | "fragment">("code");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isAuthDialogOpen, setAuthDialog] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user, loading } = useAuth();

  // Convex mutations for chat persistence
  const updateChatMessages = useMutation(api.chats.addMessageToChat);
  const addMessageWithFragment = useMutation(api.chats.addMessageWithFragment);

  // Real-time chat data from Convex
  const chatData = useQuery(
    api.chats.watchChat,
    chatId ? { id: chatId } : "skip",
  );

  const currentModel = AI_MODELS.find((model) => model.id === languageModel.id);

  // Use real-time data from Convex, fallback to initial data and local state
  const effectiveMessages: Message[] =
    (chatData?.messages as Message[]) || initialChatData?.messages || messages;
  const lastMessage = effectiveMessages[effectiveMessages.length - 1];

  const { object, submit, isLoading, stop, error } = useObject({
    api: "/api/chat",
    schema,
    onError: (error) => {
      console.error("Error submitting request:", error);
      if (error.message.includes("limit")) {
        setIsRateLimited(true);
      }

      setErrorMessage(error.message);
    },
    onFinish: async ({ object: fragment, error }) => {
      if (!error && fragment) {
        console.log("fragment", fragment);
        setIsPreviewLoading(true);

        // Create assistant message with fragment
        const assistantMessage: Message = {
          role: "assistant" as const,
          content: [
            { type: "text" as const, text: fragment.commentary || "" },
            { type: "code" as const, text: fragment.code || "" },
          ],
          object: fragment,
        };

        // Save message and fragment to database atomically
        if (chatId) {
          try {
            await addMessageWithFragment({
              id: chatId,
              message: assistantMessage,
              fragment: fragment,
            });
          } catch (error) {
            console.error("Failed to save message with fragment:", error);
          }
        } else {
          // Fallback to local state if no chatId
          addMessage(assistantMessage);
        }

        // Continue with sandbox creation
        try {
          const response = await fetch("/api/sandbox", {
            method: "POST",
            body: JSON.stringify({
              fragment,
              userID: user?.id,
            }),
          });

          if (!response.ok) {
            console.error("Sandbox creation failed:", response.status);
            setCurrentPreview({ fragment, result: undefined });
            setCurrentTab("fragment");
            setIsPreviewLoading(false);
            return;
          }

          const result = await response.json();
          console.log("result", result);

          setResult(result);
          setCurrentPreview({ fragment, result });
          setCurrentTab("fragment");
          setIsPreviewLoading(false);
        } catch (error) {
          console.error("Error creating sandbox:", error);
          setCurrentPreview({ fragment, result: undefined });
          setCurrentTab("fragment");
          setIsPreviewLoading(false);
        }
      }
    },
  });

  // Initialize chat with existing data
  useEffect(() => {
    if (initialChatData?.messages) {
      setMessages(initialChatData.messages);

      // Set the latest fragment if it exists
      if (initialChatData.fragments && initialChatData.fragments.length > 0) {
        const latestFragment =
          initialChatData.fragments[initialChatData.fragments.length - 1];
        setFragment(latestFragment);
        setCurrentTab("fragment");
      }
    }
  }, [initialChatData]);

  // Auto-submit for new chats with only a user message (from landing page)
  useEffect(() => {
    if (
      user &&
      !isLoading &&
      chatId &&
      effectiveMessages.length === 1 &&
      effectiveMessages[0].role === "user" &&
      currentModel?.id
    ) {
      console.log("Auto-submitting initial message for new chat");
      submit({
        userID: user.id,
        teamID: "none",
        messages: toAISDKMessages(effectiveMessages),
        model: currentModel.id,
        config: languageModel,
      });
    }
  }, [
    user,
    isLoading,
    chatId,
    effectiveMessages,
    currentModel,
    languageModel,
    submit,
  ]);

  // Update local fragment state when object changes (for UI display)
  useEffect(() => {
    if (object) {
      setFragment(object);
    }
  }, [object]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    if (error) stop();
  }, [error]);

  function setMessage(message: Partial<Message>, index?: number) {
    setMessages((previousMessages) => {
      const updatedMessages = [...previousMessages];
      updatedMessages[index ?? previousMessages.length - 1] = {
        ...previousMessages[index ?? previousMessages.length - 1],
        ...message,
      };

      return updatedMessages;
    });
  }

  async function handleSubmitAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user || loading) {
      return setAuthDialog(true);
    }

    if (isLoading) {
      stop();
    }

    const content: Message["content"] = [{ type: "text", text: chatInput }];
    const images = await toMessageImage(files);

    if (images.length > 0) {
      for (const image of images) {
        content.push({ type: "image", image });
      }
    }

    const newUserMessage: Message = {
      role: "user" as const,
      content,
    };

    // Optimistic update for immediate UI feedback
    const updatedMessages = addMessage(newUserMessage);

    // Save user message to database if we have a chatId
    if (chatId) {
      try {
        await addMessageWithFragment({
          id: chatId,
          message: newUserMessage,
        });
      } catch (error) {
        console.error("Failed to save user message:", error);
      }
    }

    submit({
      userID: user.id,
      teamID: "none",
      messages: toAISDKMessages(updatedMessages),
      model: currentModel?.id,
      config: languageModel,
    });

    setChatInput("");
    setFiles([]);
    setCurrentTab("code");

    // posthog.capture("chat_submit", {
    //   template: selectedTemplate,
    //   model: languageModel.model,
    // });
  }

  function retry() {
    submit({
      userID: user?.id,
      teamID: "none",
      messages: toAISDKMessages(effectiveMessages),
      model: currentModel?.id,
      config: languageModel,
    });
  }

  function addMessage(message: Message) {
    let updatedMessages: Message[] = [];
    setMessages((previousMessages) => {
      updatedMessages = [...previousMessages, message];
      return updatedMessages;
    });
    return updatedMessages;
  }

  function handleSaveInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setChatInput(e.target.value);
  }

  function handleFileChange(change: SetStateAction<File[]>) {
    setFiles(change);
  }

  function handleLanguageModelChange(e: ModelInfo) {
    setLanguageModel({ ...languageModel, ...e });
  }

  function setCurrentPreview(preview: {
    fragment: DeepPartial<FragmentSchema> | undefined;
    result: ExecutionResult | undefined;
  }) {
    setFragment(preview.fragment);
    setResult(preview.result);
  }

  return (
    <>
      <AuthDialog open={isAuthDialogOpen} setOpen={setAuthDialog} />
      <div className="h-full grid w-full md:grid-cols-2">
        <div
          className={`flex flex-col w-full max-h-full max-w-[800px] mx-auto px-4 overflow-auto ${fragment ? "col-span-1" : "col-span-2"}`}
        >
          <Chat
            messages={effectiveMessages}
            isLoading={isLoading}
            setCurrentPreview={setCurrentPreview}
          />
          <ChatInput
            retry={retry}
            isErrored={error !== undefined}
            errorMessage={errorMessage}
            isLoading={isLoading}
            isRateLimited={isRateLimited}
            stop={stop}
            input={chatInput}
            setInput={setChatInput}
            handleInputChange={handleSaveInputChange}
            handleSubmit={handleSubmitAuth}
            isMultiModal={currentModel?.capabilities?.image || false}
            files={files}
            handleFileChange={handleFileChange}
          >
            <ChatPicker
              templates={templates}
              selectedTemplate={selectedTemplate}
              onSelectedTemplateChange={setSelectedTemplate}
              models={AI_MODELS}
              languageModel={languageModel}
              onLanguageModelChange={handleLanguageModelChange}
            />
            <ChatSettings
              languageModel={languageModel}
              onLanguageModelChange={handleLanguageModelChange}
              apiKeyConfigurable={!process.env.NEXT_PUBLIC_NO_API_KEY_INPUT}
              baseURLConfigurable={!process.env.NEXT_PUBLIC_NO_BASE_URL_INPUT}
            />
          </ChatInput>
        </div>
        <Preview
          teamID={undefined}
          accessToken={undefined}
          selectedTab={currentTab}
          onSelectedTabChange={setCurrentTab}
          isChatLoading={isLoading}
          isPreviewLoading={isPreviewLoading}
          fragment={fragment}
          result={result as ExecutionResult}
          onClose={() => setFragment(undefined)}
        />
      </div>
    </>
  );
}
