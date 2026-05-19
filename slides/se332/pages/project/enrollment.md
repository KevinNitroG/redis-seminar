---
layout: figure
figureUrl: /demo/07-enroll-modal.png
figureCaption: Enrollment updates JSON state and appends a Redis Stream event.
hideInToc: true
---

<!--
- Demo bước 4: qua tab Courses, chọn một course còn chỗ và bấm Enroll.
- Nhập MSSV, ví dụ `23521476`, rồi submit.
- Backend cập nhật 2 document: thêm student vào Course.students và thêm course vào Student.enrollments.
- Đồng thời ghi `XADD enrollment:stream:{courseId}` với action ENROLL để tạo audit log.
- Mở RedisInsight vào stream tương ứng để cho thấy event mới được append, không ghi đè event cũ.
-->

---
hideInToc: true
---

## Enrollment Writes

```sh
# Update Course document
JSON.SET Course:SE332.Q21 $.students '["23521476", "..."]'
JSON.SET Course:SE332.Q21 $.enrolled 4

# Update Student document
JSON.SET Student:23521476 $.enrollments '["SE332.Q21", "..."]'

# Append audit event
XADD enrollment:stream:SE332.Q21 * \
  studentId 23521476 courseId SE332.Q21 action ENROLL
```

<!--
- Giải thích enrollment không chỉ là thêm một dòng UI.
- Có 2 document cần đồng bộ: Course biết danh sách sinh viên, Student biết danh sách môn học.
- Stream là log append-only, phù hợp cho audit trail hoặc worker xử lý async sau này.
- Nếu muốn nâng cấp production, phần này có thể bọc bằng transaction/WATCH như Section 4 đã nói.
-->
