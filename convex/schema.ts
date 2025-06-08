import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    first_name: v.string(),
    last_name: v.union(v.string(), v.null()),
    workos_id: v.string(),
  }),
  organizations: defineTable({
    workos_id: v.string(),
    name: v.string(),
  }),
});
