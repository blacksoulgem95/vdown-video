---
id: TASK-4.3
title: MetadataCard.astro component
status: Done
assignee: []
created_date: '2026-06-20 16:07'
updated_date: '2026-06-20 16:45'
labels:
  - frontend
dependencies: []
parent_task_id: TASK-4
priority: high
ordinal: 31000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the metadata preview card that appears after a URL is submitted. It shows the video thumbnail, title, duration, and author so the user can confirm the correct content before choosing a download format.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Displays thumbnail image, title, duration (formatted as mm:ss), and author name
- [ ] #2 Shows a skeleton loading state with scanline animation while metadata is being fetched
- [ ] #3 Renders a confirm CTA button that transitions the flow to the FormatPicker
- [ ] #4 Skeleton is replaced by actual content when the metadata-loaded event is received
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
