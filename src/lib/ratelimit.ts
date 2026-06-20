import db from '@/lib/db';

const RATE_LIMIT_PER_IP_HOUR = parseInt(process.env['RATE_LIMIT_PER_IP_HOUR'] ?? '10');
const RATE_LIMIT_QUEUE_DEPTH = parseInt(process.env['RATE_LIMIT_QUEUE_DEPTH'] ?? '50');
const HOUR_MS = 60 * 60 * 1000;

interface IpBucket {
  count: number;
  resetAt: number;
}

const ipBuckets = new Map<string, IpBucket>();

function getBucket(ip: string): IpBucket {
  const now = Date.now();
  let bucket = ipBuckets.get(ip);
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + HOUR_MS };
    ipBuckets.set(ip, bucket);
  }
  return bucket;
}

// Lazy cleanup: prune expired buckets every 100 calls to avoid unbounded growth
let callCount = 0;
function maybeCleanup(): void {
  if (++callCount % 100 !== 0) return;
  const now = Date.now();
  for (const [ip, bucket] of ipBuckets) {
    if (now >= bucket.resetAt) ipBuckets.delete(ip);
  }
}

export function getQueueDepth(): number {
  const row = db
    .prepare(`SELECT COUNT(*) as cnt FROM jobs WHERE status IN ('queued','fetching_meta','downloading')`)
    .get() as { cnt: number };
  return row.cnt;
}

export class RateLimitError extends Error {
  constructor(reason: string) {
    super(reason);
    this.name = 'RateLimitError';
  }
}

export function checkRateLimit(ip: string): void {
  maybeCleanup();

  const depth = getQueueDepth();
  if (depth >= RATE_LIMIT_QUEUE_DEPTH) {
    throw new RateLimitError(
      `Server busy. Queue full (${depth}/${RATE_LIMIT_QUEUE_DEPTH}). Try again later.`,
    );
  }

  const bucket = getBucket(ip);
  if (bucket.count >= RATE_LIMIT_PER_IP_HOUR) {
    throw new RateLimitError(
      `Rate limit exceeded. Max ${RATE_LIMIT_PER_IP_HOUR} downloads per hour per IP.`,
    );
  }

  bucket.count++;
}

export function getRateLimitStatus(ip: string): { remaining: number; resetAt: number } {
  const bucket = getBucket(ip);
  return {
    remaining: Math.max(0, RATE_LIMIT_PER_IP_HOUR - bucket.count),
    resetAt: bucket.resetAt,
  };
}
