import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const DB_PATH = resolve(process.env['DATABASE_PATH'] ?? './data/sqlite/vdown.db');

mkdirSync(dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('synchronous = NORMAL');

// Check existing columns
const columnCheck = db.prepare("PRAGMA table_info(jobs)").all() as { name: string }[];
const existingColumns = new Set(columnCheck.map((c) => c.name));

db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    platform TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued'
      CHECK(status IN ('queued','fetching_meta','downloading','ready','error')),
    ip TEXT,
    error_message TEXT,
    metadata_json TEXT,
    source_file_path TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS outputs (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    quality TEXT NOT NULL,
    format TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size_bytes INTEGER,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY,
    blg_id INTEGER UNIQUE,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content_html TEXT,
    content_markdown TEXT,
    meta_description TEXT,
    hero_image_url TEXT,
    json_ld TEXT,
    faq_json_ld TEXT,
    language_code TEXT NOT NULL DEFAULT 'en',
    seed_keyword TEXT,
    keywords_json TEXT,
    published_at INTEGER,
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
  CREATE INDEX IF NOT EXISTS idx_jobs_ip ON jobs(ip);
  CREATE INDEX IF NOT EXISTS idx_jobs_created ON jobs(created_at);
  CREATE INDEX IF NOT EXISTS idx_outputs_job_id ON outputs(job_id);
  CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
`);

// Migrations
if (!existingColumns.has('correlation_id')) {
  db.exec('ALTER TABLE jobs ADD COLUMN correlation_id TEXT');
}
if (!existingColumns.has('requested_quality')) {
  db.exec('ALTER TABLE jobs ADD COLUMN requested_quality TEXT');
}
if (!existingColumns.has('requested_format')) {
  db.exec('ALTER TABLE jobs ADD COLUMN requested_format TEXT');
}

export default db;
