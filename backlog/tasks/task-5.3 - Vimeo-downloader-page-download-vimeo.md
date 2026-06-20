---
id: TASK-5.3
title: Vimeo downloader page (/download/vimeo)
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
ordinal: 38000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the Vimeo-specific downloader page for VDown Video following the same hybrid form+SEO pattern as the YouTube page.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Page is rendered at /download/vimeo
- [ ] #2 Working download form operates end-to-end for Vimeo URLs
- [ ] #3 If ?url= query param is present on page load, metadata fetch is triggered automatically
- [ ] #4 SEO copy below the fold covers Vimeo downloading use cases
- [ ] #5 Page has unique <title>, meta description, canonical URL, and OG tags for Vimeo
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
