---
hideInToc: true
---

# When to Use Redis

<div class="grid grid-cols-2 gap-6 mt-4">

<div>

### ✅ Great For

- **High-speed caching** — sub-ms reads for hot data
- **Leaderboards & rankings** — Sorted Sets
- **Session management** — TTL-based token storage
- **Real-time pub/sub** — notifications, live updates
- **Rate limiting** — atomic counters + TTL
- **Full-text search** — RediSearch over JSON/Hash
- **Queue/Stream processing** — Redis Streams

</div>

<div>

### ❌ Not Ideal For

- **Large blobs** — images, files (use object storage)
- **Complex relational queries** — JOINs across many tables
- **Strict ACID across multiple keys** — use PostgreSQL
- **Cost-sensitive archival storage** — RAM is expensive

</div>

</div>

<!--
- Redis is best when read latency is critical and data fits in RAM
- Don't use it as a replacement for a relational DB when complex queries are needed
- Modern Redis (with persistence + Sentinel/Cluster) is viable as a primary store
-->
