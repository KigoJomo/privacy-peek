import { v } from 'convex/values';
import { internalMutation } from './_generated/server';

export const insertTag = internalMutation({
  args: { site_id: v.id('sites'), tag: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert('tags', args)
  }
})