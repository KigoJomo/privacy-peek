import { v } from 'convex/values';
import { action } from './_generated/server';
import { api, internal } from './_generated/api';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { Id } from './_generated/dataModel';
import z from 'zod';

/*  */
/*  */

interface ScoringCategory {
  category_name:
    | 'Data Collection'
    | 'Data Sharing'
    | 'Data Retention and Security'
    | 'User Rights and Controls'
    | 'Transparency and Clarity';
  rubric: {
    score: number;
    description: string;
  }[];
}

const scoringCategories: ScoringCategory[] = [
  {
    category_name: 'Data Collection',
    rubric: [
      {
        score: 10,
        description:
          'Only collects data absolutely essential for core service functionality with explicit, granular consent for each data type',
      },
      {
        score: 9,
        description:
          'Collects minimal data necessary for service with clear consent mechanisms and detailed explanations',
      },
      {
        score: 8,
        description:
          'Collects necessary data with some additional functional data, good consent practices',
      },
      {
        score: 7,
        description:
          'Collects reasonable amount of data with adequate consent, some non-essential collection',
      },
      {
        score: 6,
        description:
          'Collects moderate amount of data including some convenience features, basic consent',
      },
      {
        score: 5,
        description:
          'Collects substantial data including analytics and personalization, broad consent categories',
      },
      {
        score: 4,
        description:
          'Collects extensive data for multiple purposes, vague consent mechanisms',
      },
      {
        score: 3,
        description:
          'Collects broad data categories with minimal user control or unclear purposes',
      },
      {
        score: 2,
        description:
          'Collects excessive data with poor justification and limited consent options',
      },
      {
        score: 1,
        description:
          'Collects extensive personal data without clear necessity, consent, or user awareness',
      },
    ],
  },
  {
    category_name: 'Data Sharing',
    rubric: [
      {
        score: 10,
        description:
          'No data sharing with third parties, or only with explicit opt-in consent for each recipient',
      },
      {
        score: 9,
        description:
          'Very limited sharing only with essential service providers, clear user control',
      },
      {
        score: 8,
        description:
          'Shares only with trusted partners for core functionality, good transparency',
      },
      {
        score: 7,
        description:
          'Limited sharing with partners, clear disclosure and some user control',
      },
      {
        score: 6,
        description:
          'Moderate sharing with business partners, adequate disclosure',
      },
      {
        score: 5,
        description:
          'Shares data with various partners for business purposes, basic disclosure',
      },
      {
        score: 4,
        description:
          'Broad sharing with multiple categories of partners, limited user control',
      },
      {
        score: 3,
        description:
          'Extensive sharing for marketing and analytics with poor user control',
      },
      {
        score: 2,
        description:
          'Widespread sharing with minimal disclosure or consent',
      },
      {
        score: 1,
        description:
          'Unrestricted data sharing with third parties without meaningful user consent or disclosure',
      },
    ],
  },
  {
    category_name: 'Data Retention and Security',
    rubric: [
      {
        score: 10,
        description:
          'Strong encryption, minimal retention periods, automatic deletion, comprehensive security measures',
      },
      {
        score: 9,
        description:
          'Excellent security practices, clear retention limits, user-controlled deletion',
      },
      {
        score: 8,
        description:
          'Good security measures, reasonable retention periods, deletion options available',
      },
      {
        score: 7,
        description:
          'Adequate security practices, defined retention periods, some deletion capabilities',
      },
      {
        score: 6,
        description:
          'Basic security measures, moderate retention periods, limited deletion options',
      },
      {
        score: 5,
        description:
          'Standard security practices, long but defined retention periods',
      },
      {
        score: 4,
        description:
          'Minimal security details, vague retention periods, difficult deletion process',
      },
      {
        score: 3,
        description:
          'Poor security transparency, indefinite retention mentioned, no deletion options',
      },
      {
        score: 2,
        description:
          'Inadequate security measures, permanent data retention, no user control',
      },
      {
        score: 1,
        description:
          'No meaningful security measures, indefinite retention without user recourse',
      },
    ],
  },
  {
    category_name: 'User Rights and Controls',
    rubric: [
      {
        score: 10,
        description:
          'Comprehensive user rights including access, correction, deletion, portability, and granular privacy controls',
      },
      {
        score: 9,
        description:
          'Strong user rights with easy-to-use tools for data management and privacy controls',
      },
      {
        score: 8,
        description:
          'Good user rights including access, correction, and deletion with clear processes',
      },
      {
        score: 7,
        description:
          'Basic user rights with functional but limited tools for data control',
      },
      {
        score: 6,
        description:
          'Some user rights available but with restrictions or complex procedures',
      },
      {
        score: 5,
        description:
          'Limited user rights, basic access and deletion available with effort',
      },
      {
        score: 4,
        description:
          'Minimal user rights, difficult processes, long response times',
      },
      {
        score: 3,
        description:
          'Very limited rights, cumbersome procedures, poor responsiveness',
      },
      {
        score: 2,
        description:
          'Barely functional user rights, significant barriers to data control',
      },
      {
        score: 1,
        description:
          'No meaningful user rights or control over personal data',
      },
    ],
  },
  {
    category_name: 'Transparency and Clarity',
    rubric: [
      {
        score: 10,
        description:
          'Crystal clear language, comprehensive explanations, easy navigation, regular updates communicated',
      },
      {
        score: 9,
        description:
          'Very clear and accessible language, well-organized content, good update practices',
      },
      {
        score: 8,
        description:
          'Clear language with minimal jargon, logical organization, adequate update notifications',
      },
      {
        score: 7,
        description:
          'Generally clear with some technical terms, reasonable organization',
      },
      {
        score: 6,
        description:
          'Moderately clear but includes jargon, basic organization, some unclear sections',
      },
      {
        score: 5,
        description:
          'Mixed clarity with technical language, confusing organization in places',
      },
      {
        score: 4,
        description:
          'Difficult to understand, heavy use of legal jargon, poor organization',
      },
      {
        score: 3,
        description:
          'Very unclear language, confusing structure, important information buried',
      },
      {
        score: 2,
        description:
          'Extremely difficult to understand, deliberately obfuscated, poor accessibility',
      },
      {
        score: 1,
        description:
          'Incomprehensible or deliberately misleading language, no meaningful transparency',
      },
    ],
  },
];

/*  */
/*  */

export const checkExistingRecord = action({
  args: { user_input: v.string() },
  handler: async (ctx, { user_input }) => {
    if (!user_input) throw new Error('No User Input');

    const sites = await ctx.runQuery(internal.internalQueries.getSiteSByTag, {
      user_input: user_input,
    });

    let result: {
      _id: Id<'sites'>;
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
      const { normalized_base_url } = await ctx.runAction(
        api.actions.getWebsiteMetadata,
        {
          site: user_input,
        }
      );

      const site = await ctx.runQuery(internal.internalQueries.getSiteByUrl, {
        normalized_base_url,
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
  },
});

export const extractClauses = action({
  args: {
    policy_documents_urls: v.array(v.string()),
  },
  handler: async (_, { policy_documents_urls }) => {
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
        category: z.enum([
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
  },
});

// scoring