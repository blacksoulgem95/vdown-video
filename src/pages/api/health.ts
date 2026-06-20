import type { APIRoute } from 'astro';
import db from '@/lib/db';
import { getDiskUsageGb } from '@/lib/eviction';

export const GET: APIRoute = () => {
  let dbStatus: 'ok' | 'error' = 'ok';
  let queueDepth = 0;

  try {
    db.prepare('SELECT 1').get();
    const row = db
      .prepare(`SELECT COUNT(*) as cnt FROM jobs WHERE status IN ('queued','fetching_meta','downloading')`)
      .get() as { cnt: number };
    queueDepth = row.cnt;
  } catch {
    dbStatus = 'error';
  }

  const diskUsageGb = getDiskUsageGb();
  const status = dbStatus === 'ok' ? 'ok' : 'degraded';

  return new Response(
    JSON.stringify({ status, db: dbStatus, queueDepth, diskUsageGb }),
    {
      status: status === 'ok' ? 200 : 503,
      headers: { 'Content-Type': 'application/json' },
    },
  );
};
