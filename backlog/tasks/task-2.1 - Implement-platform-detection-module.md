---
id: TASK-2.1
title: Implement platform detection module
status: Done
assignee: []
created_date: '2026-06-20 16:04'
updated_date: '2026-06-20 16:22'
labels:
  - backend
dependencies: []
parent_task_id: TASK-2
priority: high
ordinal: 14000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create src/lib/platform-detect.ts which identifies the social media platform from a given URL. Accurate platform detection is required before routing URLs to the correct downloader and for per-platform SEO page routing.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 detectPlatform(url: string) returns one of: youtube | vimeo | facebook | instagram | tiktok | twitter | reddit | soundcloud | unknown
- [ ] #2 Handles YouTube aliases: youtu.be and youtube.com
- [ ] #3 Handles Twitter/X alias: x.com maps to twitter
- [ ] #4 Handles Reddit video alias: v.redd.it maps to reddit
- [ ] #5 Handles Facebook alias: fb.watch maps to facebook
- [ ] #6 Returns unknown for unrecognised hostnames without throwing
- [ ] #7 Function is pure (no side effects, no network calls) and covered by unit tests
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
