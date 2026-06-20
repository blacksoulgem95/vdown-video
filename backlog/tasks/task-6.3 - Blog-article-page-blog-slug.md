---
id: TASK-6.3
title: 'Blog article page (/blog/[slug])'
status: Done
assignee: []
created_date: '2026-06-20 16:09'
updated_date: '2026-06-20 16:59'
labels:
  - frontend
  - seo
  - integration
dependencies: []
parent_task_id: TASK-6
priority: medium
ordinal: 47000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the individual blog article page that renders full article content from SQLite. Rich structured data (JSON-LD and FAQ schema) and dynamic OG meta from BabyLoveGrowth fields are injected for maximum SEO value.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Page is rendered at /blog/[slug] using SSR; returns 404 if slug is not found in SQLite
- [ ] #2 Renders the article content_html field as the main article body
- [ ] #3 Injects the json_ld field as a <script type='application/ld+json'> tag in <head>
- [ ] #4 Injects the faq_json_ld field as a second <script type='application/ld+json'> tag if present
- [ ] #5 OG meta tags (og:title, og:description, og:image) are populated from the article's SQLite fields
- [ ] #6 Canonical URL is set to https://vdown.video/blog/[slug]
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
