---
hideInToc: true
---

## Redis on Kubernetes

<div class="grid grid-cols-3 gap-4 mt-6 text-sm">

<div class="bg-blue-50 border border-blue-300 rounded-lg p-4">

### Redis Enterprise Operator

- Official from Redis Ltd.
- Full feature support
- Not free / commercial license

</div>

<div class="bg-yellow-50 border border-yellow-300 rounded-lg p-4">

### Bitnami Helm Chart

- Easy to get started
- ⚠️ No longer actively maintained

</div>

<div class="bg-green-50 border border-green-300 rounded-lg p-4">

### OT Container Kit

- Open source operator
- Auto TLS, horizontal scaling
- Standalone & cluster modes

</div>

</div>

<!--
Three main options for running Redis on Kubernetes.
OT Container Kit is recommended for open-source deployments — active, supports auto TLS and scaling.
-->

---
layout: figure
figureUrl: https://ot-container-kit.github.io/redis-operator/assets/img/redis-operator-architecture.ae3c73c9.png
figureCaption: 'OT Container Kit Architecture - CRDs and Controller'
---

## OT Container Kit Architecture - CRDs and Controller

---
layout: figure
figureUrl: https://ot-container-kit.github.io/redis-operator/assets/img/redis-cluster-setup.c1d7206d.png
figureCaption: 'OT Container Kit Architecture - Cluster Setup'
---

## OT Container Kit Architecture - Cluster Setup
