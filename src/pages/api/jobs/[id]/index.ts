import type { APIRoute } from 'astro';
import { getJob, getJobOutputs } from '@/lib/queue';

export const GET: APIRoute = ({ params }) => {
  const { id } = params;
  if (!id) return json({ error: 'Missing job ID' }, 400);

  const job = getJob(id);
  if (!job) return json({ error: 'Job not found' }, 404);

  const outputs = getJobOutputs(id);

  return json({
    id: job.id,
    url: job.url,
    platform: job.platform,
    status: job.status,
    metadata: job.metadata,
    errorMessage: job.errorMessage,
    correlation_id: job.correlationId,
    outputs,
    createdAt: job.createdAt,
  });
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
