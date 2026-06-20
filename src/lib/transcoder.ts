import { spawn } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { logToolError } from '@/lib/correlation';

const FFMPEG_BIN = process.env['FFMPEG_PATH'] ?? 'ffmpeg';

export type VideoQuality = '4k' | '2k' | '1080p' | '720p' | '480p' | '360p';
export type AudioQuality = 'best';
export type VideoFormat = 'mp4' | 'webm' | 'mkv';
export type AudioFormat = 'mp3' | 'aac' | 'm4a' | 'ogg';
export type OutputFormat = VideoFormat | AudioFormat;

const VIDEO_SCALE: Record<VideoQuality, string> = {
  '4k':    'scale=-2:2160',
  '2k':    'scale=-2:1440',
  '1080p': 'scale=-2:1080',
  '720p':  'scale=-2:720',
  '480p':  'scale=-2:480',
  '360p':  'scale=-2:360',
};

const AUDIO_CODECS: Record<AudioFormat, string[]> = {
  mp3:  ['-c:a', 'libmp3lame', '-q:a', '2'],
  aac:  ['-c:a', 'aac', '-b:a', '192k'],
  m4a:  ['-c:a', 'aac', '-b:a', '192k'],
  ogg:  ['-c:a', 'libvorbis', '-q:a', '6'],
};

export type TranscodeProgress = {
  percent: number;
  timeSeconds: number;
};

function parseDuration(line: string): number | null {
  const m = /Duration:\s*(\d+):(\d+):([\d.]+)/.exec(line);
  if (!m) return null;
  return parseInt(m[1]!) * 3600 + parseInt(m[2]!) * 60 + parseFloat(m[3]!);
}

function parseTime(line: string): number | null {
  const m = /time=(\d+):(\d+):([\d.]+)/.exec(line);
  if (!m) return null;
  return parseInt(m[1]!) * 3600 + parseInt(m[2]!) * 60 + parseFloat(m[3]!);
}

export function isAudioFormat(format: OutputFormat): format is AudioFormat {
  return ['mp3', 'aac', 'm4a', 'ogg'].includes(format);
}

export async function transcode(
  inputPath: string,
  outputPath: string,
  quality: VideoQuality | AudioQuality,
  format: OutputFormat,
  corrId: string,
  onProgress?: (progress: TranscodeProgress) => void,
): Promise<void> {
  if (existsSync(outputPath)) return;

  mkdirSync(dirname(outputPath), { recursive: true });

  const args: string[] = ['-y', '-i', inputPath];

  if (isAudioFormat(format)) {
    const codecArgs = AUDIO_CODECS[format as AudioFormat];
    args.push('-vn', ...codecArgs);
  } else {
    const scale = quality !== 'best' ? VIDEO_SCALE[quality as VideoQuality] : null;
    if (scale) args.push('-vf', scale);
    args.push('-c:v', 'libx264', '-preset', 'fast', '-crf', '22');
    args.push('-c:a', 'aac', '-b:a', '128k');
    if (format === 'webm') {
      // Replace libx264 with libvpx-vp9 for webm
      const vfIdx = args.indexOf('-c:v');
      args.splice(vfIdx, 4, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '33');
      const audioIdx = args.indexOf('-c:a');
      args.splice(audioIdx, 4, '-c:a', 'libopus', '-b:a', '128k');
    }
  }

  args.push(outputPath);

  await new Promise<void>((resolve, reject) => {
    const proc = spawn(FFMPEG_BIN, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let totalSeconds: number | null = null;
    let stderr = '';

    proc.stderr.on('data', (d: Buffer) => {
      const chunk = d.toString();
      stderr += chunk;
      // Log all ffmpeg stderr to stderr with correlation ID
      console.error(`[${corrId}] ffmpeg: ${chunk.trim()}`);

      if (totalSeconds === null) {
        totalSeconds = parseDuration(chunk);
      }

      if (onProgress && totalSeconds) {
        const current = parseTime(chunk);
        if (current !== null) {
          onProgress({
            percent: Math.min(Math.round((current / totalSeconds) * 100), 99),
            timeSeconds: current,
          });
        }
      }
    });

    proc.on('close', (code) => {
      if (code === 0) {
        onProgress?.({ percent: 100, timeSeconds: totalSeconds ?? 0 });
        resolve();
      } else {
        const genericMsg = logToolError(corrId, 'ffmpeg', stderr, { code, inputPath, outputPath });
        reject(new Error(genericMsg));
      }
    });

    proc.on('error', (err) => {
      const genericMsg = logToolError(corrId, 'ffmpeg', err.message, { type: 'spawn' });
      reject(new Error(genericMsg));
    });
  });
}
