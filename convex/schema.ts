import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    first_name: v.string(),
    last_name: v.union(v.string(), v.null()),
    workos_id: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_workos_id", ["workos_id"]),

  organizations: defineTable({
    workos_id: v.string(),
    name: v.string(),
  }).index("by_workos_id", ["workos_id"]),

  projects: defineTable({
    user_id: v.id("users"),
    organization_id: v.id("organizations"),
    name: v.string(),
    description: v.string(),
    chats: v.optional(v.array(v.id("chats"))),
  })
    .index("by_user_id", ["user_id"])
    .index("by_organization_id", ["organization_id"])
    .index("by_name", ["name"]),
  chats: defineTable({
    user_id: v.id("users"),
    title: v.string(),
    messages: v.any(), // JSON structure for messages
    fileData: v.optional(v.any()), // File attachments data
    fragments: v.optional(v.any()), // AI fragments data
    visibility: v.union(v.literal("private"), v.literal("public")),
  })
    .index("by_user_id", ["user_id"])
    .index("by_visibility", ["visibility"])
    .index("by_user_visibility", ["user_id", "visibility"]),

  messages: defineTable({
    chat_id: v.id("chats"),
    role: v.string(),
    parts: v.array(v.string()),
  }).index("by_chat_id", ["chat_id"]),
});
