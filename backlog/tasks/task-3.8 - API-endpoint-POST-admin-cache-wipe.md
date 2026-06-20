---
id: TASK-3.8
title: 'API endpoint: POST /admin/cache/wipe'
status: Done
assignee: []
created_date: '2026-06-20 16:07'
updated_date: '2026-06-20 16:29'
labels:
  - backend
dependencies: []
parent_task_id: TASK-3
priority: medium
ordinal: 28000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement the admin cache wipe endpoint that allows operators to manually purge all cached jobs and files from VDown Video without restarting the server. Requires bearer token authentication.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 POST /admin/cache/wipe requires Authorization: Bearer ADMIN_TOKEN header; returns 401 without a valid token
- [ ] #2 Triggers a full cache eviction: deletes all rows from jobs and outputs tables and removes all files from the cache directory
- [ ] #3 Returns 200 with { jobsDeleted: N, bytesFreed: N } stats after successful wipe
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
