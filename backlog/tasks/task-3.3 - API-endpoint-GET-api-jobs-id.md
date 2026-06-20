---
id: TASK-3.3
title: 'API endpoint: GET /api/jobs/[id]'
status: Done
assignee: []
created_date: '2026-06-20 16:06'
updated_date: '2026-06-20 16:27'
labels:
  - backend
dependencies: []
parent_task_id: TASK-3
priority: high
ordinal: 23000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement the job status polling endpoint for VDown Video. Clients that cannot use SSE (or want to reconcile state after reconnecting) use this endpoint to fetch the current state of a job.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 GET /api/jobs/[id] returns 200 with { jobId, status, metadata, outputs[] } when the job exists
- [ ] #2 outputs array contains objects with { quality, format, fileSize, downloadUrl } for each completed transcode
- [ ] #3 Returns 404 with { error: 'Job not found' } if no job with that id exists in SQLite
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
