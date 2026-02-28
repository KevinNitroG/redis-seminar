---
hideInToc: true
---

# Transactions — MULTI / EXEC / WATCH

Redis transactions queue commands and execute them **atomically** as a block.

- `MULTI` — begin a transaction block
- Queue commands — all return `QUEUED`
- `EXEC` — execute all queued commands atomically
- `DISCARD` — abort the transaction
- `WATCH key` — optimistic lock; `EXEC` returns `nil` if key changed

<!--
- Atomic: no other client can inject commands between MULTI and EXEC
- BUT: Redis transactions do NOT roll back on command errors (by design)
- WATCH implements optimistic concurrency control (OCC)
-->

---
hideInToc: true
---

# Transactions

<<< @/snippets/transaction-success sh {1-3|1-5|1-8|1-11|1-15}

---
hideInToc: true
---

# Transactions Failed

<<<@/snippets/transaction-fail sh {1-3|1-5|1-9|1-12|1-16}

---
hideInToc: true
---

# Race Condition Timeline

| Time   | Student A (Client 1)             | Student B (Client 2)      | Redis State         |
| :----- | :------------------------------- | :------------------------ | :------------------ |
| **T1** | `WATCH course:SE121:seats`       |                           | Monitoring `seats`  |
| **T2** |                                  | `DECR course:SE121:seats` | **Seat taken by B** |
| **T3** | `MULTI`                          |                           | Transaction starts  |
| **T4** | `DECR course:SE121:seats`        |                           | Queued              |
| **T5** | `SADD course:SE121:students "A"` |                           | Queued              |
| **T6** | `EXEC`                           |                           | **Returns `(nil)`** |

<div v-click class="mt-4 p-3 bg-red-50 rounded border border-red-200 text-sm">

`WATCH` detects the conflict and aborts — **no double-booking**. Client must retry.

</div>

<!--
- This is optimistic locking: assume no conflict, detect and retry if there is one
- Works well for low-contention scenarios; for high-contention use Lua scripts instead
- Lua scripts are atomic by nature — another approach to avoid WATCH/MULTI overhead
-->
