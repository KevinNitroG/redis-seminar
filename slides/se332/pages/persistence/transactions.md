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
Redis transactions are atomic but not fully ACID.
WATCH enables optimistic concurrency control — useful for seat reservation scenarios.
-->

---
hideInToc: true
---

## Transactions — Enrollment Success

<<< @/snippets/transaction-success sh {1-2|1-5|1-8|1-11|1-15}

<!--
Walk through the happy path: WATCH the seat count, queue DECR + SADD, EXEC completes successfully.
-->

---
hideInToc: true
---

## Transactions — Race Condition

<<< @/snippets/transaction-fail sh {1-2|1-5|1-9|1-12|1-15}

<!--
Another client sneaks in a DECR between our WATCH and EXEC.
WATCH detects the change and EXEC returns nil — transaction aborted safely.
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
This table shows exactly why WATCH is critical for concurrent seat reservation.
Without WATCH, both students could successfully enroll even with seats=1.
-->
