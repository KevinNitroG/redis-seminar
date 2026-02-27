# Redis as a Primary Database

Data for student, courses with lecturer is at `./.agents/data/data.json`

Target Time: 20 Minutes

Style: Slidev

Audience: University Students & Lecturer (Familiar with SQL/MongoDB)

## Section 1: Introduction to Redis (Brief - 1.5 mins)

Focus: Fast context setting

- Visual Element: A mind map or a side-by-side comparison diagram (Disk-based DB like MongoDB vs. In-memory DB like Redis)
- Key Bullets:
  - What: REmote DIctionary Server. In-memory, key-value data structure store
  - Why: Sub-millisecond latency. Single-threaded event loop (no lock contention)
  - History (Brief): Created by Salvatore Sanfilippo (antirez) for real-time analytics. Evolved from a simple cache to a multi-model database
  - License Shift:
    > https://redis.io/blog/what-redis-license-change-means-for-our-managed-service-providers/
    > https://redis.io/blog/agplv3/
  - Keep in mind redis is key value, and the keyspace is flat

## Section 2: Core Data Types & Commands (UIT Context) (4 mins)

Focus: Fast-paced syntax, code snippets showing how data maps to Redis. Each command shows time complexity, output of command

### Strings

- Visual Element: Key-Value memory block diagram
- Code Snippet:
  - `SET course:SE332.Q21 "Chuyên đề CSDL nâng cao" EX 3600 NX`
    > Highlight EX for TTL/expiration, NX
    > Return value: OK if set, nil if not set
  - `GET course:SE332.Q21`
  - `DEL course:SE332.Q21`
  - `GET course:SE109.Q21`
  - `MSET student:24521574:name "Mai Phú Tân" students:24521574:username "maipht" student:24521574:cohort "24" student:24521574:gpa "6"`
  - `MGET student:24521574:name student:24521574:username`
  - `SET student:username:maipht "24521574"`
    > This is a common pattern for secondary indexes (username -> student ID)

### Hashes

- Visual Element: Flat object memory block
- Code Snippet:
  - `HSET student:24521574 name "Mai Phú Tân" username "tanmp" cohort "24" gpa "6"`
  - `HGETALL student:24521574`
  - `HGET student:24521574 name`
  - `HMGET student:24521574 name gpa`
  - `GET student:24521574` (Wrong data type)
  - `INCRBYFLOAT student:24521574 gpa 0.5` (Update GPA to 6.5)

### Sets

- Visual Element: Unique enrollment block diagram
- Code Snippet:
  - `SADD course:SE121.Q21:students "23521476" "23520952"`
  - `SMEMBERS course:SE121.Q21:students`
  - `SISMEMBER course:SE121.Q21:students "23521476"`
  - `SCARD course:SE121.Q21:students`
  - `SREM course:SE121.Q21:students "23520952"`

### Sorted Sets (ZSET)

- Visual Element: Leaderboard diagram
- Code Snippet:
  - `ZADD leaderboard:gpa:cohort23 9.2 "23521476" 9.0 "23520952" 8.9 "23521049" 8.5 "23520161"`
  - `ZRANGE leaderboard:gpa:cohort23 0 -1 WITHSCORES`
  - `ZREVRANGE leaderboard:gpa:cohort23 0 2 WITHSCORES`
- Note other command like `ZINCRBY` for updating scores, `ZREM`, `ZCARD` just like Sets

### Bitmaps

- Visual Element: Array of 0s and 1s representing a calendar/attendance sheet
- Code Snippet:
  - `SETBIT attendance:SE359.Q21:2026-03-01 23521476 1`
  - `GETBIT attendance:SE359.Q21:2026-03-01 23521476`
  - `BITCOUNT attendance:SE359.Q21:2026-03-01`
  - `BITFIELD attendance:SE359.Q21:2026-03-01 GET u8 23521476`
  - `BITOP OR attendance:SE359.Q21:2026-03-01 attendance:SE359.Q21:2026-03-02 attendance:SE359.Q21:present`

## Section 3: Advanced Patterns & Data Structures (5 mins)

- Caching
  - Cache aside: https://images.viblo.asia/5e812aa3-0d82-4e71-bc64-ab1deaf733d7.png
  - Read through: https://images.viblo.asia/8e7b044d-1732-4f3a-8512-cf6711fbad04.png
  - Write through: https://images.viblo.asia/3d6358f8-6af6-4abd-aded-948797ef2731.png
  - Write back: https://images.viblo.asia/383eae8c-acd1-42d4-a28e-88e15da2fc04.png
  - Sources of above images: [Viblo - Sử dụng Redis làm cache để tăng tốc độ truy vấn](https://viblo.asia/p/su-dung-redis-lam-cache-de-tang-toc-do-truy-van-GrLZD0dwZk0)
- Pub/Sub vs. Streams
  - Visual Element: Diagram showing "Fire-and-Forget" (Pub/Sub) vs. "Append-only Log with Consumer Groups" (Streams)
  - Code Snippet (Pub/Sub): `PUBLISH alerts:uit "Trời mưa, sảnh B trơn trượt!"` (Real-time, no persistence)
  - Code Snippet (Streams): `XADD enrollments * student_id 23521476 course_id SE121.Q21` (Persistent, async processing by workers)
- RedisJSON & RediSearch
  - Visual Element: Diagram of a JSON document being indexed into a RediSearch inverted index
  - Code Snippet:
    - Store: `JSON.SET student:23521476 $ '{"name":"Đặng Phú Thiện", "gpa": 9.2, "cohort":"23"}'`
    - Search: `FT.SEARCH idx:students "@cohort:[23 23] @gpa:[8.0 +inf]"` (Find all K23 students with GPA >= 8.0)

## Section 4: Persistence, Durability & ACID (3 mins)

Focus: Dispelling the "Redis loses data when it restarts" myth

- Sub-section A: Persistence (RDB vs AOF)
  - Visual Element: A balance scale showing RDB (Snapshots, fast restart, slight data loss risk) vs. AOF (Append Only File, log of every command, larger file). Note the "Hybrid" best practice
- Sub-section B: Transactions (MULTI/EXEC/WATCH)
  - Visual Element: Timeline diagram showing Optimistic Locking (WATCH)
  - Code Snippet (Safe Course Registration):
    ```
    WATCH course:SE121.Q21:seats
    MULTI
    DECR course:SE121.Q21:seats
    SADD course:SE121.Q21:students "23521476"
    EXEC
    ```

## Section 5: Ecosystem & Cloud Native (Brief - 1.5 mins)

Focus: Modern deployment realities

- Visual Element: Logos of Redis, Valkey, DragonflyDB, Kubernetes
- Talking Points:
  - K8s: Redis Enterprise Operator exists but not free. OSS Redis: Helm charts (Bitnami) or [Redis Operator from OT Container Kit](https://ot-container-kit.github.io/redis-operator/)
  - Alternatives: Valkey (Linux Foundation fork, drop-in replacement), DragonflyDB (multi-threaded, highly performant alternative)
    - Benchmarks: https://github.com/centminmod/redis-comparison-benchmarks
    - Import some images (source: https://github.com/centminmod/redis-comparison-benchmarks):
      - Multi thread: https://github.com/centminmod/redis-comparison-benchmarks/raw/master/results/benchmarks-v5-host-4t-jun7-2025/advcharts-comparison-stack.png
      - Throughput: https://github.com/centminmod/redis-comparison-benchmarks/raw/master/results/benchmarks-v5-host-4t-jun7-2025/advcharts-comparison.png
      - Latency: https://github.com/centminmod/redis-comparison-benchmarks/raw/master/results/benchmarks-v5-host-4t-jun7-2025/advcharts-latency-dist.png

## Section 6: Real Project Design - UIT Course Manager (4 mins)

Focus: Architecture and API Design using Node.js + Redis OM

- Visual Element: Architecture Diagram: Frontend -> Node.js Backend -> Redis Stack (RedisJSON + RediSearch)
- OpenAPI Specification (YAML): Showcase this heavily on the slide to prove how we map REST to Redis

```yaml
openapi: 3.0.0
info:
  title: UIT Course & Student Manager API
  version: 0.0.0
  description: CRUD API powered by Redis Stack (RedisJSON + RediSearch) via Redis OM Node
paths:
  /students:
    post:
      summary: Add a new student (JSON.SET)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Student'
      responses:
        201:
          description: Created
  /students/{id}:
    get:
      summary: Get student by ID (JSON.GET)
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        200:
          description: OK
    patch:
      summary: Update student's fields
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                cohort:
                  type: string
                gpa:
                  type: number
      responses:
        200:
          description: OK
  /students/search:
    get:
      summary: Search students using RediSearch (FT.SEARCH)
      parameters:
        - name: cohort
          in: query
          schema:
            type: string
        - name: minGpa
          in: query
          schema:
            type: number
      responses:
        200:
          schema:
            type: array
            items:
              $ref: '#/components/schemas/Student'
components:
  schemas:
    Student:
      type: object
      properties:
        id:
          type: string
          example: '23521476'
        username:
          type: string
          example: thiendp
        name:
          type: string
          example: Đặng Phú Thiện
        cohort:
          type: string
          example: '23'
        gpa:
          type: number
          example: 9.2
```

## Section 7: Final Thoughts & Resources (1 min)

- When to use Redis: High-speed caching, leaderboards, session management, real-time streams/chat, and full-text search over JSON
- Books to Read:
  - `Redis in Action` by Josiah L. Carlson (Great for core concepts)
  - `Redis Essentials` by Maxwell Dayvson Da Silva (Great for design patterns)
  - `Redis Deep Dive` (Good for architecture)
