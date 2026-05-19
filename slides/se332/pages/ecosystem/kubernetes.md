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
Có 3 lựa chọn phổ biến để chạy Redis trên Kubernetes:
1. Redis Enterprise Operator — của chính Redis Ltd., đầy đủ tính năng nhưng không free, cần commercial license.
2. Bitnami Helm Chart — dễ cài, phù hợp bắt đầu. Tuy nhiên không còn được maintain, không khuyến khích dùng cho production.
3. OT Container Kit — open source operator từ cộng đồng. Hỗ trợ auto TLS, horizontal scaling, cả standalone và cluster modes. Là lựa chọn miễn phí tốt nhất hiện tại.
Tuỳ nhu cầu: Enterprise nếu có budget, OT Container Kit nếu muốn open source và tự vận hành.
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
