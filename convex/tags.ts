import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

const normalizeTag = (tag: string) => tag.trim().toLowerCase();

export const insertTag = internalMutation({
  args: { site_id: v.id("sites"), tag: v.string() },
  handler: async (ctx, args) => {
    const tag = normalizeTag(args.tag);

    if (!tag) {
      return null;
    }

    const existingTag = await ctx.db
      .query("tags")
      .withIndex("by_tag", (q) => q.eq("tag", tag))
      .collect();

    const matchingTag = existingTag.find((row) => row.site_id === args.site_id);
    if (matchingTag) {
      return matchingTag._id;
    }

    return await ctx.db.insert("tags", {
      site_id: args.site_id,
      tag,
    });
  },
});