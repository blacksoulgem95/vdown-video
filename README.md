# VDown Video

Self-hosted video downloader supporting YouTube, Instagram, TikTok, Facebook, Twitter/X, Vimeo, Reddit, and SoundCloud.

Built with [Astro](https://astro.build) (SSR), SQLite, `yt-dlp`, and `gallery-dl`. Ships as a single Docker container.

## Features

- Paste a URL → pick format → download
- Background job queue with progress tracking
- Download cache with automatic eviction
- FFmpeg transcoding
- Admin panel with CMS for blog/content
- Rate limiting per IP
- Health endpoint (`/api/health`)

## Requirements

- Docker + Docker Compose
- (Local dev) Node.js ≥ 20

## Quick Start

### Production

```bash
cp .env.example .env          # fill in values
docker compose up --build -d
```

App runs at `http://localhost:4321`.

Data persists in `./data` (SQLite, cache, CMS uploads).

### Local Development (hot reload)

```bash
cp .env.example .env
docker compose -f compose.local.yml up --build
```

Mounts `./src` into the container — Astro rebuilds on file changes.

### Without Docker

```bash
npm install
npm run dev        # dev server → http://localhost:4321
npm run build      # production build
npm start          # serve production build
```

Requires `ffmpeg`, `yt-dlp`, and `gallery-dl` on `$PATH`.

## Data Layout

```
./data/
  sqlite/    SQLite database
  cache/     Downloaded & transcoded files
  cms/       CMS image uploads
```

## Environment Variables

Copy `.env.example` to `.env`. Key variables:

| Variable | Description |
|---|---|
| `PORT` | Server port (default `4321`) |
| `ADMIN_PASSWORD` | Admin panel password |
| `MAX_CACHE_GB` | Cache size before eviction triggers |

## Tests

```bash
npm test               # run once
npm run test:watch     # watch mode
npm run test:coverage  # with coverage report
```

## Kubernetes

Manifests in `k8s/`. Copy `k8s/secret.yaml.template` → `k8s/secret.yaml`, fill in secrets, then:

```bash
kubectl apply -f k8s/
```

## Stack

| Layer | Tech |
|---|---|
| Framework | Astro 5 (Node SSR adapter) |
| Database | SQLite via `better-sqlite3` |
| Downloader | `yt-dlp`, `gallery-dl` |
| Transcoding | FFmpeg |
| Styling | Tailwind CSS 4 |
| Tests | Vitest |
