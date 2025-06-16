import "server-only"; // this file is  ensure this file should only be used in the server

import { openai as originalOpenAI } from "@ai-sdk/openai";
import { anthropic as originalAnthropic } from "@ai-sdk/anthropic";
import { google as originalGoogle } from "@ai-sdk/google";
import { xai as originalXAI } from "@ai-sdk/xai";

import { customProvider, createProviderRegistry } from "ai";

export const obbylabs = customProvider({
  languageModels: {
    "agent-chat": originalGoogle("gemini-2.5-pro-preview-06-05"),
    "fast-chat": originalGoogle("gemini-2.5-flash-preview-05-20"),
  },
});

// custom provider with different model settings:
export const openai = customProvider({
  languageModels: {
    "gpt-4.1": originalOpenAI("gpt-4.1"),
    "gpt-4.1-mini": originalOpenAI("gpt-4.1-mini"),
    "gpt-4o": originalOpenAI("gpt-4o"),
    "gpt-4o-mini": originalOpenAI("gpt-4o-mini"),
    "gpt-4o-mini-structured": originalOpenAI("gpt-4o-mini", {
      structuredOutputs: true,
    }),
    o3: originalOpenAI("o3"),
    "o4-mini": originalOpenAI("o4-mini"),
  },
  fallbackProvider: originalOpenAI,
});

export const anthropic = customProvider({
  languageModels: {
    "claude-sonnet-4": originalAnthropic("claude-4-sonnet-20250514"),
    "claude-3.7-sonnet": originalAnthropic("claude-3-7-sonnet-20250219"),
    "claude-3.5-haiku": originalAnthropic("claude-3-5-haiku-20241022"),
  },
  fallbackProvider: originalAnthropic,
});

export const google = customProvider({
  languageModels: {
    "gemini-2.5-pro": originalGoogle("gemini-2.5-pro-preview-06-05"),
    "gemini-2.5-flash": originalGoogle("gemini-2.5-flash-preview-05-20"),
    "gemini-2.0-flash": originalGoogle("gemini-2.0-flash-001"), // 001 is stable version
  },
  fallbackProvider: originalGoogle,
});

export const xai = customProvider({
  languageModels: {
    "grok-3-mini": originalXAI("grok-3-mini"),
  },
  fallbackProvider: originalXAI,
});

export const registry = createProviderRegistry({
  openai,
  anthropic,
  google,
  xai,
  obbylabs,
});

import { validateModelIdFormat } from "./models";
import type { LanguageModelV1 } from "ai";

export function getModelFromRegistry(modelId: string): LanguageModelV1 {
  const validation = validateModelIdFormat(modelId);

  if (!validation.isValid || !validation.provider) {
    throw new Error(`Invalid model ID: ${modelId}`);
  }

  const { provider, resolvedId } = validation;

  switch (provider) {
    case "openai":
      return registry.languageModel(resolvedId as `openai:${string}`);
    case "anthropic":
      return registry.languageModel(resolvedId as `anthropic:${string}`);
    case "google":
      return registry.languageModel(resolvedId as `google:${string}`);
    case "xai":
      return registry.languageModel(resolvedId as `xai:${string}`);
    case "obbylabs":
      return registry.languageModel(resolvedId as `obbylabs:${string}`);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}
