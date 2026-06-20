---
id: TASK-7
title: Admin Panel
status: Done
assignee: []
created_date: '2026-06-20 16:03'
updated_date: '2026-06-20 17:07'
labels:
  - backend
  - frontend
dependencies:
  - TASK-3
priority: medium
ordinal: 7000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build a protected admin panel for VDown Video at /admin that shows system health metrics (job counts, queue depth, disk usage), a recent jobs table, and a manual cache wipe button. All /admin/* routes require a bearer token.
<!-- SECTION:DESCRIPTION:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
