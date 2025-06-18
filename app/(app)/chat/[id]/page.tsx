import AIClient from "components/ai/ai-client";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/_generated/api";
import type { Id } from "@/convex/_generated/_generated/dataModel";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;

  // Validate and load chat data
  let chatData = null;
  try {
    chatData = await fetchQuery(api.chats.getChatById, {
      id: id as Id<"chats">,
    });
  } catch (error) {
    console.error("Failed to load chat:", error);
  }

  if (!chatData) {
    notFound();
  }

  return (
    <div className="h-full w-full overflow-hidden">
      <AIClient chatId={id as Id<"chats">} initialChatData={chatData} />
    </div>
  );
}
