// lib/utils/scraper.ts

import { google, GoogleGenerativeAIProviderMetadata } from '@ai-sdk/google';
import { generateText } from 'ai';

type PolicyType = 'privacy' | 'terms' | 'data_handling';

export async function scoreWebsitePractices(url: string) {
  const { urls, groundingMetadata, safetyRatings } = await discoverPolicyUrls(url);

  return { // replace this later with analyzePolicies
    urls,
    groundingMetadata,
    safetyRatings,
  };
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
      "data-handling": "full_url" // or empty string if not separate
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
  
  const groundingMetadata = metadata?.groundingMetadata
  const safetyRatings = metadata?.safetyRatings;

  return {
    urls: JSON.parse(jsonMatch[0]) as Record<PolicyType, string>,
    groundingMetadata,
    safetyRatings,
  }
}

// async function analyzePolicies({ urls }: { urls: Record<PolicyType, string>; }) {
//   // prompt the model to go through the policies, look for clauses/sets of clauses that fit a certain category
//   // for each category, have a way to turn nl into a rule-based, scale-based score.
// }