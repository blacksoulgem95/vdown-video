---
id: TASK-4.4
title: FormatPicker.astro component
status: Done
assignee: []
created_date: '2026-06-20 16:07'
updated_date: '2026-06-20 16:45'
labels:
  - frontend
dependencies: []
parent_task_id: TASK-4
priority: high
ordinal: 32000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the format selection component where users choose the quality and container for their download. It has a simple mode for casual users and an advanced mode for power users, with preferences persisted in localStorage.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Simple mode shows quality buttons: 4K, 2K, 1080p, 720p, 480p, 360p, and an Audio option
- [ ] #2 Advanced toggle reveals codec selector, container format selector, and estimated file size display
- [ ] #3 User's last selected quality and format are saved to localStorage and pre-selected on next visit
- [ ] #4 Selecting a quality/format and confirming calls POST /api/jobs and passes the jobId to the ProgressCard
- [ ] #5 Audio-only platforms (SoundCloud) hide the video quality options and show audio formats only
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
