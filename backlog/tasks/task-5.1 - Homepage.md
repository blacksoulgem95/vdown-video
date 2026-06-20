---
id: TASK-5.1
title: Homepage (/)
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
ordinal: 36000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the VDown Video homepage that serves as the top-of-funnel entry point. It explains the service, accepts any URL via the universal input, detects the platform, and routes the user to the appropriate per-platform page.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Hero section explains VDown Video's purpose with compelling above-the-fold copy
- [ ] #2 Universal URL input is rendered prominently; on submit, detectPlatform() is called client-side
- [ ] #3 If a recognised platform is detected, the user is redirected to /download/{platform}?url=... with the URL pre-filled
- [ ] #4 If the platform is unknown, the download flow proceeds inline on the homepage
- [ ] #5 A grid or icon list of supported platforms (YouTube, Vimeo, Facebook, Instagram, TikTok, Twitter, Reddit, SoundCloud) is shown below the hero
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
