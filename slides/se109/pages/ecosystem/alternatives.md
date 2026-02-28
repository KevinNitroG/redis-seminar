---
hideInToc: true
---

# Alternatives to Redis

<div class="grid grid-cols-2 gap-6 mt-4">

<div>

### Valkey

- Forked by Linux Foundation after Redis license change
- **Drop-in replacement** — fully API compatible
- AWS ElastiCache, GCP Memorystore switched to Valkey
- Community-driven, BSD licensed

</div>

<div>

### DragonflyDB

- Multi-threaded architecture (vs Redis single-thread)
- Claims 25× throughput on multi-core hardware
- Redis API compatible
- [Benchmarks](https://github.com/centminmod/redis-comparison-benchmarks)

</div>

</div>

<!--
- Valkey: safest migration — zero code changes needed
- DragonflyDB: best raw throughput but less battle-tested
- Source: https://github.com/centminmod/redis-comparison-benchmarks
-->

---
hideInToc: true
layout: figure
figureUrl: https://github.com/centminmod/redis-comparison-benchmarks/raw/master/results/benchmarks-v5-host-4t-jun7-2025/advcharts-comparison-stack.png
figureCaption: https://github.com/centminmod/redis-comparison-benchmarks
---

# Benchmark: Multi-threaded Comparison

<!--
- DragonflyDB benefits most from multi-core due to shared-nothing architecture
- Valkey also gains from multi-threading introduced post-fork
-->

---
hideInToc: true
layout: figure
figureUrl: https://github.com/centminmod/redis-comparison-benchmarks/raw/master/results/benchmarks-v5-host-4t-jun7-2025/advcharts-comparison.png
figureCaption: https://github.com/centminmod/redis-comparison-benchmarks
---

# Benchmark: Throughput

---
hideInToc: true
layout: figure
figureUrl: https://github.com/centminmod/redis-comparison-benchmarks/raw/master/results/benchmarks-v5-host-4t-jun7-2025/advcharts-latency-dist.png
figureCaption: https://github.com/centminmod/redis-comparison-benchmarks
---

# Benchmark: Latency

<!--
- Redis still competitive for single-threaded workloads
- DragonflyDB excels at high-concurrency scenarios
- For most applications, Valkey is the pragmatic choice post-license change
-->
