import type { APIRoute } from 'astro';
import { syncArticlesFromBLG } from '@/lib/blg-sync';

export const POST: APIRoute = async () => {
  try {
    const synced = await syncArticlesFromBLG(true);
    return json({ synced });
  } catch (err) {
    return json({ error: String(err) }, 500);
  }
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
