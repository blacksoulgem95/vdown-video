---
id: TASK-7.2
title: Admin dashboard page (/admin)
status: Done
assignee: []
created_date: '2026-06-20 16:09'
updated_date: '2026-06-20 17:07'
labels:
  - frontend
  - backend
dependencies: []
parent_task_id: TASK-7
priority: medium
ordinal: 49000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the admin dashboard page at /admin that gives operators visibility into VDown Video's runtime health and lets them manually purge the cache. Protected by the admin auth middleware.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Page is rendered at /admin and is protected by the admin auth middleware (task-7.1)
- [ ] #2 Displays total job count, current queue depth, and disk usage (GB used / CACHE_MAX_GB cap)
- [ ] #3 Displays a table of the 20 most recent jobs with columns: jobId, URL (truncated), platform, status, created_at
- [ ] #4 Manual cache wipe button calls POST /admin/cache/wipe and displays returned stats ({ jobsDeleted, bytesFreed }) as a confirmation message
- [ ] #5 Page uses the Base.astro layout and cyberpunk theme
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
