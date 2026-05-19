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
Chào các bạn! Chúng ta cùng bắt đầu Module đầu tiên của phần nâng cao: Các chiến lược Caching (bộ nhớ đệm). Trong thực tế thiết kế hệ thống, việc chọn đúng chiến lược đọc ghi cache sẽ quyết định trực tiếp đến hiệu năng và tính nhất quán dữ liệu.

Đầu tiên là chiến lược Cache-Aside (còn gọi là Lazy Loading). Ở đây, ứng dụng đóng vai trò chủ động kiểm tra cache trước. Nếu có dữ liệu (cache hit), ứng dụng trả về ngay. Nếu hụt cache (cache miss), ứng dụng sẽ tự truy vấn cơ sở dữ liệu, trả kết quả về cho user và đồng thời ghi đè kết quả đó vào cache để dùng cho các lần sau. Ưu điểm lớn nhất là ứng dụng có toàn quyền kiểm soát logic, nhưng nhược điểm là dữ liệu dễ bị cũ (stale) nếu DB thay đổi mà cache chưa được cập nhật kịp thời.

Ngược lại là chiến lược Read-Through. Điểm khác biệt duy nhất là khi xảy ra cache miss, thư viện hoặc provider của cache sẽ tự động đứng ra truy vấn DB và nạp vào cache. Ứng dụng không cần tự tay viết logic truy vấn DB và ghi cache mà chỉ cần giao tiếp duy nhất với tầng cache.
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
Bên cạnh chiến lược đọc, chúng ta còn có các chiến lược ghi dữ liệu vào bộ nhớ đệm là Write-Through và Write-Back.

Với Write-Through, mỗi khi có yêu cầu ghi, dữ liệu sẽ được cập nhật đồng thời (synchronous) vào cả cache và DB. Chiến lược này đảm bảo tính nhất quán dữ liệu tuyệt đối (consistency), nhưng nhược điểm là độ trễ (latency) của tác vụ ghi sẽ cao hơn vì phải chờ cả hai hệ thống hoàn thành. Nó cực kỳ phù hợp cho các giao dịch tài chính hoặc thông tin quan trọng.

Ngược lại là Write-Back (hay Write-Behind). Khi ghi dữ liệu, ứng dụng chỉ ghi duy nhất vào cache và trả kết quả thành công ngay lập tức. Sau đó, một tiến trình chạy ngầm sẽ bất đồng bộ (asynchronously) cập nhật dữ liệu xuống cơ sở dữ liệu. Nhờ vậy, Write-Back mang lại tốc độ ghi nhanh nhất và chịu tải cực tốt, nhưng đi kèm rủi ro mất dữ liệu nếu cache bị crash trước khi kịp đồng bộ xuống DB.

Tùy vào tỉ lệ đọc/ghi, yêu cầu về tính nhất quán và khả năng chấp nhận rủi ro mất dữ liệu của dự án mà chúng ta sẽ lựa chọn chiến lược phù hợp nhất.
-->
