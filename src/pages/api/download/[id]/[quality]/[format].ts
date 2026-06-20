import type { APIRoute } from 'astro';
import { createReadStream, statSync, existsSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { randomUUID } from 'node:crypto';
import db from '@/lib/db';
import { getJob } from '@/lib/queue';
import { transcode } from '@/lib/transcoder';
import type { VideoQuality, OutputFormat } from '@/lib/transcoder';

const CACHE_DIR = resolve(process.env['CACHE_DIR'] ?? './data/cache');

const VALID_QUALITIES = new Set(['4k', '2k', '1080p', '720p', '480p', '360p', 'audio']);
const VALID_FORMATS = new Set(['mp4', 'webm', 'mkv', 'mp3', 'aac', 'm4a', 'ogg']);

const MIME: Record<string, string> = {
  mp4: 'video/mp4',
  webm: 'video/webm',
  mkv: 'video/x-matroska',
  mp3: 'audio/mpeg',
  aac: 'audio/aac',
  m4a: 'audio/mp4',
  ogg: 'audio/ogg',
};

export const GET: APIRoute = async ({ params }) => {
  const { id, quality, format } = params;

  if (!id || !quality || !format) {
    return err('Missing parameters', 400);
  }
  if (!VALID_QUALITIES.has(quality)) {
    return err(`Invalid quality: ${quality}`, 400);
  }
  if (!VALID_FORMATS.has(format)) {
    return err(`Invalid format: ${format}`, 400);
  }

  const job = getJob(id);
  if (!job) return err('Job not found', 404);
  if (job.status !== 'ready') return err('Job not ready', 409);
  if (!job.sourceFilePath || !existsSync(job.sourceFilePath)) {
    return err('Source file missing', 500);
  }

  // Check if this output already exists in DB + on disk
  const existing = db
    .prepare('SELECT file_path FROM outputs WHERE job_id = ? AND quality = ? AND format = ?')
    .get(id, quality, format) as { file_path: string } | undefined;

  let outputPath: string;

  if (existing?.file_path && existsSync(existing.file_path)) {
    outputPath = existing.file_path;
  } else {
    // Transcode on demand
    const outputDir = resolve(CACHE_DIR, id);
    outputPath = resolve(outputDir, `${quality}.${format}`);

    const transcodeQuality = quality === 'audio' ? 'best' : (quality as VideoQuality);

    try {
      await transcode(job.sourceFilePath, outputPath, transcodeQuality, format as OutputFormat);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Transcode failed';
      return err(msg, 500);
    }

    const fileSize = statSync(outputPath).size;
    const outputId = randomUUID();

    // Upsert output record
    db.prepare(
      `INSERT OR REPLACE INTO outputs (id, job_id, quality, format, file_path, file_size_bytes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, unixepoch())`,
    ).run(outputId, id, quality, format, outputPath, fileSize);
  }

  const stat = statSync(outputPath);
  const safeTitle = (job.metadata?.title ?? 'video')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 80);
  const filename = `${safeTitle}_${quality}${extname(outputPath)}`;
  const mime = MIME[format] ?? 'application/octet-stream';

  // Stream file
  const nodeStream = createReadStream(outputPath);
  const webStream = new ReadableStream({
    start(controller) {
      nodeStream.on('data', (chunk) => {
        controller.enqueue(chunk instanceof Buffer ? chunk : Buffer.from(chunk as string));
      });
      nodeStream.on('end', () => controller.close());
      nodeStream.on('error', (e) => controller.error(e));
    },
    cancel() {
      nodeStream.destroy();
    },
  });

  return new Response(webStream, {
    headers: {
      'Content-Type': mime,
      'Content-Length': String(stat.size),
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, max-age=3600',
    },
  });
};

function err(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
