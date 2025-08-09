// app/_components/search_action.ts

'use server';

import { QuickSearchSchema } from '@/lib/schema';
import analyzeWebsitePrivacy, { CategoryName } from '../api/analyze/actions';
import { CategoryScore } from '../api/analyze/actions/index';

export interface SearchResult {
  websiteId: string;
  site_name: string;
  full_url: string;
  last_analyzed: string;
  overall_score: number;
  reasoning: string;
  category_scores: Record<CategoryName, CategoryScore>;
}

export interface AnalyzeState {
  result?: SearchResult;
  error?: string;
  isLoading: boolean;
}

export async function analyzeWebsiteAction(
  prevState: AnalyzeState,
  formData: FormData
): Promise<AnalyzeState> {
  try {
    const rawData = {
      search_term: formData.get('search_term'),
    };

    const validatedData = QuickSearchSchema.parse(rawData);

    const result = await analyzeWebsitePrivacy({
      url: validatedData.search_term,
    });

    if (!result) {
      return {
        error: 'No analysis returned',
        isLoading: false
      };
    }

    return {
      result,
      error: undefined,
      isLoading: false,
    };
  } catch (error) {
    console.error('Error in analyzeWebsiteAction: ', error);
    return {
      error:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.',
      isLoading: false,
    };
  }
}
