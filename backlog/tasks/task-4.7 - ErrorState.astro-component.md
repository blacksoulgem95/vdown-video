---
id: TASK-4.7
title: ErrorState.astro component
status: Done
assignee: []
created_date: '2026-06-20 16:08'
updated_date: '2026-06-20 16:47'
labels:
  - frontend
dependencies: []
parent_task_id: TASK-4
priority: high
ordinal: 35000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the inline error state component shown when a job fails or an API error occurs. It uses a CSS glitch animation on the error text to match the cyberpunk aesthetic and offers a retry path.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Renders an error message with a CSS glitch text animation (horizontal colour offset flicker)
- [ ] #2 Displays the error message string passed via prop
- [ ] #3 Renders a retry CTA button that resets the download flow back to the UrlInput state
- [ ] #4 Replaces the ProgressCard in the DOM when the SSE stream emits status: error
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
