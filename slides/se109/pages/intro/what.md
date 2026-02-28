---
layout: two-cols-header
hideInToc: true
---

# What is Redis?

::left::

### In-Memory Key-Value Store

- **REmote DIctionary Server**
- Data lives in RAM → sub-millisecond latency
- Single-threaded event loop — no lock contention
- Supports rich data structures beyond simple strings
- Keyspace is **flat**: every key lives at the top level

::right::

<div class="mt-8">

```
┌───────────────────────────────────────┐
│         Disk-Based DB                 │
│  Request → Parse → Disk I/O → Result  │
│            ~1–10 ms latency           │
└───────────────────────────────────────┘

┌────────────────────────────────────┐
│         Redis (In-Memory)          │
│  Request → Parse → RAM → Result    │
│           ~0.1–1 ms latency        │
└────────────────────────────────────┘
```

</div>

<!--
- Redis = Remote Dictionary Server
- Key differentiator: everything in RAM
- Single thread: avoids mutex contention, simpler reasoning
- Flat keyspace: no namespacing — convention like "user:123:name"
-->
