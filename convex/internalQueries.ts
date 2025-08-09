import { v } from 'convex/values';
import { internalQuery } from './_generated/server';

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
