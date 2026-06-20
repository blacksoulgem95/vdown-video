---
layout: default
title: Overview
description: Self-hosted video downloader for YouTube, Instagram, TikTok, and more.
permalink: /
---

<div class="callout callout-warning">
  <span class="callout-icon">⚠</span>
  <div class="callout-body">
    <strong>Proof of concept — legal notice.</strong> This software is provided for educational and personal research purposes only.
    It is intended <strong>solely for downloading content you own or have explicit permission to download</strong> — for example, your own videos, public-domain material, or content licensed under terms that permit downloading.
    Downloading copyrighted material without authorisation may violate copyright law, platform terms of service, and other regulations in your jurisdiction.
    The authors accept no liability for unlawful use. <strong>You are solely responsible for ensuring compliance with all applicable laws.</strong>
  </div>
</div>

**VDown Video** is a self-hosted web app for downloading videos from the most popular platforms. Paste a URL, pick a format, and download — no signup, no tracking.

<div class="platform-grid">
  <div class="platform-card">
    <span class="platform-card-name">YouTube</span>
    <span class="platform-card-desc">Videos, Shorts, Playlists</span>
  </div>
  <div class="platform-card">
    <span class="platform-card-name">Instagram</span>
    <span class="platform-card-desc">Reels, Stories, Photos</span>
  </div>
  <div class="platform-card">
    <span class="platform-card-name">TikTok</span>
    <span class="platform-card-desc">Videos without watermark</span>
  </div>
  <div class="platform-card">
    <span class="platform-card-name">Facebook</span>
    <span class="platform-card-desc">Videos, Reels, Photos</span>
  </div>
  <div class="platform-card">
    <span class="platform-card-name">Twitter / X</span>
    <span class="platform-card-desc">Videos &amp; GIFs</span>
  </div>
  <div class="platform-card">
    <span class="platform-card-name">Vimeo</span>
    <span class="platform-card-desc">HD &amp; 4K Videos</span>
  </div>
  <div class="platform-card">
    <span class="platform-card-name">Reddit</span>
    <span class="platform-card-desc">Video posts &amp; GIFs</span>
  </div>
  <div class="platform-card">
    <span class="platform-card-name">SoundCloud</span>
    <span class="platform-card-desc">Audio tracks &amp; mixes</span>
  </div>
</div>

## How it works

1. Paste a video URL into the input field.
2. VDown fetches metadata via `yt-dlp` or `gallery-dl` and shows available formats.
3. Pick a format (resolution / audio-only).
4. The download runs in a background job queue. Progress updates in real time.
5. File is served directly from the cache when ready.

## Stack

| Layer | Technology |
|---|---|
| Framework | Astro 5, Node SSR adapter |
| Database | SQLite (`better-sqlite3`) |
| Downloader | `yt-dlp`, `gallery-dl` |
| Transcoding | FFmpeg |
| Styling | Tailwind CSS 4 |
| Tests | Vitest |
| Container | Docker (multi-stage build) |

## Next steps

- [Run locally with Docker](/local-development/) — quickest way to get started
- [Configuration reference](/configuration/) — all environment variables
- [Architecture overview](/architecture/) — how the pieces fit together
