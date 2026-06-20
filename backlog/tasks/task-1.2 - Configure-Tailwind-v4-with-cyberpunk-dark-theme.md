---
id: TASK-1.2
title: Configure Tailwind v4 with cyberpunk dark theme
status: Done
assignee: []
created_date: '2026-06-20 16:04'
updated_date: '2026-06-20 16:16'
labels:
  - setup
  - frontend
dependencies: []
parent_task_id: TASK-1
priority: high
ordinal: 11000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Set up Tailwind v4 with a cyberpunk dark colour system for VDown Video. The visual identity is dark backgrounds, neon purple accents, and glitch/scanline texture effects. This theme must be consistent across all components and pages.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 CSS variables define neon purple palette: #8B5CF6 as base plus neon variants (e.g. --color-neon-purple, --color-neon-glow)
- [ ] #2 Inter is configured as the body font and JetBrains Mono as the monospace/code font
- [ ] #3 Dark background is #0a0a0f applied globally via CSS variable and Tailwind base layer
- [ ] #4 Global utility classes for scanline overlay and grid background texture are available and documented
- [ ] #5 Tailwind v4 config uses the new CSS-first configuration approach (no tailwind.config.js required)
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
