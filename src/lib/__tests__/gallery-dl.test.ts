import { describe, it, expect, vi } from 'vitest';
import { EventEmitter } from 'node:events';

let spawnImpl: (...args: unknown[]) => unknown = () => { throw new Error('spawn not set'); };

vi.mock('node:child_process', () => ({
  spawn: (...args: unknown[]) => spawnImpl(...args),
}));

vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs')>();
  return {
    ...actual,
    mkdirSync: vi.fn(),
    readdirSync: vi.fn(() => ['photo1.jpg', 'photo2.jpg', 'metadata.json']),
  };
});

import { galleryDlDownload, isInstagramStoryOrPhoto } from '../gallery-dl';

function makeProc(exitCode = 0) {
  const proc = new EventEmitter() as EventEmitter & { stdout: EventEmitter; stderr: EventEmitter };
  proc.stdout = new EventEmitter();
  proc.stderr = new EventEmitter();
  Promise.resolve().then(() => proc.emit('close', exitCode));
  return proc;
}

describe('galleryDlDownload', () => {
  it('returns file list excluding json files', async () => {
    spawnImpl = () => makeProc(0);
    const result = await galleryDlDownload('https://instagram.com/p/abc', '/tmp/cache/job1');
    expect(result.files).toHaveLength(2);
    expect(result.count).toBe(2);
    expect(result.files.every((f) => !f.endsWith('.json'))).toBe(true);
  });

  it('rejects on gallery-dl exit 1', async () => {
    spawnImpl = () => makeProc(1);
    await expect(galleryDlDownload('https://instagram.com/p/abc', '/tmp')).rejects.toThrow();
  });

  it('passes --dest flag with destDir', async () => {
    const capturedArgs: string[][] = [];
    spawnImpl = (...args) => { capturedArgs.push(args[1] as string[]); return makeProc(0); };
    await galleryDlDownload('https://instagram.com/p/abc', '/custom/dest');
    expect(capturedArgs[0]).toContain('--dest');
    expect(capturedArgs[0]).toContain('/custom/dest');
  });
});

describe('isInstagramStoryOrPhoto', () => {
  it('returns true for /stories/ URL', async () => {
    expect(await isInstagramStoryOrPhoto('https://instagram.com/stories/user/123')).toBe(true);
  });

  it('returns true for /p/ URL', async () => {
    expect(await isInstagramStoryOrPhoto('https://instagram.com/p/abc123')).toBe(true);
  });

  it('returns false for /reel/ URL', async () => {
    expect(await isInstagramStoryOrPhoto('https://instagram.com/reel/abc123')).toBe(false);
  });

  it('returns false for video URL with no story/photo path', async () => {
    expect(await isInstagramStoryOrPhoto('https://instagram.com/tv/abc123')).toBe(false);
  });
});
