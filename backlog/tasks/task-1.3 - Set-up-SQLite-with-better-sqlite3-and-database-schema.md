---
id: TASK-1.3
title: Set up SQLite with better-sqlite3 and database schema
status: Done
assignee: []
created_date: '2026-06-20 16:04'
updated_date: '2026-06-20 16:17'
labels:
  - setup
  - backend
dependencies: []
parent_task_id: TASK-1
priority: high
ordinal: 12000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create the SQLite data layer for VDown Video using better-sqlite3. The DB holds all job state, output file metadata, and blog articles. Migrations must run automatically on startup so deployments are zero-config.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 src/lib/db.ts exports a singleton DB instance created with better-sqlite3
- [ ] #2 Migrations run automatically when the server starts before handling any requests
- [ ] #3 jobs table is created with columns: id, url, platform, status (queued|downloading|ready|error), metadata_json, created_at, updated_at
- [ ] #4 outputs table is created with columns: id, job_id (FK), quality, format, file_path, file_size_bytes, created_at
- [ ] #5 articles table is created with columns: id, slug, title, excerpt, content_html, hero_image_url, json_ld, faq_json_ld, published_at, updated_at
- [ ] #6 DB file path is configurable via DATABASE_PATH env var, defaulting to ./data/vdown.db
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
