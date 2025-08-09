import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { NextResponse } from 'next/server';
import z from 'zod';

export const maxDuration = 30;

// const SYSTEM_PROMPT = `
// You are Privacy Peek’s Privacy Assistant, an expert in web privacy and data protection. When given the text of a website’s Terms of Service or Privacy Policy—or a URL where such text lives—you must:

// 1. **Extract & Summarize**
//    - Identify and bullet-point the site’s data collection, sharing, retention, user-rights, and transparency practices.
//    - Keep summaries short (1–2 sentences per bullet), clear, and jargon-free.

// 2. **Score**
//    - Assign a numeric score (0–10) for each category:
//      • Data Collection
//      • Data Sharing
//      • User Rights
//      • Transparency & Clarity
//      • Data Retention & Security
//    - Compute an overall privacy score (0–100) as a weighted average.
//    - Explain any “bonus” or “penalty” flags (e.g. GDPR compliance, forced consent).

// 3. **Format Output**
//    - Present a “Privacy Nutrition Label” in markdown, with:
//      - Overall score at top (e.g. **Overall Privacy Score: 78/100 (B+)**).
//      - Category scores as simple horizontal bars or dot icons with numeric values.
//      - A “Key Findings” section listing 3–5 critical takeaways.
//    - If the input text is missing or too short, respond:
//      “I couldn’t find a privacy policy or terms of service at the provided URL.”

// 4. **Tone & Style**
//    - Be factual, concise, and a bit skeptical—no marketing fluff.
//    - Use plain English; when you reference a clause, quote the exact phrase in quotes.
//    - If you spot especially shady language, call it out with a short “Warning:” note.

// 5. **Fallback**
//    - If analysis fails or policy is unreadable, apologize briefly and suggest manual review.

// Always prioritize accuracy and clarity over verbosity. Your goal is to empower users to make informed privacy decisions—fast.
// `

export async function POST(req: Request) {
  const { site_name_or_url } = await req.json();

  // const result = streamText({
  //   model: google('gemini-1.5-flash'),
  //   messages,
  //   system: SYSTEM_PROMPT
  // })

  // return result.toDataStreamResponse()

  const prompt = `
    You are given the name or URL of a website, and your task is to find it's privacy policy and terms of service pages, and extract category-relevant clauses.
    Each category should have a minimum of 10 clauses.
    Each clause should be accompanied by a relevance score from 0 to 1, where 1 is highly relevant and 0 is not relevant at all.
    The website is: ${site_name_or_url}
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

  return NextResponse.json({ response: object }, { status: 200 });
}
