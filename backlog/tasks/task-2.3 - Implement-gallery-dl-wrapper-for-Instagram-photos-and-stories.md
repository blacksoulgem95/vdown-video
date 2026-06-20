---
id: TASK-2.3
title: Implement gallery-dl wrapper for Instagram photos and stories
status: Done
assignee: []
created_date: '2026-06-20 16:05'
updated_date: '2026-06-20 16:22'
labels:
  - backend
dependencies: []
parent_task_id: TASK-2
priority: high
ordinal: 16000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create src/lib/gallery-dl.ts which wraps the gallery-dl CLI as a fallback downloader for Instagram photos and stories that yt-dlp cannot handle. The wrapper must integrate cleanly with the existing job queue.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 galleryDlDownload(url: string, destDir: string) spawns gallery-dl as a child process to download Instagram photos/stories to destDir
- [ ] #2 Function returns an array of downloaded file paths on success
- [ ] #3 If gallery-dl exits non-zero, the function throws a typed error with stderr output included
- [ ] #4 gallery-dl binary path is configurable via GALLERYDL_PATH env var, defaulting to gallery-dl in PATH
- [ ] #5 The downloader.ts module falls back to galleryDlDownload when yt-dlp fails on an Instagram URL
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
