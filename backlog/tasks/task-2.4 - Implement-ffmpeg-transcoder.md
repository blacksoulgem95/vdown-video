---
id: TASK-2.4
title: Implement ffmpeg transcoder
status: Done
assignee: []
created_date: '2026-06-20 16:05'
updated_date: '2026-06-20 16:23'
labels:
  - backend
dependencies: []
parent_task_id: TASK-2
priority: high
ordinal: 17000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create src/lib/transcoder.ts which uses ffmpeg to transcode downloaded source files into the quality and format requested by the user. Transcoding results are cached in the outputs SQLite table to avoid redundant work.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 transcode(inputPath, outputPath, quality, format, onProgress) spawns ffmpeg as a child process
- [ ] #2 quality parameter accepts: 4k | 2k | 1080p | 720p | 480p | 360p and maps to appropriate ffmpeg scale/bitrate flags
- [ ] #3 format parameter accepts video formats: mp4 | webm | mkv and audio formats: mp3 | aac | m4a | ogg
- [ ] #4 onProgress callback receives a number 0-100 representing transcode completion percentage, parsed from ffmpeg stderr
- [ ] #5 On successful completion, an entry is inserted into the outputs table with job_id, quality, format, file_path, and file_size_bytes
- [ ] #6 ffmpeg binary path is configurable via FFMPEG_PATH env var, defaulting to ffmpeg in PATH
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
