---
id: TASK-6.2
title: Blog index page (/blog)
status: Done
assignee: []
created_date: '2026-06-20 16:09'
updated_date: '2026-06-20 16:59'
labels:
  - frontend
  - integration
dependencies: []
parent_task_id: TASK-6
priority: medium
ordinal: 46000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the /blog index page that lists all articles synced from BabyLoveGrowth. It provides an entry point for readers and search engines to discover all blog content on VDown Video.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Page is rendered at /blog using SSR (not static) so it reflects the latest SQLite state without rebuild
- [ ] #2 Articles are displayed as a card grid with: title, excerpt, hero image, and published date per card
- [ ] #3 Cards link to the corresponding /blog/[slug] page
- [ ] #4 Pagination is implemented (e.g. 20 articles per page) when there are more than 20 articles
- [ ] #5 Page has appropriate <title> and meta description tags
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
