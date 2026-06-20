import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { logToolError } from '@/lib/correlation';

export interface VideoMetadata {
  title: string;
  thumbnail: string;
  duration: number;
  author: string;
  description: string;
  formats: FormatInfo[];
}

export interface FormatInfo {
  formatId: string;
  ext: string;
  quality: string;
  width: number | null;
  height: number | null;
  fps: number | null;
  filesize: number | null;
  vcodec: string | null;
  acodec: string | null;
  hasVideo: boolean;
  hasAudio: boolean;
}

export interface DownloadProgress {
  percent: number;
  speed: string;
  eta: string;
}

const YTDLP_BIN = process.env['YTDLP_PATH'] ?? 'yt-dlp';

function runProcess(
  cmd: string,
  args: string[],
  corrId: string,
  onStderr?: (line: string) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (d: Buffer) => {
      stdout += d.toString();
    });

    proc.stderr.on('data', (d: Buffer) => {
      const line = d.toString();
      stderr += line;
      // Log all yt-dlp stderr to stderr with correlation ID
      console.error(`[${corrId}] yt-dlp: ${line.trim()}`);
      onStderr?.(line);
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        const genericMsg = logToolError(corrId, 'yt-dlp', stderr, { args, code });
        reject(new Error(genericMsg));
      }
    });

    proc.on('error', (err) => {
      const genericMsg = logToolError(corrId, 'yt-dlp', err.message, { type: 'spawn' });
      reject(new Error(genericMsg));
    });
  });
}

export async function fetchMetadata(
  url: string,
  corrId: string,
): Promise<VideoMetadata> {
  const raw = await runProcess(YTDLP_BIN, [
    '--dump-json',
    '--no-playlist',
    '--no-warnings',
    url,
  ], corrId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = JSON.parse(raw) as Record<string, any>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formats: FormatInfo[] = ((data['formats'] as any[]) ?? []).map((f: any) => ({
    formatId: String(f['format_id'] ?? ''),
    ext: String(f['ext'] ?? ''),
    quality: String(f['format_note'] ?? f['quality'] ?? ''),
    width: (f['width'] as number | null) ?? null,
    height: (f['height'] as number | null) ?? null,
    fps: (f['fps'] as number | null) ?? null,
    filesize: (f['filesize'] as number | null) ?? (f['filesize_approx'] as number | null) ?? null,
    vcodec: f['vcodec'] !== 'none' ? (f['vcodec'] as string | null) : null,
    acodec: f['acodec'] !== 'none' ? (f['acodec'] as string | null) : null,
    hasVideo: f['vcodec'] !== 'none' && f['vcodec'] != null,
    hasAudio: f['acodec'] !== 'none' && f['acodec'] != null,
  }));

  return {
    title: String(data['title'] ?? 'Untitled'),
    thumbnail: String(data['thumbnail'] ?? ''),
    duration: Number(data['duration'] ?? 0),
    author: String(data['uploader'] ?? data['channel'] ?? ''),
    description: String(data['description'] ?? '').slice(0, 500),
    formats,
  };
}

export async function downloadSource(
  url: string,
  destDir: string,
  corrId: string,
  onProgress?: (progress: DownloadProgress) => void,
): Promise<string> {
  mkdirSync(destDir, { recursive: true });
  const outputTemplate = resolve(destDir, 'source.%(ext)s');

  const args = [
    '--no-playlist',
    '--no-warnings',
    '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best',
    '--merge-output-format', 'mp4',
    '--output', outputTemplate,
    '--newline',
    url,
  ];

  let resolvedPath = '';

  await runProcess(YTDLP_BIN, args, corrId, (line) => {
    // Parse progress: [download]  45.2% of  123.45MiB at  1.23MiB/s ETA 00:10
    const progressMatch = /\[download\]\s+([\d.]+)%.*?at\s+(\S+).*?ETA\s+(\S+)/.exec(line);
    if (progressMatch && onProgress) {
      onProgress({
        percent: parseFloat(progressMatch[1] ?? '0'),
        speed: progressMatch[2] ?? '',
        eta: progressMatch[3] ?? '',
      });
    }

    // Capture final filename
    const destMatch = /\[download\] Destination: (.+)/.exec(line)
      ?? /\[Merger\] Merging formats into "(.+)"/.exec(line)
      ?? /\[ffmpeg\] Destination: (.+)/.exec(line);
    if (destMatch?.[1]) {
      resolvedPath = destMatch[1].trim();
    }
  });

  // Fall back to finding source.* if path not captured from stderr
  if (!resolvedPath) {
    const { readdirSync } = await import('node:fs');
    const files = readdirSync(destDir).filter((f) => f.startsWith('source.'));
    if (files.length === 0) {
      const genericMsg = logToolError(corrId, 'yt-dlp', 'No output file produced', { destDir });
      throw new Error(genericMsg);
    }
    resolvedPath = resolve(destDir, files[0]!);
  }

  return resolvedPath;
}

export async function getAvailableFormats(
  url: string,
  corrId: string,
): Promise<FormatInfo[]> {
  const meta = await fetchMetadata(url, corrId);
  return meta.formats;
}
