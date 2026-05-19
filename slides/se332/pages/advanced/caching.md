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
Cache-Aside (còn gọi là Lazy Loading):
- App kiểm tra cache trước. Nếu có (cache hit) → trả về ngay.
- Nếu không có (cache miss) → app tự query DB, ghi kết quả vào cache cho lần sau.
- Ưu: app kiểm soát hoàn toàn logic caching.
- Nhược: dữ liệu có thể bị stale nếu DB thay đổi mà cache chưa update.

Read-Through:
- Giống Cache-Aside, nhưng việc load DB khi cache miss do thư viện/ provider cache xử lý, app không cần tự viết.
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
Write-Through:
- Ghi đồng thời vào cache và DB, synchronous.
- Luôn nhất quán (consistent), nhưng độ trễ ghi bằng tổng thời gian ghi cache + DB.
- Phù hợp hệ thống cần consistency cao.

Write-Back (Write-Behind):
- Ghi vào cache trước, DB update sau (asynchronous).
- Tốc độ ghi nhanh nhất, nhưng rủi ro mất dữ liệu nếu crash trước khi flush xuống DB.
- Phù hợp ứng dụng nặng về ghi, có thể chấp nhận rủi ro.

Chọn chiến thuật nào? Dựa vào: tỉ lệ đọc/ghi, yêu cầu consistency, khả năng chấp nhận mất dữ liệu.
-->
