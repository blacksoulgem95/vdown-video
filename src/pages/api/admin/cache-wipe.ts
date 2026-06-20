import type { APIRoute } from 'astro';
import { runEviction } from '@/lib/eviction';

function requireAdminToken(request: Request): boolean {
  const token = process.env['ADMIN_TOKEN'];
  if (!token) return false;
  const auth = request.headers.get('authorization') ?? '';
  return auth === `Bearer ${token}`;
}

export const POST: APIRoute = ({ request }) => {
  if (!requireAdminToken(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = runEviction();

  return new Response(
    JSON.stringify({
      ok: true,
      evictedByTtl: result.byTtl,
      evictedBySize: result.bySize,
      diskUsageGb: result.diskGb,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
};
