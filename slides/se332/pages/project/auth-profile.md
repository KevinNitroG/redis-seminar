---
layout: figure
figureUrl: /demo/02-login-modal.png
figureCaption: Login creates a short-lived Redis session key.
hideInToc: true
---

<!--
- Demo bước 1: bấm Login, dùng tài khoản seed `thiendp / thiendp`.
- Backend kiểm tra username/password từ Student document, sau đó tạo token UUID.
- Redis lưu `session:{token}` bằng `SET ... EX 3600`, tức là session tự hết hạn sau 1 giờ.
- Mở RedisInsight và filter `session:*`, sau đó chạy TTL để cho thấy đây là session có thời hạn.
-->

---
layout: figure
figureUrl: /demo/05-profile-updated.png
figureCaption: Profile edit updates the logged-in Student JSON document.
hideInToc: true
---

<!--
- Demo bước 2: sau login, mở Profile và bấm Edit Profile.
- Đổi tên hoặc GPA rồi Save; UI gọi `PATCH /auth/me`.
- Backend đọc session để biết studentId, fetch `Student:23521476`, merge field mới và save lại bằng Redis OM.
- Trong RedisInsight mở key `Student:23521476` để thấy name/GPA đã thay đổi.
-->
