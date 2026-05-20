---
layout: figure
figureUrl: /demo/08-enroll-dropdown.png
figureCaption: Enroll modal uses a searchable student dropdown.
hideInToc: true
---

<!--
tab Courses, chọn một môn còn chỗ và bấm Enroll.

-->

---
layout: figure
figureUrl: /demo/09-enroll-selected.png
figureCaption: Selected student is locked before submitting enrollment.
hideInToc: true
---

<!--
frontend gửi `studentId` đã chọn lên API, còn backend mới là nơi validate course còn chỗ,
student có tồn tại không, và student này đã enroll môn đó chưa.

Nếu muốn nhấn mạnh phần Redis, một thao tác enroll sẽ bao gồm thao tác vs JSON document và Stream.
-->

---
layout: figure
figureUrl: /demo/10-enroll-updated.png
figureCaption: Course card updates after enrollment.
hideInToc: true
---

<!--
Sau khi bấm Enroll, card môn học cập nhật chip sinh viên và số lượng enrolled.
Chuyển qua RedisInsight để mở `Course:*` và `Student:*`.

Course document có thêm student trong `students`, Student document có thêm course trong `enrollments`.
Đồng thời Stream `enrollment:stream:{courseId}` có event `ENROLL`.
Để một thao tác nghiệp vụ tạo ra cả state hiện tại lẫn log lịch sử.
-->

---
layout: figure
figureUrl: /demo/11-unenroll-updated.png
figureCaption: Unenroll appends another stream event instead of rewriting history.
hideInToc: true
---

<!--
Để demo trọn flow, mình bấm dấu x trên chip sinh viên để unenroll lại.
Điểm hay để nói ở đây là Stream không xóa event enroll cũ.

Backend cập nhật lại JSON hiện tại để student không còn trong course nữa,
nhưng Stream append thêm event `UNENROLL`. Vì vậy nếu nhìn theo Stream,
mình có thể replay được lịch sử đăng ký và hủy đăng ký của môn học.
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

# Unenroll appends another event
XADD enrollment:stream:SE332.Q21 * \
  studentId 23521476 courseId SE332.Q21 action UNENROLL
```

<!--
Slide command này mình dùng để gom lại logic phía sau flow enroll/unenroll.
Enrollment không chỉ là thêm một dòng UI: Course biết danh sách sinh viên, Student biết danh sách môn học,
và Stream giữ lại lịch sử thao tác.

Mình nhấn mạnh chữ append-only: khi unenroll, event cũ không bị sửa hoặc xóa,
mà hệ thống ghi thêm một event mới với action `UNENROLL`.
Nếu nâng cấp production, đoạn cập nhật nhiều document này có thể bọc kỹ hơn bằng transaction hoặc WATCH như section trước đã nói.
-->
