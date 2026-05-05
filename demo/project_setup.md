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
│       ├── students.js      # Student CRUD + search
│       └── courses.js       # Course CRUD + search + enrollment
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
- 🔍 **Fuzzy search** with autocomplete suggestions (RediSearch)
- 📊 **Stats dashboard** (total, avg GPA, cohorts)
- 🎨 **Dark theme** with gradient accents and animations
- 📝 **CRUD modals** for students and courses
- 🔗 **Enrollment management** with stream logging
