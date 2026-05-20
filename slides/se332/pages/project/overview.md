---
layout: figure
figureUrl: /demo/01-dashboard.png
figureCaption: Demo app landing screen: Students, Courses, Profile, and Redis-backed API.
hideInToc: true
---

<!--
App có ba tab: Students để quản lý sinh viên,
Courses để quản lý môn học và enrollment, còn Profile là phần thông tin của user đang đăng nhập.

App quản trị vs mọi state quan trọng đều đi qua Redis Stack:
Student và Course là JSON document, ô search dùng RediSearch index, login tạo session key có TTL, còn thao tác enroll sẽ append event vào Redis Stream.

Sau slide này mở app thật ở `http://localhost:3000` để bắt đầu thao tác.
-->
