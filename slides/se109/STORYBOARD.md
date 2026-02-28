# Redis as a Primary Database

Data for student, courses with lecturer is at [data.json](./data.json)

Target Time: 10 Minutes

Audience: University Students & Lecturer

## Section 1: Introduction to Redis (Brief)

Focus: Fast context setting

- Visual Element: A mind map or a side-by-side comparison diagram (Disk-based DB like MongoDB vs. In-memory DB like Redis)
- Key Bullets:
  - What: REmote DIctionary Server. In-memory, key-value data structure store
  - Why: Sub-millisecond latency. Single-threaded event loop (no lock contention)
  - History (Brief): Created by Salvatore Sanfilippo (antirez) for real-time analytics. Evolved from a simple cache to a multi-model database
  - License Shift:
    - ```mermaid
        graph LR
          subgraph OSS [Open Source]
          V72[Redis 7.2 and Prior] --> BSD(BSD 3-Clause License)
          end

          subgraph SA [Source Available]
          V74[Redis 7.4 and Future] --> DUAL(Dual License: RSALv2 / SSPLv1)
          end

          OSS -->|March 2024 Transition| SA

          style OSS fill:#f9f9f9,stroke:#333,stroke-dasharray: 5 5
          style SA fill:#fff4f4,stroke:#dc3545,stroke-width:2px
          style V72 fill:#d4edda
          style V74 fill:#f8d7da
      ```

      > https://redis.io/blog/what-redis-license-change-means-for-our-managed-service-providers/
      > https://redis.io/blog/agplv3/

  - Keep in mind redis is key value, and the keyspace is flat

## Section 2: Core Data Types & Commands (UIT Context)

Focus: Fast-paced syntax, code snippets showing how data maps to Redis. Each command shows time complexity, output of command

### Strings

- Visual Element: Key-Value memory block diagram
- Code Snippet:
  ```
  SET course:SE332.Q21 "Chuyên đề CSDL nâng cao" EX 3600 NX
  GET course:SE332.Q21
  DEL course:SE332.Q21
  GET course:SE109.Q21
  MSET student:24521574:name "Mai Phú Tân" students:24521574:username "maipht" student:24521574:cohort "24" student:24521574:gpa "6"
  MGET student:24521574:name student:24521574:username
  SET student:username:maipht "24521574"
  ```
  > Highlight EX for TTL/expiration, NX
  > Return value: OK if set, nil if not set
  > This is a common pattern for secondary indexes (username -> student ID)

### Hashes

- Visual Element: Flat object memory block
- Code Snippet:
  ```
  HSET student:24521574 name "Mai Phú Tân" username "tanmp" cohort "24" gpa "6"
  HGETALL student:24521574
  HGET student:24521574 name
  HMGET student:24521574 name gpa
  GET student:24521574   # Wrong data type
  INCRBYFLOAT student:24521574 gpa 0.5   # Update GPA to 6.5
  ```

### Sets

- Visual Element: Unique enrollment block diagram
- Code Snippet:
  ```
  SADD course:SE121.Q21:students "23521476" "23520952"
  SMEMBERS course:SE121.Q21:students
  SISMEMBER course:SE121.Q21:students "23521476"
  SCARD course:SE121.Q21:students
  SREM course:SE121.Q21:students "23520952"
  ```

### Sorted Sets (ZSET)

- Visual Element: Leaderboard diagram
- Code Snippet:
  ```
  ZADD leaderboard:gpa:cohort23 9.2 "23521476" 9.0 "23520952" 8.9 "23521049" 8.5 "23520161"
  ZRANGE leaderboard:gpa:cohort23 0 -1 WITHSCORES
  ZREVRANGE leaderboard:gpa:cohort23 0 2 WITHSCORES
  # Note other commands like ZINCRBY for updating scores, ZREM, ZCARD just like Sets
  ```

### Bitmaps

- Visual Element: Attendance calendar grid showing student presence (1 = present, 0 = absent) across class sessions
- Use Case: Efficient attendance tracking, quick presence verification, historical analysis
- Code Snippet:

  ```
  # Each student gets a fixed ID offset (e.g., Tân = 0, Minh = 1, Bình = 2)
  # Mark attendance for SE332.Q21 on March 1st, 2026

  SETBIT attend:SE332:2026-03-01 0 1   # Tân: Present (1)
  SETBIT attend:SE332:2026-03-01 1 0   # Minh: Absent (0)
  SETBIT attend:SE332:2026-03-01 2 1   # Bình: Present (1)

  # Check if Minh was present
  GETBIT attend:SE332:2026-03-01 1
  # Output: (integer) 0

  # Count total students present today (O(N) fast counting)
  BITCOUNT attend:SE332:2026-03-01
  # Output: (integer) 2
  ```

- Key Points:
  - Space-efficient: 1 bit per student per day (vs. boolean field = 1 byte)
  - For 100 students, 100 days = 12.5 KB (vs. 40 KB with regular bool/int fields)
  - BITCOUNT: O(N) fast presence counting
  - BITOP: Combine attendance patterns (both present, at least one present, etc.)
  - Perfect for: Attendance tracking, feature flags, user online status, historical analytics

## Section 3: Advanced Patterns & Data Structures

### Caching

- Cache aside: https://images.viblo.asia/5e812aa3-0d82-4e71-bc64-ab1deaf733d7.png
- Read through: https://images.viblo.asia/8e7b044d-1732-4f3a-8512-cf6711fbad04.png
- Write through: https://images.viblo.asia/3d6358f8-6af6-4abd-aded-948797ef2731.png
- Write back: https://images.viblo.asia/383eae8c-acd1-42d4-a28e-88e15da2fc04.png
- Sources of above images: [Viblo - Sử dụng Redis làm cache để tăng tốc độ truy vấn](https://viblo.asia/p/su-dung-redis-lam-cache-de-tang-toc-do-truy-van-GrLZD0dwZk0)

### Pub/Sub

- Visual Element: Diagram showing "Fire-and-Forget" messaging pattern with multiple subscribers listening to course events
- Use Case: Real-time notifications for deadlines, exam announcements, course updates (no persistence)
- Code Snippets:

  ```
  # Publisher: Lecturer announces assignment deadline for SE332.Q21
  PUBLISH course:SE332.Q21:deadline "Assignment 3 deadline: 2026-03-15 23:59. Submit via portal"

  # Subscriber 1: Student thiendp's mobile app listening
  SUBSCRIBE course:SE332.Q21:deadline
  # Receives: "Assignment 3 deadline: 2026-03-15 23:59. Submit via portal"

  # Subscriber 2: Student minhpl's web app listening
  SUBSCRIBE course:SE332.Q21:deadline
  # Receives: "Assignment 3 deadline: 2026-03-15 23:59. Submit via portal"

  # Publisher: Course exam announced
  PUBLISH course:SE121.Q21:exam "Final exam scheduled for 2026-04-20 14:00. Room: A101"

  # Multiple students subscribed to exam notifications
  SUBSCRIBE course:SE121.Q21:exam

  # Publisher: Grade released notification
  PUBLISH student:23521476:grades "Midterm grades for SE332.Q21 posted. Check portal now!"

  # Publisher: Course cancellation alert
  PUBLISH course:SE359.Q21:alert "SE359.Q21 cancelled due to insufficient enrollment"

  # Pattern subscription: Student listening to ALL course deadlines
  PSUBSCRIBE course:*:deadline

  # Pattern subscription: Lecturer monitoring ALL student notifications
  PSUBSCRIBE student:*:grades
  ```

- Key Points:
  - Messages delivered to all connected subscribers at publish time
  - If no subscribers, message is lost (fire-and-forget)
  - Perfect for urgent, real-time events: deadline reminders, exam announcements, grade releases
  - Best for: Real-time notifications, alerts, live updates
- socket.io Redis Adapter: https://raw.githubusercontent.com/socketio/socket.io-redis-adapter/main/assets/adapter.png

### RedisJSON

- Use Case: Complex nested documents, atomic updates, structured data
- Code Snippets:

  ```
  # Store complete student profile as JSON
  JSON.SET student:23521476 $ '{"id":"23521476","username":"thiendp","name":"Đặng Phú Thiện","cohort":"23","gpa":9.2,"enrollments":["SE332.Q21","SE121.Q21","SE359.Q21"]}'

  # Retrieve full student object
  JSON.GET student:23521476

  # Get only name and cohort
  JSON.GET student:23521476 $.name $.cohort

  # Update GPA atomically
  JSON.SET student:23521476 $.gpa 9.3

  # Add new enrollment to existing array
  JSON.ARRAPPEND student:23521476 $.enrollments '"SE113.Q11"'

  # Store course with detailed structure
  JSON.SET course:SE332.Q21 $ '{"id":"SE332.Q21","name":"Chuyên đề CSDL nâng cao","lecturer":{"name":"Trần Thị Hồng Yến"},"capacity":30,"enrolled":3,"students":["23521476","23520952","23521049"]}'

  # Get course lecturer name
  JSON.GET course:SE332.Q21 $.lecturer.name

  # Increment enrolled count
  JSON.NUMINCRBY course:SE332.Q21 $.enrolled 1

  # Get all students in course
  JSON.GET course:SE332.Q21 $.students

  # Get course capacity check
  JSON.GET course:SE332.Q21 $.capacity $.enrolled
  ```

- Key Points:
  - Atomic operations on nested data (no need for multiple commands)
  - Supports arrays, objects, scalars
  - Commands are atomic at JSON path level
  - Best for: User profiles, configurations, complex documents

### Other

- Redis supports geospatial, time-series, probabilistic (HyperLogLog, Cuckoo Filter, Count-min sketch, Top-K, t-digest), Vector Set, Stream, RediSearch but we will skip for brevity
- Redis vector database benchmarks: https://cdn.sanity.io/images/sy1jschh/production/40954abf490e6598d3a1cad0bd5503d3386e7faf-655x450.svg

## Section 4: Persistence, Durability & ACID

Focus: Dispelling the "Redis loses data when it restarts" myth

### Persistence (RDB vs AOF)

- Visual Element:
  - A balance scale showing RDB (Snapshots, fast restart, slight data loss risk)
  - AOF (Append Only File, log of every command, larger file). Note the "Hybrid" best practice

### Transactions (MULTI/EXEC/WATCH)

#### Case 1: Successful Enrollment (No interference)

The student checks for a seat, and since no one else is registering at that exact microsecond, the registration completes.

```
# Initial state: seats = 1
WATCH course:SE121.Q21:seats

# Logic: App checks if seats > 0 (it is)
MULTI
DECR course:SE121.Q21:seats
SADD course:SE121.Q21:students "23521476"
EXEC
# Output:
# 1) (integer) 0
# 2) (integer) 1
# Success! The commands were executed atomically.
```

### Race Condition: The "Double-Booking" Problem

| Time   | Student A (Client 1)             | Student B (Client 2)      | Redis State / Result        |
| :----- | :------------------------------- | :------------------------ | :-------------------------- |
| **T1** | `WATCH course:SE121:seats`       |                           | Monitoring `seats` key      |
| **T2** |                                  | `DECR course:SE121:seats` | **Seat taken by Student B** |
| **T3** | `MULTI`                          |                           | Transaction starts          |
| **T4** | `DECR course:SE121:seats`        |                           | Command queued              |
| **T5** | `SADD course:SE121:students "A"` |                           | Command queued              |
| **T6** | `EXEC`                           |                           | **Returns (nil)**           |

> In slide design, show 2 code block with two columns layout

## Section 5: Ecosystem & Cloud Native (Brief - 1.5 mins)

- Visual Element: Logos of Redis, Valkey, DragonflyDB, Kubernetes
- Talking Points:
  - K8s:
    - Redis Enterprise Operator exists but not free
    - Helm charts (Bitnami) (no maintained)
    - [Redis Operator from OT Container Kit](https://ot-container-kit.github.io/redis-operator/) (auto tls, scale)
      > Architecture: https://ot-container-kit.github.io/redis-operator/assets/img/redis-operator-architecture.ae3c73c9.png
      > Standalone: https://ot-container-kit.github.io/redis-operator/assets/img/redis-standalone.a6152d9b.png
      > Cluster: https://ot-container-kit.github.io/redis-operator/assets/img/redis-cluster-setup.c1d7206d.png
  - Alternatives: Valkey (Linux Foundation fork, drop-in replacement), DragonflyDB (multi-threaded, highly performant alternative)
    - Benchmarks: https://github.com/centminmod/redis-comparison-benchmarks
    - Import some images (source: https://github.com/centminmod/redis-comparison-benchmarks):
      - Multi thread: https://github.com/centminmod/redis-comparison-benchmarks/raw/master/results/benchmarks-v5-host-4t-jun7-2025/advcharts-comparison-stack.png
      - Throughput: https://github.com/centminmod/redis-comparison-benchmarks/raw/master/results/benchmarks-v5-host-4t-jun7-2025/advcharts-comparison.png
      - Latency: https://github.com/centminmod/redis-comparison-benchmarks/raw/master/results/benchmarks-v5-host-4t-jun7-2025/advcharts-latency-dist.png

## Section 6: Final Thoughts & Resources (1 min)

- When to use Redis: High-speed caching, leaderboards, session management, real-time streams/chat, and full-text search over JSON
- Authentik removed Redis (simplicity dev & deploy):

  ```
  graph TD
      subgraph "Previous Architecture (Pre-2025.10)"
          U1([User / Browser]) --> R1[Authentik Server <br> Router & Core]

          R1 <--> DB1[(PostgreSQL <br> Config & Data)]
          R1 <--> Cache[(Redis <br> Cache, Sessions, WebSockets)]

          W1[Authentik Worker <br> Background Tasks] <--> DB1
          W1 <--> Cache
      end

      subgraph "Current Architecture (2025.10+)"
          U2([User / Browser]) --> R2[Authentik Server <br> Router & Core]

          R2 <--> DB2[(PostgreSQL <br> Config, Data, Cache, <br> Sessions, WebSockets, Tasks)]

          W2[Authentik Worker <br> Background Tasks] <--> DB2
      end
  ```

- Books to Read:
  - `Redis in Action` by Josiah L. Carlson (Great for core concepts)
  - `Redis Essentials` by Maxwell Dayvson Da Silva (Great for design patterns)
  - `Redis Deep Dive` (Good for architecture)
