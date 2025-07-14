import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  websites: defineTable({
    site_name: v.string(),
    normalized_url: v.string(),
    tags: v.array(v.string()),
    last_analyzed: v.string(),
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
  }).index('by_url', ['normalized_url']).index('by_last_analyzed', ['last_analyzed']),
});
