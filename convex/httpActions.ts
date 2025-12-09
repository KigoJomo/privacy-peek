import { httpAction } from './_generated/server';
import { api, internal } from './_generated/api';
import { Id } from './_generated/dataModel';

// CORS headers for extension requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Helper to create JSON response with CORS
const jsonResponse = (data: unknown, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
};

// Helper for CORS preflight
const corsPreflightResponse = () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

/**
 * GET /api/site?url=<url>
 * Lookup a site by URL (normalized base URL or tag)
 */
export const getSite = httpAction(async (ctx, req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return corsPreflightResponse();
  }

  if (req.method !== 'GET') {
    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  }

  const url = new URL(req.url);
  const siteUrl = url.searchParams.get('url');

  if (!siteUrl) {
    return jsonResponse({ error: 'Missing required parameter: url' }, 400);
  }

  try {
    // First try to find by tag (user input)
    const sitesByTag = await ctx.runQuery(internal.sites.getSiteSByTag, {
      user_input: siteUrl,
    });

    if (sitesByTag && sitesByTag.length > 0) {
      const site = sitesByTag[0];
      return jsonResponse({
        found: true,
        site: {
          _id: site._id,
          normalized_base_url: site.normalized_base_url,
          site_name: site.site_name,
          overall_score: site.overall_score,
          reasoning: site.reasoning,
          category_scores: site.category_scores,
          last_analyzed: site.last_analyzed,
          policy_documents_urls: site.policy_documents_urls,
        },
      });
    }

    return jsonResponse({ found: false, site: null });
  } catch (error) {
    console.error('Error fetching site:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
});

/**
 * POST /api/analyze
 * Start a new analysis job
 * Body: { site_input: string }
 */
export const analyze = httpAction(async (ctx, req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return corsPreflightResponse();
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  }

  try {
    const body = await req.json();
    const { site_input } = body;

    if (!site_input || typeof site_input !== 'string') {
      return jsonResponse({ error: 'Missing required field: site_input' }, 400);
    }

    // Create a job
    const jobId = await ctx.runMutation(api.analysisJobs.createJob, {
      site_input,
    });

    // Start the analysis (this runs in the background)
    ctx.runAction(api.actions.getSiteAnalysis, {
      user_input: site_input,
      job_id: jobId,
    });

    return jsonResponse({
      job_id: jobId,
      status: 'queued',
    });
  } catch (error) {
    console.error('Error starting analysis:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
});

/**
 * GET /api/job?id=<job_id>
 * Get the status of an analysis job
 */
export const getJob = httpAction(async (ctx, req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return corsPreflightResponse();
  }

  if (req.method !== 'GET') {
    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  }

  const url = new URL(req.url);
  const jobId = url.searchParams.get('id');

  if (!jobId) {
    return jsonResponse({ error: 'Missing required parameter: id' }, 400);
  }

  try {
    const job = await ctx.runQuery(api.analysisJobs.getJob, {
      job_id: jobId as Id<'analysisJobs'>,
    });

    if (!job) {
      return jsonResponse({ error: 'Job not found' }, 404);
    }

    return jsonResponse({
      job_id: job._id,
      status: job.status,
      site_input: job.site_input,
      created_at: job.created_at,
      updated_at: job.updated_at,
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
});

export const health = httpAction(
  async (_ctx, req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const method = (req.method ?? 'GET').toUpperCase();
    const accept = (req.headers.get('accept') ?? '').toLowerCase();

    if (method === 'HEAD') {
      return new Response(null, {
        status: 200,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'no-store',
        },
      });
    }

    if (method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
        status: 405,
        headers: {
          'content-type': 'application/json',
          allow: 'GET, HEAD',
        },
      });
    }

    if (
      accept.includes('application/json') ||
      url.searchParams.get('format') === 'json'
    ) {
      return new Response(
        JSON.stringify({ status: 'OK', time: new Date().toISOString() }),
        {
          status: 200,
          headers: {
            'content-type': 'application/json',
            'cache-control': 'no-store',
          },
        }
      );
    }

    const html = `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Health Check</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
          <main class="p-6 rounded-lg shadow-md bg-white max-w-md w-full text-center" role="status" aria-live="polite">
            <h1 class="text-2xl font-semibold mb-2">Service status: <span class="text-green-600">OK</span></h1>
            <p class="text-sm text-gray-600">Last updated: ${new Date().toLocaleString()}</p>
            <div class="mt-4">
              <a href="?format=json" class="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">View JSON</a>
            </div>
          </main>
        </body>
      </html>
      `;

    return new Response(html, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  }
);
