---
id: TASK-4.5
title: ProgressCard.astro component
status: Done
assignee: []
created_date: '2026-06-20 16:07'
updated_date: '2026-06-20 16:46'
labels:
  - frontend
dependencies: []
parent_task_id: TASK-4
priority: high
ordinal: 33000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the real-time progress display component that subscribes to the SSE stream for a job and shows download and transcode progress to the user with cyberpunk visual styling.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Connects to GET /api/jobs/[id]/sse on mount and updates UI on each SSE event
- [ ] #2 Neon purple progress bar fills from 0% to 100% as progress events arrive
- [ ] #3 Current status text (e.g. 'Downloading...', 'Transcoding...') is displayed alongside the bar
- [ ] #4 An animated cyberpunk effect (e.g. pulsing glow or scanning line) is active while the job is in progress
- [ ] #5 On job completion (status: ready), transitions to display the DownloadList component
- [ ] #6 On job error (status: error), transitions to display the ErrorState component
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
