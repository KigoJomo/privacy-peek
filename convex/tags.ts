import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

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

export const getTagsForSite = query({
  args: { site_id: v.id("sites") },
  handler: async (ctx, { site_id }) => {
    return await ctx.db
      .query("tags")
      .withIndex("by_site", (q) => q.eq("site_id", site_id))
      .collect();
  },
});

export const getTagsForSites = query({
  args: { site_ids: v.array(v.id("sites")) },
  handler: async (ctx, { site_ids }) => {
    if (site_ids.length === 0) return {};
    const results = await Promise.all(
      site_ids.map(async (site_id) => {
        const tags = await ctx.db
          .query("tags")
          .withIndex("by_site", (q) => q.eq("site_id", site_id))
          .collect();
        return { site_id, tags: tags.map((t) => t.tag) };
      }),
    );
    return Object.fromEntries(
      results.map((r) => [r.site_id, r.tags]),
    ) as Record<string, string[]>;
  },
});

export const getSiteIdsByTag = query({
  args: { tag: v.string() },
  handler: async (ctx, { tag }) => {
    const rows = await ctx.db
      .query("tags")
      .withIndex("by_tag", (q) => q.eq("tag", normalizeTag(tag)))
      .collect();
    return [...new Set(rows.map((r) => r.site_id))];
  },
});

export const getAllUniqueTags = query({
  handler: async (ctx) => {
    const allTags = await ctx.db.query("tags").collect();
    const tagCounts = new Map<string, number>();
    const seen = new Set<string>();
    for (const t of allTags) {
      if (!seen.has(t.tag)) {
        seen.add(t.tag);
        tagCounts.set(t.tag, allTags.filter((x) => x.tag === t.tag).length);
      }
    }
    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50);
  },
});
