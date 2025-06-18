import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import schema from "./schema";
import { crud } from "convex-helpers/server/crud";
import type { Doc } from "./_generated/dataModel";

export const { create, destroy, update } = crud(schema, "chats");

export const createChat = mutation({
  args: {
    user_id: v.id("users"),
    title: v.string(),
    messages: v.any(),
    fileData: v.optional(v.any()),
    fragments: v.optional(v.any()),
    visibility: v.optional(v.union(v.literal("private"), v.literal("public"))),
    initialMessageProcessed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db.insert("chats", {
      user_id: args.user_id,
      title: args.title,
      messages: args.messages,
      fileData: args.fileData,
      fragments: args.fragments,
      visibility: args.visibility ?? "private", // Default visibility
      initialMessageProcessed: args.initialMessageProcessed ?? false,
    });
    return chat;
  },
});

export const getChatById = query({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.id);
    return chat;
  },
});

export const getChatsByUserID = query({
  args: { user_id: v.id("users") },
  handler: async (ctx, args) => {
    const chats = await ctx.db
      .query("chats")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.user_id))
      .collect();
    return chats;
  },
});

export const getChatsByVisibility = query({
  args: { visibility: v.union(v.literal("private"), v.literal("public")) },
  handler: async (ctx, args) => {
    const chats = await ctx.db
      .query("chats")
      .withIndex("by_visibility", (q) => q.eq("visibility", args.visibility))
      .collect();
    return chats;
  },
});

export const getPublicChats = query({
  args: {},
  handler: async (ctx) => {
    const chats = await ctx.db
      .query("chats")
      .withIndex("by_visibility", (q) => q.eq("visibility", "public"))
      .collect();
    return chats;
  },
});

export const getUserChatsByVisibility = query({
  args: {
    user_id: v.id("users"),
    visibility: v.union(v.literal("private"), v.literal("public")),
  },
  handler: async (ctx, args) => {
    const chats = await ctx.db
      .query("chats")
      .withIndex("by_user_visibility", (q) =>
        q.eq("user_id", args.user_id).eq("visibility", args.visibility),
      )
      .collect();
    return chats;
  },
});

export const getUserPrivateChats = query({
  args: { user_id: v.id("users") },
  handler: async (ctx, args) => {
    const chats = await ctx.db
      .query("chats")
      .withIndex("by_user_visibility", (q) =>
        q.eq("user_id", args.user_id).eq("visibility", "private"),
      )
      .collect();
    return chats;
  },
});

export const getUserPublicChats = query({
  args: { user_id: v.id("users") },
  handler: async (ctx, args) => {
    const chats = await ctx.db
      .query("chats")
      .withIndex("by_user_visibility", (q) =>
        q.eq("user_id", args.user_id).eq("visibility", "public"),
      )
      .collect();
    return chats;
  },
});

export const updateChatVisibility = mutation({
  args: {
    id: v.id("chats"),
    visibility: v.union(v.literal("private"), v.literal("public")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { visibility: args.visibility });
    return { success: true };
  },
});

export const addMessageToChat = mutation({
  args: {
    id: v.id("chats"),
    messages: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { messages: args.messages });
    return { success: true };
  },
});

// Enhanced mutation for atomic message + fragment updates
export const addMessageWithFragment = mutation({
  args: {
    id: v.id("chats"),
    message: v.any(),
    fragment: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.id);
    if (!chat) {
      throw new Error("Chat not found");
    }

    // Prepare updates
    const currentMessages = chat.messages || [];
    const updatedMessages = [...currentMessages, args.message];

    const updates: Partial<Doc<"chats">> = { messages: updatedMessages };

    // Add fragment to fragments array if provided
    if (args.fragment) {
      const currentFragments = chat.fragments || [];
      updates.fragments = [...currentFragments, args.fragment];
    }

    await ctx.db.patch(args.id, updates);

    return {
      success: true,
      messageCount: updatedMessages.length,
      fragmentCount: updates.fragments?.length || chat.fragments?.length || 0,
    };
  },
});

// Real-time optimized chat query
export const watchChat = query({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.id);
    if (!chat) return null;

    return {
      ...chat,
      messageCount: chat.messages?.length || 0,
      fragmentCount: chat.fragments?.length || 0,
      lastUpdated: chat._creationTime,
    };
  },
});

// Fragment-only update mutation
export const updateChatFragments = mutation({
  args: {
    id: v.id("chats"),
    fragments: v.any(),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.id);
    if (!chat) {
      throw new Error("Chat not found");
    }

    await ctx.db.patch(args.id, { fragments: args.fragments });
    return { success: true, fragmentCount: args.fragments?.length || 0 };
  },
});

export const markInitialMessageProcessed = mutation({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { initialMessageProcessed: true });
  },
});

// Validation query for chat access
export const validateChatAccess = query({
  args: {
    id: v.id("chats"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.id);
    if (!chat) return { valid: false, reason: "not_found" };
    if (chat.user_id !== args.userId)
      return { valid: false, reason: "unauthorized" };
    return { valid: true, chat };
  },
});
