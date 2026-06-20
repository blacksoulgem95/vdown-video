---
id: TASK-7.1
title: Admin auth middleware for /admin/* routes
status: Done
assignee: []
created_date: '2026-06-20 16:09'
updated_date: '2026-06-20 17:07'
labels:
  - backend
dependencies: []
parent_task_id: TASK-7
priority: medium
ordinal: 48000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement Astro middleware that protects all /admin/* routes behind bearer token authentication. This must run before any admin page or endpoint is served.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Astro middleware in src/middleware.ts intercepts all requests to /admin/* paths
- [ ] #2 Requests without a valid Authorization: Bearer ADMIN_TOKEN header are rejected with 401
- [ ] #3 Valid requests are passed through to the route handler without modification
- [ ] #4 The ADMIN_TOKEN value is read from the ADMIN_TOKEN environment variable at runtime
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
