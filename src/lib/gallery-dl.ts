import { spawn } from 'node:child_process';
import { mkdirSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

export interface GalleryDlResult {
  files: string[];
  count: number;
}

function runGalleryDl(args: string[]): Promise<string> {
  return new Promise((resolveP, reject) => {
    const proc = spawn('gallery-dl', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (d: Buffer) => {
      stdout += d.toString();
    });
    proc.stderr.on('data', (d: Buffer) => {
      stderr += d.toString();
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolveP(stdout);
      } else {
        reject(new Error(`gallery-dl exited ${code}: ${stderr.slice(-500)}`));
      }
    });

    proc.on('error', (err) => {
      reject(new Error(`Failed to spawn gallery-dl: ${err.message}`));
    });
  });
}

export async function galleryDlDownload(
  url: string,
  destDir: string,
): Promise<GalleryDlResult> {
  mkdirSync(destDir, { recursive: true });

  await runGalleryDl([
    '--dest', destDir,
    '--filename', '{filename}.{extension}',
    '--no-mtime',
    url,
  ]);

  const files = readdirSync(destDir)
    .filter((f) => !f.endsWith('.json'))
    .map((f) => resolve(destDir, f));

  return { files, count: files.length };
}

export async function isInstagramStoryOrPhoto(url: string): Promise<boolean> {
  // Stories: /stories/, Photos: /p/ or /reel/ without video indicator
  const u = new URL(url);
  return (
    u.pathname.includes('/stories/') ||
    u.pathname.includes('/p/')
  );
}
