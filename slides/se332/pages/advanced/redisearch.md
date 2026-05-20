---
hideInToc: true
layout: two-cols-header
layoutClass: gap-6
---

## RediSearch — Secondary Index Problem

Standard Redis is extremely fast for direct lookups by key — but what about querying by inner fields?

::left::

### Key-Value Limitation

<div class="bg-blue-50 border border-blue-300 rounded-lg p-4 text-sm">

- **Flat Keyspace:** Redis stores data in flat keyspaces.
- **Direct Access Only:** O(1) lookups require the exact key (e.g. `student:23521476`).
- **No Native Filters:** Querying by inner fields (GPA, name) is not supported natively.

</div>

::right::

### The Danger of `KEYS *`

<div class="bg-red-50 border border-red-300 rounded-lg p-4 text-sm">

- **Anti-Pattern:** Using `KEYS *` or scanning all keys to filter in-app is highly inefficient.
- **Thread Blocking:** `KEYS *` is an O(N) blocking command.
- **Production Risk:** Freezes the single-threaded Redis engine, causing service downtime.

</div>

<!--
Tiếp theo là RediSearch - giải pháp tìm kiếm dữ liệu mạnh mẽ.

Bình thường, Redis chỉ tối ưu tìm kiếm O(1) qua key chính xác (như `student:23521476`). Khi cần lọc theo GPA hay tìm tên, nhiều người mắc sai lầm dùng `KEYS *` để quét toàn bộ dữ liệu.

Đây là một thảm họa trên production. Lệnh `KEYS *` có độ phức tạp O(N). Do Redis đơn luồng, nó sẽ chặn đứng (block) toàn bộ server, khiến mọi request khác phải chờ, gây nghẽn và sập hệ thống.
-->

---
hideInToc: true
---

## RediSearch — Index Field Types

Automatically index your structured JSON or Hash data fields in memory.

| Field Type | Use Case | UIT Examples |
| :--- | :--- | :--- |
| **TAG** | Exact match lookup (low-cardinality) | `$.cohort` (`23`), `$.username` (`thiendp`) |
| **NUMERIC** | Range & filter queries (numeric ranges) | `$.gpa` (`[8.5 9.5]`), `$.capacity` |
| **TEXT** | Full-text search engine (stemming & fuzzy) | `$.name` (`"Đặng Phú"`) — weight and phonetics |

Index updates automatically under-the-hood whenever underlying JSON data changes.

<!--
Để giải quyết điều này, RediSearch cung cấp Secondary Index và Full-Text Search ngay trên RAM. Khác với việc phải quản lý Sorted Set thủ công, index của RediSearch tự động cập nhật ngầm khi dữ liệu thay đổi.

Có 3 loại index chính:
1. TAG: Khớp chính xác (exact match) cho các giá trị như `cohort` hay `username`.
2. NUMERIC: Truy vấn theo khoảng (range), ví dụ sinh viên có GPA [8.5 - 9.5].
3. TEXT: Hỗ trợ tìm kiếm mờ (fuzzy search), phân tích từ căn (stemming), và gán trọng số ưu tiên.

RediSearch biến Redis thành database tài liệu linh hoạt như Elasticsearch nhưng với tốc độ của RAM.
-->

---
hideInToc: true
---

## RediSearch — Queries & Aggregations

```bash
# 1. Create a secondary index over student JSON documents (FT.CREATE)
FT.CREATE idx:students ON JSON PREFIX 1 student: SCHEMA $.name TEXT WEIGHT 2.0 $.cohort TAG $.gpa NUMERIC $.username TEXT

# 2. Search: Find all students in cohort 23 (TAG match)
FT.SEARCH idx:students "@cohort:{23}"

# 3. Search: Find students with GPA >= 9.0 (NUMERIC range query)
FT.SEARCH idx:students "@gpa:[9.0 +inf]"

# 4. Complex Search: K23 students with GPA between 8.5 and 9.5
FT.SEARCH idx:students "@cohort:{23} @gpa:[8.5 9.5]"

# 5. Full-text Search: Search students by name (partial/fuzzy matching)
FT.SEARCH idx:students "Đặng Phú"

# 6. Aggregation: Count students grouped by cohort (FT.AGGREGATE)
FT.AGGREGATE idx:students "*" GROUPBY 1 @cohort REDUCE COUNT 0 AS student_count
```

<!--
Hãy lướt qua một số câu lệnh RediSearch thực tế:

1. Dùng `FT.CREATE` để tạo index `idx:students` trên các key `student:`. Định nghĩa rõ kiểu dữ liệu trong SCHEMA (TEXT, TAG, NUMERIC).
2. Lọc chính xác trường TAG (khóa 23): Dùng cú pháp `@cohort:{23}` (ngoặc nhọn).
3. Lọc khoảng NUMERIC (GPA >= 9.0): Dùng `@gpa:[9.0 +inf]` (ngoặc vuông). Dễ dàng kết hợp nhiều điều kiện cùng lúc.
4. Tìm kiếm Full-Text: Nhập `"Đặng Phú"` để tìm kiếm mờ, kết quả được xếp hạng theo độ tương đồng.
5. Gom cụm (`FT.AGGREGATE`): Nhóm theo khóa (`GROUPBY @cohort`) và đếm (`REDUCE COUNT`) trực tiếp trên RAM, không cần kéo dữ liệu về ứng dụng tính toán.
-->
