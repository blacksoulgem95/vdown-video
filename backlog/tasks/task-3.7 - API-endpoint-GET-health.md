---
id: TASK-3.7
title: 'API endpoint: GET /health'
status: Done
assignee: []
created_date: '2026-06-20 16:06'
updated_date: '2026-06-20 16:28'
labels:
  - backend
  - devops
dependencies: []
parent_task_id: TASK-3
priority: high
ordinal: 27000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement a health check endpoint for VDown Video that Kubernetes liveness and readiness probes can call to determine if the service is healthy. The endpoint reports DB connectivity, queue depth, and disk usage.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 GET /health returns 200 with { status: 'ok', db: 'ok', queueDepth: N, diskUsageGB: N } when all systems are healthy
- [ ] #2 Returns 503 with { status: 'degraded', db: 'error', ... } if the SQLite DB cannot be queried
- [ ] #3 diskUsageGB reflects the actual size of the cache directory
- [ ] #4 Response time is under 200ms (no external network calls)
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
