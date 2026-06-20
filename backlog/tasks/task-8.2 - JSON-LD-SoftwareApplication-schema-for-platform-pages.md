---
id: TASK-8.2
title: JSON-LD SoftwareApplication schema for platform pages
status: Done
assignee: []
created_date: '2026-06-20 16:10'
updated_date: '2026-06-20 17:34'
labels:
  - seo
dependencies: []
parent_task_id: TASK-8
priority: medium
ordinal: 51000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Inject structured data on each /download/* platform page so search engines can display rich results (e.g. application name, rating, platform) for VDown Video.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Each /download/* page includes a <script type='application/ld+json'> in <head> with SoftwareApplication schema
- [ ] #2 Schema includes: @type: SoftwareApplication, name: VDown Video, applicationCategory: MultimediaApplication, operatingSystem: Web
- [ ] #3 Schema is valid according to Google's Rich Results Test
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
