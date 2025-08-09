import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  websites: defineTable({ // phasing this out as we move to the sites table
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
  })
    .index('by_url', ['normalized_url'])
    .index('by_last_analyzed', ['last_analyzed']),

  sites: defineTable({
    normalized_base_url: v.string(),
    site_name: v.string(),
    policy_documents_urls: v.array(v.string()),
  })
    .index('by_url', ['normalized_base_url'])
    .index('by_site_name', ['site_name']),

  tags: defineTable({
    site_id: v.id('sites'),
    tag: v.string(),
  })
    .index('by_tag', ['tag'])
    .index('by_site', ['site_id']),
});
