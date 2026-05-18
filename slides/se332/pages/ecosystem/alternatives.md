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
Các giải pháp thay thế Redis đã trưởng thành rõ rệt trong những năm gần đây.

Bên trái: Valkey.
- Là fork từ Redis dưới sự bảo trợ của Linux Foundation, ra đời sau khi Redis chuyển sang license SSPL.
- Drop-in replacement: tương thích hoàn toàn với RESP protocol, có thể chuyển từ Redis sang mà không cần sửa code.
- AWS ElastiCache và GCP Memorystore đã chuyển từ Redis sang Valkey.
- BSD licensed — hoàn toàn open-source.

Bên phải: DragonflyDB.
- Kiến trúc multi-threaded, tận dụng được đa nhân CPU.
- Quảng cáo throughput gấp 25 lần so với Redis.
- Tương thích cả Redis lẫn Memcached protocol.
- Tối ưu cho phần cứng hiện đại (nhiều core, RAM lớn).

Tóm lại:
- Valkey là lựa chọn an toàn, thay thế trực tiếp, tương thích hoàn toàn.
- DragonflyDB là lựa chọn hiệu năng cao, nếu ứng dụng của bạn cần xử lý cực nhiều requests và có thể chịu thay đổi kiến trúc.
-->

---
hideInToc: true
layout: figure
figureUrl: https://github.com/centminmod/redis-comparison-benchmarks/raw/master/results/benchmarks-v5-host-4t-jun7-2025/advcharts-comparison-stack.png
figureCaption: 'Multi-threaded performance comparison'
---

## Benchmark: Multi-threaded Operations

<!--
Biểu đồ so sánh 4 engine: Redis 8.0.2, KeyDB 6.3.4, Dragonfly 1.30.3, Valkey 8.1.1.
Môi trường: GitHub Actions runner (4 vCPU, 16 GB RAM), Docker host network, CPU-pinned.

Công cụ test: memtier_benchmark — ratio 1:15 SET:GET, payload 512 bytes,
keyspace 3M Gaussian, 4 I/O threads, clients/thread = 100.

Scalability từ 1 → 4 threads (Non-TLS):
- Dragonfly: +125%  (53k → 119k ops/s) — scalability tốt nhất
- Redis:     +105%  (61k → 125k ops/s) — throughput tuyệt đối cao nhất
- KeyDB:     +72%   (66k → 114k ops/s) — single-thread mạnh nhất
- Valkey:    +75%   (56k → 98k ops/s)  — cải thiện io-threads so với v2

Ở 4 threads: Redis 125,524 ops/s dẫn đầu, Dragonfly 119,615 sát nút.
TLS giảm throughput ~30-34%, latency tăng ~1.4-1.5× ở tất cả engine.
-->

---
hideInToc: true
layout: figure
figureUrl: https://github.com/centminmod/redis-comparison-benchmarks/raw/master/results/benchmarks-v5-host-4t-jun7-2025/advcharts-comparison.png
figureCaption: 'Throughput comparison (ops/sec)'
---

## Benchmark: Throughput

<!--
So sánh throughput Non-TLS ở 4 threads (concurrency scale: 1, 2, 4, 8 threads):

| Threads | Redis      | KeyDB      | Dragonfly  | Valkey     |
|---------|-----------|-----------|-----------|-----------|
| 1       | 61,112    | 66,443    | 53,113    | 56,000    |
| 2       | 121,315   | 102,536   | 90,426    | 68,335    |
| 4       | 125,524   | 114,455   | 119,615   | 98,119    |
| 8       | 124,294   | 111,217   | 112,402   | 104,091   |

Nhận xét:
- Redis dẫn đầu ở 2T, 4T, 8T — throughput ổn định nhất.
- Dragonfly tăng trưởng nhanh từ 1T→4T nhưng chững lại ở 8T do giới hạn 4 vCPU.
- KeyDB mạnh ở single-thread (66k) nhưng scaling khiêm tốn hơn.
- Valkey thấp nhất ở hầu hết mức, nhưng cải thiện rõ so với v2 (bug io-threads).

Với TLS: throughput giảm ~30-34% đồng đều — ranking không thay đổi.
-->

---
hideInToc: true
layout: figure
figureUrl: https://github.com/centminmod/redis-comparison-benchmarks/raw/master/results/benchmarks-v5-host-4t-jun7-2025/advcharts-latency-dist.png
figureCaption: 'Latency distribution'
---

## Benchmark: Latency

<!--
Latency breakdown ở 4 threads:

| Engine    | Avg (ms) | p50 (ms) | p99 (ms) | p99.9 (ms) |
|-----------|---------|---------|---------|-----------|
| Redis     | 3.18    | 3.04    | 7.65    | 16.19     |
| Dragonfly | 3.39    | 3.52    | 8.19    | 17.92     |
| KeyDB     | 3.51    | 3.23    | 10.37   | 17.92     |
| Valkey    | 4.15    | 3.99    | 10.05   | 24.19     |

Nhận xét:
- Redis có latency thấp nhất ở mọi % — đặc biệt p99.9 chỉ 16.19ms.
- Dragonfly cạnh tranh sát Redis: avg 3.39ms, p99 8.19ms.
- Valkey có tail latency cao nhất: p99.9 = 24.19ms (+49% so với Redis).
- KeyDB p99 (10.37ms) cao hơn các đối thủ còn lại.

Với TLS: latency tăng ~1.4-1.5×, thứ hạng không đổi.

Nguồn: github.com/centminmod/redis-comparison-benchmarks
-->
