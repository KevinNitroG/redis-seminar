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
hideInToc: true
layout: two-cols
layoutClass: gap-6
---

## OT Container Kit Architecture

![Redis Operator Architecture](https://ot-container-kit.github.io/redis-operator/assets/img/redis-operator-architecture.ae3c73c9.png)

::right::

![Redis Cluster Setup](https://ot-container-kit.github.io/redis-operator/assets/img/redis-cluster-setup.c1d7206d.png)

<!--
Left: the operator architecture — CRDs managed by the operator controller.
Right: cluster setup with master-replica sharding across nodes.
-->
