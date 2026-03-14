---
hideInToc: true
layout: two-cols-header
layoutClass: gap-6
---

## Redis Alternatives

::left::

### Valkey

<div class="bg-blue-50 border border-blue-300 rounded-lg p-4">

<img src="https://cdn.jsdelivr.net/gh/selfhst/icons@main/svg/valkey.svg" class="h-8 mb-2" />

- Linux Foundation fork of Redis
- Drop-in replacement (RESP compatible)
- AWS ElastiCache & GCP Memorystore switched
- BSD licensed

</div>

::right::

### DragonflyDB

<div class="bg-purple-50 border border-purple-300 rounded-lg p-4">

<img src="https://raw.githubusercontent.com/dragonflydb/dragonfly/refs/heads/main/.github/images/logo-full.svg" class="h-8 mb-2" />

- Multi-threaded architecture
- Up to 25x throughput over Redis
- Redis & Memcached compatible
- In-memory, optimized for modern hardware

</div>

<!--
Redis alternatives have matured. Valkey is the safe drop-in, DragonflyDB is for high-performance needs.
-->

---
hideInToc: true
layout: figure
figureUrl: https://github.com/centminmod/redis-comparison-benchmarks/raw/master/results/benchmarks-v5-host-4t-jun7-2025/advcharts-comparison-stack.png
figureCaption: 'Multi-threaded performance comparison'
---

## Benchmark: Multi-threaded Operations

<!--
DragonflyDB leverages all CPU cores; Redis is single-threaded per shard.
-->

---
hideInToc: true
layout: figure
figureUrl: https://github.com/centminmod/redis-comparison-benchmarks/raw/master/results/benchmarks-v5-host-4t-jun7-2025/advcharts-comparison.png
figureCaption: 'Throughput comparison (ops/sec)'
---

## Benchmark: Throughput

<!--
Dragonfly significantly outperforms on throughput, especially at high concurrency.
-->

---
hideInToc: true
layout: figure
figureUrl: https://github.com/centminmod/redis-comparison-benchmarks/raw/master/results/benchmarks-v5-host-4t-jun7-2025/advcharts-latency-dist.png
figureCaption: 'Latency distribution'
---

## Benchmark: Latency

<!--
Source: https://github.com/centminmod/redis-comparison-benchmarks
Latency percentiles — DragonflyDB shows competitive p99 latency.
-->
