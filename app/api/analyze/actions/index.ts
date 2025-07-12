import { formatRelativeTime } from '@/lib/utils/utils';
import { insertWebsite } from './data_sync';
import { analyzeWebsitePolicies } from './policy-analyzer';
import { scorePractices } from './privacy-scorer';

export type PolicyType = 'privacy' | 'terms';

export interface Clause {
  clause: string;
  relevance: number;
}

export type CategoryName =
  | 'Data Collection'
  | 'Data Sharing'
  | 'Data Retention and Security'
  | 'User Rights and Controls'
  | 'Transparency and Clarity';

export interface CategoryScore {
  score: number;
  reasoning: string;
  supporting_clauses: string[];
}

export interface Rubric {
  10: string;
  5: string;
  0: string;
}

export interface ScoringCategory {
  category_name: CategoryName;
  rubric: Rubric;
}

export const CategoryScoringWeights: Record<CategoryName, number> = {
  'Data Collection': 1.0,
  'Data Sharing': 1.5,
  'Data Retention and Security': 1.2,
  'User Rights and Controls': 1.0,
  'Transparency and Clarity': 0.8,
};

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

export interface CalculatedScore {
  overall_score: number;
  reasoning: string;
  category_scores: Record<CategoryName, CategoryScore>;
}

export default async function analyzeWebsitePrivacy({ url }: { url: string }) {
  if (!url || typeof url !== 'string') {
    throw new Error('Invalid URL provided');
  }

  try {
    const {
      site_name,
      normalized_url,
      tags,
      clauses,
      recentlyAnalyzed,
      existingSite,
    } = await analyzeWebsitePolicies({ url });

    if ((!recentlyAnalyzed || !existingSite) && clauses) {
      const { overall_score, reasoning, category_scores } =
        await scorePractices({
          clauses,
        });

      const websiteId = await insertWebsite({
        site_name,
        normalized_url,
        tags,
        overall_score,
        reasoning,
        category_scores,
      });

      return {
        websiteId,
        site_name,
        full_url: normalized_url,
        last_analyzed: formatRelativeTime(new Date().toISOString()),
        overall_score,
        reasoning,
        category_scores,
      };
    } else if (recentlyAnalyzed && existingSite) {
      return {
        websiteId: existingSite._id,
        site_name: existingSite.site_name,
        full_url: existingSite.normalized_url,
        last_analyzed: formatRelativeTime(existingSite.last_analyzed),
        overall_score: existingSite.overall_score,
        reasoning: existingSite.reasoning,
        category_scores: existingSite.category_scores,
      };
    }
  } catch (error) {
    console.error('Error in analyzeWebsitePrivacy:', error);
    throw new Error(
      `Privacy analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
