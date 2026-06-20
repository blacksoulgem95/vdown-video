---
id: TASK-8.3
title: Sitemap.xml generation
status: Done
assignee: []
created_date: '2026-06-20 16:10'
updated_date: '2026-06-20 17:34'
labels:
  - seo
dependencies: []
parent_task_id: TASK-8
priority: medium
ordinal: 52000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Generate a dynamic sitemap.xml that includes all /download/* platform pages plus all /blog/[slug] pages sourced from SQLite, so search engines can discover and index the full VDown Video content inventory.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 @astrojs/sitemap is installed and configured in astro.config.mjs
- [ ] #2 All /download/* platform pages are included in the sitemap
- [ ] #3 /blog/[slug] pages from SQLite are dynamically included at build/request time
- [ ] #4 Sitemap is accessible at https://vdown.video/sitemap.xml
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
