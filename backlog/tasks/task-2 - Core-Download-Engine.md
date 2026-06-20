---
id: TASK-2
title: Core Download Engine
status: Done
assignee: []
created_date: '2026-06-20 16:03'
updated_date: '2026-06-20 16:24'
labels:
  - backend
dependencies:
  - TASK-1
priority: high
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement the backend download pipeline for VDown Video: platform detection, yt-dlp and gallery-dl wrappers, ffmpeg transcoder, SQLite-backed job queue, cache eviction, and IP rate limiting. This epic is the heart of the application and blocks the API and UI layers.
<!-- SECTION:DESCRIPTION:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
