---
hideInToc: true
---

## Case Study: Authentik Removed Redis

<div class="grid grid-cols-2 gap-8 mt-4">

<div>

**Before (Pre-2025.10)**

```mermaid {scale: 0.7}
graph TD
  U1([User / Browser]) --> R1[Authentik Server <br> Router & Core]
  R1 <--> DB1[(PostgreSQL <br> Config & Data)]
  R1 <--> Cache[(Redis <br> Cache, Sessions, WebSockets)]
  W1[Authentik Worker <br> Background Tasks] <--> DB1
  W1 <--> Cache
```

</div>

<div>

**After (2025.10+)**

```mermaid {scale: 0.7}
graph TD
  U2([User / Browser]) --> R2[Authentik Server <br> Router & Core]
  R2 <--> DB2[(PostgreSQL <br> Config, Data, Cache, <br> Sessions, WebSockets, Tasks)]
  W2[Authentik Worker <br> Background Tasks] <--> DB2
```

</div>

</div>

<div v-click class="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mt-4 text-center text-sm">

**Lesson:** Redis adds operational complexity — only adopt when the performance gain justifies it

</div>

<!--
Authentik là một open-source identity provider (SSO/OAuth2).
Trước phiên bản 2025.10, Authentik dùng Redis cho cache, session, WebSocket.
Sau đó họ loại bỏ Redis hoàn toàn, chuyển hết sang PostgreSQL.

Tại sao? Redis làm tăng độ phức tạp vận hành:
phải quản lý thêm một service, cấu hình persistence, memory limits, v.v.
Với use case của Authentik, PostgreSQL đáp ứng đủ — không cần Redis.

Bài học: đừng thêm infrastructure nếu không thực sự cần.
Redis rất mạnh, nhưng chỉ nên dùng khi performance gain xứng đáng với chi phí vận hành.
-->
