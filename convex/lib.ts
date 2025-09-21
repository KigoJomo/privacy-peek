import { Infer, v } from 'convex/values';
import type { Id } from './_generated/dataModel';

export type RequireOnly<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export const CategoryNameValidator = v.union(
  v.literal("Data Collection"),
  v.literal("Data Sharing"),
  v.literal("Data Retention and Security"),
  v.literal("User Rights and Controls"),
  v.literal("Transparency and Clarity"),
)

export type CategoryName = Infer<typeof CategoryNameValidator>;

export interface SiteDetails {
  _id: Id<'sites'>;
  normalized_base_url: string;
  site_name: string;
  policy_documents_urls: string[];
  last_analyzed: string;
  overall_score: number;
  reasoning: string;
  category_scores: Array<{
    category_name: CategoryName;
    category_score: number;
    reasoning: string;
  }>;
}

interface ScoringCategory {
  category_name: CategoryName;
  rubric: {
    score: number;
    description: string;
  }[];
}

export const scoringCategories: ScoringCategory[] = [
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
        description: 'Widespread sharing with minimal disclosure or consent',
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
        description: 'No meaningful user rights or control over personal data',
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

export const categoryWeights: Array<{
  category: CategoryName;
  weight: number;
}> = [
  { category: 'Data Collection', weight: 1.0 },
  { category: 'Data Sharing', weight: 1.5 },
  { category: 'Data Retention and Security', weight: 1.2 },
  { category: 'User Rights and Controls', weight: 1.0 },
  { category: 'Transparency and Clarity', weight: 0.8 },
];
