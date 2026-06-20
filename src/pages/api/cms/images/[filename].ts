import type { APIRoute } from 'astro';
import { createReadStream, statSync, existsSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { CMS_DIR } from '@/lib/cms-images';

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
};

export const GET: APIRoute = ({ params }) => {
  const { filename } = params;

  // Prevent path traversal
  if (!filename || filename.includes('/') || filename.includes('..')) {
    return new Response(null, { status: 400 });
  }

  const filePath = resolve(CMS_DIR, filename);
  if (!existsSync(filePath)) {
    return new Response(null, { status: 404 });
  }

  const stat = statSync(filePath);
  const ext = extname(filename).toLowerCase();
  const contentType = MIME[ext] ?? 'application/octet-stream';

  const stream = createReadStream(filePath);
  return new Response(stream as unknown as ReadableStream, {
    headers: {
      'Content-Type': contentType,
      'Content-Length': String(stat.size),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
