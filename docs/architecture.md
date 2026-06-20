---
layout: default
title: Architecture
description: How VDown Video is structured internally.
permalink: /architecture/
---

VDown is a single-container Astro application running in Node SSR mode. It handles HTTP requests, background download jobs, and file serving all in the same process.

## Request flow

```
Browser
  │
  ├─ POST /api/jobs          → create job, return job ID
  │
  ├─ GET  /api/jobs/:id/sse  → Server-Sent Events stream (progress)
  │
  └─ GET  /api/download/:id  → stream finished file to browser
```

## Core modules

| Module | Path | Responsibility |
|---|---|---|
| Queue | `src/lib/queue.ts` | Job lifecycle: `queued → fetching_meta → downloading → transcoding → ready` |
| Downloader | `src/lib/downloader.ts` | Wraps `yt-dlp` — metadata fetch + file download |
| Gallery-DL | `src/lib/gallery-dl.ts` | Wraps `gallery-dl` for Instagram stories/photos |
| Transcoder | `src/lib/transcoder.ts` | FFmpeg wrapper — remux or re-encode to target format |
| Database | `src/lib/db.ts` | SQLite connection + schema via `better-sqlite3` |
| Platform detect | `src/lib/platform-detect.ts` | Classify URL → platform slug |
| Rate limiter | `src/lib/ratelimit.ts` | Sliding-window rate limit per IP |
| Eviction | `src/lib/eviction.ts` | Delete oldest cache files when `MAX_CACHE_GB` is exceeded |
| CMS images | `src/lib/cms-images.ts` | Admin image upload handler |

## Job state machine

```
queued
  │
  ▼
fetching_meta  ── (yt-dlp --dump-json)
  │
  ▼
downloading    ── (yt-dlp download)
  │
  ▼
transcoding    ── (ffmpeg remux/encode)
  │
  ▼
ready          ── file served from cache
  │
  ▼ (on error anywhere)
error
```

Progress events are pushed to the browser over **Server-Sent Events** (`/api/jobs/:id/sse`). The frontend polls the SSE stream and updates the UI without polling.

## Data layout

```
/app/data/
  sqlite/vdown.db   — jobs table, rate limit state
  cache/            — one file per completed job (named by job ID)
  cms/              — images uploaded via admin CMS
```

Jobs older than the eviction threshold are deleted (FIFO) when the cache directory exceeds `MAX_CACHE_GB`.

## Container layers

The production Dockerfile uses a **multi-stage build**:

1. **Builder** (`node:20-bookworm`) — installs npm deps, runs `astro build`
2. **Runtime** (`node:20-bookworm-slim`) — copies `dist/`, installs `ffmpeg` + `yt-dlp` + `gallery-dl`, exposes port 4321

The dev image (`Dockerfile.dev`) skips the build step and mounts `./src` for hot reload.

## Pages & API routes

| Route | Type | Purpose |
|---|---|---|
| `/` | Page | URL input + platform grid |
| `/download/[platform]` | Page | Platform-specific landing + downloader |
| `/blog`, `/blog/[slug]` | Pages | Static blog (CMS-backed) |
| `/admin` | Pages | Job management, CMS, stats |
| `/api/metadata` | API | Fetch video metadata for a URL |
| `/api/jobs` | API | Create download job |
| `/api/jobs/[id]/sse` | API | SSE progress stream |
| `/api/download/[id]` | API | Serve completed file |
| `/api/health` | API | Liveness check |
| `/api/webhook` | API | External webhook receiver |
