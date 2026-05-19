---
hideInToc: true
---

## Transactions: MULTI / EXEC / WATCH

<div class="grid grid-cols-3 gap-4 mt-6 text-sm">

<div class="bg-gray-50 border rounded-lg p-3">

**MULTI**
Start a transaction block. Commands are queued, not executed.

</div>

<div class="bg-gray-50 border rounded-lg p-3">

**EXEC**
Execute all queued commands atomically.
Returns array of results.

</div>

<div class="bg-gray-50 border rounded-lg p-3">

**WATCH**
Optimistic locking. If watched key changes before `EXEC`, transaction aborts.

</div>

</div>

<div class="mt-4 text-sm text-gray-500">

`DISCARD` — cancel the queued transaction

</div>

<!--
Redis tuân thủ BASE thay vì ACID.

- Basically Available: Redis luôn sẵn sàng phản hồi ngay cả khi một phần node gặp sự cố.
- Soft state: Trạng thái hệ thống có thể thay đổi theo thời gian (TTL, eviction - thu hồi, replication lag).
- Eventually consistent: Trong môi trường cluster, dữ liệu cuối cùng sẽ đồng bộ — không đảm bảo consistent ngay lập tức.

Vì vậy, transaction của Redis là atomic nhưng không fully ACID.
WATCH đóng vai trò optimistic locking (lạc quan) — giống như check-in trước khi commit.

Optimistic lock được hiểu là cho phép nhiều client cùng làm việc trên một key,
nhưng khi commit sẽ kiểm tra xem có ai thay đổi key đó không.
Nếu có, transaction sẽ bị abort để tránh xung đột dữ liệu.
-->

---
hideInToc: true
---

## Transactions — Enrollment Success

<<< @/snippets/transaction-success sh {1-2|1-5|1-8|1-11|1-15}

<!--
Đây là kịch bản lý tưởng:
- Sinh viên WATCHes `seats` (1 chỗ còn)
- Sinh viên MULTI, DECR `seats` → 0, SADD "A" → EXEC thành công
-->

---
hideInToc: true
---

## Transactions — Race Condition

<<< @/snippets/transaction-fail sh {1-2|1-5|1-9|1-12|1-15}

<!--
Đây là kịch bản xung đột
-->

---
hideInToc: true
---

## Race Condition Timeline

| Time | Student A                    | Student B        |
| ---- | ---------------------------- | ---------------- |
| T1   | `WATCH seats` (seats=1)      |                  |
| T2   |                              | `DECR seats` → 0 |
| T3   | `MULTI`                      |                  |
| T4   | `DECR seats` → QUEUED        |                  |
| T5   | `SADD students "A"` → QUEUED |                  |
| T6   | `EXEC` → **(nil)**           |                  |

<div v-click class="bg-red-50 border border-red-300 rounded-lg p-3 mt-4 text-center">

**WATCH detects the conflict — transaction aborted, no double booking**

</div>

<!--
Bảng thời gian này minh họa rõ ràng cách WATCH phát hiện xung đột và ngăn chặn double booking.
Nếu không có WATCH, cả hai sinh viên đều có thể thành công dù chỉ còn 1 chỗ.
-->
