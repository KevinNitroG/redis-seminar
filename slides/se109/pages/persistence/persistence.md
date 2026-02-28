---
hideInToc: true
---

# Persistence: RDB vs AOF

<div class="grid grid-cols-2 gap-6 mt-4">

<div class="p-4 bg-blue-50 rounded border border-blue-200">

### RDB — Snapshots

- Point-in-time snapshot of the dataset
- Compact binary file, fast restart
- Configurable: `save 900 1` (save if 1 key changed in 900s)
- **Trade-off**: data written since last snapshot can be lost on crash

</div>

<div class="p-4 bg-green-50 rounded border border-green-200">

### AOF — Append Only File

- Logs every write command
- `appendfsync always/everysec/no`
- Larger file size, slower restart
- **Trade-off**: at most 1 second of data loss (`everysec`)

</div>

</div>

<div v-click class="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200 text-sm text-center">

**Best practice**: Enable **both** — RDB for fast restarts, AOF for durability. Redis rewrites AOF automatically to keep it compact.

</div>

<!--
- RDB: fork process takes snapshot; minimal impact on main thread
- AOF: Redis 7.0 introduced Multi-Part AOF to reduce rewrite overhead
- Hybrid persistence: RDB base + AOF tail = fast startup + high durability
-->
