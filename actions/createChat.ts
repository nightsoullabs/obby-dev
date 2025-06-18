"use server";

import { api } from "@/convex/_generated/api";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { generateTitleFromUserMessage } from "./generateTitle";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Id } from "@/convex/_generated/dataModel";
import type { MessageText, MessageImage } from "lib/ai/messages";

export async function createChatFromMessage({
  message,
  files,
}: {
  message: string;
  files?: File[];
}) {
  const { user } = await withAuth({ ensureSignedIn: true });

  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    const title = await generateTitleFromUserMessage({ message });

    const convexUser = await fetchQuery(api.users.getByWorkOSIdQuery, {
      workos_id: user.id,
    });

    if (!convexUser) {
      throw new Error("User not found in database");
    }

    // Prepare initial message data
    const initialMessage = {
      role: "user" as const,
      content: [{ type: "text" as const, text: message }] as Array<
        MessageText | MessageImage
      >,
    };

    // Handle file attachments if present
    let fileData = undefined;
    if (files && files.length > 0) {
      // Convert files to base64 for storage
      const filePromises = files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        return {
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64,
        };
      });
      fileData = await Promise.all(filePromises);

      // Add image content to message if images are present
      for (const file of files) {
        if (file.type.startsWith("image/")) {
          const arrayBuffer = await file.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString("base64");
          initialMessage.content.push({
            type: "image" as const,
            image: `data:${file.type};base64,${base64}`,
          });
        }
      }
    }

    const chatId = await fetchMutation(api.chats.createChat, {
      user_id: convexUser._id,
      title,
      messages: [initialMessage],
      fileData,
      visibility: "private",
    });

    revalidatePath("/");

    return { chatId, success: true };
  } catch (error) {
    console.error("Error creating chat:", error);
    throw new Error("Failed to create chat");
  }
}

export async function redirectToChat(chatId: Id<"chats">) {
  redirect(`/chat/${chatId}`);
}
