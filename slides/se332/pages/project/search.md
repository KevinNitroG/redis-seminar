---
layout: figure
figureUrl: /demo/06-student-search.png
figureCaption: Student search supports one-character and Vietnamese-friendly lookup.
hideInToc: true
---

<!--
Ở tab Students gõ thử một ký tự, ví dụ `d`, hoặc gõ không dấu như `dang`.
RediSearch là phần chính để search nhanh trên index, nhưng với case tiếng Việt và một ký tự ngắn,
backend có thêm bước fold dấu để UX demo mượt hơn. Người dùng không cần nhớ dấu chính xác vẫn tìm được sinh viên.
-->

---
layout: figure
figureUrl: /demo/07-course-filter.png
figureCaption: Course filters combine search, lecturer, capacity, and sorting.
hideInToc: true
---

<!--
Đến Courses demo thêm filter môn học. gõ một ký tự trong search box, chọn Has Seats,
hoặc chọn lecturer nếu muốn cho thấy filter không chỉ áp dụng cho sinh viên.

UI này đang gọi `/courses/search` với nhiều query param cùng lúc:
text search, lecturer, capacity và sort. Backend map các điều kiện đó xuống `Course:index`,
rồi vẫn có fallback không dấu để các tên như "Chuyên đề" tìm bằng `chuyen` vẫn ra.
-->

---
hideInToc: true
---

## Search Query Behind the UI

```sh
# Prefix / autocomplete
FT.SEARCH Student:index "(@name:thie*|@username:thie*)"

# One-character / Vietnamese fallback is handled in API
foldText("Đặng Phú Thiện") includes "d"

# Combine text + filter + numeric range
FT.SEARCH Student:index "@cohort:{23} @gpa:[8 +inf]" \
  SORTBY gpa DESC

# Course search uses another index
FT.SEARCH Course:index "(@name:chuyen*|@lecturerName:yen*)" \
  SORTBY name ASC
```

<!--
Slide này mình sau khi thao tác UI để giải thích phía sau.
RediSearch index các field text và number, nên search không phải đọc từng JSON document rồi lọc thủ công.
Prefix query phục vụ autocomplete, numeric range phục vụ lọc GPA, còn Course dùng index riêng cho tên môn và giảng viên.

Riêng dòng `foldText` không phải Redis command, mà là lớp xử lý thêm trong API để demo tiếng Việt tốt hơn:
`Đặng` có thể tìm bằng `d`, `Chuyên` có thể tìm bằng `chuyen`.
Như vậy vẫn giữ Redis làm search engine chính, nhưng UX nhập liệu thân thiện hơn với dữ liệu tiếng Việt.
-->
