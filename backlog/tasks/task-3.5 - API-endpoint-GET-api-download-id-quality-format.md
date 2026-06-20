---
id: TASK-3.5
title: 'API endpoint: GET /api/download/[id]/[quality]/[format]'
status: Done
assignee: []
created_date: '2026-06-20 16:06'
updated_date: '2026-06-20 16:28'
labels:
  - backend
dependencies: []
parent_task_id: TASK-3
priority: high
ordinal: 25000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement the file delivery endpoint for VDown Video. When a user clicks a download button, this endpoint checks the outputs table for a cached transcode, triggers ffmpeg if the transcode is missing, and then streams the file to the browser.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 GET /api/download/[id]/[quality]/[format] looks up the outputs table for a matching (job_id, quality, format) row
- [ ] #2 If the output already exists, streams the file immediately with appropriate Content-Type and Content-Disposition: attachment headers
- [ ] #3 If the output does not exist, triggers ffmpeg transcoding synchronously then streams the resulting file
- [ ] #4 Returns 404 if no job with the given id exists
- [ ] #5 Filename in Content-Disposition is derived from the job title and quality/format
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
