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
| 1 | Dashboard overview | `Student:*`, `Course:*` |
| 2 | Login `thiendp / thiendp` | `SET session:{token} EX 3600` |
| 3 | Inspect current profile | `GET session:{token}` |
| 4 | Edit profile name / GPA | `JSON.SET Student:23521476` |
| 5 | Search `thie` | `FT.SEARCH Student:index` |
| 6 | Enroll a student | `JSON.SET` + `XADD` |
| 7 | Logout | `DEL session:{token}` |

<!--
- Trước khi thuyết trình nên mở sẵn 3 tab: app, RedisInsight hoặc Redis Stack Browser, và terminal.
- App demo mặc định chạy ở localhost:3000 bằng `pnpm --filter demo-1 dev`.
- Nếu cần chụp lại ảnh cho slide, chạy `pnpm --filter demo-1 capture:demo`; script sẽ dùng port 3100 để không đụng server đang demo.
- Trong demo thật, sau mỗi thao tác UI nên chuyển qua RedisInsight để chứng minh dữ liệu đã đổi trong Redis.
- Nếu thiếu thời gian, bỏ bước logout và chỉ nói session key sẽ tự hết hạn nhờ TTL.
-->
