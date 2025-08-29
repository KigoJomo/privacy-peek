import { SiteDetails } from '@/convex/lib';

const mockId = (s: string): SiteDetails['_id'] =>
  s as unknown as SiteDetails['_id'];

export const SAMPLE_SITES: SiteDetails[] = [
  // High score
  {
    _id: mockId('signal'),
    normalized_base_url: 'https://www.signal.org',
    site_name: 'Signal',
    policy_documents_urls: [
      'https://signal.org/legal/',
      'https://signal.org/legal/privacy/',
    ],
    last_analyzed: new Date('2025-08-18T10:00:00.000Z').toISOString(),
    overall_score: 92,
    reasoning:
      'Strong privacy by design with minimal collection and clear user controls.',
    category_scores: [
      {
        category_name: 'Data Collection',
        category_score: 10,
        reasoning: 'Collects only what is needed for core functionality.',
      },
      {
        category_name: 'Data Sharing',
        category_score: 10,
        reasoning: 'No selling or sharing of personal data with third parties.',
      },
      {
        category_name: 'Data Retention and Security',
        category_score: 9,
        reasoning:
          'Robust encryption and minimal retention with user deletion options.',
      },
      {
        category_name: 'User Rights and Controls',
        category_score: 9,
        reasoning:
          'Clear processes for access and deletion; granular privacy controls.',
      },
      {
        category_name: 'Transparency and Clarity',
        category_score: 8,
        reasoning: 'Plain-language policies with good organization.',
      },
    ],
  },
  // Mid-low score
  {
    _id: mockId('amazon'),
    normalized_base_url: 'https://www.amazon.com',
    site_name: 'Amazon',
    policy_documents_urls: [
      'https://www.amazon.com/privacy',
      'https://www.amazon.com/gp/help/customer/display.html?nodeId=GLSBYFE9MGKKQXXM',
    ],
    last_analyzed: new Date('2025-08-21T17:45:00.000Z').toISOString(),
    overall_score: 56,
    reasoning:
      'Extensive data use for personalization and ads; standard rights.',
    category_scores: [
      {
        category_name: 'Data Collection',
        category_score: 5,
        reasoning:
          'Substantial collection across shopping, devices, and services.',
      },
      {
        category_name: 'Data Sharing',
        category_score: 5,
        reasoning:
          'Shares with numerous partners for business and advertising.',
      },
      {
        category_name: 'Data Retention and Security',
        category_score: 7,
        reasoning: 'Strong security; retention is long for business purposes.',
      },
      {
        category_name: 'User Rights and Controls',
        category_score: 6,
        reasoning:
          'Basic access/deletion; controls exist but spread across settings.',
      },
      {
        category_name: 'Transparency and Clarity',
        category_score: 6,
        reasoning: 'Comprehensive but lengthy and complex in parts.',
      },
    ],
  },
  // Very high score
  {
    _id: mockId('protonmail'),
    normalized_base_url: 'https://www.proton.me',
    site_name: 'Proton Mail',
    policy_documents_urls: [
      'https://www.proton.me/legal/privacy',
      'https://www.proton.me/legal/terms',
    ],
    last_analyzed: new Date('2025-08-23T08:20:00.000Z').toISOString(),
    overall_score: 95,
    reasoning:
      'Privacy-first architecture with end-to-end encryption and strong user rights.',
    category_scores: [
      {
        category_name: 'Data Collection',
        category_score: 10,
        reasoning: 'Minimal collection necessary for service.',
      },
      {
        category_name: 'Data Sharing',
        category_score: 10,
        reasoning: 'No third-party advertising or selling.',
      },
      {
        category_name: 'Data Retention and Security',
        category_score: 10,
        reasoning: 'Robust E2EE and strong security posture.',
      },
      {
        category_name: 'User Rights and Controls',
        category_score: 9,
        reasoning: 'Comprehensive rights and intuitive controls.',
      },
      {
        category_name: 'Transparency and Clarity',
        category_score: 9,
        reasoning: 'Clear, accessible, and frequently updated policies.',
      },
    ],
  },
  // Low score
  {
    _id: mockId('meta'),
    normalized_base_url: 'https://www.meta.com',
    site_name: 'Meta',
    policy_documents_urls: [
      'https://www.facebook.com/policy.php',
      'https://www.facebook.com/terms.php',
    ],
    last_analyzed: new Date('2025-08-22T11:05:00.000Z').toISOString(),
    overall_score: 42,
    reasoning:
      'Broad collection and sharing for advertising; user tools improving.',
    category_scores: [
      {
        category_name: 'Data Collection',
        category_score: 3,
        reasoning: 'Extensive collection across properties and third parties.',
      },
      {
        category_name: 'Data Sharing',
        category_score: 4,
        reasoning: 'Wide sharing for ads/measurement with complex controls.',
      },
      {
        category_name: 'Data Retention and Security',
        category_score: 7,
        reasoning: 'Mature security; retention varies and can be long.',
      },
      {
        category_name: 'User Rights and Controls',
        category_score: 6,
        reasoning: 'Rights supported but controls are complex to navigate.',
      },
      {
        category_name: 'Transparency and Clarity',
        category_score: 6,
        reasoning: 'Improved explanations but still dense.',
      },
    ],
  },
  // High-mid score
  {
    _id: mockId('apple'),
    normalized_base_url: 'https://www.apple.com',
    site_name: 'Apple',
    policy_documents_urls: [
      'https://www.apple.com/legal/privacy/',
      'https://www.apple.com/legal/internet-services/terms/site.html',
    ],
    last_analyzed: new Date('2025-08-20T09:15:00.000Z').toISOString(),
    overall_score: 78,
    reasoning: 'Privacy-forward features with business-related data uses.',
    category_scores: [
      {
        category_name: 'Data Collection',
        category_score: 8,
        reasoning: 'Collects necessary and some additional analytics data.',
      },
      {
        category_name: 'Data Sharing',
        category_score: 8,
        reasoning:
          'Primarily sharing with service providers; good user choices.',
      },
      {
        category_name: 'Data Retention and Security',
        category_score: 9,
        reasoning: 'Strong security practices and device-level protections.',
      },
      {
        category_name: 'User Rights and Controls',
        category_score: 8,
        reasoning: 'Solid tools for privacy settings and data requests.',
      },
      {
        category_name: 'Transparency and Clarity',
        category_score: 7,
        reasoning: 'Generally clear with some technical sections.',
      },
    ],
  },
  // Very low score
  {
    _id: mockId('freevpnow'),
    normalized_base_url: 'https://www.freevpnow.com',
    site_name: 'FreeVPNNow',
    policy_documents_urls: [
      'https://www.freevpnow.com/privacy',
      'https://www.freevpnow.com/terms',
    ],
    last_analyzed: new Date('2025-08-24T12:00:00.000Z').toISOString(),
    overall_score: 18,
    reasoning:
      'Aggressive data collection and sharing practices with vague disclosures.',
    category_scores: [
      {
        category_name: 'Data Collection',
        category_score: 2,
        reasoning: 'Excessive data collection beyond necessity.',
      },
      {
        category_name: 'Data Sharing',
        category_score: 1,
        reasoning: 'Broad sharing with advertisers and affiliates.',
      },
      {
        category_name: 'Data Retention and Security',
        category_score: 3,
        reasoning: 'Limited security transparency; long retention.',
      },
      {
        category_name: 'User Rights and Controls',
        category_score: 2,
        reasoning: 'Difficult processes and limited tooling.',
      },
      {
        category_name: 'Transparency and Clarity',
        category_score: 2,
        reasoning: 'Opaque and confusing privacy policy.',
      },
    ],
  },
  // Keep additional good example (will appear if more than 6 requested)
  {
    _id: mockId('wikipedia'),
    normalized_base_url: 'https://www.wikipedia.org',
    site_name: 'Wikipedia',
    policy_documents_urls: [
      'https://foundation.wikimedia.org/wiki/Policy:Privacy_policy',
      'https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use',
    ],
    last_analyzed: new Date('2025-08-19T14:30:00.000Z').toISOString(),
    overall_score: 86,
    reasoning: 'Nonprofit, transparent practices, and limited data collection.',
    category_scores: [
      {
        category_name: 'Data Collection',
        category_score: 9,
        reasoning: 'Minimal data collection focused on service delivery.',
      },
      {
        category_name: 'Data Sharing',
        category_score: 9,
        reasoning:
          'Limited sharing with service providers and strong disclosure.',
      },
      {
        category_name: 'Data Retention and Security',
        category_score: 8,
        reasoning: 'Good security with clear retention guidance.',
      },
      {
        category_name: 'User Rights and Controls',
        category_score: 8,
        reasoning: 'Clear processes for access and correction.',
      },
      {
        category_name: 'Transparency and Clarity',
        category_score: 8,
        reasoning: 'Readable policies with helpful structure.',
      },
    ],
  },
];

export const getSampleSites = (limit?: number): SiteDetails[] =>
  SAMPLE_SITES.slice(0, limit ?? SAMPLE_SITES.length);
