---
hideInToc: true
---

# Caching Strategies

<div class="grid grid-cols-2 gap-6 mt-4">

<div>

### Cache-Aside (Lazy Loading)

App checks cache first; on miss, loads from DB and writes to cache.

![Cache-aside](https://images.viblo.asia/5e812aa3-0d82-4e71-bc64-ab1deaf733d7.png)

</div>

<div>

### Read-Through

Cache sits in front of DB; cache handles misses automatically.

![Read-through](https://images.viblo.asia/8e7b044d-1732-4f3a-8512-cf6711fbad04.png)

</div>

</div>

<div class="text-xs text-gray-400 mt-2">Source: <a href="https://viblo.asia/p/su-dung-redis-lam-cache-de-tang-toc-do-truy-van-GrLZD0dwZk0">Viblo — Sử dụng Redis làm cache để tăng tốc độ truy vấn</a></div>

<!--
- Cache-aside: most common; app controls caching logic; stale data possible
- Read-through: cleaner app code; cache library manages DB fetch
-->

---
hideInToc: true
---

# Caching Strategies — Write Patterns

<div class="grid grid-cols-2 gap-6 mt-4">

<div>

### Write-Through

Every write goes to cache AND DB synchronously. Always consistent.

![Write-through](https://images.viblo.asia/3d6358f8-6af6-4abd-aded-948797ef2731.png)

</div>

<div>

### Write-Back (Write-Behind)

Write to cache first; DB is updated asynchronously. Fastest writes, risk of data loss.

![Write-back](https://images.viblo.asia/383eae8c-acd1-42d4-a28e-88e15da2fc04.png)

</div>

</div>

<div class="text-xs text-gray-400 mt-2">Source: <a href="https://viblo.asia/p/su-dung-redis-lam-cache-de-tang-toc-do-truy-van-GrLZD0dwZk0">Viblo — Sử dụng Redis làm cache để tăng tốc độ truy vấn</a></div>

<!--
- Write-through: consistent but adds write latency
- Write-back: best throughput; async flush risks data loss on crash
- Choose based on: read/write ratio, consistency requirements, tolerance for data loss
-->
