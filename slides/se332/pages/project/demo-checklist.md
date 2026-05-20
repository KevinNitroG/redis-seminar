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
| 3 | Edit profile name / GPA | `JSON.SET Student:23521476` |
| 4 | Search one Vietnamese character | `FT.SEARCH` + folded fallback |
| 5 | Filter courses by lecturer/capacity | `FT.SEARCH Course:index` |
| 6 | Enroll with searchable dropdown | `JSON.SET` + `XADD ENROLL` |
| 7 | Unenroll the same student | `JSON.SET` + `XADD UNENROLL` |
| 8 | Logout | `DEL session:{token}` |

<!--
App ở `localhost:3000`, RedisInsight hoặc Redis Stack Browser, và terminal.
RedisInsight dùng để chứng minh key trong Redis thay đổi sau mỗi thao tác.

Kịch bản chính sẽ là: login trước, sửa profile một chút, qua search thử gõ một ký tự tiếng Việt hoặc không dấu,
sau đó qua Courses lọc môn còn chỗ, enroll một sinh viên bằng dropdown search, rồi bấm unenroll lại ngay trên chip sinh viên.

logout tự động Session key có TTL nên tự hết hạn.
-->
