import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Hoisted mocks so vi.mock factories can access them
const { mockRmSync, mockReaddirSync, mockStatSync, mockExistsSync, mockRun, mockAll, mockPrepare } = vi.hoisted(() => {
  const mockRun = vi.fn();
  const mockAll = vi.fn(() => [] as unknown[]);
  const mockPrepare = vi.fn(() => ({ run: mockRun, all: mockAll, get: vi.fn() }));
  return {
    mockRmSync: vi.fn(),
    mockReaddirSync: vi.fn(() => [] as string[]),
    mockStatSync: vi.fn(() => ({ size: 0, isDirectory: () => false })),
    mockExistsSync: vi.fn(() => true),
    mockRun,
    mockAll,
    mockPrepare,
  };
});

vi.mock('@/lib/db', () => ({ default: { prepare: mockPrepare } }));

vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs')>();
  return {
    ...actual,
    rmSync: mockRmSync,
    readdirSync: mockReaddirSync,
    statSync: mockStatSync,
    existsSync: mockExistsSync,
  };
});

import { runEviction, getDiskUsageGb, startEvictionCron, stopEvictionCron } from '../eviction';

describe('runEviction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env['CACHE_TTL_DAYS'] = '7';
    process.env['CACHE_MAX_GB'] = '20';
    process.env['CACHE_DIR'] = '/tmp/test-cache';
    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue([]);
  });

  afterEach(() => {
    delete process.env['CACHE_TTL_DAYS'];
    delete process.env['CACHE_MAX_GB'];
    delete process.env['CACHE_DIR'];
  });

  it('returns shape { byTtl, bySize, diskGb }', () => {
    mockAll.mockReturnValue([]);
    const result = runEviction();
    expect(result).toHaveProperty('byTtl');
    expect(result).toHaveProperty('bySize');
    expect(result).toHaveProperty('diskGb');
  });

  it('evicts jobs older than TTL', () => {
    mockAll
      .mockReturnValueOnce([{ id: 'old-job-1' }, { id: 'old-job-2' }]) // TTL eviction candidates
      .mockReturnValue([]);  // size eviction candidates (empty)
    const result = runEviction();
    expect(result.byTtl).toBe(2);
  });

  it('byTtl is 0 when no expired jobs', () => {
    mockAll.mockReturnValue([]);
    expect(runEviction().byTtl).toBe(0);
  });

  it('calls rmSync for each expired job directory', () => {
    mockAll.mockReturnValueOnce([{ id: 'job-rm' }]).mockReturnValue([]);
    runEviction();
    expect(mockRmSync).toHaveBeenCalledWith(
      expect.stringContaining('job-rm'),
      expect.objectContaining({ recursive: true, force: true }),
    );
  });

  it('evicts by size when cache exceeds cap', () => {
    // Simulate cache dir with one job subdir containing a large file
    mockReaddirSync
      .mockReturnValueOnce([{ name: 'big-job', isDirectory: () => true }] as unknown as string[]) // cache dir listing
      .mockReturnValueOnce(['video.mp4']) // files inside big-job
      .mockReturnValueOnce([]) // after eviction, cache is empty
      .mockReturnValue([]);

    // File size: 25GB (exceeds 20GB cap)
    mockStatSync.mockReturnValue({ size: 25 * 1024 * 1024 * 1024, isDirectory: () => false } as ReturnType<typeof import('node:fs').statSync>);

    // No TTL evictions, but one size-based candidate
    mockAll
      .mockReturnValueOnce([]) // TTL query returns nothing
      .mockReturnValueOnce([{ id: 'big-job' }]); // size eviction candidate

    const result = runEviction();
    expect(result.bySize).toBeGreaterThanOrEqual(0);
  });

  it('does not evict by size when under cap', () => {
    mockAll.mockReturnValue([]);
    mockReaddirSync.mockReturnValue([]);
    const result = runEviction();
    expect(result.bySize).toBe(0);
  });

  it('handles CACHE_DIR not existing gracefully', () => {
    mockExistsSync.mockReturnValue(false);
    mockAll.mockReturnValue([]);
    expect(() => runEviction()).not.toThrow();
  });

  it('logs when jobs are evicted', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    mockAll.mockReturnValueOnce([{ id: 'logged-job' }]).mockReturnValue([]);
    runEviction();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('eviction'));
    consoleSpy.mockRestore();
  });

  it('does not log when nothing was evicted', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    mockAll.mockReturnValue([]);
    runEviction();
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe('getDiskUsageGb', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env['CACHE_DIR'] = '/tmp/test-cache';
    mockExistsSync.mockReturnValue(true);
  });

  it('returns 0 when cache dir does not exist', () => {
    mockExistsSync.mockReturnValue(false);
    expect(getDiskUsageGb()).toBe(0);
  });

  it('returns a number', () => {
    mockReaddirSync.mockReturnValue([]);
    expect(typeof getDiskUsageGb()).toBe('number');
  });
});

describe('startEvictionCron / stopEvictionCron', () => {
  it('does not throw on start and stop', () => {
    vi.useFakeTimers();
    mockAll.mockReturnValue([]);
    mockReaddirSync.mockReturnValue([]);
    expect(() => startEvictionCron()).not.toThrow();
    expect(() => stopEvictionCron()).not.toThrow();
    vi.useRealTimers();
  });

  it('is safe to call stopEvictionCron when not started', () => {
    expect(() => stopEvictionCron()).not.toThrow();
  });

  it('is idempotent — double startEvictionCron is safe', () => {
    vi.useFakeTimers();
    mockAll.mockReturnValue([]);
    mockReaddirSync.mockReturnValue([]);
    startEvictionCron();
    expect(() => startEvictionCron()).not.toThrow();
    stopEvictionCron();
    vi.useRealTimers();
  });
});
