---
id: TASK-2.5
title: Implement in-process job queue with SQLite backing
status: Done
assignee: []
created_date: '2026-06-20 16:05'
updated_date: '2026-06-20 16:23'
labels:
  - backend
dependencies: []
parent_task_id: TASK-2
priority: high
ordinal: 18000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create src/lib/queue.ts which manages the lifecycle of download jobs for VDown Video. The queue persists job state in SQLite so jobs survive server restarts, limits concurrency to avoid resource exhaustion, and emits SSE-compatible events for real-time progress.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 MAX_CONCURRENT env var (default 3) caps the number of jobs processed simultaneously
- [ ] #2 On server startup, all jobs with status queued are re-loaded from SQLite into the in-memory queue
- [ ] #3 Job status transitions correctly: queued → downloading → ready or queued → downloading → error
- [ ] #4 Every status and progress change emits an event that can be consumed by the SSE endpoint
- [ ] #5 Queue exposes enqueue(jobId), getJob(jobId), and onEvent(jobId, callback) as its public API
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
