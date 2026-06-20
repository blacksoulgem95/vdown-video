---
layout: default
title: Configuration
description: Environment variables and configuration reference for VDown Video.
permalink: /configuration/
---

VDown is configured entirely via environment variables. Copy `.env.example` to `.env` before starting.

```bash
cp .env.example .env
```

## Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `4321` | HTTP port the server listens on |
| `HOST` | No | `0.0.0.0` | Bind address |
| `NODE_ENV` | No | `production` | `development` or `production` |
| `ADMIN_PASSWORD` | **Yes** | — | Password for the `/admin` panel |
| `YTDLP_PATH` | No | `yt-dlp` | Path to the `yt-dlp` binary |
| `MAX_CACHE_GB` | No | `10` | Max cache size in GB before eviction runs |
| `DATA_DIR` | No | `/app/data` | Root directory for SQLite, cache, and CMS files |

## Data directories

All persistent data lives under a single mount point (`DATA_DIR`):

```
$DATA_DIR/
  sqlite/    SQLite database file
  cache/     Downloaded & transcoded output files
  cms/       Admin CMS image uploads
```

When running with Docker, mount `./data` to `/app/data`:

```yaml
volumes:
  - ./data:/app/data
```

## `yt-dlp` binary

By default the container ships `yt-dlp` installed via `pip3`. If you want to point at a specific binary (e.g. a pre-downloaded static build), set:

```bash
YTDLP_PATH=/usr/local/bin/yt-dlp
```

## Rate limiting

Rate limiting is enforced per IP using a sliding window. It is hardcoded in `src/lib/ratelimit.ts` and is not currently configurable via environment variables.

## Admin panel

The admin panel is available at `/admin`. It requires the `ADMIN_PASSWORD` set in `.env`. There is no multi-user support — a single shared password guards the panel.

<div class="callout callout-warning">
  <span class="callout-icon">⚠</span>
  <div class="callout-body"><strong>Do not expose the admin panel to the internet</strong> without additional access controls (e.g. IP allowlist or auth proxy). The password is transmitted as a plain form POST over HTTP unless TLS is terminated upstream.</div>
</div>
