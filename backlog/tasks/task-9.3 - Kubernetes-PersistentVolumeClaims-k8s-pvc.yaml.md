---
id: TASK-9.3
title: Kubernetes PersistentVolumeClaims (k8s/pvc.yaml)
status: Done
assignee: []
created_date: '2026-06-20 16:10'
updated_date: '2026-06-20 17:40'
labels:
  - devops
dependencies: []
parent_task_id: TASK-9
priority: high
ordinal: 56000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Define the two Kubernetes PersistentVolumeClaims needed by VDown Video: one for the large ephemeral cache (downloaded files) and one for the small persistent data volume (SQLite database).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 k8s/pvc.yaml defines cache-pvc with accessMode ReadWriteOnce and storage request of 100Gi
- [ ] #2 k8s/pvc.yaml defines data-pvc with accessMode ReadWriteOnce and storage request of 1Gi
- [ ] #3 Both PVCs use the default StorageClass (no explicit storageClassName)
- [ ] #4 kubectl apply -f k8s/pvc.yaml succeeds against a standard k8s cluster
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Unit test are present and covers > 70%
- [ ] #2 E2e Tests are present and covers > 70%
<!-- DOD:END -->
