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
Chiến lược Caching quyết định trực tiếp hiệu năng và tính nhất quán dữ liệu.

Đầu tiên là Cache-Aside (Lazy Loading): Ứng dụng chủ động kiểm tra cache. Nếu hụt (miss), ứng dụng tự truy vấn DB, trả kết quả và ghi vào cache. Ưu điểm: dễ kiểm soát logic. Nhược điểm: dữ liệu dễ bị cũ (stale).

Thứ hai là Read-Through: Tầng cache tự động xử lý truy vấn DB khi xảy ra cache miss. Ứng dụng không cần viết logic query DB, chỉ cần giao tiếp duy nhất với tầng cache.
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
Về chiến lược ghi dữ liệu vào cache:

1. Write-Through: Dữ liệu được ghi đồng thời vào cả cache và DB. Ưu điểm: Đảm bảo tính nhất quán tuyệt đối. Nhược điểm: Độ trễ cao, phù hợp với dữ liệu quan trọng như tài chính.

2. Write-Back (Write-Behind): Chỉ ghi vào cache rồi trả kết quả ngay, đồng bộ xuống DB ngầm (asynchronous) sau. Ưu điểm: Tốc độ ghi cực nhanh, chịu tải tốt. Nhược điểm: Rủi ro mất dữ liệu nếu cache crash trước khi đồng bộ.
-->
