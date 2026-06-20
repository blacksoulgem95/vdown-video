import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── DB mock ──────────────────────────────────────────────────────────────────
const { mockRun, mockGet, mockAll, mockPrepare } = vi.hoisted(() => {
  const mockRun = vi.fn();
  const mockGet = vi.fn();
  const mockAll = vi.fn(() => [] as unknown[]);
  return {
    mockRun,
    mockGet,
    mockAll,
    mockPrepare: vi.fn(() => ({ run: mockRun, get: mockGet, all: mockAll })),
  };
});

vi.mock('@/lib/db', () => ({ default: { prepare: mockPrepare } }));

// ── Downloader / gallery-dl mocks ────────────────────────────────────────────
const mockFetchMetadata = vi.fn(async () => ({
  title: 'Test Video', thumbnail: 'https://img.example.com/t.jpg',
  duration: 60, author: 'TestCh', description: 'desc', formats: [],
}));
const mockDownloadSource = vi.fn(async () => '/cache/job-id/source.mp4');
const mockGalleryDlDownload = vi.fn(async () => ({ files: ['/cache/job-id/photo.jpg'], count: 1 }));
const mockIsInstagramStoryOrPhoto = vi.fn(async () => false);

vi.mock('@/lib/downloader', () => ({
  fetchMetadata: (...a: unknown[]) => mockFetchMetadata(...a),
  downloadSource: (...a: unknown[]) => mockDownloadSource(...a),
}));
vi.mock('@/lib/gallery-dl', () => ({
  galleryDlDownload: (...a: unknown[]) => mockGalleryDlDownload(...a),
  isInstagramStoryOrPhoto: (...a: unknown[]) => mockIsInstagramStoryOrPhoto(...a),
}));
vi.mock('node:crypto', () => ({ randomUUID: vi.fn(() => 'mock-uuid-1234') }));

import {
  getJob, getJobOutputs, subscribeSSE,
  createJob, recoverStaleJobs,
} from '../queue';

describe('getJob', () => {
  beforeEach(() => { mockGet.mockReset(); mockPrepare.mockReturnValue({ run: mockRun, get: mockGet, all: mockAll }); });

  it('returns null when job not found', () => {
    mockGet.mockReturnValue(undefined);
    expect(getJob('nonexistent')).toBeNull();
  });

  it('returns parsed job with metadata', () => {
    mockGet.mockReturnValue({
      id: 'abc-123', url: 'https://youtube.com/watch?v=abc',
      platform: 'youtube', status: 'ready', ip: '1.2.3.4',
      error_message: null,
      metadata_json: JSON.stringify({ title: 'Test', thumbnail: '', duration: 60, author: '', description: '' }),
      source_file_path: '/cache/abc-123/source.mp4',
      created_at: 1700000000,
    });
    const job = getJob('abc-123');
    expect(job?.id).toBe('abc-123');
    expect(job?.status).toBe('ready');
    expect(job?.metadata?.title).toBe('Test');
    expect(job?.platform).toBe('youtube');
    expect(job?.sourceFilePath).toBe('/cache/abc-123/source.mp4');
  });

  it('returns null metadata when metadata_json is null', () => {
    mockGet.mockReturnValue({
      id: 'xyz', url: 'https://youtube.com', platform: 'youtube',
      status: 'queued', ip: null, error_message: null,
      metadata_json: null, source_file_path: null, created_at: 0,
    });
    expect(getJob('xyz')?.metadata).toBeNull();
  });

  it('returns null errorMessage when error_message is null', () => {
    mockGet.mockReturnValue({
      id: 'err-job', url: 'https://youtube.com', platform: 'youtube',
      status: 'error', ip: null, error_message: null,
      metadata_json: null, source_file_path: null, created_at: 0,
    });
    expect(getJob('err-job')?.errorMessage).toBeNull();
  });

  it('returns errorMessage when error_message is set', () => {
    mockGet.mockReturnValue({
      id: 'err-job2', url: 'https://youtube.com', platform: 'youtube',
      status: 'error', ip: null, error_message: 'Download failed',
      metadata_json: null, source_file_path: null, created_at: 0,
    });
    expect(getJob('err-job2')?.errorMessage).toBe('Download failed');
  });
});

describe('getJobOutputs', () => {
  beforeEach(() => { mockAll.mockReset(); mockPrepare.mockReturnValue({ run: mockRun, get: mockGet, all: mockAll }); });

  it('returns empty array when no outputs', () => {
    mockAll.mockReturnValue([]);
    expect(getJobOutputs('job-1')).toEqual([]);
  });

  it('includes downloadUrl in each output', () => {
    mockAll.mockReturnValue([{ id: 'out-1', quality: '1080p', format: 'mp4', file_size_bytes: 50000000 }]);
    const outputs = getJobOutputs('job-1');
    expect(outputs[0]?.downloadUrl).toBe('/api/download/job-1/1080p/mp4');
  });

  it('maps file_size_bytes to fileSize', () => {
    mockAll.mockReturnValue([{ id: 'out-2', quality: '720p', format: 'mp4', file_size_bytes: 12345 }]);
    expect(getJobOutputs('job-1')[0]?.fileSize).toBe(12345);
  });

  it('handles null file_size_bytes', () => {
    mockAll.mockReturnValue([{ id: 'out-3', quality: '360p', format: 'mp4', file_size_bytes: null }]);
    expect(getJobOutputs('job-1')[0]?.fileSize).toBeNull();
  });

  it('returns multiple outputs', () => {
    mockAll.mockReturnValue([
      { id: 'o1', quality: '1080p', format: 'mp4', file_size_bytes: 100 },
      { id: 'o2', quality: '720p', format: 'mp4', file_size_bytes: 50 },
    ]);
    expect(getJobOutputs('job-1')).toHaveLength(2);
  });
});

describe('subscribeSSE', () => {
  it('returns an unsubscribe function', () => {
    const unsub = subscribeSSE('some-job', vi.fn());
    expect(typeof unsub).toBe('function');
    expect(() => unsub()).not.toThrow();
  });

  it('unsubscribe removes listener (no error on double unsubscribe)', () => {
    const unsub = subscribeSSE('double-unsub-job', vi.fn());
    unsub();
    expect(() => unsub()).not.toThrow();
  });
});

describe('recoverStaleJobs', () => {
  beforeEach(() => {
    mockAll.mockReset();
    mockGet.mockReset();
    mockRun.mockReset();
    mockPrepare.mockReturnValue({ run: mockRun, get: mockGet, all: mockAll });
  });

  it('does not throw when no stale jobs', () => {
    mockAll.mockReturnValue([]);
    expect(() => recoverStaleJobs()).not.toThrow();
  });

  it('re-enqueues stale jobs from DB', () => {
    // Return stale jobs then return job data for each enqueued job
    mockAll.mockReturnValueOnce([{ id: 'stale-1' }, { id: 'stale-2' }]);
    mockGet.mockReturnValue(undefined); // getJob returns null — processJob will early-exit
    expect(() => recoverStaleJobs()).not.toThrow();
  });
});

describe('createJob', () => {
  beforeEach(() => {
    mockRun.mockReset();
    mockGet.mockReset();
    mockAll.mockReturnValue([]);
    mockPrepare.mockReturnValue({ run: mockRun, get: mockGet, all: mockAll });
    // processJob will call getJob — return null so async worker exits immediately
    mockGet.mockReturnValue(undefined);
  });

  it('returns a job ID string', () => {
    const jobId = createJob('https://youtube.com/watch?v=abc', '1.2.3.4');
    expect(typeof jobId).toBe('string');
    expect(jobId.length).toBeGreaterThan(0);
  });

  it('inserts job into SQLite', () => {
    createJob('https://youtube.com/watch?v=abc', '1.2.3.4');
    expect(mockRun).toHaveBeenCalled();
  });

  it('handles null IP', () => {
    expect(() => createJob('https://youtube.com/watch?v=abc', null)).not.toThrow();
  });

  it('detects platform from URL', () => {
    const calls: unknown[][] = [];
    mockRun.mockImplementation((...args: unknown[]) => calls.push(args));
    createJob('https://twitter.com/user/status/123', '1.2.3.4');
    // INSERT args: (id, url, platform, ip) — platform is index 2
    const platformArg = calls[0]?.[2];
    expect(platformArg).toBe('twitter');
  });
});
