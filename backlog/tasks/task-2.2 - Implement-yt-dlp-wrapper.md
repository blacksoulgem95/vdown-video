---
id: TASK-2.2
title: Implement yt-dlp wrapper
status: Done
assignee: []
created_date: '2026-06-20 16:05'
updated_date: '2026-06-20 16:22'
labels:
  - backend
dependencies: []
parent_task_id: TASK-2
priority: high
ordinal: 15000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create src/lib/downloader.ts which wraps the yt-dlp CLI for VDown Video. This module handles metadata extraction, source file download, and format listing by spawning yt-dlp as a child process and parsing its output.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 fetchMetadata(url: string) runs yt-dlp --dump-json and returns { title, thumbnail, duration, author } or throws a typed error if yt-dlp exits non-zero
- [ ] #2 downloadSource(url: string, destDir: string) downloads the best-quality source file to destDir and returns the file path
- [ ] #3 getAvailableFormats(url: string) returns an array of format objects from yt-dlp --list-formats output
- [ ] #4 All three functions spawn yt-dlp as a child process (not shell exec) to avoid shell injection
- [ ] #5 stderr from yt-dlp is streamed and emitted as progress events so callers can track download progress
- [ ] #6 yt-dlp binary path is configurable via YTDLP_PATH env var, defaulting to yt-dlp in PATH
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
