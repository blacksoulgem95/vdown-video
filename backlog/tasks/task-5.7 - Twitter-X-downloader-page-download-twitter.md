---
id: TASK-5.7
title: Twitter/X downloader page (/download/twitter)
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
ordinal: 42000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the Twitter/X-specific downloader page for VDown Video following the same hybrid form+SEO pattern. Must handle both twitter.com and x.com URLs.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Page is rendered at /download/twitter
- [ ] #2 Working download form operates end-to-end for both twitter.com and x.com URLs
- [ ] #3 If ?url= query param is present on page load, metadata fetch is triggered automatically
- [ ] #4 SEO copy below the fold covers Twitter/X video downloading use cases
- [ ] #5 Page has unique <title>, meta description, canonical URL, and OG tags for Twitter/X
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
