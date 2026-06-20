import type { APIRoute } from 'astro';
import { createJob } from '@/lib/queue';
import { isValidUrl } from '@/lib/platform-detect';
import { checkRateLimit, RateLimitError } from '@/lib/ratelimit';

export const POST: APIRoute = async ({ request }) => {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? '0.0.0.0';

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const url = (body as Record<string, unknown>)['url'];
  const quality = (body as Record<string, unknown>)['quality'];
  const format = (body as Record<string, unknown>)['format'];
  if (typeof url !== 'string' || !url.trim()) {
    return json({ error: 'Missing required field: url' }, 400);
  }

  if (!isValidUrl(url)) {
    return json({ error: 'Invalid URL' }, 400);
  }

  try {
    checkRateLimit(ip);
  } catch (err) {
    if (err instanceof RateLimitError) {
      return json({ error: err.message }, 429);
    }
    throw err;
  }

  const jobId = createJob(url, ip, typeof quality === 'string' ? quality : undefined, typeof format === 'string' ? format : undefined);
  return json({ jobId }, 201);
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
