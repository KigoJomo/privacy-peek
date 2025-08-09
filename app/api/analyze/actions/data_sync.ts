'use server';

import { fetchMutation } from 'convex/nextjs';
import { CategoryName, CategoryScore } from '.';
import { api } from '@/convex/_generated/api';

interface InsertWebsiteProps {
  site_name: string;
  normalized_url: string;
  tags: string[];
  overall_score: number;
  reasoning: string;
  category_scores: Record<CategoryName, CategoryScore>;
}

export async function insertWebsite(data: InsertWebsiteProps) {
  try {
    if (!data.site_name || !data.normalized_url) {
      throw new Error('Missing required fields: site_name or normalized_url');
    }

    if (data.overall_score < 0 || data.overall_score > 100) {
      throw new Error('Overall score must be between 0 and 100');
    }

    const newWebsiteId = await fetchMutation(api.websites.insertAnalysis, data);
    return newWebsiteId;
  } catch (error) {
    console.error('Error inserting website analysis:', error);
    throw new Error(
      `Failed to store website analysis: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
