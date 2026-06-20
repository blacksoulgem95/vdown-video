---
id: TASK-3.1
title: 'API endpoint: POST /api/metadata'
status: Done
assignee: []
created_date: '2026-06-20 16:05'
updated_date: '2026-06-20 16:27'
labels:
  - backend
dependencies: []
parent_task_id: TASK-3
priority: high
ordinal: 21000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement the metadata fetch endpoint that the frontend calls when a user pastes a URL. It runs yt-dlp --dump-json to extract video metadata without creating a job, enabling the MetadataCard preview before the user commits to a download.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 POST /api/metadata accepts { url: string } JSON body
- [ ] #2 Returns 200 with { title, thumbnail, duration, author, platform } on success
- [ ] #3 Returns 400 if url is missing or not a valid URL
- [ ] #4 Returns 422 if yt-dlp fails to extract metadata (e.g. private video, unsupported platform)
- [ ] #5 Request is rate-limited per IP using the ratelimit module; returns 429 if limit exceeded
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
