---
id: TASK-4.2
title: UrlInput.astro component
status: Done
assignee: []
created_date: '2026-06-20 16:07'
updated_date: '2026-06-20 16:44'
labels:
  - frontend
dependencies: []
parent_task_id: TASK-4
priority: high
ordinal: 30000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the primary URL input component used on all downloader pages. It is the entry point of the download flow: user pastes a URL, the component validates it client-side and fetches metadata before the user proceeds.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Input field has a pulsing neon purple border animation (CSS keyframe) indicating it is ready for input
- [ ] #2 Client-side URL validation runs before any fetch (empty or malformed URLs show inline error without network call)
- [ ] #3 On valid submit, calls POST /api/metadata and shows a loading spinner while the request is in flight
- [ ] #4 On successful metadata response, emits a custom DOM event (metadata-loaded) with the response payload for parent components to consume
- [ ] #5 On metadata fetch error, shows an inline error message without navigating away
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
