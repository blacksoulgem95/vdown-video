---
id: TASK-7.3
title: Admin Blog CMS
status: Done
assignee: []
created_date: '2026-06-20 17:02'
updated_date: '2026-06-20 17:07'
labels: []
dependencies: []
parent_task_id: TASK-7
ordinal: 59000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Blog article management UI under /admin/blog — list, create, edit, delete articles directly in SQLite.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Page at /admin/blog lists all articles with title, slug, published date, edit/delete actions
- [ ] #2 GET /admin/blog/new renders create form with fields: title, slug, excerpt, meta_description, hero_image_url, content_html
- [ ] #3 POST /admin/blog/new inserts article into SQLite and redirects to /admin/blog
- [ ] #4 GET /admin/blog/[slug]/edit renders pre-filled edit form
- [ ] #5 POST /admin/blog/[slug]/edit updates article and redirects to /admin/blog
- [ ] #6 POST /admin/blog/[slug]/delete removes article and redirects to /admin/blog
- [ ] #7 Manual BLG sync button on /admin/blog triggers startup sync even if table not empty
- [ ] #8 All routes protected by admin auth middleware
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
