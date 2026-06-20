---
id: TASK-9.5
title: 'Kubernetes Service, ConfigMap, and Secret template (k8s/)'
status: Done
assignee: []
created_date: '2026-06-20 16:11'
updated_date: '2026-06-20 17:40'
labels:
  - devops
dependencies: []
parent_task_id: TASK-9
priority: high
ordinal: 58000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Define the remaining Kubernetes manifests for VDown Video: a ClusterIP Service to expose the app inside the cluster, a ConfigMap for non-sensitive configuration, and a Secret template (with placeholder values, not committed to git) for sensitive credentials.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 k8s/service.yaml defines a ClusterIP Service targeting port 4321 with appropriate selector labels
- [ ] #2 k8s/configmap.yaml contains non-secret env vars: PORT, MAX_CONCURRENT, CACHE_TTL_DAYS, CACHE_MAX_GB, RATE_LIMIT_PER_IP_HOUR, RATE_LIMIT_QUEUE_DEPTH, DATABASE_PATH, CACHE_DIR
- [ ] #3 k8s/secret.yaml.template contains placeholder entries for ADMIN_TOKEN, BABYLOVEGROWTH_API_KEY, BABYLOVEGROWTH_WEBHOOK_SECRET; the template file is committed but .gitignore excludes k8s/secret.yaml
- [ ] #4 kubectl apply -f k8s/service.yaml and kubectl apply -f k8s/configmap.yaml succeed against a standard k8s cluster
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
