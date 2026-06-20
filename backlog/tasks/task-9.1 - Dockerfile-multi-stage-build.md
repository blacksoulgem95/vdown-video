---
id: TASK-9.1
title: Dockerfile (multi-stage build)
status: Done
assignee: []
created_date: '2026-06-20 16:10'
updated_date: '2026-06-20 17:40'
labels:
  - devops
dependencies: []
parent_task_id: TASK-9
priority: high
ordinal: 54000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create a production-ready multi-stage Dockerfile for VDown Video that produces a minimal runtime image containing the built Astro app plus all required system tools (ffmpeg, yt-dlp, gallery-dl).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Stage 1 uses node:20-bookworm, installs npm dependencies, and runs npm run build
- [ ] #2 Stage 2 (runtime) starts from node:20-bookworm-slim; installs ffmpeg and python3 via apt; installs yt-dlp and gallery-dl via pip
- [ ] #3 Only the built dist/ output and production node_modules are copied from stage 1 to stage 2
- [ ] #4 Container exposes the PORT env var and starts the Astro standalone server
- [ ] #5 /app/cache and /app/data are documented as volume mount points (VOLUME directives or comments)
- [ ] #6 docker build . completes successfully and docker run starts the server on port 4321
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
