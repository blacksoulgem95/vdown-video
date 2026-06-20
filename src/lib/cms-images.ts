import { mkdirSync, createWriteStream } from 'node:fs';
import { resolve, extname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

export const CMS_DIR = resolve(process.env['CMS_DIR'] ?? './data/cms');

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
};
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB

export interface UploadResult {
  filename: string;
  url: string;
}

export async function saveCmsImage(file: File): Promise<UploadResult> {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error(`Unsupported image type: ${file.type}`);
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error(`Image too large (max 8 MB)`);
  }

  mkdirSync(CMS_DIR, { recursive: true });

  const ext = MIME_TO_EXT[file.type] ?? extname(file.name) ?? '.jpg';
  const filename = `${randomUUID()}${ext}`;
  const dest = resolve(CMS_DIR, filename);

  const nodeStream = Readable.fromWeb(file.stream() as import('stream/web').ReadableStream);
  await pipeline(nodeStream, createWriteStream(dest));

  return { filename, url: `/api/cms/images/${filename}` };
}
