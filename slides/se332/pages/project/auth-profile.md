---
layout: figure
figureUrl: /demo/02-login-modal.png
figureCaption: Login creates a short-lived Redis session key.
hideInToc: true
---

<!--
Ở bước này Login và dùng account seed `thiendp / thiendp`.
Backend sẽ tìm user trong Student document, kiểm tra password demo, rồi tạo một token.

Backend lưu một key `session:{token}` trong Redis bằng `SET ... EX 3600`,
tức là session có TTL một giờ. Mở RedisInsight, filter `session:*`, rồi show TTL để chứng minh đây là session có thời hạn.
-->

---
layout: figure
figureUrl: /demo/03-profile-session.png
figureCaption: After login, the profile view is hydrated from the Redis session.
hideInToc: true
---

<!--
Sau khi login xong app tự chuyển qua Profile. Ở đây mình nói rõ là UI không tự đoán user đang là ai.
Frontend gửi Bearer token lên `/auth/me`, backend `GET session:{token}` để lấy `studentId`, rồi đọc tiếp JSON document `Student:23521476`.

Redis session key trên UI để liên hệ với key thật trong RedisInsight.
Như vậy phần profile đang được hydrate từ Redis session cộng với Student JSON.
-->

---
layout: figure
figureUrl: /demo/04-edit-profile.png
figureCaption: Profile form edits a subset of the Student document.
hideInToc: true
---

<!--
Tiếp theo mình bấm Edit Profile và đổi nhẹ Full Name hoặc GPA.
Đây là một PATCH đúng nghĩa: client chỉ gửi field muốn đổi, backend dựa vào session để biết user nào đang được sửa.

Chỗ này nên nhấn một câu là client không được gửi `studentId` tùy ý để sửa người khác.
Sau khi Save, mình quay qua RedisInsight mở `Student:23521476` để thấy field trong JSON đã đổi thật.
-->

---
layout: figure
figureUrl: /demo/05-profile-updated.png
figureCaption: Profile edit updates the logged-in Student JSON document.
hideInToc: true
---

<!--
Ảnh này là trạng thái sau khi lưu profile.
Mình có thể nói ngắn là UI gọi `PATCH /auth/me`, backend đọc session để biết đúng `studentId`, fetch Student JSON,
merge các field mới rồi save lại bằng Redis OM.

Nếu đang demo live, mình nên dừng một nhịp ở RedisInsight để cho người nghe thấy name hoặc GPA đã thay đổi trong document.
Đoạn này giúp nối phần auth/session với phần RedisJSON rất rõ.
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
Login tạo session bằng `SET ... EX`, current user thì `GET session` rồi `JSON.GET Student`, logout chỉ cần `DEL session`.

Session chỉ là state đăng nhập ngắn hạn. Dữ liệu profile thật vẫn nằm trong Student JSON.
Demo đơn giản hóa password để tập trung vào Redis,
còn production phải hash password, harden token và kiểm soát quyền kỹ hơn.
-->
