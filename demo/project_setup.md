# 🎓 UIT Course & Student Manager — Demo Project

## Project Structure

```
demo/1/
├── public/                  # Frontend (static HTML/CSS/JS)
│   ├── index.html           # SPA with tabs, modals, search
│   ├── style.css            # Dark theme design system
│   └── app.js               # API calls, search suggestions, CRUD
├── src/                     # Backend (Express.js)
│   ├── index.js             # Express server entry point
│   ├── db.js                # Redis client connection
│   ├── schemas.js           # Redis OM schemas (Student, Course)
│   ├── repositories.js      # Redis OM repositories + index creation
│   ├── seed.js              # Seed script with sample data
│   └── routes/
│       ├── auth.js          # Login/logout + Redis session profile
│       ├── students.js      # Student CRUD + search
│       └── courses.js       # Course CRUD + search + enrollment
├── scripts/
│   └── capture-demo.js      # Playwright screenshots for Section 6 slides
└── package.json
```

## Tech Stack

| Layer | Tech | Purpose |
|-------|------|---------|
| Backend | Express.js 5 | REST API server |
| ORM | redis-om 0.4.x | Object mapping for Redis (like Prisma but for Redis) |
| Database | Redis Stack | RedisJSON + RediSearch + Streams |
| Frontend | HTML/CSS/JS | Simple SPA with dark theme |

## Redis Features Demonstrated

| Feature | Redis Commands | Where Used |
|---------|---------------|------------|
| **RedisJSON** | `JSON.SET`, `JSON.GET`, `JSON.DEL` | All CRUD operations (via redis-om) |
| **RediSearch** | `FT.CREATE`, `FT.SEARCH` | Search endpoints with fuzzy matching |
| **Streams** | `XADD` | Enrollment event logging |
| **Sessions** | `SET EX`, `GET`, `DEL` | Login/logout with Redis TTL keys |
| **Redis OM** | Schema, Repository | ORM layer abstracting Redis commands |

## How to Run

```bash
# 1. Start Redis Stack (required — has RedisJSON + RediSearch modules)
docker compose up -d

# 2. Seed sample data
cd demo/1 && node src/seed.js

# 3. Start the server (with hot reload)
npm run dev
# → Server at http://localhost:3000

# Optional: regenerate screenshots used in SE332 Section 6 slides
pnpm --filter demo-1 capture:demo
# → PNG files in slides/se332/public/demo
```

> [!IMPORTANT]
> The `compose.yaml` was updated from `redis:8.6.0-alpine` to `redis/redis-stack:latest` because the alpine image doesn't include RedisJSON/RediSearch modules.

## Redis Connection & Admin UI

Sau khi chạy `docker compose up -d`, bạn có thể truy cập Redis theo các thông tin sau:

| Service | Connection / URL | Description |
|---------|------------------|-------------|
| **Redis Server** | `localhost:6379` | Không mật khẩu. Dùng cho Backend kết nối. |
| **Redis Stack Browser** | [http://localhost:8001](http://localhost:8001) | Giao diện quản lý tích hợp sẵn trong Redis Stack. |
| **RedisInsight** | [http://localhost:5540](http://localhost:5540) | Công cụ GUI chuyên sâu (Container riêng biệt). |

### Cách kiểm tra dữ liệu:
1. Mở [http://localhost:8001](http://localhost:8001).
2. Vào mục **"RedisInsight"** hoặc **"Browser"**.
3. Bạn sẽ thấy các keys có tiền tố `Student:` và `Course:`.
4. Với các môn học có enrollment, bạn có thể xem các event trong **Streams** (`enrollment:stream:*`).


## API Endpoints (per OpenAPI spec)

### Auth & Profile
| Method | Endpoint | Redis Behind the Scenes |
|--------|----------|------------------------|
| POST | `/auth/login` | `FT.SEARCH` user + `SET session:{token} EX 3600` |
| POST | `/auth/logout` | `DEL session:{token}` |
| GET | `/auth/me` | `GET session:{token}` + `JSON.GET Student:{id}` |
| PATCH | `/auth/me` | `GET session:{token}` + `JSON.SET Student:{id}` |

### Students
| Method | Endpoint | Redis Behind the Scenes |
|--------|----------|------------------------|
| POST | `/students` | `JSON.SET Student:{id}` |
| GET | `/students` | `FT.SEARCH Student:idx * LIMIT ...` |
| GET | `/students/:id` | `JSON.GET Student:{id}` |
| PATCH | `/students/:id` | `JSON.GET` → merge → `JSON.SET` |
| PUT | `/students/:id` | `JSON.SET` (full replace) |
| DELETE | `/students/:id` | `JSON.DEL Student:{id}` |
| GET | `/students/search` | `FT.SEARCH` with full-text + filters |

### Courses
| Method | Endpoint | Redis Behind the Scenes |
|--------|----------|------------------------|
| POST | `/courses` | `JSON.SET Course:{id}` |
| GET | `/courses` | `FT.SEARCH Course:idx * LIMIT ...` |
| GET | `/courses/:id` | `JSON.GET Course:{id}` |
| PATCH | `/courses/:id` | `JSON.GET` → merge → `JSON.SET` |
| PUT | `/courses/:id` | `JSON.SET` (full replace) |
| DELETE | `/courses/:id` | `JSON.DEL Course:{id}` |
| GET | `/courses/search` | `FT.SEARCH` with full-text + filters |
| POST | `/courses/:id/students` | `XADD` + `JSON.SET` (enrollment) |
| GET | `/courses/:id/students` | `JSON.GET` per student |
| DELETE | `/courses/:id/students/:sid` | `XADD` + `JSON.SET` (unenroll) |

## Frontend Features
- 🔐 **Login/logout** with Redis-backed session keys and TTL
- 👤 **Simple profile editor** that updates the logged-in Student JSON document
- 🔍 **Fuzzy search** with autocomplete suggestions (RediSearch) — prefix wildcard + `%fuzzy%`
- ⌨️ **Keyboard navigation** on suggestions: `↑↓` navigate, `Enter` select, `Esc` close
- 📊 **Stats dashboard** (total, avg GPA, cohorts)
- 🎨 **Dark theme** with gradient accents and animations
- 📝 **CRUD modals** for students and courses
- 🔗 **Enrollment management** with stream logging

---

## 🎬 Kịch bản Demo (Script)

> Thời gian ước tính: **10–15 phút**. Mở sẵn 3 tab: **App** (`localhost:3000`), **RedisInsight** (`localhost:5540`), **Terminal**.

---

### 🚀 Bước 0 — Khởi động (1 phút)

```bash
# Terminal 1: Start Redis Stack
docker compose up -d

# Terminal 2: Seed dữ liệu mẫu
node src/seed.js

# Terminal 3: Start server
npm run dev
```

Mở trình duyệt vào `http://localhost:3000`.

**Nói:** *"Đây là ứng dụng quản lý sinh viên và môn học của UIT, built trên Redis Stack — kết hợp RedisJSON, RediSearch, và Streams."*

---

### 1️⃣ RedisJSON — CRUD Sinh Viên (3 phút)

#### 1.1 Tạo sinh viên mới

1. Tab **Students** → click **➕ Add Student**
2. Nhập:
   - MSSV: `23521999`
   - Username: `demouser`
   - Full Name: `Nguyen Demo`
   - Cohort: `23`
   - GPA: `8.5`
3. Click **Create**

**Chuyển sang RedisInsight → Browser:**
- Tìm key `Student:23521999`
- Mở ra → thấy JSON document đầy đủ

**Nói:** *"Mỗi sinh viên được lưu dưới dạng JSON document trong Redis với lệnh `JSON.SET`. Không phải string thông thường, Redis hiểu cấu trúc nested JSON."*

#### 1.2 Cập nhật (PATCH)

1. Click **✏️ Edit** trên card `Nguyen Demo`
2. Đổi GPA thành `9.0`
3. Click **Save**

**Trong RedisInsight:** Thấy field `gpa` thay đổi từ `8.5` → `9.0`.

**Nói:** *"`PATCH` chỉ cập nhật field thay đổi — backend fetch JSON, merge, rồi `JSON.SET` lại. Tương tự `UPDATE` trong SQL nhưng document-oriented."*

#### 1.3 Xóa (DELETE)

1. Click **🗑️ Delete** → Confirm
2. Thấy card biến mất

**Nói:** *"`JSON.DEL Student:23521999` — xóa cả document."*

---

### 2️⃣ RediSearch — Fuzzy Search & Autocomplete (3 phút)

#### 2.1 Demo prefix search

1. Tab **Students**, gõ vào ô search: `ngu`
2. Suggestions xuất hiện ngay sau 250ms với các sinh viên có tên bắt đầu bằng "Ngu..."

**Nói:** *"RediSearch index tất cả text fields. Query `ngu*` match prefix — giống autocomplete. Backend gọi `FT.SEARCH Student:idx @name:ngu*`."*

#### 2.2 Demo fuzzy matching

1. Gõ sai chính tả: `nguyeen` (2 chữ e)
2. Vẫn thấy kết quả — fuzzy matching `%nguyeen%` cho phép sai 1–2 ký tự

**Nói:** *"RediSearch hỗ trợ fuzzy search với cú pháp `%term%`. Edit distance Levenshtein — gõ sai vẫn tìm được!"*

#### 2.3 Keyboard navigation

1. Gõ `ngu`, dùng phím `↓` để di chuyển trong suggestions
2. Nhấn `Enter` để chọn
3. Nhấn `Esc` để đóng

#### 2.4 Filter theo cohort + GPA

1. Chọn **Cohort: K23**, Min GPA: `8.0`
2. Click **🔍 Filter**

**Nói:** *"RediSearch hỗ trợ combined filter: full-text + numeric range + tag. `FT.SEARCH Student:idx @cohort:{23} @gpa:[8.0 +inf]`"*

---

### 3️⃣ Enrollment + Redis Streams (3 phút)

#### 3.1 Enroll sinh viên vào môn học

1. Chuyển sang tab **Courses**
2. Tìm môn `SE332.Q21`
3. Click **➕ Enroll** → nhập MSSV: `23521001`
4. Click **Enroll**

**Chuyển sang RedisInsight → Streams:**
- Tìm key `enrollment:stream:SE332.Q21`
- Thấy event vừa được append với `action: ENROLL`

**Nói:** *"Mỗi lần enroll, backend gọi `XADD enrollment:stream:SE332.Q21 * studentId 23521001 action ENROLL timestamp ...`. Streams là append-only log — perfect cho audit trail!"*

#### 3.2 Kiểm tra enrolled count

- Card môn học cập nhật số sinh viên enrolled
- Tab Students → card sinh viên `23521001` → thấy môn `SE332.Q21` trong enrollments

**Nói:** *"Backend update cả 2 document: Course và Student — bidirectional reference lưu bằng JSON arrays."*

#### 3.3 Unenroll

1. Click **✕** cạnh chip sinh viên trong course card
2. Confirm → enrolled count giảm

**RedisInsight Streams:** Thấy event mới `action: UNENROLL` được append.

**Nói:** *"Stream không xóa record cũ — chỉ append thêm. Đây là event sourcing pattern — bạn có thể replay lịch sử."*

---

### 4️⃣ RedisInsight — Quan sát Internal (1 phút)

Mở **RedisInsight** và show:

| Điều cần show | Cách thực hiện |
|---|---|
| Keys với prefix | Browser → filter `Student:*` |
| JSON document | Click vào một key → xem tree view |
| FT.SEARCH index | Workbench → `FT.INFO Student:idx` |
| Stream events | Click `enrollment:stream:*` → xem messages |
| Key TTL | `TTL Student:23521001` trong workbench → `-1` (no expiry) |

---

### 5️⃣ Tổng kết (1 phút)

| Redis Feature | Lệnh thực tế | Dùng để làm gì |
|---|---|---|
| **RedisJSON** | `JSON.SET`, `JSON.GET`, `JSON.DEL` | Lưu/đọc/xóa document |
| **RediSearch** | `FT.CREATE`, `FT.SEARCH` | Full-text + fuzzy + filter |
| **Streams** | `XADD`, `XREAD` | Audit log enrollment events |
| **Redis OM** | Schema, Repository | ORM abstraction layer |

**Nói:** *"Redis không chỉ là cache. Với Redis Stack, nó là một document store có full-text search và event streaming — tất cả trong một binary, latency < 1ms."*

---

> [!TIP]
> **Câu hỏi hay để mở thảo luận:**
> - *"Tại sao dùng Redis thay vì PostgreSQL + Elasticsearch?"* → Latency, simplicity, all-in-one
> - *"RediSearch scale thế nào?"* → Sharding qua Redis Cluster
> - *"Stream có persist không?"* → Có, dùng `XREAD` với consumer groups để xử lý guaranteed delivery
