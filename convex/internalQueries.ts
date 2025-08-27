import { v } from 'convex/values';
import { internalMutation, internalQuery } from './_generated/server';

export const getSiteSByTag = internalQuery({
  args: { user_input: v.string() },
  handler: async (ctx, { user_input }) => {
    const tagRows = await ctx.db
      .query('tags')
      .withIndex('by_tag', (q) => q.eq('tag', user_input))
      .collect();

    const site_ids = tagRows.map((t) => t.site_id);
    const sites = await Promise.all(
      site_ids.map(async (site_id) => {
        const site = await ctx.db.get(site_id);
        return site;
      })
    );

    return sites.filter((site) => site !== null);
  },
});

export const getSiteByUrl = internalQuery({
  args: { normalized_base_url: v.string() },
  handler: async (ctx, { normalized_base_url }) => {
    return await ctx.db
      .query('sites')
      .withIndex('by_url', (q) =>
        q.eq('normalized_base_url', normalized_base_url)
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
        category_name: v.string(),
        category_score: v.number(),
        reasoning: v.string(),
      })
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
    const site_id = await ctx.db.insert('sites', {
      normalized_base_url,
      site_name,
      policy_documents_urls,
      last_analyzed,
      overall_score,
      reasoning,
      category_scores,
    });

    for (const tag of tags) {
      await ctx.db.insert('tags', { site_id, tag });
    }

    return site_id;
  },
});
