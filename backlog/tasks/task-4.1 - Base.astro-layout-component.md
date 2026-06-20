---
id: TASK-4.1
title: Base.astro layout component
status: Done
assignee: []
created_date: '2026-06-20 16:07'
updated_date: '2026-06-20 16:44'
labels:
  - frontend
dependencies: []
parent_task_id: TASK-4
priority: high
ordinal: 29000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create the root layout component that wraps every page of VDown Video. It provides the cyberpunk chrome (nav, footer, background textures) and injects all SEO/social meta tags. Every page must use this layout.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 src/layouts/Base.astro renders a nav bar with the VDown Video logo and neon purple accent
- [ ] #2 Page background is dark (#0a0a0f) with grid background and scanline overlay CSS utilities applied globally
- [ ] #3 Layout accepts and renders SEO props: title, description, canonicalUrl, ogImage
- [ ] #4 Layout accepts and renders a jsonLd prop as a <script type='application/ld+json'> tag in <head>
- [ ] #5 Footer is rendered at the bottom of every page
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
