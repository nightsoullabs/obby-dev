import { type CoreMessage, streamText } from "ai";
import dedent from "dedent";
import { z } from "zod";
import { getModelFromRegistry } from "@/lib/ai/providers";
import { validateModelIdFormat } from "@/lib/ai/models";
import { SYSTEM_PROMPT } from "@/lib/ai/prompt";

export const maxDuration = 90;

export async function POST(req: Request) {
  const json = await req.json();
  const result = z
    .object({
      model: z.string(),
      messages: z.array(
        z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        }),
      ),
    })
    .safeParse(json);

  if (result.error) {
    return new Response(result.error.message, { status: 422 });
  }

  const { model: requestedModel, messages } = result.data;

  const validation = validateModelIdFormat(requestedModel);

  if (!validation.isValid) {
    return new Response(`Invalid model: ${requestedModel}`, { status: 400 });
  }

  try {
    const model = getModelFromRegistry(requestedModel);
    const systemPrompt = getSystemPrompt();

    const augmentedMessages = [
      {
        role: "system",
        content: `${systemPrompt}\n\nPlease ONLY return code, NO backticks or language names. Don't start with \`\`\`typescript or \`\`\`javascript or \`\`\`tsx or \`\`\`.`,
      },
      ...messages,
    ];

    const ret = await streamText({
      model,
      messages: augmentedMessages as CoreMessage[],
    });

    return ret.toTextStreamResponse();
  } catch (error) {
    console.error("Error generating response:", error);
    return new Response(
      `Failed to generate response with model: ${requestedModel}`,
      { status: 500 },
    );
  }
}

function getSystemPrompt() {
  // TODO: When I add LLMS.txt, I need to update this function to dynamically add it to the context
  return dedent(SYSTEM_PROMPT);
}
