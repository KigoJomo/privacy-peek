import { httpAction } from './_generated/server';

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
