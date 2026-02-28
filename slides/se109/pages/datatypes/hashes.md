---
hideInToc: true
---

# Hashes

A key mapping to a **field-value map** — like a flat object or struct in memory.

<div class="text-center my-4">

![HSET command railroad](https://redis.io/docs/latest/images/railroad/hset.svg)

</div>

<!--
- Perfect for representing objects: user profiles, course records
- More memory-efficient than storing each field as a separate key
- O(1) for HGET/HSET per field
-->

---
hideInToc: true
---

# Hashes — HSET / HGETALL / HGET / HMGET

<<<@/snippets/hashes sh {1-2|1-12|1-15|1-21}

<!--
- HSET returns number of NEW fields added (not updated)
- HGETALL: returns all fields + values as alternating list
- HMGET: fetch multiple fields in one round-trip
-->

---
hideInToc: true
---

# Hashes — Type Safety & Atomic Update

<<<@/snippets/hashes-update sh {1-2|1-5}

<div v-click class="mt-4 p-3 bg-red-50 rounded border border-red-200 text-sm">

`GET` on a Hash key returns `WRONGTYPE` — Redis enforces type safety per key.

</div>

<div v-click class="mt-3 p-3 bg-green-50 rounded border border-green-200 text-sm">

`INCRBYFLOAT` atomically increments a float field — safe for concurrent GPA updates.

</div>

<!--
- Each key has a single type; mixing commands raises WRONGTYPE error
- INCRBYFLOAT: atomic floating-point increment, no read-modify-write needed
- Also: HINCRBY for integers
-->
