---
hideInToc: true
---

# Sorted Sets (ZSET)

Like a Set, but each member has a **score** — members are always sorted by score.

<div class="text-center my-4">

![ZADD command railroad](https://redis.io/docs/latest/images/railroad/zadd.svg)

</div>

<!--
- Use case: leaderboards, priority queues, range queries by score
- Internally: skip list + hash map — O(log N) for most ops
- Score is a double-precision float
-->

---
hideInToc: true
---

# Sorted Sets — ZADD / ZRANGE / ZREVRANGE

<<<@/snippets/zsets sh {1-2|1-12|1-20}

<div v-click class="mt-4 p-3 bg-blue-50 rounded border border-blue-200 text-sm">

Also: `ZINCRBY` to update scores, `ZREM`/`ZCARD` like Sets, `ZRANGEBYSCORE` for GPA ranges.

</div>

<!--
- ZADD returns count of NEW members
- ZRANGE: ascending order (lowest GPA first); ZREVRANGE: descending
- WITHSCORES: include the score in output
- Great for "top N" queries: leaderboards, rank-by-GPA
-->
