---
id: TASK-5.2
title: YouTube downloader page (/download/youtube)
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
ordinal: 37000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the YouTube-specific downloader page for VDown Video. It combines a fully functional download form with SEO copy below the fold. Auto-triggers metadata fetch when a ?url= query param is present.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Page is rendered at /download/youtube
- [ ] #2 Working download form is rendered above the fold: UrlInput → MetadataCard → FormatPicker → ProgressCard → DownloadList
- [ ] #3 If ?url= query param is present on page load, metadata fetch is triggered automatically without user interaction
- [ ] #4 SEO copy section below the fold covers YouTube downloading use cases
- [ ] #5 Page has unique <title>, meta description, canonical URL, and OG tags for YouTube
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
