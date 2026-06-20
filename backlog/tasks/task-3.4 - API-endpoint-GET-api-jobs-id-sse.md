---
id: TASK-3.4
title: 'API endpoint: GET /api/jobs/[id]/sse'
status: Done
assignee: []
created_date: '2026-06-20 16:06'
updated_date: '2026-06-20 16:27'
labels:
  - backend
dependencies: []
parent_task_id: TASK-3
priority: high
ordinal: 24000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement the Server-Sent Events endpoint that pushes real-time job progress to the ProgressCard component. This avoids polling and gives users instant feedback during download and transcoding.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 GET /api/jobs/[id]/sse sets Content-Type: text/event-stream and keeps the connection open
- [ ] #2 Emits SSE data events with JSON payload { status, progress, outputs[] } whenever job state changes
- [ ] #3 Closes the SSE stream automatically when the job reaches status ready or error
- [ ] #4 Returns 404 if the job does not exist
- [ ] #5 Connection is cleaned up (no memory leaks) when the client disconnects
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
