import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventEmitter } from 'node:events';

let spawnImpl: (...args: unknown[]) => unknown = () => { throw new Error('spawn not set'); };

vi.mock('node:child_process', () => ({
  spawn: (...args: unknown[]) => spawnImpl(...args),
}));

const { mockExistsSync } = vi.hoisted(() => ({
  mockExistsSync: vi.fn(() => false),
}));

vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs')>();
  return { ...actual, mkdirSync: vi.fn(), existsSync: mockExistsSync };
});

import { transcode, isAudioFormat } from '../transcoder';

const FFMPEG_STDERR = [
  'Duration: 00:02:00.00, start: 0.000000\n',
  'frame=  100 fps= 25 q=22.0 size=    1024kB time=00:00:04.00 bitrate=2097.2kbits/s\n',
  'frame=  600 fps= 25 q=22.0 size=    6144kB time=00:01:00.00 bitrate=839.1kbits/s\n',
];

function makeProc(stderrLines: string[], exitCode = 0) {
  const proc = new EventEmitter() as EventEmitter & { stdout: EventEmitter; stderr: EventEmitter };
  proc.stdout = new EventEmitter();
  proc.stderr = new EventEmitter();
  Promise.resolve().then(() => {
    for (const line of stderrLines) proc.stderr.emit('data', Buffer.from(line));
    proc.emit('close', exitCode);
  });
  return proc;
}

describe('transcode', () => {
  beforeEach(() => { mockExistsSync.mockReturnValue(false); });

  it('resolves on ffmpeg exit 0', async () => {
    spawnImpl = () => makeProc(FFMPEG_STDERR, 0);
    await expect(transcode('/input/source.mp4', '/output/1080p.mp4', '1080p', 'mp4', 'test1234')).resolves.toBeUndefined();
  });

  it('rejects on ffmpeg exit 1', async () => {
    spawnImpl = () => makeProc(['ffmpeg: error\n'], 1);
    await expect(transcode('/input/source.mp4', '/output/1080p.mp4', '1080p', 'mp4', 'test1234')).rejects.toThrow();
  });

  it('calls onProgress and final event is 100', async () => {
    spawnImpl = () => makeProc(FFMPEG_STDERR, 0);
    const percents: number[] = [];
    await transcode('/input/source.mp4', '/output/1080p.mp4', '1080p', 'mp4', 'test1234', (p) => percents.push(p.percent));
    expect(percents.length).toBeGreaterThan(0);
    expect(percents[percents.length - 1]).toBe(100);
  });

  it('skips transcode if output already exists', async () => {
    mockExistsSync.mockReturnValue(true);
    const calls: unknown[] = [];
    spawnImpl = (...args) => { calls.push(args); return makeProc([], 0); };
    await transcode('/input/source.mp4', '/output/exists.mp4', '720p', 'mp4', 'test1234');
    expect(calls.length).toBe(0);
  });

  it('uses -vn flag for audio formats', async () => {
    const capturedArgs: string[][] = [];
    spawnImpl = (...args) => { capturedArgs.push(args[1] as string[]); return makeProc(FFMPEG_STDERR, 0); };
    await transcode('/input/source.mp4', '/output/audio.mp3', 'best', 'mp3', 'test1234');
    expect(capturedArgs[0]).toContain('-vn');
  });

  it('applies -vf scale filter for video quality', async () => {
    const capturedArgs: string[][] = [];
    spawnImpl = (...args) => { capturedArgs.push(args[1] as string[]); return makeProc(FFMPEG_STDERR, 0); };
    await transcode('/input/source.mp4', '/output/480p.mp4', '480p', 'mp4', 'test1234');
    const vfIdx = capturedArgs[0]!.indexOf('-vf');
    expect(vfIdx).toBeGreaterThan(-1);
    expect(capturedArgs[0]![vfIdx + 1]).toContain('480');
  });

  it('uses libvpx-vp9 codec for webm output', async () => {
    const capturedArgs: string[][] = [];
    spawnImpl = (...args) => { capturedArgs.push(args[1] as string[]); return makeProc(FFMPEG_STDERR, 0); };
    await transcode('/input/source.mp4', '/output/720p.webm', '720p', 'webm', 'test1234');
    expect(capturedArgs[0]).toContain('libvpx-vp9');
  });
});

describe('isAudioFormat', () => {
  it.each(['mp3', 'aac', 'm4a', 'ogg'] as const)('returns true for %s', (fmt) => {
    expect(isAudioFormat(fmt)).toBe(true);
  });

  it.each(['mp4', 'webm', 'mkv'] as const)('returns false for %s', (fmt) => {
    expect(isAudioFormat(fmt)).toBe(false);
  });
});
