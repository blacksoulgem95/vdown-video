---
id: TASK-5.5
title: Instagram downloader page (/download/instagram)
status: Done
assignee: []
created_date: '2026-06-20 16:08'
updated_date: '2026-06-20 16:53'
labels:
  - frontend
  - seo
dependencies: []
parent_task_id: TASK-5
priority: high
ordinal: 40000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the Instagram-specific downloader page for VDown Video covering reels, videos, and stories. Photos and stories fall back to gallery-dl, so the page must handle both yt-dlp and gallery-dl success paths.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Page is rendered at /download/instagram
- [ ] #2 Working download form operates end-to-end for Instagram reels, videos, and stories
- [ ] #3 Download flow works correctly when the backend falls back to gallery-dl for photos/stories
- [ ] #4 If ?url= query param is present on page load, metadata fetch is triggered automatically
- [ ] #5 SEO copy below the fold specifically covers Instagram reels, videos, and stories downloading
- [ ] #6 Page has unique <title>, meta description, canonical URL, and OG tags for Instagram
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
