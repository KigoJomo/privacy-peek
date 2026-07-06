import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { generateObject, generateText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import z from "zod";

import {
  CategoryName,
  scoringCategories,
  categoryWeights,
  SiteDetails,
  RequireOnly,
  AnalysisStatus,
} from "./lib";

export type ResultItem = RequireOnly<
  SiteDetails,
  "_id" | "normalized_base_url" | "site_name" | "overall_score" | "reasoning"
>;

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// Model with browser search support for web-grounded calls
const BROWSER_SEARCH_MODEL = "openai/gpt-oss-120b";
// Model with generous limits for non-web-search calls
const STANDARD_MODEL = "moonshotai/kimi-k2-instruct-0905";

export const getSiteAnalysis: ReturnType<typeof action<any, any>> = action({
  args: { user_input: v.string(), job_id: v.id("analysisJobs") },
  handler: async (ctx, { user_input, job_id }) => {
    if (!user_input) {
      await ctx.runMutation(internal.analysisJobs.updateJob, {
        job_id,
        status: "error",
      });
      throw new Error("No User Input");
    }

    const statusUpdate = async (status: AnalysisStatus) => {
      await ctx.runMutation(internal.analysisJobs.updateJob, {
        job_id,
        status,
      });
    };

    try {
      await statusUpdate("checking_recent");
      const sites: ResultItem[] = await ctx.runQuery(
        internal.sites.getSiteSByTag,
        { user_input },
      );

      if (sites && sites.length > 0) {
        console.log("\nFound Matching Records");
        await statusUpdate("complete");
        return sites;
      } else {
        await statusUpdate("getting_site_info");
        const siteMetaData = await getWebsiteMetadata({ site: user_input });

        const site = await ctx.runQuery(internal.sites.getSiteByUrl, {
          normalized_base_url: siteMetaData.normalized_base_url,
        });

        if (site) {
          // add the user input as a tag for this site
          const new_tag = await ctx.runMutation(internal.tags.insertTag, {
            site_id: site._id,
            tag: user_input,
          });
          console.log("\nFound Matching Record");
          console.log(`\nAdded new tags for site ${site._id} => ${new_tag}`);
          await statusUpdate("complete");
          return [
            {
              _id: site._id,
              normalized_base_url: site.normalized_base_url,
              site_name: site.site_name,
              overall_score: site.overall_score,
              reasoning: site.reasoning,
            } as ResultItem,
          ];
        } else {
          console.log("\nNo Matching Records. Beginning Analysis.");
          await statusUpdate("reading_policies");
          const categoriesClauses = await extractClauses({
            policy_documents_urls: siteMetaData.policy_documents_urls,
          });

          await statusUpdate("categorizing_and_scoring");
          const categoryScores = await getCategoryScores({ categoriesClauses });

          await statusUpdate("computing_overall_score");
          const overallScore = await getOverallScore({ categoryScores });

          await statusUpdate("finalizing");
          const newSiteId = await ctx.runMutation(internal.sites.insertAnalysis, {
            normalized_base_url: siteMetaData.normalized_base_url,
            site_name: siteMetaData.site_name,
            policy_documents_urls: siteMetaData.policy_documents_urls,
             tags: [
               ...siteMetaData.tags.map((tag) => tag.toLowerCase()),
               user_input.toLowerCase(),
               siteMetaData.normalized_base_url.toLowerCase(),
             ],
            last_analyzed: new Date().toISOString(),
            overall_score: overallScore.overall_score,
            reasoning: overallScore.reasoning ? overallScore.reasoning : "",
            category_scores: categoryScores,
          });

          const analysisResult: ResultItem = {
            _id: newSiteId,
            normalized_base_url: siteMetaData.normalized_base_url,
            site_name: siteMetaData.site_name,
            overall_score: overallScore.overall_score,
            reasoning: overallScore.reasoning,
          };

          await statusUpdate("complete");
          const result = [analysisResult];
          return result;
        }
      }
    } catch (error) {
      await ctx.runMutation(internal.analysisJobs.updateJob, {
        job_id,
        status: "error",
      });
      throw error;
    }
  },
});

export const reanalyzeSite = action({
  args: { site_id: v.id("sites") },
  handler: async (ctx, { site_id }) => {
    const site = await ctx.runQuery(internal.sites.getFullSiteDetail, {
      site_id,
    });

    if (!site) {
      throw new Error("Site not found");
    }

    const { policy_documents_urls } = site;
    const safePolicyUrls = policy_documents_urls ?? [];

    try {
      console.log(`\nRe-analyzing site ${site.site_name} (${site.normalized_base_url})`);

      const categoriesClauses = await extractClauses({ policy_documents_urls: safePolicyUrls });

      const categoryScores = await getCategoryScores({ categoriesClauses });

      const overallScore = await getOverallScore({ categoryScores });

      await ctx.runMutation(internal.sites.updateSiteAnalysis, {
        site_id,
        overall_score: overallScore.overall_score,
        reasoning: overallScore.reasoning || "",
        category_scores: categoryScores,
        last_analyzed: new Date().toISOString(),
      });

      console.log(`\nRe-analysis complete for ${site.site_name}`);

      return {
        success: true,
        overall_score: overallScore.overall_score,
        reasoning: overallScore.reasoning,
        category_scores: categoryScores,
      };
    } catch (error) {
      console.error("Re-analysis failed:", error);
      throw error;
    }
  },
});

const getWebsiteMetadata = async ({ site }: { site: string }) => {
  if (!site) throw new Error("No Site Provided");

  const prompt = `
      You are asked to get the website metadata for ${site}.

      The normalized_base_url is the full URL including protocol (http or https) and www. subdomain (e.g., "https://www.example.com") with no trailing slashes.

      site_name is the name of the website.

      tags should include relevant keywords, common urls and topics associated with the website. Include at least 15 tags. For example, meta.com may have tags like "Meta", "Facebook", "instagram.com", "facebook.com", "Social Media", "Tech Company", etc.

      policy_documents_urls: An array of URLs that contain the site's privacy policy, terms of service, or other relevant legal documents. Include at least 2 URLs.

      Important:
      - Use official sources only.
      - Prioritize the most current versions.
      - Verify URLs actually exist
      - The normalized_base_url should match the base url for the policy documents, example; input -> chatgpt.com, ouput -> normalized_base_url: 'https://www.openai.com', policy_documents_urls: ['https://www.openai.com/policies/terms-of-use', 'https://www.openai.com/policies/privacy-policy']
      - Always include www. in the normalized_base_url
      - Never hallucinate - return empty strings or empty arrays if uncertain
    `;

  console.log("\nHitting Groq API now (with browser search).");
  
  // Use browser search to get accurate website metadata
  const { text } = await generateText({
    model: groq(BROWSER_SEARCH_MODEL),
    system: "You are a privacy practices analyzer and researcher. Return your response as valid JSON only, with no additional text or explanation.",
    prompt: `${prompt}
    
    Return your response as a JSON object with exactly these fields:
    - normalized_base_url: string
    - site_name: string  
    - tags: string[]
    - policy_documents_urls: string[]`,
    tools: {
      browser_search: groq.tools.browserSearch({}),
    },
    toolChoice: "required",
  });

  // Parse the JSON response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse website metadata response");
  }
  const object = JSON.parse(jsonMatch[0]) as {
    normalized_base_url: string;
    site_name: string;
    tags: string[];
    policy_documents_urls: string[];
  };

  return object;
};

const extractClauses = async ({
  policy_documents_urls,
}: {
  policy_documents_urls: string[];
}) => {
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

  console.log("\nHitting Groq API now (with browser search).");

  // Use browser search to extract clauses from policy documents
  const { text } = await generateText({
    model: groq(BROWSER_SEARCH_MODEL),
    system:
      "You are a privacy policy analyzer. Your task is to extract and summarize the privacy practices of a website based on its terms of service or privacy policy. Return your response as valid JSON only, with no additional text or explanation.",
    prompt: `${prompt}
    
    Return your response as a JSON array where each element has:
    - category_name: one of "Data Collection", "Data Sharing", "Data Retention and Security", "User Rights and Controls", "Transparency and Clarity"
    - clauses: array of objects with "clause" (string) and "relevance" (number between 0 and 1)`,
    tools: {
      browser_search: groq.tools.browserSearch({}),
    },
    toolChoice: "required",
  });

  // Parse the JSON response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Failed to parse clauses response");
  }
  const object = JSON.parse(jsonMatch[0]) as Array<{
    category_name: "Data Collection" | "Data Sharing" | "Data Retention and Security" | "User Rights and Controls" | "Transparency and Clarity";
    clauses: Array<{ clause: string; relevance: number }>;
  }>;

  return object;
};

const getCategoryScores = async ({
  categoriesClauses,
}: {
  categoriesClauses: Awaited<ReturnType<typeof extractClauses>>;
}) => {
  if (!categoriesClauses) {
    throw new Error("No clauses provided.");
  }

  const promises = categoriesClauses.map(async (category) => {
    const filteredClauses = (category.clauses ?? []).filter((c) => c.relevance >= 0.3);

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

    const { category_score, reasoning } = await scoreCategory({
      category_name: category.category_name,
      clauses: filteredClauses,
      rubric: categoryRubric,
    });

    if (category_score == null || !reasoning) {
      throw new Error(
        `An unknown error occured scoring ${category.category_name}`,
      );
    } else {
      return {
        category_name: category.category_name,
        category_score,
        reasoning,
        supporting_clauses: category.clauses.map((c) => c.clause),
      };
    }
  });

  const scores = (await Promise.all(promises)).filter(
    (score): score is NonNullable<typeof score> => score !== undefined,
  );
  if (scores.length === 0) {
    throw new Error("No category scores could be generated.");
  }

  return scores as Array<{
    category_name: CategoryName;
    category_score: number;
    reasoning: string;
    supporting_clauses: string[];
  }>;
};

const getOverallScore = async ({
  categoryScores,
}: {
  categoryScores: Awaited<ReturnType<typeof getCategoryScores>>;
}) => {
  const appliedWeights = categoryWeights.filter((weight) =>
    categoryScores.some((score) => score.category_name === weight.category),
  );
  const weightByCategory = new Map(
    appliedWeights.map((w) => [w.category, w.weight]),
  );
  const weightsTotal = appliedWeights.reduce((sum, w) => sum + w.weight, 0);
  if (weightsTotal === 0) {
    throw new Error("No category weights available for computed scores.");
  }

  const weight_x_score_sum = categoryScores
    .map((c) => {
      const weight = weightByCategory.get(c.category_name);
      if (weight === undefined) {
        throw new Error(
          `Missing weight for category: ${c.category_name}`,
        );
      }
      return weight * c.category_score;
    })
    .reduce((sum, product) => sum + product, 0);

  const result = 10 * (weight_x_score_sum / weightsTotal);
  const overall_score = Math.round(result * 100) / 100;

   const prompt = `
       Based on a website's privacy practices across five categories, generate a 1-2 sentence summary that explains the overall privacy situation to a user.

       Here are the category evaluations:

       ${categoryScores
       .map(
         (category) =>
           `${category.category_name}: ${category.reasoning}`,
       )
       .join("\n\n")}

       Write a brief explanation that synthesizes this into practical terms for users:
       - Lead with the main privacy concern or strength (e.g., "This site collects extensive data and shares it freely" or "This site is careful about your data").
       - Include 1-2 specific details from the categories above (e.g., mention data collection scope, sharing practices, retention, user control options).
       - Balance risks and protections if mixed (e.g., "Data is shared with many partners, but you can opt-out from your account settings").
       - Do NOT mention numeric scores, category names, or the website name.
       - Use plain, conversational language (e.g., "they keep your data" instead of "indefinite retention").
       - Tone should match the overall privacy posture: firm/concerned for poor practices, neutral/positive for strong ones.

       Example summaries:
       - Poor privacy: "Extensive tracking and profiling occurs, with data shared to hundreds of advertisers. You'll need to dig into settings to limit sharing, and deletion takes months."
       - Mixed privacy: "Your essential service data is kept secure, but behavioral data is shared with analytics partners. You can disable tracking in settings and request deletion anytime."
       - Strong privacy: "Only essential data is collected and never shared. You have full control to download, edit, or delete everything from your account dashboard."
     `;


  try {
    console.log("\nHitting Groq API now.");
    const { object } = await generateObject({
      model: groq(STANDARD_MODEL),
      prompt,
      schema: z.object({
        reasoning: z.string(),
      }),
      temperature: 0,
      maxOutputTokens: 500,
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
      reasoning: "",
    };
  }
};

async function scoreCategory({
  category_name,
  clauses,
  rubric,
}: {
  category_name: CategoryName;
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
     These are clauses extracted from a website's Privacy Policy and Terms of Service specifically regarding ${category_name}:

     ${clauses
       .map((c) => `- ${c.clause} (Relevance: ${c.relevance})`)
       .join("\n")}

     You are given the following rubric for scoring the website's performance in ${category_name} based on the provided clauses:
     
     ${rubric.map((r) => `Score: ${r.score} - ${r.description}`).join("\n")}

     Carefully go through all provided clauses and find the most appropriate numeric score for the website in ${category_name}.

     Return two fields: a category_score (number) and a reasoning (string).
     
     The reasoning must be 1-2 concise sentences explaining the practical privacy impact to a user, with specific details:
     - Lead with the main risk or protection (e.g., "Your location and browsing history are tracked" or "Only essential service data is collected").
     - Include specific practices (e.g., "advertisers," "30-day retention," "opt-out available in settings," "account deletion required").
     - Show both risks AND protections when balanced (e.g., "Data is shared with partners, but you can disable this in your account settings").
     - Do NOT mention the numeric score, category name, or website name.
     - Avoid jargon; use plain language (e.g., "apps" instead of "third-party services," "you can delete it" instead of "data portability").
     - Tone should reflect the privacy posture: warning for bad practices, reassuring for strong protections.

     Example reasonings for reference:
     - Data Collection (strong): "Only your account username and email are collected—no tracking or profiling."
     - Data Collection (weak): "Your browsing history, location, and payment data are tracked. Consent is pre-checked and buried in settings."
     - Data Sharing (strong): "Your data is never shared with advertisers; it's only used internally for service improvements."
     - Data Sharing (weak): "Your profile is shared with hundreds of advertising partners and data brokers unless you opt-out separately for each one."
     - Data Retention (strong): "Data is encrypted and automatically deleted 90 days after you stop using the service."
     - Data Retention (weak): "Your data is kept indefinitely for 'analytics purposes' with no clear deletion option."
     - User Rights (strong): "You can download or delete your account data anytime from your dashboard without contacting support."
     - User Rights (weak): "You can request deletion by emailing support, but processing takes 60 days and some data is kept for legal reasons."
   `;

  try {
    console.log("\nHitting Groq API now.");
    const { object } = await generateObject({
      model: groq(STANDARD_MODEL),
      prompt,
      temperature: 0,
      maxOutputTokens: 500,
      schema: z.object({
        category_score: z.number(),
        reasoning: z.string(),
      }),
    });

    return object;
  } catch (error) {
    console.error("Something went wrong: ", error);
    throw new Error(`Failed to generate score for ${category_name}`);
  }
}

/**
 *
 */
