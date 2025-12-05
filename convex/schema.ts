import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { AnalysisStatusValidator, CategoryNameValidator } from "./lib";

export default defineSchema({
  sites: defineTable({
    normalized_base_url: v.string(),
    site_name: v.string(),
    policy_documents_urls: v.array(v.string()),
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
  })
    .index("by_url", ["normalized_base_url"])
    .index("by_site_name", ["site_name"])
    .index("by_last_analyzed", ["last_analyzed"]),

  tags: defineTable({
    site_id: v.id("sites"),
    tag: v.string(),
  })
    .index("by_tag", ["tag"])
    .index("by_site", ["site_id"]),

  analysisJobs: defineTable({
    site_input: v.string(),
    created_at: v.string(),
    updated_at: v.string(),
    status: AnalysisStatusValidator,
  }),
});
