---
hideInToc: true
---

## UIT Course Manager Architecture

```mermaid
flowchart LR
  Browser["Browser SPA"] --> API["Express REST API"]
  API --> OM["Redis OM Repositories"]
  API --> Session["Redis Session Keys"]
  OM --> JSON["RedisJSON Documents"]
  OM --> Search["RediSearch Indexes"]
  API --> Stream["Redis Streams"]

  JSON --> Student["Student:*"]
  JSON --> Course["Course:*"]
  Search --> StudentIndex["Student:index"]
  Search --> CourseIndex["Course:index"]
  Session --> SessionKey["session:{token} TTL"]
  Stream --> EnrollStream["enrollment:stream:{courseId}"]
```

<div class="text-sm mt-4 text-gray-500">

One Redis Stack instance powers documents, search, session state, and event logs.

</div>

<!--
- Giải thích luồng chính: frontend gọi Express API, API dùng Redis OM cho Student/Course.
- RedisJSON lưu document: Student:* và Course:*.
- RediSearch tạo index để search theo tên, username, lecturer, GPA.
- Login tạo key session:{token} có TTL; logout thì DEL key.
- Enroll/unenroll ghi thêm event vào Redis Stream để có audit log.
-->

---
hideInToc: true
---

## API Surface

| Flow | Endpoint | Redis commands |
| ---- | -------- | -------------- |
| Login / logout | `/auth/login`, `/auth/logout` | `SET EX`, `GET`, `DEL` |
| Profile | `/auth/me` | `JSON.GET`, `JSON.SET` |
| Student CRUD | `/students/:id` | `JSON.SET`, `JSON.GET`, `JSON.DEL` |
| Search | `/students/search`, `/courses/search` | `FT.SEARCH` |
| Enrollment | `/courses/:id/students` | `JSON.SET`, `XADD` |

<div class="text-sm mt-4 text-gray-500">

OpenAPI spec: `slides/se332/openapi.yaml`

</div>

<!--
- Nói nhanh API map để giảng viên thấy demo có thiết kế backend rõ ràng, không chỉ là UI tĩnh.
- Khi demo, không cần mở hết endpoint; chỉ chọn các flow có ý nghĩa: login/session, edit profile, search, enrollment stream.
- Nhấn mạnh OpenAPI đã được cập nhật để mô tả thêm auth/profile.
-->
