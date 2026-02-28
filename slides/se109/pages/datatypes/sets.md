---
hideInToc: true
---

# Sets

An **unordered collection of unique strings** — like a mathematical set.

<div class="text-center my-4">

![SADD command railroad](https://redis.io/docs/latest/images/railroad/sadd.svg)

</div>

<!--
- Use case: course enrollment lists, tags, unique visitor tracking
- Uniqueness is enforced automatically — no duplicates possible
- O(1) for SADD/SREM/SISMEMBER
-->

---
hideInToc: true
---

# Sets — SADD / SMEMBERS / SISMEMBER / SCARD / SREM

<<<@/snippets/sets sh {1-2|1-6|1-9|1-12|1-15}

<div v-click class="mt-4 p-3 bg-blue-50 rounded border border-blue-200 text-sm">

**Set operations**: `SUNION`, `SINTER`, `SDIFF` — find students enrolled in multiple courses in O(N).

</div>

<!--
- SADD returns number of NEW members added
- SISMEMBER: O(1) membership test — great for "is student enrolled?"
- SCARD: count members O(1)
- Set operations useful for multi-course analytics
-->
