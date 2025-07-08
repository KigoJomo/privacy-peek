import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const insertAnalysis = mutation({
  args: {
    site_name: v.string(),
    normalized_url: v.string(),
    tags: v.array(v.string()),
    overall_score: v.number(),
    reasoning: v.string(),
    category_scores: v.record(
      v.string(),
      v.object({
        score: v.number(),
        reasoning: v.string(),
        supporting_clauses: v.array(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const newWebsiteId = await ctx.db.insert('websites', {
      ...args,
      last_analyzed: new Date().toISOString(),
    });

    return newWebsiteId;
  },
});

export const getWebsiteByUrl = query({
  args: { normalized_url: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('websites')
      .withIndex('by_url', (q) => q.eq('normalized_url', args.normalized_url))
      .first();
  },
});
