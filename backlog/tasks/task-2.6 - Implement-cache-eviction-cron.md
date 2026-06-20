---
id: TASK-2.6
title: Implement cache eviction cron
status: Done
assignee: []
created_date: '2026-06-20 16:05'
updated_date: '2026-06-20 16:24'
labels:
  - backend
dependencies: []
parent_task_id: TASK-2
priority: high
ordinal: 19000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create src/lib/eviction.ts which automatically reclaims disk space by deleting old jobs and their downloaded files. Eviction must run on a schedule and enforce both an age-based TTL and a total disk cap.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Eviction runs every hour via setInterval, starting when the module is first imported
- [ ] #2 Jobs (and their associated files) older than CACHE_TTL_DAYS (default 7) are deleted
- [ ] #3 If total cache directory size exceeds CACHE_MAX_GB (default 20), the oldest jobs are deleted until usage drops below the cap
- [ ] #4 Eviction deletes the corresponding rows from both the jobs and outputs tables
- [ ] #5 Each eviction run logs the count of jobs evicted and bytes freed
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
