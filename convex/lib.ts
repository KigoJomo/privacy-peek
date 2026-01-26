import { Infer, v } from 'convex/values';
import type { Id } from './_generated/dataModel';

export type RequireOnly<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export const CategoryNameValidator = v.union(
  v.literal('Data Collection'),
  v.literal('Data Sharing'),
  v.literal('Data Retention and Security'),
  v.literal('User Rights and Controls'),
  v.literal('Transparency and Clarity')
);

export const AnalysisStatusValidator = v.union(
  v.literal('queued'),
  v.literal('checking_recent'),
  v.literal('getting_site_info'),
  v.literal('reading_policies'),
  v.literal('categorizing_and_scoring'),
  v.literal('computing_overall_score'),
  v.literal('finalizing'),
  v.literal('complete'),
  v.literal('error')
);

export type CategoryName = Infer<typeof CategoryNameValidator>;
export type AnalysisStatus = Infer<typeof AnalysisStatusValidator>;

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
          'Collects only strictly essential data for core functionality, with explicit per-use consent and documented business justification for each data type collected',
      },
      {
        score: 9,
        description:
          'Minimal data collection limited to essential functionality, granular consent options, and clear statement of purpose for all collection',
      },
      {
        score: 8,
        description:
          'Collects essential data plus limited functional analytics, with consent checkboxes and explanations of data use',
      },
      {
        score: 7,
        description:
          'Collects necessary service data plus some non-essential features, reasonable consent structure but some categories remain undefined',
      },
      {
        score: 6,
        description:
          'Moderate data collection including analytics, personalization, and tracking, with basic consent mechanisms',
      },
      {
        score: 5,
        description:
          'Collects substantial data across multiple categories (behavioral, location, preferences) with vague justifications and broad consent requests',
      },
      {
        score: 4,
        description:
          'Extensive data collection for profiling and third-party purposes, consent mechanisms weak or pre-checked, purposes remain unclear',
      },
      {
        score: 3,
        description:
          'Broad unrestricted data collection across device, behavioral, and personal categories with minimal transparency about scope or purpose',
      },
      {
        score: 2,
        description:
          'Collects comprehensive personal and behavioral data including sensitive information with minimal consent and no clear limitation',
      },
      {
        score: 1,
        description:
          'Collects extensive personal data without meaningful consent, user awareness, or stated limitations; data scope undefined',
      },
    ],
  },
  {
    category_name: 'Data Sharing',
    rubric: [
      {
        score: 10,
        description:
          'Explicitly states no third-party sharing except with explicit per-recipient opt-in; any essential service providers are named and contractually bound',
      },
      {
        score: 9,
        description:
          'Very restricted sharing only with clearly named essential service providers; users have granular control over each sharing relationship',
      },
      {
        score: 8,
        description:
          'Shares only with identified service providers necessary for core function; users can control or disable sharing; no marketing sharing',
      },
      {
        score: 7,
        description:
          'Shares with identified partners for stated business purposes with user control options available, though opting out may be difficult',
      },
      {
        score: 6,
        description:
          'Moderate sharing with multiple partner categories (analytics, marketing, service providers); basic transparency but limited user control',
      },
      {
        score: 5,
        description:
          'Shares data with various partners including marketing and analytics without explicit per-partner consent; categories broadly defined but vague',
      },
      {
        score: 4,
        description:
          'Widespread sharing with multiple partner categories; partners named only generically; user control minimal or requires account changes',
      },
      {
        score: 3,
        description:
          'Shares broadly with business partners, affiliates, and advertisers with minimal disclosure; category-based sharing (not partner-specific) disclosed poorly',
      },
      {
        score: 2,
        description:
          'Shares extensively with undefined categories of third parties; policy indicates sharing for "business purposes" or "improvements" without specifics',
      },
      {
        score: 1,
        description:
          'No meaningful disclosure of sharing practices; policy suggests unrestricted third-party sharing or sharing practices remain completely undefined',
      },
    ],
  },
  {
    category_name: 'Data Retention and Security',
    rubric: [
      {
        score: 10,
        description:
          'States strong encryption for data in transit and at rest, minimal specific retention periods (e.g., days/weeks), automatic deletion of data, regular security audits mentioned',
      },
      {
        score: 9,
        description:
          'Encryption mentioned for sensitive data, short defined retention periods (e.g., under 1 year), user-initiated deletion available, security practices described',
      },
      {
        score: 8,
        description:
          'Describes encryption for sensitive data, reasonable retention periods (1-3 years), deletion options available to users, basic security measures mentioned',
      },
      {
        score: 7,
        description:
          'Security measures mentioned (encryption or standards referenced), retention periods defined but longer (3-5 years), some user control over deletion',
      },
      {
        score: 6,
        description:
          'Basic security practices mentioned, retention periods defined but lengthy (5+ years), deletion requests possible but require account closure or contact',
      },
      {
        score: 5,
        description:
          'Generic security claims without specific mechanisms, retention periods long or vague ("as long as needed"), deletion available only via customer support',
      },
      {
        score: 4,
        description:
          'Minimal security details provided, retention periods vague or "as needed," deletion process unclear, data may be retained for secondary purposes',
      },
      {
        score: 3,
        description:
          'Poor security transparency, indefinite retention stated or implied, deletion available only under legal request, no ongoing protection measures described',
      },
      {
        score: 2,
        description:
          'Inadequate or absent security measures, permanent retention stated for analytics or legal purposes, no user-initiated deletion option',
      },
      {
        score: 1,
        description:
          'No meaningful security commitments made, indefinite retention without justification, user recourse for deletion non-existent',
      },
    ],
  },
  {
    category_name: 'User Rights and Controls',
    rubric: [
      {
        score: 10,
        description:
          'Clearly lists all user rights (access, correction, deletion, portability, opt-out) with specific processes; users can exercise rights easily without barriers',
      },
      {
        score: 9,
        description:
          'Provides access to personal data, correction and deletion rights, with straightforward processes; portability mentioned; granular privacy controls available',
      },
      {
        score: 8,
        description:
          'Users can access data, request deletion, and make corrections with reasonable processes; some granular privacy controls (e.g., tracking opt-out)',
      },
      {
        score: 7,
        description:
          'Basic rights available (access, deletion) but with moderate friction; cookie controls present; some personalization preferences adjustable',
      },
      {
        score: 6,
        description:
          'Some rights mentioned but with restrictions or complex procedures; basic privacy settings available but not comprehensive',
      },
      {
        score: 5,
        description:
          'Limited rights described (access or deletion but not both) requiring effort or account management; minimal user control options',
      },
      {
        score: 4,
        description:
          'User rights mentioned but processes difficult or time-consuming; user controls relegated to account settings rather than data management',
      },
      {
        score: 3,
        description:
          'Very limited rights accessible; processes cumbersome or require contacting support; significant friction for opting out',
      },
      {
        score: 2,
        description:
          'Minimal functional user rights; significant barriers to exercising deletion, access, or opt-out; response times undefined',
      },
      {
        score: 1,
        description:
          'No meaningful user rights or controls described; no path for users to manage, delete, or control their personal data',
      },
    ],
  },
  {
    category_name: 'Transparency and Clarity',
    rubric: [
      {
        score: 10,
        description:
          'Language is simple and accessible to non-lawyers, minimal technical jargon, well-organized with clear sections, frequently updated with change summaries',
      },
      {
        score: 9,
        description:
          'Clearly written with definitions for technical terms, well-organized navigation, update log provided, accessible formatting',
      },
      {
        score: 8,
        description:
          'Mostly clear language with some jargon, logical document structure, updates dated and communicated, readable formatting',
      },
      {
        score: 7,
        description:
          'Generally understandable but contains technical terms without definitions, reasonable organization, update dates present',
      },
      {
        score: 6,
        description:
          'Moderately clear with significant jargon, basic organization, some sections unclear, update history unclear',
      },
      {
        score: 5,
        description:
          'Mixed clarity with heavy use of legal and technical jargon, confusing organization, updated but changes not summarized',
      },
      {
        score: 4,
        description:
          'Difficult to understand, dense legal language predominates, poor organization makes finding information challenging',
      },
      {
        score: 3,
        description:
          'Confusing structure, heavy jargon, important information buried, vague language when describing data practices',
      },
      {
        score: 2,
        description:
          'Deliberately complex language, poor organization, key practices described vaguely or in contradictory ways',
      },
      {
        score: 1,
        description:
          'Incomprehensible language, no meaningful structure, practices described in deliberately unclear or contradictory terms',
      },
    ],
  },
];

export const categoryWeights: Array<{
  category: CategoryName;
  weight: number;
}> = [
  { category: 'Data Collection', weight: 1.3 },
  { category: 'Data Sharing', weight: 1.6 },
  { category: 'Data Retention and Security', weight: 1.3 },
  { category: 'User Rights and Controls', weight: 1.1 },
  { category: 'Transparency and Clarity', weight: 0.7 },
];
