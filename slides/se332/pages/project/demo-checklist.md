---
hideInToc: true
---

## Demo Checklist

```bash
docker compose up -d
pnpm --filter demo-1 seed
pnpm --filter demo-1 dev
```

| Step | What to show | Redis proof |
| ---- | ------------ | ----------- |
| 1 | Login `thiendp / thiendp` | `session:*` key with TTL |
| 2 | Edit profile name / GPA | `Student:23521476` JSON changes |
| 3 | Search `thie` | `FT.SEARCH Student:index` |
| 4 | Enroll a student | `enrollment:stream:*` event |

<!--
- Trước khi thuyết trình nên mở sẵn 3 tab: app, RedisInsight hoặc Redis Stack Browser, và terminal.
- App demo mặc định chạy ở localhost:3000 bằng `pnpm --filter demo-1 dev`.
- Nếu cần chụp lại ảnh cho slide, chạy `pnpm --filter demo-1 capture:demo`; script sẽ dùng port 3100 để không đụng server đang demo.
- Trong demo thật, sau mỗi thao tác UI nên chuyển qua RedisInsight để chứng minh dữ liệu đã đổi trong Redis.
-->
