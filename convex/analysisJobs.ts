import { v } from 'convex/values';
import { internalMutation, mutation, query } from './_generated/server';
import { AnalysisStatusValidator } from './lib';

export const createJob = mutation({
  args: { site_input: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert('analysisJobs', {
      site_input: args.site_input,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'queued',
    });
  },
});

export const getJob = query({
  args: { job_id: v.id('analysisJobs') },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.job_id);
    return job;
  },
});

export const updateJob = internalMutation({
  args: { job_id: v.id('analysisJobs'), status: AnalysisStatusValidator },
  handler: async (ctx, { job_id, status }) => {
    await ctx.db.patch(job_id, { status });
  },
});
