---
layout: center
class: text-center
transition: slide-up
---

# Project Demo - UIT Course Manager

<!--
Tới đây chuyển từ phần lý thuyết sang một project nhỏ để thấy Redis chạy hoạt động trong một app đơn giản
quản lý sinh viên, quản lý môn học, đăng nhập đăng xuất, sửa profile, search có filter và flow enroll/unenroll.

 edis không chỉ đứng ở vai trò cache. Redis Stack có thể vừa lưu document bằng RedisJSON,
vừa search bằng RediSearch, vừa giữ session login, vừa ghi log enrollment bằng Streams.
-->

---
hideInToc: true
---

## Flows

| Part | Demo flow                       | Redis focus                      |
| ---- | ------------------------------- | -------------------------------- |
| 1    | Architecture + setup            | Redis Stack modules              |
| 2    | Login, logout, edit profile     | Session key + JSON document      |
| 3    | Student search + course filters | RediSearch + Vietnamese fallback |
| 4    | Enroll, then unenroll           | JSON update + Stream audit log   |

<!--
Bao gồm phần auth/profile, rồi search/filter, cuối cùng là enroll và unenroll.

Login để thấy session key, search để thấy index,
và enroll/unenroll để thấy Stream ghi event.
-->

---
src: ./architecture.md
---

---
src: ./overview.md
---

---
src: ./demo-checklist.md
---

---
src: ./auth-profile.md
---

---
src: ./search.md
---

---
src: ./enrollment.md
---
