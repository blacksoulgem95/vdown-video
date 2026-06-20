---
id: TASK-8.1
title: Dynamic meta tags for platform downloader pages
status: Done
assignee: []
created_date: '2026-06-20 16:10'
updated_date: '2026-06-20 17:34'
labels:
  - seo
dependencies: []
parent_task_id: TASK-8
priority: medium
ordinal: 50000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Ensure every /download/* platform page has unique, well-crafted meta tags for SEO and social sharing. Unique titles and descriptions prevent duplicate-content penalties and improve click-through rates from search results.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Each /download/* page has a distinct <title> tag targeting the platform's primary keyword (e.g. 'YouTube Video Downloader - VDown Video')
- [ ] #2 Each page has a unique meta description between 140-160 characters
- [ ] #3 Each page has a <link rel='canonical'> pointing to https://vdown.video/download/{platform}
- [ ] #4 Each page has og:title, og:description, og:image, og:url Open Graph tags
- [ ] #5 Each page has twitter:card, twitter:title, twitter:description Twitter card tags
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
