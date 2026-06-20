---
layout: default
title: Local Development
description: Run VDown Video locally with Docker and hot reload.
permalink: /local-development/
---

Docker is the recommended way to run VDown locally. It installs all system dependencies (`ffmpeg`, `yt-dlp`, `gallery-dl`) inside the container so you don't have to touch your host.

## Prerequisites

- [Docker Desktop](https://docs.docker.com/get-docker/) (or Docker Engine + Compose plugin)
- Git

## Quick start

<ol class="steps">
<li>

**Clone the repository**

```bash
git clone <your-repo-url>
cd yt-downloader
```

</li>
<li>

**Copy the example environment file**

```bash
cp .env.example .env
```

Open `.env` and fill in the required values. See the [Configuration reference](/configuration/) for details.

</li>
<li>

**Start the dev server**

```bash
docker compose -f compose.local.yml up --build
```

Docker will:
- Build the dev image (`Dockerfile.dev`) with `ffmpeg`, `yt-dlp`, `gallery-dl`
- Mount `./src` into the container for hot reload
- Start Astro in dev mode on port **4321**

</li>
<li>

**Open the app**

```
http://localhost:4321
```

</li>
</ol>

<div class="callout callout-tip">
  <span class="callout-icon">✦</span>
  <div class="callout-body"><strong>Hot reload:</strong> <code>./src</code> is mounted as a volume. Edit any file in <code>src/</code> and Astro rebuilds automatically — no restart needed.</div>
</div>

## What the compose file does

```yaml
# compose.local.yml (simplified)
services:
  app:
    build:
      dockerfile: Dockerfile.dev   # includes ffmpeg + yt-dlp
    ports:
      - "4321:4321"
    volumes:
      - ./src:/app/src             # hot reload
      - ./data:/app/data           # sqlite + cache + cms uploads
    command: npm run dev -- --host
```

Data is persisted in `./data` on your host so it survives container restarts.

## Stopping

```bash
docker compose -f compose.local.yml down
```

Add `-v` to also remove named volumes (wipes the `data/` bind mount is on the host, so data in `./data` stays regardless).

## Running tests

Tests run inside or outside Docker — they only need Node.js and do not require `ffmpeg` or `yt-dlp`.

**Outside Docker (fastest):**

```bash
npm install
npm test
```

**With coverage:**

```bash
npm run test:coverage
# report written to ./coverage
```

**Inside the running container:**

```bash
docker compose -f compose.local.yml exec app npm test
```

## Rebuilding after dependency changes

If you change `package.json` or `package-lock.json`, rebuild the image:

```bash
docker compose -f compose.local.yml up --build
```

## Production build locally

To test the production build without deploying:

```bash
docker compose up --build
```

This uses `docker-compose.yml` (not the dev file), builds a production image, and serves it on port **4321**.

<div class="callout callout-warning">
  <span class="callout-icon">⚠</span>
  <div class="callout-body"><strong>No hot reload in production mode.</strong> Use <code>compose.local.yml</code> for day-to-day development.</div>
</div>

## Troubleshooting

**Port 4321 already in use**

Change the host port in `compose.local.yml`:

```yaml
ports:
  - "4322:4321"   # use :4322 in your browser
```

**`yt-dlp` fails on some URLs**

Update `yt-dlp` inside the running container:

```bash
docker compose -f compose.local.yml exec app pip3 install -U yt-dlp
```

**Database locked / corrupted**

Stop containers, then delete `./data/sqlite/` and restart. The app recreates the schema on boot.
