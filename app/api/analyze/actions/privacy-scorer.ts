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
    - For reasoning, use simple language, understandable by a non-technical user and keep it to a maximum of three short sentences.
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
