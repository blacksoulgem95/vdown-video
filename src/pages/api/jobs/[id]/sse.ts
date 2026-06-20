import type { APIRoute } from 'astro';
import { getJob, subscribeSSE } from '@/lib/queue';
import type { SSEEvent } from '@/lib/queue';

export const GET: APIRoute = ({ params }) => {
  const { id } = params;
  if (!id) {
    return new Response('Missing job ID', { status: 400 });
  }

  const job = getJob(id);
  if (!job) {
    return new Response('Job not found', { status: 404 });
  }

  // If job already finished, send terminal event immediately
  if (job.status === 'ready' || job.status === 'error') {
    const data = JSON.stringify({
      type: job.status === 'ready' ? 'done' : 'error',
      status: job.status,
      progress: job.status === 'ready' ? 100 : 0,
      message: job.errorMessage ?? undefined,
      sourceFilePath: job.sourceFilePath ?? undefined,
    } satisfies SSEEvent);

    return new Response(
      `data: ${data}\n\ndata: ${JSON.stringify({ type: 'close' })}\n\n`,
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      },
    );
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      function send(event: SSEEvent): void {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        } catch {
          // controller closed
        }
      }

      // Send current status immediately
      send({ type: 'status', status: job.status, progress: 0 });

      const unsubscribe = subscribeSSE(id, (event) => {
        send(event);
        if (event.type === 'done' || event.type === 'error') {
          try {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'close' })}\n\n`),
            );
            controller.close();
          } catch {
            // already closed
          }
          unsubscribe();
        }
      });

      // Heartbeat every 15s to keep connection alive through proxies
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': ping\n\n'));
        } catch {
          clearInterval(heartbeat);
          unsubscribe();
        }
      }, 15000);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
};
