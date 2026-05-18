---
layout: figure
figureUrl: https://images.viblo.asia/a7d0e5a9-ae0e-4d9d-ada5-6d5307e14c09.png
figureCaption: 'Single Redis instance - Viblo'
---

## Single Redis Instance

<!--
Đây là cách đơn giản nhất để triển khai Redis, phù hợp cho môi trường dev và local.
Cho phép dev thiết lập nhanh, tăng tốc service mà không cần infra phức tạp.

Tuy nhiên, nhược điểm lớn: nếu Redis instance bị restart hoặc failover,
tất cả requests đến Redis đều thất bại — làm giảm tính toàn vẹn của hệ thống.

Về hiệu năng: với đủ RAM và tài nguyên, single instance rất mạnh mẽ.
Có thể chạy ngay trên cùng máy chủ với ứng dụng để tối ưu tốc độ.

Dữ liệu được xử lý trực tiếp trong bộ nhớ.
Nếu bật persistence, Redis sẽ ghi xuống đĩa định kỳ qua RDB (snapshot) hoặc AOF (append-only log).
Nếu không bật persistence, toàn bộ dữ liệu sẽ mất khi restart.
-->

---
layout: figure
figureUrl: https://images.viblo.asia/3a4f4cbc-3b13-4738-9248-ca605b115629.png
figureCaption: 'High Availability - Viblo'
---

## High Availability

<!--
Một thiết lập phổ biến khác là kết hợp primary và secondary instances.
- Một primary: xử lý tất cả writes.
- Nhiều secondaries: replicate dữ liệu từ primary (mặc định read-only).

Setup này mang lại:
- Tăng khả năng scale đọc
- Cải thiện fault tolerance (khi secondary fail)
- Là tiền đề cho automatic failover (Sentinel / Cluster)

Tuy nhiên, nếu primary fail, phải thủ công promote secondary lên primary
-> đây là lúc Sentinel xuất hiện

High Availability (HA) là khả năng hệ thống duy trì hoạt động ổn định trong thời gian dài.
Không có single point of failure, phục hồi nhanh, không mất dữ liệu khi chuyển đổi primary ↔ secondary.

Mỗi instance Redis có replicationID và offset để track tiến trình đồng bộ với primary.
-->

---
layout: figure
figureUrl: https://images.viblo.asia/ea6bf023-56af-48bf-bfbe-023952d5bb92.png
figureCaption: 'Sentinel - Viblo'
---

## Sentinel

<!--
Sentinel là một hệ thống phân tán — nhiều tiến trình Sentinel phối hợp với nhau để cung cấp HA.
Không thể có một Sentinel đơn lẻ vì nó sẽ là single point of failure.

Sentinel đảm nhiệm 4 vai trò chính:
1. Giám sát (Monitoring) — kiểm tra primary và secondary còn hoạt động không.
2. Thông báo (Notification) — báo cho admin khi có sự cố.
3. Quản lý chuyển đổi dự phòng (Failover) — tự động promote secondary lên primary.
4. Quản lý cấu hình (Configuration management) — giống như ZooKeeper / Consul,
   Sentinel cho client biết primary hiện tại là node nào.

Fault detection dựa trên quorum — số phiếu tối thiểu để các Sentinel đồng thuận
rằng primary đã chết, từ đó kích hoạt failover.

- Quorum có thể cấu hình, thường là 2/3 hoặc 3/5.
- Số lẻ luôn được ưu tiên để đạt majority.

Về triển khai: nên chạy một Sentinel node bên cạnh mỗi application server
để tránh khác biệt về khả năng tiếp cận mạng. Có thể chạy chung với Redis instance
hoặc standalone. Ít nhất 3 Sentinel nodes, quorum tối thiểu 2.

QUAN TRỌNG: đừng nhầm giữa số Sentinel và số replica.

- Số Sentinel: liên quan đến voting / failover reliability.
- Số Redis replica (secondary): liên quan đến read-scaling và data redundancy.
-->

---
layout: figure
figureUrl: https://images.viblo.asia/658120d2-bb70-4062-b72a-fe0eec407db0.png
figureCaption: 'Cluster - Viblo'
---

## Cluster

<!--
Khi RAM của một máy không đủ (dù AWS có instance 24TB), cần mở rộng ngang.
Redis Cluster cho phép scale theo chiều ngang — dữ liệu được phân tán trên nhiều node.

Các node (cả master lẫn slave) trao đổi trạng thái qua gossip protocol:
gửi PING/PONG định kỳ để báo hiệu trạng thái. Nếu một master fail,
dựa trên majority để bầu master mới.
Ví dụ: 3 node (1 master, 2 slave) cần ít nhất ⌈3/2⌉ + 1 = 2 node đồng thuận.

So sánh mở rộng:
- Vertical (mở rộng dọc): thêm RAM/CPU cho một máy - có giới hạn vật lý.
- Horizontal (mở rộng ngang): thêm nhiều máy - cần hệ thống phân tán.

Redis Cluster dùng key hashing: mỗi key được băm và gán vào một hash slot.
Mỗi node sở hữu một tập hash slot. Lệnh GET/SET được gửi thẳng đến node sở hữu slot đó,
không cần coordination liên tục.

Thách thức khi dùng Cluster:
- Data consistency — làm sao đảm bảo dữ liệu nhất quán giữa các node?
- Data partitioning — dữ liệu được phân vùng và phân phối thế nào?

Redis Cluster giải quyết bằng cơ chế phân phối lại tự động và sao chép dữ liệu.
Tuy nhiên, nó đòi hỏi nhiều cấu hình và bảo trì hơn — không nên dùng nếu chưa hiểu rõ
ưu và nhược điểm của hệ thống phân tán.

Có thể so sánh sentinel và cluster giống zoo keeper và kafka draft, có bộ phận quản lý riêng biệt, hay tự quản lý phân tán.
-->
