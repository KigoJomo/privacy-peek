// lib/utils/scraper.ts

import { google, GoogleGenerativeAIProviderMetadata } from '@ai-sdk/google';
import { generateText } from 'ai';
import chalk from 'chalk';

type PolicyType = 'privacy' | 'terms' | 'data_handling';

export async function scoreWebsitePractices(url: string) {
  const { urls } = await discoverPolicyUrls(url);

  const clauses = await analyzePolicies({ urls });

  return {
    urls,
    clauses,
  };
  // replace this later with actual scoring logic
}

async function discoverPolicyUrls(baseUrl: string) {
  const prompt = `
    You are an expert web researcher. For the website at ${baseUrl}, find these policy URLs:
    1. Privacy Policy (explicit data handling practices)
    2. Terms of Service (user agreements)
    3. Data Handling Policy (specific data practices if separate)
    
    Return ONLY a JSON object in this exact structure:
    {
      "privacy": "full_url",
      "terms": "full_url",
      "data_handling": "full_url" // or empty string if not separate
    }
    
    Important:
    - Use official sources only
    - Prioritize the most current versions
    - Verify URLs actually exist
    - Never hallucinate - return empty string if uncertain
  `;

  const { text, providerMetadata } = await generateText({
    model: google('gemini-2.0-flash', {
      useSearchGrounding: true,
    }),
    prompt: prompt,
    temperature: 0.2,
    maxTokens: 500,
  });

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('AI response format invalid');

  const metadata = providerMetadata?.google as
    | GoogleGenerativeAIProviderMetadata
    | undefined;

  const groundingMetadata = metadata?.groundingMetadata;
  const safetyRatings = metadata?.safetyRatings;

  return {
    urls: JSON.parse(jsonMatch[0]) as Record<PolicyType, string>,
    groundingMetadata,
    safetyRatings,
  };
}

/** */

interface ScoringCategory {
  category_name: string;
  rubric: {
    10: string;
    5: string;
    0: string;
  };
}

interface Clause {
  clause: string;
  relevance: number;
}

export const scoringcategories: ScoringCategory[] = [
  {
    category_name: 'Data Collection',
    rubric: {
      10: 'Only collects data strictly necessary for core service, with clear user consent.',
      5: ' Collects some additional data, but with justification and user awareness.',
      0: 'Collects excessive data without clear purpose or user consent.',
    },
  },
  {
    category_name: 'Data Sharing',
    rubric: {
      10: 'Does not share data with third parties, or shares only with explicit user consent.',
      5: 'Shares data with trusted partners, but with user knowledge and limited scope.',
      0: 'Shares data widely without user knowledge or consent.',
    },
  },
  {
    category_name: 'Data Retention and Security',
    rubric: {
      10: 'Implements strong security measures, retains data only as long as necessary, and allows users to delete their data.',
      5: 'Has basic security measures, retains data for a reasonable period, but does not allow users to delete their data.',
      0: 'Lacks security measures, retains data indefinitely, and does not allow users to delete their data.',
    },
  },
  {
    category_name: 'User Rights and Controls',
    rubric: {
      10: 'Provides users with clear rights and controls over their data, including access, correction, and deletion.',
      5: 'Provides some rights and controls, but with limitations or unclear processes.',
      0: 'Does not provide users with any rights or controls over their data.',
    },
  },
  {
    category_name: 'Transparency and Clarity',
    rubric: {
      10: 'Clearly communicates data practices, including collection, use, and sharing, in an easily understandable manner.',
      5: 'Communicates data practices, but with some jargon or complexity that may confuse users.',
      0: 'Fails to communicate data practices or does so in a confusing manner.',
    },
  },
];

async function analyzePolicies({ urls }: { urls: Record<PolicyType, string> }) {
  async function analyzePolicy({
    url,
    category_name,
  }: {
    url: string;
    category_name: string;
  }) {
    const prompt = `
    You are a privacy policy analyst. From the following url: ${url}, extract every clause that pertains to ${category_name}.
    Return ONLY a JSON array of objects in this format:
    [
      {
        "clause": "The specific clause text here",
        "relevance": 0.9
      },
      ...
    ]

    Important:
    - Clause should be the exact excerpt.
    - Relevance is a number between 0.0 (irrelevant) and 1.0 (perfectly on-topic).
    - Omit any entries below relevance 0.2.
    - Never hallucinate or return placeholder text - return empty array if no relevant clauses found.
    `;

    console.log(chalk.bgBlack(`>>> Analyzing ${category_name} for ${url}`));

    const { text } = await generateText({
      model: google('gemini-2.0-flash', {
        useSearchGrounding: true,
      }),
      prompt: prompt,
      temperature: 0.2,
      maxTokens: 2000,
    });

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.warn(
        chalk.yellow(
          `>>> No valid JSON array found in response for ${category_name}`
        )
      );
      return [];
    }

    return JSON.parse(jsonMatch[0]) as Clause[];
  }

  const allClauses: Record<string, Clause[]> = {};

  for (const category of scoringcategories) {
    const categoryResults: Record<PolicyType, Clause[]> = {
      privacy: [],
      data_handling: [],
      terms: [],
    };

    const promises = Object.entries(urls).map(async ([key, value]) => {
      if (!value) {
        console.log(chalk.red(`>>> No url provided for ${key}`));
        return { policy_type: key as PolicyType, clauses: [] };
      } else {
        const clauses = await analyzePolicy({
          url: value,
          category_name: category.category_name,
        });

        return { policy_type: key as PolicyType, clauses };
      }
    });

    const results = await Promise.all(promises);

    results.forEach(({ policy_type, clauses }) => {
      if (clauses.length > 0) {
        categoryResults[policy_type] = clauses;
      }
    });

    allClauses[category.category_name] = [
      ...categoryResults.privacy,
      ...categoryResults.terms,
      ...categoryResults.data_handling,
    ];
  }

  return allClauses;
}
