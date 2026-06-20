---
id: TASK-1.4
title: Configure TypeScript strict mode and project path aliases
status: Done
assignee: []
created_date: '2026-06-20 16:04'
updated_date: '2026-06-20 16:17'
labels:
  - setup
dependencies: []
parent_task_id: TASK-1
priority: high
ordinal: 13000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Establish a strict TypeScript configuration for VDown Video with path aliases so internal imports are clean and refactor-friendly across the entire codebase.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 @/lib/* resolves to src/lib/* in both TypeScript and at Astro build time
- [ ] #2 @/components/* resolves to src/components/* in both TypeScript and at Astro build time
- [ ] #3 tsconfig.json enables strict: true, noUncheckedIndexedAccess, exactOptionalPropertyTypes
- [ ] #4 npm run build completes with zero TypeScript errors
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
