'use server';

import { google, GoogleGenerativeAIProviderMetadata } from '@ai-sdk/google';
import { generateText } from 'ai';
import chalk from 'chalk';
import {
  CategoryName,
  Clause,
  PolicyType,
  scoringcategories,
} from '@/app/api/analyze/actions/index';

/**
 * Analyzes website privacy policies and terms of service by discovering relevant policy URLs
 * and extracting clauses categorized by privacy scoring criteria.
 *
 * @param params - The analysis parameters
 * @param params.url - The base website URL to analyze policies for
 * @returns A promise that resolves to an object containing:
 *   - `urls`: Record of discovered policy URLs by type (privacy, terms, data_handling)
 *   - `clauses`: Record of extracted clauses organized by scoring category
 *
 * @example
 * ```typescript
 * const result = await analyzeWebsitePolicies({ url: 'https://example.com' });
 * console.log(result.urls.privacy); // Privacy policy URL
 * console.log(result.clauses['Data Collection']); // Array of relevant clauses
 * ```
 *
 * @throws {Error} When AI response format is invalid or JSON parsing fails
 */
export async function analyzeWebsitePolicies({ url }: { url: string }) {
  const { urls } = await discoverPolicyUrls(url);
  const fullWebsiteUrl = await getFullWebsiteUrl({ url });
  const clauses = await analyzePolicies({ urls });

  return {
    urls,
    full_website_url: fullWebsiteUrl,
    clauses,
  };
}

async function getFullWebsiteUrl({ url }: { url: string }) {
  if (!url) throw new Error('Invalid URL');

  const prompt = `You are a web researcher. Given the base URL "${url}", return the full website URL including
    the protocol (http or https).
    Return ONLY the full URL without any additional text.
    Example:
    Input: "example.com"
    Output: "https://example.com"
  `;

  const { text } = await generateText({
    model: google('gemini-2.0-flash-lite', {
      useSearchGrounding: true,
    }),
    prompt: prompt,
    temperature: 0.2,
    maxTokens: 100,
  });

  const fullUrlMatch = text.match(/https?:\/\/[^\s]+/);
  if (!fullUrlMatch) throw new Error('AI response format invalid');
  const fullUrl = fullUrlMatch[0].trim();
  if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
    throw new Error('Invalid URL format returned by AI');
  }
  return fullUrl;
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
    - Properly escape all quotes and special characters in the clause text.
    - Replace any newlines in clause text with \\n.
    `;

    console.log(chalk.bgBlack(`>>> Analyzing ${category_name} for ${url}`));

    try {
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

      // Try to parse the JSON
      try {
        return JSON.parse(jsonMatch[0]) as Clause[];
      } catch (parseError) {
        console.error(
          chalk.red(`>>> JSON parse error for ${category_name}:`),
          parseError
        );

        // Attempt to fix common JSON issues
        let fixedJson = jsonMatch[0];

        // Fix unescaped quotes in clause text
        fixedJson = fixedJson.replace(
          /"clause":\s*"([^"]*)"([^"]*)"([^"]*)"(\s*,\s*"relevance")/g,
          '"clause": "$1\\"$2\\"$3"$4'
        );

        // Fix unescaped newlines
        fixedJson = fixedJson.replace(/\n/g, '\\n');

        // Fix unescaped backslashes
        fixedJson = fixedJson.replace(/\\\\/g, '\\');

        // Retry JSON parsing
        try {
          return JSON.parse(fixedJson) as Clause[];
        } catch (finalParseError) {
          console.error(
            chalk.red(
              `>>> Final JSON parse attempt failed for ${category_name}:`
            ),
            finalParseError
          );
          return [];
        }
      }
    } catch (error) {
      console.error(
        chalk.red(`>>> Error analyzing ${category_name} for ${url}:`),
        error
      );
      return [];
    }
  }

  /** */
  const allClauses: Record<CategoryName, Clause[]> = {
    'Data Collection': [],
    'Data Sharing': [],
    'Data Retention and Security': [],
    'User Rights and Controls': [],
    'Transparency and Clarity': [],
  };

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
