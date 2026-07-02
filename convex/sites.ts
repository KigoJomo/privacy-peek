import { v } from "convex/values";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { CategoryNameValidator } from "./lib";

const normalizeTag = (tag: string) => tag.trim().toLowerCase();

export const getSiteSByTag = internalQuery({
  args: { user_input: v.string() },
  handler: async (ctx, { user_input }) => {
    const tagRows = await ctx.db
      .query("tags")
      .withIndex("by_tag", (q) => q.eq("tag", normalizeTag(user_input)))
      .collect();

    const siteIds = [...new Set(tagRows.map((tagRow) => tagRow.site_id))];
    const sites = await Promise.all(
      siteIds.map(async (site_id) => {
        const site = await ctx.db.get(site_id);
        return site;
      }),
    );

    return sites.filter((site) => site !== null);
  },
});

export const getSiteByUrl = internalQuery({
  args: { normalized_base_url: v.string() },
  handler: async (ctx, { normalized_base_url }) => {
    return await ctx.db
      .query("sites")
      .withIndex("by_url", (q) =>
        q.eq("normalized_base_url", normalized_base_url),
      )
      .first();
  },
});

export const insertAnalysis = internalMutation({
  args: {
    normalized_base_url: v.string(),
    site_name: v.string(),
    policy_documents_urls: v.array(v.string()),
    tags: v.array(v.string()),
    last_analyzed: v.string(),
    overall_score: v.number(),
    reasoning: v.string(),
    category_scores: v.array(
      v.object({
        category_name: CategoryNameValidator,
        category_score: v.number(),
        reasoning: v.string(),
        supporting_clauses: v.array(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const {
      normalized_base_url,
      site_name,
      policy_documents_urls,
      tags,
      last_analyzed,
      overall_score,
      reasoning,
      category_scores,
    } = args;
    const uniqueTags = [...new Set(tags.map(normalizeTag).filter(Boolean))];

    const site_id = await ctx.db.insert("sites", {
      normalized_base_url,
      site_name,
      policy_documents_urls,
      last_analyzed,
      overall_score,
      reasoning,
      category_scores,
    });

    for (const tag of uniqueTags) {
      await ctx.db.insert("tags", { site_id, tag });
    }

    return site_id;
  },
});

export const getRecentSites = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    limit = limit ? limit : 6;

    const results = await ctx.db
      .query("sites")
      .withIndex("by_last_analyzed")
      .order("desc")
      .take(limit);

    const structured_results = results.map((r) => {
      const {
        _id,
        normalized_base_url,
        site_name,
        overall_score,
        reasoning,
        last_analyzed,
        category_scores,
      } = r;
      return {
        _id,
        normalized_base_url,
        site_name,
        overall_score,
        reasoning,
        last_analyzed,
        category_scores,
      };
    });

    return structured_results;
  },
});

export const getFullSiteDetails = query({
  args: { site_id: v.id("sites") },
  handler: async (ctx, { site_id }) => {
    return await ctx.db.get(site_id);
  },
});

export const getAllSiteIds = query({
  handler: async (ctx) => {
    const all_sites = await ctx.db.query("sites").collect();
    const ids = all_sites.map((site) => site._id);
    return ids;
  },
});

export const getSitesByIds = query({
  args: { ids: v.array(v.id("sites")) },
  handler: async (ctx, { ids }) => {
    if (ids.length === 0) return [];
    const sites = await Promise.all(
      ids.map((id) => ctx.db.get(id)),
    );
    return sites.filter((s) => s !== null);
  },
});

export const getSitesBrief = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const results = await ctx.db
      .query("sites")
      .withIndex("by_last_analyzed")
      .order("desc")
      .take(limit ?? 100);
    return results.map((s) => ({
      _id: s._id,
      site_name: s.site_name,
      normalized_base_url: s.normalized_base_url,
      overall_score: s.overall_score,
      last_analyzed: s.last_analyzed,
    }));
  },
});

export const getFullSiteDetail = internalQuery({
  args: { site_id: v.id("sites") },
  handler: async (ctx, { site_id }) => {
    return await ctx.db.get(site_id);
  },
});

export const updateSiteAnalysis = internalMutation({
  args: {
    site_id: v.id("sites"),
    overall_score: v.number(),
    reasoning: v.string(),
    category_scores: v.array(
      v.object({
        category_name: CategoryNameValidator,
        category_score: v.number(),
        reasoning: v.string(),
        supporting_clauses: v.array(v.string()),
      }),
    ),
    last_analyzed: v.string(),
  },
  handler: async (ctx, args) => {
    const { site_id, overall_score, reasoning, category_scores, last_analyzed } = args;
    await ctx.db.patch(site_id, {
      overall_score,
      reasoning,
      category_scores,
      last_analyzed,
    });
  },
});
