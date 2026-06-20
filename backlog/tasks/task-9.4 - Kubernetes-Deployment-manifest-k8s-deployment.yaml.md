---
id: TASK-9.4
title: Kubernetes Deployment manifest (k8s/deployment.yaml)
status: Done
assignee: []
created_date: '2026-06-20 16:11'
updated_date: '2026-06-20 17:40'
labels:
  - devops
dependencies: []
parent_task_id: TASK-9
priority: high
ordinal: 57000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Define the Kubernetes Deployment for VDown Video with appropriate resource limits, volume mounts, and health probes so the cluster can self-heal and enforce resource boundaries.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 k8s/deployment.yaml defines a Deployment with replicas: 1
- [ ] #2 Both cache-pvc and data-pvc are mounted at /app/cache and /app/data respectively
- [ ] #3 Resource requests are 500m CPU / 512Mi memory; limits are 2000m CPU / 2Gi memory
- [ ] #4 Liveness probe: httpGet /health, initialDelaySeconds: 30, periodSeconds: 10
- [ ] #5 Readiness probe: httpGet /health, initialDelaySeconds: 30, periodSeconds: 5
- [ ] #6 Environment variables are sourced from a ConfigMap (non-secret) and a Secret (sensitive values) via envFrom
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
