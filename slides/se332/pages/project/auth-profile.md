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
figureUrl: /demo/03-profile-session.png
figureCaption: After login, the profile view is hydrated from the Redis session.
hideInToc: true
---

<!--
- Demo bước 2: sau khi login thành công, app tự chuyển qua tab Profile.
- Nói UI không tự đoán user; frontend gửi Bearer token lên `/auth/me`.
- Backend `GET session:{token}` để lấy studentId, rồi đọc `Student:23521476`.
- Chỉ vào dòng Redis session key trên UI để liên hệ với key thật trong RedisInsight.
-->

---
layout: figure
figureUrl: /demo/04-edit-profile.png
figureCaption: Profile form edits a subset of the Student document.
hideInToc: true
---

<!--
- Demo bước 3: bấm Edit Profile, đổi Full Name hoặc GPA.
- Nói đây là partial update, giống PATCH trong REST API.
- Phần cần nhấn: session quyết định user nào được sửa profile, chứ client không gửi studentId tùy ý.
- Sau khi Save, quay qua RedisInsight để thấy document Student đã đổi.
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

---
hideInToc: true
---

## Auth Flow in Redis

```sh
# Login
FT.SEARCH Student:index "@username:thiendp"
SET session:<uuid> '{"studentId":"23521476"}' EX 3600

# Current user
GET session:<uuid>
JSON.GET Student:23521476

# Logout
DEL session:<uuid>
```

<!--
- Slide này dùng sau khi demo UI để gom lại các command Redis thật sự phía sau.
- `SET ... EX` là pattern session management rất phổ biến với Redis.
- `GET session` chỉ lưu state đăng nhập ngắn hạn; profile thật vẫn nằm trong Student JSON.
- Nếu thầy/cô hỏi bảo mật: demo đang đơn giản hóa password, production phải hash password và harden token.
-->
