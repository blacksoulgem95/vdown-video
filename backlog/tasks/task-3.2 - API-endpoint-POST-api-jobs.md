---
id: TASK-3.2
title: 'API endpoint: POST /api/jobs'
status: Done
assignee: []
created_date: '2026-06-20 16:06'
updated_date: '2026-06-20 16:27'
labels:
  - backend
dependencies: []
parent_task_id: TASK-3
priority: high
ordinal: 22000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement the job creation endpoint that enqueues a new download job in VDown Video. This is the entry point that triggers the actual download pipeline after the user confirms the metadata preview and picks a format.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 POST /api/jobs accepts { url: string } JSON body
- [ ] #2 Validates url is a non-empty valid URL; returns 400 otherwise
- [ ] #3 Applies IP rate limit; returns 429 if exceeded
- [ ] #4 Creates a job row in SQLite with status queued and enqueues it in the job queue
- [ ] #5 Returns 201 with { jobId: string }
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
