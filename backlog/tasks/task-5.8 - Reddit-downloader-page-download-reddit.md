---
id: TASK-5.8
title: Reddit downloader page (/download/reddit)
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
ordinal: 43000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the Reddit-specific downloader page for VDown Video following the same hybrid form+SEO pattern. Must handle v.redd.it short URLs.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Page is rendered at /download/reddit
- [ ] #2 Working download form operates end-to-end for both reddit.com and v.redd.it URLs
- [ ] #3 If ?url= query param is present on page load, metadata fetch is triggered automatically
- [ ] #4 SEO copy below the fold covers Reddit video downloading use cases
- [ ] #5 Page has unique <title>, meta description, canonical URL, and OG tags for Reddit
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
