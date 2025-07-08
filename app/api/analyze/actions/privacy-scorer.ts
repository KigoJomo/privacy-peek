import { generateText } from 'ai';
import {
  CalculatedScore,
  CategoryName,
  CategoryScore,
  CategoryScoringWeights,
  Clause,
  Rubric,
  scoringcategories,
} from './index';
import { google } from '@ai-sdk/google';

/**
 * Analyzes privacy policy clauses across multiple categories and calculates comprehensive privacy scores.
 *
 * This function evaluates privacy practices by scoring clauses in five key categories:
 *  - Data Collection
 *  - Data Sharing
 *  - Data Retention and Security
 *  - User Rights and Controls
 *  - Transparency and Clarity
 *
 * It filters clauses by relevance, applies category-specific
 * rubrics, and generates both individual category scores and an overall weighted score.
 *
 * @param params - Configuration object for scoring
 * @param params.clauses - Record mapping category names to arrays of extracted privacy clauses
 * @returns Promise resolving to a complete scoring result including overall score,
 *          reasoning, and detailed category breakdowns
 *
 * @example
 * ```typescript
 * const result = await scorePractices({
 *   clauses: {
 *     "Data Collection": [
 *       { clause: "We collect personal information", relevance: 0.8 }
 *     ]
 *   }
 * });
 * // Returns CalculatedScore with overall_score, reasoning, and category_scores
 * ```
 *
 * @throws Error if AI response format is invalid or scores are out of expected range
 */
export async function scorePractices({
  clauses,
}: {
  clauses: Record<CategoryName, Clause[]>;
}): Promise<CalculatedScore> {
  const category_scores: Record<CategoryName, CategoryScore> = {
    'Data Collection': { score: 0, reasoning: '', supporting_clauses: [] },
    'Data Sharing': { score: 0, reasoning: '', supporting_clauses: [] },
    'Data Retention and Security': {
      score: 0,
      reasoning: '',
      supporting_clauses: [],
    },
    'User Rights and Controls': {
      score: 0,
      reasoning: '',
      supporting_clauses: [],
    },
    'Transparency and Clarity': {
      score: 0,
      reasoning: '',
      supporting_clauses: [],
    },
  };

  // Iterate over each category and score them
  const promises = Object.entries(clauses).map(async ([key, value]) => {
    const filteredClauses = value.filter((c) => c.relevance >= 0.3);

    if (filteredClauses.length === 0) {
      console.warn(`No relevant clauses found for category: ${key}`);
      return;
    }

    const categoryRubric: Rubric | undefined = scoringcategories.find(
      (c) => c.category_name === key
    )?.rubric;

    if (!categoryRubric) {
      console.warn(`No rubric found for category: ${key}`);
      return;
    }

    const categoryScore = await scoreByCategory({
      categoryName: key as CategoryName,
      clauses: filteredClauses,
      rubric: categoryRubric,
    });

    return { categoryName: key as CategoryName, categoryScore };
  });

  const scores = await Promise.all(promises);

  scores.forEach((score) => {
    if (!score) return;
    category_scores[score.categoryName] = score.categoryScore;
  });

  /**
   * use category_scores to get overall_score and reasoning
   */
  const { overall_score, reasoning } = await getOverallScore({
    category_scores,
  });

  return {
    overall_score,
    reasoning,
    category_scores,
  };
}

/**
 * Scores a privacy policy category based on extracted clauses and a scoring rubric.
 *
 * Uses AI to analyze privacy policy clauses for a specific category and assign a score
 * between 0-10 based on privacy protection standards.
 *
 * @param categoryName - The privacy category being scored (e.g., "Data Collection")
 * @param clauses - Array of relevant clauses extracted from privacy policy
 * @param rubric - Scoring criteria mapping score ranges to privacy standards
 * @returns Promise resolving to category score and reasoning
 * @throws Error if response format is invalid or score is out of range
 */
async function scoreByCategory({
  categoryName,
  clauses,
  rubric,
}: {
  categoryName: CategoryName;
  clauses: Clause[];
  rubric: Rubric;
}): Promise<CategoryScore> {
  const prompt = `
    These are clauses extracted from a website's Privacy Policy and Terms of Service specifically regarding ${categoryName}:
    
    ${clauses.map((c) => `- ${c.clause} (Relevance: ${c.relevance})`).join('\n')}
    
    Based on the following rubric, please score the website's practices in this category between 0 and 10, where:
    ${Object.entries(rubric)
      .map(([key, value]) => `- ${key}: ${value}`)
      .join('\n')}
    Provide a brief reasoning for your score, focusing on the most relevant clauses and their implications for user privacy and data protection.

    Return only a JSON object in this format:
    {
      "score": number, // between 0 and 10
      "reasoning": string // brief explanation of the score
    }

    Important:
    - Focus on the most relevant clauses and their implications for user privacy.
    - For reasoning, use simple language, understandable by a non-technical user.
    - Do not include any additional text or explanations outside the JSON object.
  `;

  const { text } = await generateText({
    model: google('gemini-2.0-flash-lite'),
    prompt: prompt,
    temperature: 0.2,
    maxTokens: 500,
  });

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.warn(`No valid JSON object found in response for ${categoryName}`);
    return { score: 0, reasoning: '', supporting_clauses: [] };
  }

  const result = JSON.parse(jsonMatch[0]) as CategoryScore;
  if (typeof result.score !== 'number' || typeof result.reasoning !== 'string')
    throw new Error(
      `Invalid response format for ${categoryName}: ${JSON.stringify(result)}`
    );

  if (result.score < 0 || result.score > 10)
    throw new Error(
      `Score out of range for ${categoryName}: ${result.score}. Expected between 0 and 10.`
    );

  return {
    score: result.score,
    reasoning: result.reasoning,
    supporting_clauses: clauses.map(c => c.clause)
  };
}

/**
 * Calculates an overall privacy score based on weighted category scores and generates reasoning.
 *
 * Computes a weighted average of all category scores using predefined weights, then uses AI
 * to generate human-readable reasoning explaining the overall privacy score.
 *
 * @param category_scores - Record mapping category names to their scores and reasoning
 * @returns Promise resolving to object containing overall score (0-100) and AI-generated reasoning
 */
async function getOverallScore({
  category_scores,
}: {
  category_scores: Record<CategoryName, CategoryScore>;
}) {
  // code for the math, AI for the words
  const weightsTotal = Object.values(CategoryScoringWeights).reduce(
    (sum, weight) => sum + weight,
    0
  );

  const weight_x_score_sum = Object.entries(category_scores)
    .map(
      ([key, value]) =>
        CategoryScoringWeights[key as CategoryName] * value.score
    )
    .reduce((sum, product) => sum + product, 0);

  const result = 10 * (weight_x_score_sum / weightsTotal);
  const overall_score = Math.round(result * 100) / 100;

  // pass calculated score and the category_scores object and prompt the model to give a brief reasoning.
  const prompt = `
    Based on the following category scores, provide a brief reasoning for the overall privacy score:
    
    ${Object.entries(category_scores)
      .map(
        ([key, value]) =>
          `- ${key}: Score: ${value.score}, Reasoning: ${value.reasoning}`
      )
      .join('\n')}
    
    Overall score is calculated as a weighted average based on the following weights:
    
    ${Object.entries(CategoryScoringWeights)
      .map(([key, value]) => `- ${key}: Weight: ${value}`)
      .join('\n')}
    
    The overall score is ${overall_score.toFixed(2)}.
    
    Provide a brief reasoning for this overall score, focusing on the most impactful categories and their implications for user privacy.

    Important:
    - Return at most 2 sentences.
    - Use simple language, understandable by a non-technical user.
    - Do not include any additional text or explanations outside the reasoning.
  `;

  const { text } = await generateText({
    model: google('gemini-2.0-flash-lite'),
    prompt,
    temperature: 0.2,
    maxTokens: 500,
  });

  return {
    overall_score,
    reasoning: text,
  };
}
