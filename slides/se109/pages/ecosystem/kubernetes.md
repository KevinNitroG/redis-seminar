---
hideInToc: true
---

# Redis on Kubernetes

<div class="grid grid-cols-3 gap-4 mt-4">

<div class="p-3 bg-gray-50 rounded border text-sm">

### Redis Enterprise Operator

- Official, feature-rich
- **Not free** — requires Redis Enterprise license

</div>

<div class="p-3 bg-yellow-50 rounded border text-sm">

### Bitnami Helm Chart

- Easy to get started
- **No longer maintained** by Bitnami

</div>

<div class="p-3 bg-green-50 rounded border border-green-300 text-sm">

### OT Container Kit Operator

- Open source, actively maintained
- Auto TLS, horizontal scaling
- Standalone + Cluster modes

</div>

</div>

---
hideInToc: true
layout: two-cols
class: gap-8
---

::left::

![OT Operator Architecture](https://ot-container-kit.github.io/redis-operator/assets/img/redis-operator-architecture.ae3c73c9.png)

<div class="text-xs text-gray-400">OT Redis Operator Architecture</div>

::right::

![Redis Cluster Setup](https://ot-container-kit.github.io/redis-operator/assets/img/redis-cluster-setup.c1d7206d.png){width=350px}

<div class="text-xs text-gray-400">Redis Cluster on K8s</div>

<!--
- Redis Enterprise Operator: full HA, geo-replication, but expensive
- OT Container Kit: community-driven, good for self-hosted k8s clusters
- Source: https://ot-container-kit.github.io/redis-operator/
-->
