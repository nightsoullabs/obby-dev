"use client";

import { AuthDialog } from "./fragments/auth-dialog";
import { Chat } from "./fragments/chat";
import { ChatInput } from "./fragments/chat-input";
import { ChatPicker } from "./fragments/chat-picker";
import { ChatSettings } from "./fragments/chat-settings";
import { Preview } from "./fragments/preview";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import {
  type Message,
  toAISDKMessages,
  toMessageImage,
} from "@/lib/ai/messages";
import { AI_MODELS, type ModelInfo } from "@/lib/ai/models";
import { type FragmentSchema, fragmentSchema as schema } from "@/lib/fragment";
import templates, { type TemplateId } from "@/lib/templates";
import type { ExecutionResult } from "@/lib/types";
import type { DeepPartial } from "ai";
import { experimental_useObject as useObject } from "@ai-sdk/react";

// import { usePostHog } from "posthog-js/react";
import { type SetStateAction, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

export default function AIClient() {
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
  const { user, loading, sessionId } = useAuth();

  const currentModel = AI_MODELS.find((model) => model.id === languageModel.id);

  const lastMessage = messages[messages.length - 1];

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
      if (!error) {
        // send it to /api/sandbox
        console.log("fragment", fragment);
        setIsPreviewLoading(true);
        // posthog.capture("fragment_generated", {
        //   template: fragment?.template,
        // });

        const response = await fetch("/api/sandbox", {
          method: "POST",
          body: JSON.stringify({
            fragment,
            userID: user?.id,
          }),
        });

        const result = await response.json();
        console.log("result", result);
        // posthog.capture("sandbox_created", { url: result.url });

        setResult(result);
        setCurrentPreview({ fragment, result });
        setMessage({ result });
        setCurrentTab("fragment");
        setIsPreviewLoading(false);
      }
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: incorrect suggestion
  useEffect(() => {
    if (object) {
      setFragment(object);
      const content: Message["content"] = [
        { type: "text", text: object.commentary || "" },
        { type: "code", text: object.code || "" },
      ];

      if (!lastMessage || lastMessage.role !== "assistant") {
        addMessage({
          role: "assistant",
          content,
          object,
        });
      }

      if (lastMessage && lastMessage.role === "assistant") {
        setMessage({
          content,
          object,
        });
      }
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

    const updatedMessages = addMessage({
      role: "user",
      content,
    });

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
      messages: toAISDKMessages(messages),
      model: currentModel?.id,
      config: languageModel,
    });
  }

  function addMessage(message: Message) {
    setMessages((previousMessages) => [...previousMessages, message]);
    return [...messages, message];
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
    <main className="flex min-h-screen max-h-screen">
      <AuthDialog open={isAuthDialogOpen} setOpen={setAuthDialog} />
      <div className="grid w-full md:grid-cols-2">
        <div
          className={`flex flex-col w-full max-h-full max-w-[800px] mx-auto px-4 overflow-auto ${fragment ? "col-span-1" : "col-span-2"}`}
        >
          <Chat
            messages={messages}
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
    </main>
  );
}
