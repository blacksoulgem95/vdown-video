import { rmSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import db from '@/lib/db';

const CACHE_TTL_DAYS = parseInt(process.env['CACHE_TTL_DAYS'] ?? '7');
const CACHE_MAX_GB = parseInt(process.env['CACHE_MAX_GB'] ?? '20');
const CACHE_DIR = resolve(process.env['CACHE_DIR'] ?? './data/cache');
const CACHE_MAX_BYTES = CACHE_MAX_GB * 1024 * 1024 * 1024;
const HOUR_MS = 60 * 60 * 1000;

function getCacheSizeBytes(): number {
  if (!existsSync(CACHE_DIR)) return 0;
  let total = 0;
  for (const entry of readdirSync(CACHE_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const jobDir = resolve(CACHE_DIR, entry.name);
    try {
      for (const file of readdirSync(jobDir)) {
        try {
          total += statSync(resolve(jobDir, file)).size;
        } catch {
          // file may have been deleted concurrently
        }
      }
    } catch {
      // dir may have been deleted concurrently
    }
  }
  return total;
}

function deleteJobFiles(jobId: string): void {
  const jobDir = resolve(CACHE_DIR, jobId);
  try {
    rmSync(jobDir, { recursive: true, force: true });
  } catch {
    // best-effort
  }
}

function evictByTtl(): number {
  const cutoff = Math.floor((Date.now() - CACHE_TTL_DAYS * 86400 * 1000) / 1000);
  const expired = db
    .prepare(`SELECT id FROM jobs WHERE created_at < ?`)
    .all(cutoff) as { id: string }[];

  for (const { id } of expired) {
    deleteJobFiles(id);
  }

  if (expired.length > 0) {
    db.prepare(
      `DELETE FROM jobs WHERE created_at < ?`,
    ).run(cutoff);
  }

  return expired.length;
}

function evictBySize(): number {
  let currentSize = getCacheSizeBytes();
  if (currentSize <= CACHE_MAX_BYTES) return 0;

  const candidates = db
    .prepare(`SELECT id FROM jobs WHERE status = 'ready' ORDER BY created_at ASC`)
    .all() as { id: string }[];

  let evicted = 0;
  for (const { id } of candidates) {
    if (currentSize <= CACHE_MAX_BYTES) break;
    deleteJobFiles(id);
    db.prepare('DELETE FROM jobs WHERE id = ?').run(id);
    currentSize = getCacheSizeBytes();
    evicted++;
  }

  return evicted;
}

export function runEviction(): { byTtl: number; bySize: number; diskGb: number } {
  const byTtl = evictByTtl();
  const bySize = evictBySize();
  const diskGb = Math.round((getCacheSizeBytes() / 1024 / 1024 / 1024) * 100) / 100;
  if (byTtl > 0 || bySize > 0) {
    console.log(`[eviction] removed ${byTtl} by TTL, ${bySize} by size cap — disk: ${diskGb}GB`);
  }
  return { byTtl, bySize, diskGb };
}

export function getDiskUsageGb(): number {
  return Math.round((getCacheSizeBytes() / 1024 / 1024 / 1024) * 100) / 100;
}

let evictionTimer: ReturnType<typeof setInterval> | null = null;

export function startEvictionCron(): void {
  if (evictionTimer) return;
  // Run once at startup, then every hour
  runEviction();
  evictionTimer = setInterval(() => {
    runEviction();
  }, HOUR_MS);
}

export function stopEvictionCron(): void {
  if (evictionTimer) {
    clearInterval(evictionTimer);
    evictionTimer = null;
  }
}
