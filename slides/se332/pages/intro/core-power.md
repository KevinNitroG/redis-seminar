---
layout: two-cols-header
hideInToc: true
---

# Part 1: What is Redis? (Core & Power)

::left::

### Ultra-Low Latency

- **Sub-millisecond/microsecond** response times
- In-memory storage eliminates disk I/O bottlenecks
- Perfect for real-time applications

### Beyond Caching

- Serves as **Primary Database**
- **Message Broker** for async communication
- **Streaming Engine** for event processing

::right::

### Rich Data Structures

Native support for:
- Strings, Lists, Sets
- Hashes, Sorted Sets
- Streams, HyperLogLog, Bitmaps
- Geospatial indexes

### Optimized Architecture

- **Single-threaded** — no lock contention
- **Highly scalable** via Sentinel/Cluster
- Efficient memory management

<!--
- Redis isn't just a cache anymore — it's evolved into a multi-purpose platform
- Speed is the main differentiator: microsecond latencies vs milliseconds in traditional DBs
- Supports complex data types natively, enabling application logic to move closer to data
-->
