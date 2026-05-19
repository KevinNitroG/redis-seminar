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
