---
hideInToc: true
---

# License Shift: March 2024

```mermaid
graph LR
  subgraph OSS ["Open Source"]
    V72[Redis 7.2 and Prior] --> BSD(BSD 3-Clause License)
  end

  subgraph SA ["Source Available"]
    V74[Redis 7.4 and Future] --> DUAL(Dual License: RSALv2 / SSPLv1)
  end

  OSS -->|March 2024 Transition| SA

  style OSS fill:#f9f9f9,stroke:#333,stroke-dasharray: 5 5
  style SA fill:#fff4f4,stroke:#dc3545,stroke-width:2px
  style V72 fill:#d4edda
  style V74 fill:#f8d7da
```

<div class="mt-4 text-sm text-gray-500">

Sources: [redis.io/blog/what-redis-license-change-means-for-our-managed-service-providers](https://redis.io/blog/what-redis-license-change-means-for-our-managed-service-providers/) · [redis.io/blog/agplv3](https://redis.io/blog/agplv3/)

</div>

<!--
- RSALv2 = Redis Source Available License v2: can use but can't sell Redis as a service
- SSPLv1 = Server Side Public License: open source but requires sharing all service code
- Drove community forks: Valkey (Linux Foundation), AWS ElastiCache switch to Valkey
-->
