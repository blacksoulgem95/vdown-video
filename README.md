# VDown Video

> **Legal notice — Proof of Concept only**
>
> This software is a **proof of concept** built for educational and personal research purposes.
> It is intended **solely for downloading content you own or have explicit permission to download** — for example, your own videos, content in the public domain, or material licensed under terms that permit downloading.
>
> Downloading copyrighted material without the rights holder's authorisation may violate copyright law, the terms of service of the relevant platform, and other applicable regulations in your jurisdiction.
> The authors of this project accept no liability for any unlawful use. **You are solely responsible for ensuring your use complies with all applicable laws.**

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

## License

Copyright © 2026 **Sofia Vicedomini**

This project is released under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html).
You may use, copy, modify, and distribute this software under the terms of the GPL v3.
There is **no warranty**, to the extent permitted by law.

---

<a href='https://ko-fi.com/Q5Q1AEQQK' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
