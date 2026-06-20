---
id: TASK-4.6
title: DownloadList.astro component
status: Done
assignee: []
created_date: '2026-06-20 16:07'
updated_date: '2026-06-20 16:46'
labels:
  - frontend
dependencies: []
parent_task_id: TASK-4
priority: high
ordinal: 34000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the completed downloads grid that appears when a job finishes. Each card represents one available output (quality + format combination) and provides a direct download button.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Renders a responsive grid of output cards, one per available quality/format combination
- [ ] #2 Each card displays: quality label, format, file size, and a download button
- [ ] #3 Download button href points to GET /api/download/[id]/[quality]/[format]
- [ ] #4 Download button has a neon purple hover effect consistent with the cyberpunk theme
- [ ] #5 Component accepts an outputs array prop matching the API response schema
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
