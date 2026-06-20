---
id: TASK-5.9
title: SoundCloud downloader page (/download/soundcloud)
status: Done
assignee: []
created_date: '2026-06-20 16:09'
updated_date: '2026-06-20 16:53'
labels:
  - frontend
  - seo
dependencies: []
parent_task_id: TASK-5
priority: high
ordinal: 44000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the SoundCloud-specific downloader page for VDown Video. SoundCloud is audio-only, so the format picker must show only audio formats and hide video quality options.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Page is rendered at /download/soundcloud
- [ ] #2 Working download form operates end-to-end for SoundCloud track and playlist URLs
- [ ] #3 FormatPicker shows only audio formats (mp3, aac, m4a, ogg) and hides video quality buttons
- [ ] #4 If ?url= query param is present on page load, metadata fetch is triggered automatically
- [ ] #5 SEO copy below the fold covers SoundCloud audio downloading use cases
- [ ] #6 Page has unique <title>, meta description, canonical URL, and OG tags for SoundCloud
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
