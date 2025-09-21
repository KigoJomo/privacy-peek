import { v } from 'convex/values';
import { action } from './_generated/server';
import { internal } from './_generated/api';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import z from 'zod';

import {
  CategoryName,
  scoringCategories,
  categoryWeights,
  SiteDetails,
  RequireOnly,
} from './lib';

export type ResultItem = RequireOnly<
  SiteDetails,
  '_id' | 'normalized_base_url' | 'site_name' | 'overall_score' | 'reasoning'
>;

export const getSiteAnalysis = action({
  args: { user_input: v.string() },
  handler: async (ctx, { user_input }) => {
    if (!user_input) throw new Error('No User Input');

    let result: ResultItem[] = [];

    // check existing record
    const sites: ResultItem[] = await ctx.runQuery(
      internal.sites.getSiteSByTag,
      {
        user_input,
      }
    );

    if (sites && sites.length > 0) {
      console.log('\nFound Matching Records');
      return sites;
    } else {
      // if there are not matching records, do a more thorough search
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
        const sites: ResultItem[] = [site];
        console.log('\nFound Matching Record');
        console.log(`\nAdded new tags for site ${site._id} => ${new_tag}`);
        return sites;
      } else {
        // no initial matching records and no result after thorough search, then do the analysis
        console.log('\nNo Matching Records. Begining Analysis.');
        // 1. Get category clauses.
        const categoriesClauses = await extractClauses({
          policy_documents_urls: siteMetaData.policy_documents_urls,
        });

        // 2. Get category scores and reasoning
        const categoryScores = await getCategoryScores({ categoriesClauses });

        // 3. Get the overall score and reasoning
        const overallScore = await getOverallScore({ categoryScores });

        // 4. Return Analysis & Persist in db
        const newSiteId = await ctx.runMutation(internal.sites.insertAnalysis, {
          normalized_base_url: siteMetaData.normalized_base_url,
          site_name: siteMetaData.site_name,
          policy_documents_urls: siteMetaData.policy_documents_urls,
          tags: [
            ...siteMetaData.tags,
            user_input,
            siteMetaData.normalized_base_url,
          ],
          last_analyzed: new Date().toISOString(),
          overall_score: overallScore.overall_score,
          reasoning: overallScore.reasoning ? overallScore.reasoning : '',
          category_scores: categoryScores,
        });

        const analysisResult: ResultItem = {
          _id: newSiteId,
          normalized_base_url: siteMetaData.normalized_base_url,
          site_name: siteMetaData.site_name,
          overall_score: overallScore.overall_score,
          reasoning: overallScore.reasoning,
        };

        result = [analysisResult];
        return result;
      }
    }
  },
});

const getWebsiteMetadata = async ({ site }: { site: string }) => {
  if (!site) throw new Error('No Site Provided');

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

  console.log('\nHitting Gemini API now.');
  const { object } = await generateObject({
    model: google('gemini-2.0-flash', {
      useSearchGrounding: true,
    }),
    system: 'You are a privacy practices analyzer and researcher.',
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
};

const extractClauses = async ({
  policy_documents_urls,
}: {
  policy_documents_urls: string[];
}) => {
  if (policy_documents_urls.length <= 0)
    throw new Error('No Policy Document URLs Provided');

  const prompt = `
      You are given the following urls:
      ${policy_documents_urls.map((u) => `${u}`).join('\n')}

      You are required to go through each page, extracting all relevant clauses that fall under each of these categories:
      ${scoringCategories.map((c, i) => `${i}. ${c.category_name}`).join('\n')}

      Important:
      - Use official sources only.
      - Prioritize the most current versions.
      - Clause should be the exact complete sentence or paragraph that clearly states the policy.
      - Each category should have a minimum of 10 clauses.
      - Each clause should be accompanied by a relevance score from 0 to 1, where 1 is highly relevant and 0 is not relevant at all.
      - Never hallucinate or return placeholder text - return empty strings or empty arrays if uncertain.
    `;

  console.log('\nHitting Gemini API now.');
  const { object } = await generateObject({
    model: google('gemini-2.0-flash', {
      useSearchGrounding: true,
    }),
    system:
      'You are a privacy policy analyzer. Your task is to extract and summarize the privacy practices of a website based on its terms of service or privacy policy.',
    prompt: prompt,
    temperature: 0,
    output: 'array',
    schema: z.object({
      category_name: z.enum([
        'Data Collection',
        'Data Sharing',
        'Data Retention and Security',
        'User Rights and Controls',
        'Transparency and Clarity',
      ]),
      clauses: z.array(
        z.object({
          clause: z.string(),
          relevance: z.number(),
        })
      ),
    }),
  });

  return object;
};

const getCategoryScores = async ({
  categoriesClauses,
}: {
  categoriesClauses: Awaited<ReturnType<typeof extractClauses>>;
}) => {
  if (!categoriesClauses) {
    throw new Error('No clauses provided.');
  }

  const promises = categoriesClauses.map(async (category) => {
    const filteredClauses = category.clauses.filter((c) => c.relevance >= 0.3);

    if (filteredClauses.length === 0) {
      console.warn(
        `No relevant clauses found for category: ${category.category_name}`
      );
      return;
    }

    const categoryRubric = scoringCategories.find(
      (r) => r.category_name === category.category_name
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

    if (!category_score || !reasoning) {
      throw new Error(
        `An unknown error occured scoring ${category.category_name}`
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

  const scores = await Promise.all(promises);
  if (!scores) throw new Error('Something went wrong.');

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
  const weightsTotal = categoryWeights.reduce((sum, w) => sum + w.weight, 0);

  const weight_x_score_sum = categoryScores
    .map(
      (c) =>
        categoryWeights.find((cw) => cw.category === c.category_name)!.weight *
        c.category_score
    )
    .reduce((sum, product) => sum + product, 0);

  const result = 10 * (weight_x_score_sum / weightsTotal);
  const overall_score = Math.round(result * 100) / 100;

  const prompt = `
      A website's privacy practices are evaluated in the following categories with their reasoning:

      ${categoryScores
        .map(
          (category) =>
            `${category.category_name}: ${category.category_score}.\n Reasoning: ${category.reasoning}`
        )
        .join('\n\n')}

      Write a brief explanation that tells users what this means for them in practical terms.
      Requirements for the explanation:
      - Focus on concrete user impact (what information is collected or shared, how long it may be kept, what choices/controls users have, and how clearly this is communicated).
      - Be clear, specific, and non-ambiguous.
      - Do NOT mention any numeric scores, category names, or the website name.
      - Avoid jargon and hedging language.
      Return only the explanation, at most 2 short sentences.
    `;

  try {
    console.log('\nHitting Gemini API now.');
    const { object } = await generateObject({
      model: google('gemini-2.0-flash-lite'),
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
      'Something went wrong getting a reasoning for the overall score',
      error
    );
    return {
      overall_score,
      reasoning: '',
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
      .join('\n')}

    You are given the following rubric for scoring the website's performance in ${category_name} based on the provided clauses:
    
    ${rubric.map((r) => `Score: ${r.score} - ${r.description}`).join('\n')}

    Carefully go through all provided clauses and find the most appropriate numeric score for the website in ${category_name}.

    Return two fields: a category_score (number) and a reasoning (string).
    The reasoning must:
    - Focus on what this means for users in real terms (e.g., what data is collected/shared/retained, what choices users have, and any notable risks or protections).
    - Be clear, concrete, and non-ambiguous.
    - NOT mention the numeric score or the website name.
    - Avoid jargon and hedging language.
    Keep it to at most 2 short sentences, understandable by a non-technical user.
  `;

  try {
    console.log('\nHitting Gemini API now.');
    const { object } = await generateObject({
      model: google('gemini-2.0-flash-lite'),
      prompt,
      temperature: 0,
      maxTokens: 500,
      schema: z.object({
        category_score: z.number(),
        reasoning: z.string(),
      }),
    });

    return object;
  } catch (error) {
    console.error('Something went wrong: ', error);
    throw new Error(`Failed to generate score for ${category_name}`);
  }
}

/**
 *
 */
