---
id: TASK-1.1
title: Initialize Astro 5 project with @astrojs/node standalone adapter
status: Done
assignee: []
created_date: '2026-06-20 16:04'
updated_date: '2026-06-20 16:15'
labels:
  - setup
dependencies: []
parent_task_id: TASK-1
priority: high
ordinal: 10000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Bootstrap the VDown Video project with Astro 5 and the @astrojs/node adapter in standalone mode so the app runs as a self-contained Node.js server. This is the foundational step that all other work depends on.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 npm run dev starts SSR server on the port defined by PORT env var
- [ ] #2 npm run build produces a standalone Node.js server output in dist/
- [ ] #3 @astrojs/node is configured with output: standalone in astro.config.mjs
- [ ] #4 Project structure follows Astro 5 conventions with src/pages, src/components, src/layouts, src/lib directories
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
