---
id: TASK-9.2
title: docker-compose.yml for local development
status: Done
assignee: []
created_date: '2026-06-20 16:10'
updated_date: '2026-06-20 17:40'
labels:
  - devops
dependencies: []
parent_task_id: TASK-9
priority: high
ordinal: 55000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create a docker-compose.yml for local development of VDown Video so developers can run the full stack (app + volumes) with a single command and matching production environment variables.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 docker compose up starts the VDown Video container built from the local Dockerfile
- [ ] #2 ./cache and ./data host directories are mounted as volumes to /app/cache and /app/data
- [ ] #3 All env vars from .env.example are wired through to the container via env_file or environment block
- [ ] #4 Host port 4321 is mapped to container port 4321
- [ ] #5 .env.example file is created listing all required environment variables with placeholder values and comments
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
