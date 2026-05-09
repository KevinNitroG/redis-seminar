---
layout: center
---

# Redis as a Primary Database
## Section 2: Core Data Types & Commands

---

# Tổng quan về Cấu trúc lệnh Redis
## "Tư duy theo Key-Value"

- **Cấu trúc lệnh:** `COMMAND KEY [ARGUMENTS]`
- **Quy ước đặt tên Key:** `object:id:field`
- **Đặc điểm kỹ thuật:**
  - **Flat Keyspace:** Không có cấu trúc bảng, truy cập trực tiếp qua Key.
  - **Single-threaded:** Không lo lắng về vấn đề lock contention khi thao tác dữ liệu.
- **Ví dụ:** `student:24521574:name`

<img src="./public/synax-redis.tiff" class="w-200 h-48" />
---

## 1. Strings (Kiểu dữ liệu cơ bản)
Tối ưu để lưu trữ các giá trị đơn lẻ, cho phép ánh xạ từ một key sang một value

```bash
# Chỉ set nếu chưa tồn tại (NX)
SET student:login:maipht "active" NX

# Lưu thông tin sinh viên UIT cùng lúc (MSET)
MSET student:24521574:name "Mai Phú Tân" student:24521574:gpa "6.5"

# Tăng giảm số lượng
INCR student:24521574:views       
INCRBY student:24521574:views 10   

# Lấy giá trị của một key
GET student:24521574:name         
MGET student:24521574:name student:24521574:gpa 
```

---

## 2. Hashes (Cấu trúc đối tượng)
Lưu trữ các đối tượng có nhiều thuộc tính tức là một key có thể ánh xạ đến nhiều value

```bash
# Tạo profile sinh viên dưới dạng một Hash duy nhất (HSET)
HSET student:24521574 name "Mai Phú Tân" gpa 6.5 cohort "24"

# Lấy toàn bộ thông tin của sinh viên này
HGETALL student:24521574

# Cập nhật thông tin của sinh viên này
HSET student:24521574 gpa 7.0     

# Lấy thông tin của sinh viên này
HGET student:24521574 name         

# Thao tác số học
HINCRBYFLOAT student:24521574 gpa 0.5

# Thao tác kiểm tra
HEXISTS student:24521574 cohort   

# Thao tác xoá 
HDEL student:24521574 cohort
```

---

## 3. Sets & Sorted Sets
Quản lý danh sách không trùng lặp và có thứ tự.

```bash
# Thêm sinh viên vào lớp SE121 (Set)
SADD course:SE121:students "23521476" "23520952"

# Thêm sinh viên kèm GPA vào bảng vàng (ZSET)
ZADD leaderboard:gpa:K24 9.2 "23521476" 8.5 "24521574"

# Kiểm tra và đếm các phần tử
SISMEMBER course:SE121:students "24521574" 
SCARD course:SE121:students 

# Truy vấn bảng xếp hạng
ZREVRANGE leaderboard:gpa:K24 0 2 WITHSCORES 
ZRANK leaderboard:gpa:K24 "24521574"             
```

---

## 4. Bitmaps (Tối ưu bộ nhớ)
Dùng để điểm danh hoặc theo dõi trạng thái.

```bash
# Điểm danh môn SE332 ngày 01/03/2026
# Tân (ID 0): Có mặt (1)
SETBIT attend:SE332:2026-03-01 0 1

# Đếm tổng số sinh viên đi học hôm nay
BITCOUNT attend:SE332:2026-03-01

# Kiểm tra tồn tại
GETBIT attend:SE332:2026-03-01 0   # Trả về 1 (Tân đã điểm danh)

# Phép toán logic
BITOP AND attend:full:both_days attend:SE332:03-01 attend:SE332:03-02 # Tân đã đi học trong ngày 1 và ngày 2
```

---

## 5. So sánh với SQL (Trực quan hóa)
Sự khác biệt giữa truy vấn quan hệ và truy vấn Key-Value.



| Đặc điểm | SQL (MySQL/PostgreSQL) | Redis |
| :--- | :--- | :--- |
| **Mô hình** | Bảng (Rows & Columns) | Key-Value, Data Structures |
| **Schema** | Cố định (Strong Schema) | Linh hoạt (Schema-less) |
| **Lưu trữ** | Ổ đĩa (Disk-based) | Bộ nhớ tạm (In-memory) |
| **Tốc độ** | Miliseconds (vài ms) | Sub-millisecond (< 1ms) |
| **Truy vấn** | Ngôn ngữ SQL phức tạp | Lệnh nguyên tử (Atomic Commands) |

---

## 5. So sánh với SQL (Ví dụ cụ thể)
Cách chuyển đổi tư duy từ bảng sang Key-Value.

**Bài toán: Cập nhật GPA sinh viên**

- **SQL:** Phải tìm dòng, khóa bảng (lock), ghi xuống đĩa.
  ```sql
  UPDATE students SET gpa = gpa + 0.5 WHERE id = '24521574';
- **Hash Update (Atomic)**
```
   HINCRBYFLOAT student:24521574 gpa 0.5;

---

## Tại sao chọn Redis cho "Primary Database"?

- **Atomic Operations:** Đảm bảo tính nhất quán dữ liệu mà không cần cơ chế khóa phức tạp.
- **Rich Data Structures:** Hash, Set, ZSet, Bitmap cung cấp các phép toán tối ưu mà SQL khó thực hiện hiệu quả.
- **Tối ưu chi phí:** Lưu trữ hàng triệu trạng thái (ví dụ: điểm danh) chỉ với vài MB nhờ Bitmaps.
- **Scalability:** Dễ dàng mở rộng và chịu tải cực lớn cho các hệ thống như Đăng ký môn học.

