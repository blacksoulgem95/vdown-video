---
id: TASK-8.4
title: robots.txt
status: Done
assignee: []
created_date: '2026-06-20 16:10'
updated_date: '2026-06-20 17:34'
labels:
  - seo
dependencies: []
parent_task_id: TASK-8
priority: medium
ordinal: 53000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add a robots.txt file to VDown Video that permits all compliant web crawlers to index the site and points them to the sitemap for efficient crawling.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 robots.txt is served at https://vdown.video/robots.txt
- [ ] #2 Contains User-agent: * / Allow: / directives
- [ ] #3 Contains Sitemap: https://vdown.video/sitemap.xml directive
- [ ] #4 Disallows /admin/* to prevent indexing of the admin panel
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
