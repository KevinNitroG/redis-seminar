---
hideInToc: true
---

# Beyond the Basics

Redis Stack includes many more modules — briefly:

<div class="grid grid-cols-2 gap-4 mt-4">

<div>

**RediSearch** — Full-text search + secondary indexes over JSON/Hash
**RedisTimeSeries** — Time-series data with downsampling & aggregation
**RedisGraph** — Property graph queries (Cypher)

</div>

<div>

**Probabilistic Structures**

- HyperLogLog — cardinality estimation
- Cuckoo Filter — membership testing
- Count-Min Sketch — frequency estimation
- Top-K, t-digest

**Vector Sets** — ANN similarity search (AI/RAG use cases)

</div>

</div>

<!--
- Redis has become a multi-model database
- Vector Sets: Redis 8.0 native feature; replaces the older RedisSearch vector index
- Streams: append-only log with consumer groups — Kafka-lite
- These are skipped for brevity in this seminar
-->

---
hideInToc: true
---

# Redis Vector Search

![Redis Vector DB Benchmarks](https://cdn.sanity.io/images/sy1jschh/production/40954abf490e6598d3a1cad0bd5503d3386e7faf-655x450.svg)

<div class="text-xs text-gray-400">Redis vector search benchmarks</div>
