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
RDB - Redis Database Backup, là dạng snapshot, lưu trữ toàn bộ dữ liệu tại một thời điểm nhất định.
Dữ liệu sẽ bị mất nếu Redis bị crash giữa các lần snapshot, nhưng khởi động lại rất nhanh.

AOF - giống write-ahead log — ghi lại tất cả các lệnh ghi vào file, có thể cấu hình để ghi ngay lập tức hoặc mỗi giây. AOF có thể lớn hơn RDB và khởi động chậm hơn, nhưng giảm thiểu mất dữ liệu.

Nên kết hợp cả hai: RDB để khởi động nhanh, AOF để đảm bảo dữ liệu không bị mất.
-->
