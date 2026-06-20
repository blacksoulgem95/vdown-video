---
id: TASK-3.6
title: 'API endpoint: POST /api/webhook/blg'
status: Done
assignee: []
created_date: '2026-06-20 16:06'
updated_date: '2026-06-20 16:28'
labels:
  - backend
  - integration
dependencies: []
parent_task_id: TASK-3
priority: medium
ordinal: 26000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement the BabyLoveGrowth webhook receiver that keeps VDown Video's local articles table in sync with new content published on the BLG platform, without requiring a full re-sync.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 POST /api/webhook/blg verifies the X-BLG-Secret (or equivalent) header matches BABYLOVEGROWTH_WEBHOOK_SECRET env var; returns 401 on mismatch
- [ ] #2 Accepts a JSON body containing article fields: slug, title, excerpt, content_html, hero_image_url, json_ld, faq_json_ld, published_at
- [ ] #3 Upserts the article into the SQLite articles table (insert or update by slug)
- [ ] #4 Returns 200 on success
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
