---
id: TASK-6.1
title: BabyLoveGrowth startup article sync
status: Done
assignee: []
created_date: '2026-06-20 16:09'
updated_date: '2026-06-20 16:59'
labels:
  - backend
  - integration
dependencies: []
parent_task_id: TASK-6
priority: medium
ordinal: 45000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement the startup sync routine that populates the local articles SQLite table from the BabyLoveGrowth API when VDown Video boots with an empty database. This ensures the blog is populated on first deploy without manual intervention.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 On server startup, if the articles table is empty, fetch articles from GET https://api.babylovegrowth.ai/api/integrations/v1/articles using BABYLOVEGROWTH_API_KEY header
- [ ] #2 Pagination is handled: fetches all pages with limit=50 until no more results
- [ ] #3 Each article is upserted into the SQLite articles table by slug
- [ ] #4 Sync errors are logged but do not crash the server startup
- [ ] #5 If the articles table already has rows, the startup sync is skipped
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
