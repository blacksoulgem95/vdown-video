---
id: TASK-2.7
title: Implement IP rate limiter
status: Done
assignee: []
created_date: '2026-06-20 16:05'
updated_date: '2026-06-20 16:24'
labels:
  - backend
dependencies: []
parent_task_id: TASK-2
priority: high
ordinal: 20000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create src/lib/ratelimit.ts to protect VDown Video from abuse by limiting how many download requests a single IP can submit per hour and capping the total queue depth. This module is used by the API endpoints before creating any jobs.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 checkRateLimit(ip: string) throws a 429 error if the calling IP has exceeded RATE_LIMIT_PER_IP_HOUR (default 10) requests in the current hour
- [ ] #2 checkRateLimit also throws 429 if the total queue depth across all IPs exceeds RATE_LIMIT_QUEUE_DEPTH (default 50)
- [ ] #3 Per-IP counters are stored in an in-memory Map and reset hourly
- [ ] #4 The function is synchronous and adds negligible latency to request handling
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
