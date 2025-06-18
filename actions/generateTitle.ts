"use server";

import { registry } from "lib/ai/providers";
import type { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { generateText } from "ai";

export async function generateTitleFromUserMessage({
  message,
}: {
  message: string;
}) {
  const { text: title } = await generateText({
    model: registry.languageModel("google:gemini-2.5-flash"),
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
      } satisfies GoogleGenerativeAIProviderOptions,
    },
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  return title;
}
