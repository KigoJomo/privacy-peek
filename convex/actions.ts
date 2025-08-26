import { v } from "convex/values";
import { action } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { Id } from "./_generated/dataModel";
import z from "zod";

import { CategoryName, scoringCategories, categoryWeights } from "./lib";


export const checkExistingRecord = action({
  args: { user_input: v.string() },
  handler: async (ctx, { user_input }) => {
    if (!user_input) throw new Error("No User Input");

    const sites = await ctx.runQuery(internal.internalQueries.getSiteSByTag, {
      user_input: user_input,
    });

    let result: {
      _id: Id<"sites">;
      site_name: string;
      normalized_base_url: string;
    }[] = [];

    if (sites && sites.length > 0) {
      result = sites.map((s) => {
        return {
          _id: s._id,
          site_name: s.site_name,
          normalized_base_url: s.normalized_base_url,
        };
      });
    } else {
      const metaData = await ctx.runAction(api.actions.getWebsiteMetadata, {
        site: user_input,
      });

      const site = await ctx.runQuery(internal.internalQueries.getSiteByUrl, {
        normalized_base_url: metaData.normalized_base_url,
      });

      result = site ? ([site] as typeof result) : [];
    }

    return result;
  },
});

export const getWebsiteMetadata = action({
  args: {
    site: v.string(),
  },
  handler: async (_, { site }) => {
    if (!site) throw new Error("No Site Provided");

    const prompt = `
      You are asked to get the website metadata for ${site}.

      The normalized_base_url is the full URL including protocol (http or https) and www. subdomain (e.g., "https://www.example.com") with no trailing slashes.

      site_name is the name of the website.

      tags should include relevant keywords, common urls and topics associated with the website. Include at least 15 tags. For example, meta.com may have tags like "Meta", "Facebook", "instagram.com", "facebook.com", "Social Media", "Tech Company", etc.

      policy_documents_urls: An array of URLs that contain the site's privacy policy, terms of service, or other relevant legal documents. Include at least 2 URLs.

      Important:
      - Use offcial sources only.
      - Prioritize the most current versions.
      - Verify URLs actually exist
      - The normalized_base_url should match the base url for the policy documents, example; input -> chatgpt.com, ouput -> normalized_base_url: 'https://www.openai.com', policy_documents_urls: ['https://www.openai.com/policies/terms-of-use', 'https://www.openai.com/policies/privacy-policy']
      - Always include www. in the normalized_base_url
      - Never hallucinate - return empty strings or empty arrays if uncertain
    `;

    console.log("Hitting Gemini API now.");
    const { object } = await generateObject({
      model: google("gemini-2.0-flash", {
        useSearchGrounding: true,
      }),
      system: "You are a privacy practices analyzer and researcher.",
      prompt: prompt,
      temperature: 0,
      schema: z.object({
        normalized_base_url: z.string(),
        site_name: z.string(),
        tags: z.array(z.string()),
        policy_documents_urls: z.array(z.string()),
      }),
    });

    return object;
  },
});

export const extractClauses = action({
  args: {
    policy_documents_urls: v.array(v.string()),
  },
  handler: async (_, { policy_documents_urls }) => {
    if (policy_documents_urls.length <= 0)
      throw new Error("No Policy Document URLs Provided");

    const prompt = `
      You are given the following urls:
      ${policy_documents_urls.map((u) => `${u}`).join("\n")}

      You are required to go through each page, extracting all relevant clauses that fall under each of these categories:
      ${scoringCategories.map((c, i) => `${i}. ${c.category_name}`).join("\n")}

      Important:
      - Use official sources only.
      - Prioritize the most current versions.
      - Clause should be the exact complete sentence or paragraph that clearly states the policy.
      - Each category should have a minimum of 10 clauses.
      - Each clause should be accompanied by a relevance score from 0 to 1, where 1 is highly relevant and 0 is not relevant at all.
      - Never hallucinate or return placeholder text - return empty strings or empty arrays if uncertain.
    `;

    console.log("Hitting Gemini API now.");
    const { object } = await generateObject({
      model: google("gemini-2.0-flash", {
        useSearchGrounding: true,
      }),
      system:
        "You are a privacy policy analyzer. Your task is to extract and summarize the privacy practices of a website based on its terms of service or privacy policy.",
      prompt: prompt,
      temperature: 0,
      output: "array",
      schema: z.object({
        category: z.enum([
          "Data Collection",
          "Data Sharing",
          "Data Retention and Security",
          "User Rights and Controls",
          "Transparency and Clarity",
        ]),
        clauses: z.array(
          z.object({
            clause: z.string(),
            relevance: z.number(),
          }),
        ),
      }),
    });

    return object;
  },
});

export const scorePractices = action({
  args: {
    categories: v.array(
      v.object({
        category_name: v.union(
          ...scoringCategories.map((c) => v.literal(c.category_name)),
        ),
        clauses: v.array(
          v.object({
            clause: v.string(),
            relevance: v.number(),
          }),
        ),
      }),
    ),
  },
  handler: async (_, { categories }) => {
    if (!categories) {
      throw new Error("No category clauses provided.");
    }

    const promises = categories.map(async (category) => {
      const filteredClauses = category.clauses.filter(
        (c) => c.relevance >= 0.3,
      );

      if (filteredClauses.length === 0) {
        console.warn(
          `No relevant clauses found for category: ${category.category_name}`,
        );
        return;
      }

      const categoryRubric = scoringCategories.find(
        (r) => r.category_name === category.category_name,
      )?.rubric;

      if (!categoryRubric) {
        console.warn(`No rubric found for category: ${category.category_name}`);
        return;
      }

      const { score, reasoning } = await scoreCategory({
        categoryName: category.category_name,
        clauses: filteredClauses,
        rubric: categoryRubric,
      });

      if (!score || !reasoning) {
        throw new Error(
          `An unknown error occured scoring ${category.category_name}`,
        );
      } else {
        return { category: category.category_name, score, reasoning };
      }
    });

    const scores = await Promise.all(promises);
    if (!scores) throw new Error("Something went wrong.");

    return scores as Array<{
      category: CategoryName;
      score: number;
      reasoning: string;
    }>;
  },
});

export const getOverallScore = action({
  args: {
    categories: v.array(
      v.object({
        category_name: v.union(
          ...scoringCategories.map((c) => v.literal(c.category_name)),
        ),
        score: v.number(),
        reasoning: v.string(),
      }),
    ),
  },
  handler: async (_, { categories }) => {
    const weightsTotal = categoryWeights.reduce((sum, w) => sum + w.weight, 0);

    const weight_x_score_sum = categories
      .map(
        (c) =>
          categoryWeights.find((cw) => cw.category === c.category_name)!
            .weight * c.score,
      )
      .reduce((sum, product) => sum + product, 0);

    const result = 10 * (weight_x_score_sum / weightsTotal);
    const overall_score = Math.round(result * 100) / 100;

    const prompt = `
      A website's privacy practices are scored out of 10 in categories as shown:

      ${categories
        .map(
          (category) =>
            `${category.category_name}: ${category.score}.\n Reasoning: ${category.reasoning}`,
        )
        .join("\n\n")}
      
      Overall score is calculated as a weighted average based on the following weights:
      ${categoryWeights.map((c) => `${c.category} - ${c.weight}`).join("\n")}

      The overall score is ${overall_score}.
      Return only a brief reasoning for this overall score, focusing on the most impactful categories and their implications for user privacy.
      At most 2 sentences. Use simple language, understandable by a non-technical user.
    `;

    try {
      console.log("Hitting Gemini API now.");
      const { object } = await generateObject({
        model: google("gemini-2.0-flash-lite"),
        prompt,
        schema: z.object({
          reasoning: z.string(),
        }),
        temperature: 0,
        maxTokens: 500,
      });

      const { reasoning } = object;

      return {
        overall_score,
        reasoning,
      };
    } catch (error) {
      console.error(
        "Something went wrong getting a reasoning for the overall score",
        error,
      );
      return {
        overall_score,
      };
    }
  },
});

/**
 * helper function(s)
 */

async function scoreCategory({
  categoryName,
  clauses,
  rubric,
}: {
  categoryName: CategoryName;
  clauses: Array<{
    clause: string;
    relevance: number;
  }>;
  rubric: Array<{
    score: number;
    description: string;
  }>;
}) {
  const prompt = `
    These are clauses extracted from a website's Privacy Policy and Terms of Service specifically regarding ${categoryName}:

    ${clauses
      .map((c) => `- ${c.clause} (Relevance: ${c.relevance})`)
      .join("\n")}

    You are given the following rubric for scoring the website's performance in ${categoryName} based on the provided clauses:
    
    ${rubric.map((r) => `Score: ${r.score} - ${r.description}`).join("\n")}

    Carefully go through all provided clauses and find the most appropriate score for the website in ${categoryName}.

    Return only a score, and a short reasoning statement - max 2 sentences - saying why the assigned score is appropriate.
    Use simple language, understandable by a non-technical user.
  `;

  try {
    console.log("Hitting Gemini API now.");
    const { object } = await generateObject({
      model: google("gemini-2.0-flash-lite"),
      prompt,
      temperature: 0,
      maxTokens: 500,
      schema: z.object({
        score: z.number(),
        reasoning: z.string(),
      }),
    });

    return object;
  } catch (error) {
    console.error("Something went wrong: ", error);
    throw new Error(`Failed to generate score for ${categoryName}`);
  }
}
