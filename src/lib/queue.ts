import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import db from '@/lib/db';
import { fetchMetadata, downloadSource } from '@/lib/downloader';
import { galleryDlDownload, isInstagramStoryOrPhoto } from '@/lib/gallery-dl';
import { transcode, isAudioFormat, type VideoQuality, type AudioQuality, type OutputFormat } from '@/lib/transcoder';
import { detectPlatform } from '@/lib/platform-detect';
import type { Platform } from '@/lib/platform-detect';
import { generateCorrelationId, genericErrorMessage } from '@/lib/correlation';

export type JobStatus = 'queued' | 'fetching_meta' | 'downloading' | 'transcoding' | 'ready' | 'error';

export interface Job {
  id: string;
  url: string;
  platform: Platform;
  status: JobStatus;
  ip: string | null;
  errorMessage: string | null;
  correlationId: string | null;
  requestedQuality: string | null;
  requestedFormat: string | null;
  metadata: JobMetadata | null;
  sourceFilePath: string | null;
  createdAt: number;
}

export interface JobMetadata {
  title: string;
  thumbnail: string;
  duration: number;
  author: string;
  description: string;
}

export interface SSEEvent {
  type: 'status' | 'progress' | 'error' | 'done';
  status: JobStatus;
  progress?: number;
  message?: string;
  sourceFilePath?: string;
}

type SSEListener = (event: SSEEvent) => void;

const MAX_CONCURRENT = parseInt(process.env['MAX_CONCURRENT'] ?? '3');
const CACHE_DIR = resolve(process.env['CACHE_DIR'] ?? './data/cache');

const sseListeners = new Map<string, Set<SSEListener>>();

let activeWorkers = 0;
const pendingQueue: string[] = [];

function emit(jobId: string, event: SSEEvent): void {
  const listeners = sseListeners.get(jobId);
  if (!listeners) return;
  for (const fn of listeners) fn(event);
}

export function subscribeSSE(jobId: string, listener: SSEListener): () => void {
  if (!sseListeners.has(jobId)) sseListeners.set(jobId, new Set());
  sseListeners.get(jobId)!.add(listener);
  return () => {
    sseListeners.get(jobId)?.delete(listener);
    if (sseListeners.get(jobId)?.size === 0) sseListeners.delete(jobId);
  };
}

function setJobStatus(
  id: string,
  status: JobStatus,
  extra: Partial<{
    errorMessage: string;
    correlationId: string;
    sourceFilePath: string;
    metadataJson: string;
    requestedQuality: string;
    requestedFormat: string;
  }> = {},
): void {
  const sets = ['status = ?', 'updated_at = unixepoch()'];
  const vals: unknown[] = [status];

  if (extra.errorMessage !== undefined) {
    sets.push('error_message = ?');
    vals.push(extra.errorMessage);
  }
  if (extra.correlationId !== undefined) {
    sets.push('correlation_id = ?');
    vals.push(extra.correlationId);
  }
  if (extra.sourceFilePath !== undefined) {
    sets.push('source_file_path = ?');
    vals.push(extra.sourceFilePath);
  }
  if (extra.metadataJson !== undefined) {
    sets.push('metadata_json = ?');
    vals.push(extra.metadataJson);
  }
  if (extra.requestedQuality !== undefined) {
    sets.push('requested_quality = ?');
    vals.push(extra.requestedQuality);
  }
  if (extra.requestedFormat !== undefined) {
    sets.push('requested_format = ?');
    vals.push(extra.requestedFormat);
  }

  vals.push(id);
  db.prepare(`UPDATE jobs SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
}

async function processJob(jobId: string, corrId: string): Promise<void> {
  activeWorkers++;

  try {
    const row = db.prepare('SELECT * FROM jobs WHERE id = ?').get(jobId) as
      | { url: string; platform: string; requested_quality: string; requested_format: string } | undefined;
    if (!row) return;

    const destDir = resolve(CACHE_DIR, jobId);
    const requestedQuality = row.requested_quality || '1080p';
    const requestedFormat = row.requested_format || 'mp4';

    // Fetch metadata
    setJobStatus(jobId, 'fetching_meta', { correlationId: corrId });
    emit(jobId, { type: 'status', status: 'fetching_meta', progress: 0 });

    const meta = await fetchMetadata(row.url, corrId);
    setJobStatus(jobId, 'downloading', {
      metadataJson: JSON.stringify({
        title: meta.title,
        thumbnail: meta.thumbnail,
        duration: meta.duration,
        author: meta.author,
        description: meta.description,
      }),
    });
    emit(jobId, { type: 'status', status: 'downloading', progress: 0 });

    // Download
    let sourceFilePath: string;
    const useGalleryDl =
      row.platform === 'instagram' && (await isInstagramStoryOrPhoto(row.url));

    if (useGalleryDl) {
      const result = await galleryDlDownload(row.url, destDir);
      sourceFilePath = result.files[0] ?? '';
    } else {
      sourceFilePath = await downloadSource(row.url, destDir, corrId, (progress) => {
        emit(jobId, {
          type: 'progress',
          status: 'downloading',
          progress: Math.round(progress.percent),
        });
      });
    }

    setJobStatus(jobId, 'downloading', { sourceFilePath });
    emit(jobId, { type: 'status', status: 'downloading', progress: 50, sourceFilePath });

    // Transcode to requested format
    setJobStatus(jobId, 'transcoding');
    emit(jobId, { type: 'status', status: 'transcoding', progress: 50 });

    const isAudio = isAudioFormat(requestedFormat);
    const quality = isAudio ? 'best' : (requestedQuality as VideoQuality);
    const format = requestedFormat as OutputFormat;
    const outputExt = format === 'aac' || format === 'ogg' ? format : (isAudio ? 'mp3' : 'mp4');
    const outputPath = resolve(destDir, `output.${outputExt}`);

    await transcode(sourceFilePath, outputPath, quality, format, corrId, (progress) => {
      emit(jobId, {
        type: 'progress',
        status: 'transcoding',
        progress: 50 + Math.round((progress.percent / 100) * 50), // 50-100%
      });
    });

    // Calculate file size
    const { statSync } = await import('node:fs');
    const stat = statSync(outputPath);

    // Save output to database
    const outputId = randomUUID();
    db.prepare(
      `INSERT INTO outputs (id, job_id, quality, format, file_path, file_size_bytes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, unixepoch())`
    ).run(outputId, jobId, requestedQuality, requestedFormat, outputPath, stat.size);

    setJobStatus(jobId, 'ready', { sourceFilePath });
    emit(jobId, { type: 'done', status: 'ready', progress: 100, sourceFilePath });
  } catch (err) {
    const genericMsg = err instanceof Error ? err.message : genericErrorMessage(corrId);
    setJobStatus(jobId, 'error', { errorMessage: genericMsg, correlationId: corrId });
    emit(jobId, { type: 'error', status: 'error', message: genericMsg });
  } finally {
    activeWorkers--;
    drainQueue();
  }
}

function drainQueue(): void {
  while (activeWorkers < MAX_CONCURRENT && pendingQueue.length > 0) {
    const nextId = pendingQueue.shift();
    if (nextId) {
      const corrId = generateCorrelationId();
      void processJob(nextId, corrId);
    }
  }
}

export function enqueueJob(jobId: string, quality?: string, format?: string): void {
  // Store requested quality/format if provided
  if (quality && format) {
    db.prepare(
      `UPDATE jobs SET requested_quality = ?, requested_format = ?, updated_at = unixepoch() WHERE id = ?`
    ).run(quality, format, jobId);
  }

  if (activeWorkers < MAX_CONCURRENT) {
    const corrId = generateCorrelationId();
    void processJob(jobId, corrId);
  } else {
    pendingQueue.push(jobId);
  }
}

export function createJob(url: string, ip: string | null, quality?: string, format?: string): string {
  const id = randomUUID();
  const platform = detectPlatform(url);

  db.prepare(
    `INSERT INTO jobs (id, url, platform, status, ip, requested_quality, requested_format, created_at, updated_at)
     VALUES (?, ?, ?, 'queued', ?, ?, ?, unixepoch(), unixepoch())`
  ).run(id, url, platform, ip, quality || null, format || null);

  enqueueJob(id, quality, format);
  return id;
}

export function getJob(id: string): Job | null {
  const row = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id) as
    | Record<string, unknown> | undefined;
  if (!row) return null;

  return {
    id: row['id'] as string,
    url: row['url'] as string,
    platform: row['platform'] as Platform,
    status: row['status'] as JobStatus,
    ip: (row['ip'] as string | null) ?? null,
    errorMessage: (row['error_message'] as string | null) ?? null,
    correlationId: (row['correlation_id'] as string | null) ?? null,
    requestedQuality: (row['requested_quality'] as string | null) ?? null,
    requestedFormat: (row['requested_format'] as string | null) ?? null,
    metadata: row['metadata_json']
      ? (JSON.parse(row['metadata_json'] as string) as JobMetadata)
      : null,
    sourceFilePath: (row['source_file_path'] as string | null) ?? null,
    createdAt: row['created_at'] as number,
  };
}

export function getJobOutputs(
  jobId: string,
): { id: string; quality: string; format: string; fileSize: number | null; downloadUrl: string }[] {
  return (
    db
      .prepare('SELECT id, quality, format, file_size_bytes FROM outputs WHERE job_id = ?')
      .all(jobId) as { id: string; quality: string; format: string; file_size_bytes: number | null }[]
  ).map((r) => ({
    id: r.id,
    quality: r.quality,
    format: r.format,
    fileSize: r.file_size_bytes,
    downloadUrl: `/api/download/${jobId}/${r.quality}/${r.format}`,
  }));
}

export function getQueueDepth(): number {
  return pendingQueue.length + activeWorkers;
}

// On startup: re-enqueue any jobs left in queued/downloading state from a previous crash
export function recoverStaleJobs(): void {
  const stale = db
    .prepare(`SELECT id FROM jobs WHERE status IN ('queued', 'downloading', 'fetching_meta', 'transcoding')`)
    .all() as { id: string }[];

  for (const { id } of stale) {
    const row = db.prepare('SELECT requested_quality, requested_format FROM jobs WHERE id = ?').get(id) as
      | { requested_quality: string; requested_format: string } | undefined;
    setJobStatus(id, 'queued');
    enqueueJob(id, row?.requested_quality, row?.requested_format);
  }
}
