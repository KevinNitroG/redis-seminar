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
Bên trái — Redis phù hợp cho:
- Cache tốc độ cao — use case phổ biến nhất
- Leaderboards / bảng xếp hạng — nhờ Sorted Set
- Session management — lưu session tạm, TTL tự động xoá
- Pub/Sub & real-time messaging — nhẹ, nhanh
- Rate limiting — dùng INCR + EXPIRE
- Full-text search trên JSON — với RedisJSON module
- Event streams — dùng Stream data type

Bên phải — Redis KHÔNG phù hợp cho:
- File nhị phân lớn — Redis là in-memory, lưu file rất tốn RAM
- Truy vấn quan hệ phức tạp — không có JOIN, không có query planner
- Giao dịch multi-key ACID nghiêm ngặt — optimize for speed, không cho consistency mạnh
- Lưu trữ dài hạn — persistence chỉ là backup, không thay thế được database

Tóm lại: Redis mạnh ở tốc độ và đơn giản. Khi cần dữ liệu quan hệ phức tạp hoặc durability nghiêm ngặt, dùng RDBMS truyền thống
-->
