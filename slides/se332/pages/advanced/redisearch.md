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
Tiếp theo, chúng ta sẽ bước sang một mảnh ghép vô cùng mạnh mẽ song hành cùng RedisJSON: đó là RediSearch.

Như đã biết, Redis thông thường là một flat keyspace phẳng, tối ưu cho việc tìm kiếm O(1) khi biết chính xác key (như `student:23521476`). Nhưng trong thực tế, ta thường cần lọc sinh viên khóa 23, có GPA trên 9.0, hoặc tìm kiếm theo tên. Để giải quyết, nhiều nhà phát triển mắc sai lầm nghiêm trọng khi sử dụng `KEYS *` hoặc `SCAN` để duyệt toàn bộ bộ nhớ và lọc ở phía ứng dụng.

Lệnh `KEYS *` là một thảm họa trên production với độ phức tạp O(N). Vì Redis đơn luồng, lệnh này sẽ chặn đứng (block) hoàn toàn luồng xử lý chính. Mọi request đọc ghi từ hàng ngàn user khác đều phải xếp hàng chờ đợi, dễ dẫn đến nghẽn hệ thống, treo ứng dụng và gây downtime nghiêm trọng.
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
Để giải quyết bài toán truy vấn phức tạp mà vẫn giữ hiệu năng siêu tốc, RediSearch cung cấp công cụ tìm kiếm toàn văn và lập chỉ mục phụ (Secondary Index) thời gian thực trực tiếp trong RAM. Thay vì phải duy trì Sorted Set thủ công, RediSearch cho phép định nghĩa các chỉ mục trên tài liệu Hash hoặc JSON. Khi dữ liệu thay đổi, index tự động cập nhật dưới nền (asynchronously) mà không chặn luồng ghi chính.

RediSearch hỗ trợ 3 loại trường index phổ biến:
1. **TAG**: So khớp chính xác (exact match) trên các trường ngắn phân đoạn, như khóa tuyển sinh `cohort` hoặc `username`.
2. **NUMERIC**: Phục vụ truy vấn lọc theo khoảng (range queries), như tìm sinh viên có GPA từ 8.5 đến 9.5 hoặc lọc dung lượng lớp học.
3. **TEXT**: Động cơ Full-Text Search thực thụ hỗ trợ tìm kiếm mờ (fuzzy search), phân tích từ căn (stemming), và gán trọng số (weighting) khi tìm gần đúng.

Nhờ đó, bạn có thể biến Redis thành cơ sở dữ liệu tài liệu linh hoạt như MongoDB hay Elasticsearch nhưng với tốc độ nhanh gấp hàng chục lần.
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
Hãy cùng nghiên cứu các câu lệnh thực tế của RediSearch để thấy được sức mạnh và cú pháp truy vấn của nó.

Đầu tiên, ta dùng lệnh `FT.CREATE` tạo chỉ mục `idx:students` trên tài liệu `JSON` cho các key có tiền tố `student:`. Trong SCHEMA, ta định nghĩa trường `name` là TEXT kèm trọng số 2.0 (ưu tiên khớp tên), `cohort` là TAG, `gpa` là NUMERIC, và `username` là TEXT. RediSearch sẽ quét lập chỉ mục toàn bộ dữ liệu hiện tại và tự động cập nhật sau này.

Thứ hai, để tìm sinh viên khóa 23, ta dùng `FT.SEARCH idx:students "@cohort:{23}"`. Ngoặc nhọn `{}` đại diện cho việc lọc chính xác trường TAG.

Thứ ba, lọc khoảng điểm GPA từ 9.0 trở lên bằng cú pháp `FT.SEARCH idx:students "@gpa:[9.0 +inf]"`, với ngoặc vuông `[]` cho NUMERIC range và `+inf` là dương vô cực. Ta dễ dàng kết hợp các điều kiện như: `@cohort:{23} @gpa:[8.5 9.5]`.

Thứ tư, tìm kiếm văn bản đầy đủ với `"Đặng Phú"` để tìm kiếm mờ trên các trường TEXT và trả về kết quả xếp hạng theo độ tương đồng.

Cuối cùng, lệnh `FT.AGGREGATE` hỗ trợ gom cụm thống kê siêu tốc ngay trong RAM. Ở đây ta nhóm theo khóa (`GROUPBY 1 @cohort`) và đếm số lượng sinh viên (`REDUCE COUNT`), giúp loại bỏ hoàn toàn việc kéo lượng lớn bản ghi về ứng dụng để tính toán.
-->
