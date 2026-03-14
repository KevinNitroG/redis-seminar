---
hideInToc: true
---

## Persistence: RDB vs AOF

<div class="grid grid-cols-2 gap-6 mt-6">

<div class="bg-blue-50 border border-blue-300 rounded-lg p-4">

### RDB (Snapshots)

- Point-in-time snapshots
- Compact binary format
- Fast restart / restore
- Configurable with `SAVE` / `BGSAVE`
- Risk: data loss since last snapshot

</div>

<div class="bg-green-50 border border-green-300 rounded-lg p-4">

### AOF (Append-Only File)

- Logs every write command
- Configurable `appendfsync` (always / everysec / no)
- More durable, larger file size
- Max ~1s data loss with `everysec`

</div>

</div>

<div v-click class="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mt-4 text-center">

**Best Practice:** Enable both — RDB for fast restarts, AOF for durability

</div>

<!--
RDB is like a database backup — fast to load but may lose recent writes.
AOF is like a write-ahead log — more durable but slower and larger.
Together they cover each other's weaknesses.
-->
