---
hideInToc: true
layout: two-cols-header
layoutClass: gap-6
---

## When to Use Redis

::left::

### Great For

<div class="bg-green-50 border border-green-300 rounded-lg p-4 text-sm">

- High-speed caching
- Leaderboards & sorted rankings
- Session management
- Pub/Sub & real-time messaging
- Rate limiting
- Full-text search over JSON
- Event streams

</div>

::right::

### Not Ideal For

<div class="bg-red-50 border border-red-300 rounded-lg p-4 text-sm">

- Large binary blobs / files
- Complex relational queries
- Strict multi-key ACID transactions
- Long-term archival storage

</div>

<!--
Redis shines at speed and simplicity. For complex relational data or strict durability guarantees, a traditional RDBMS is more appropriate.
-->
