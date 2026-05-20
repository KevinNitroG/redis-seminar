---
layout: center
class: text-center
transition: slide-up
---

# Core Data Types & Commands

---
hideInToc: true
---

## "The Key-Value Mindset"

- **Command Structure:** `COMMAND KEY [ARGUMENTS]`
- **Key Naming Convention:** `object:id:field`
- **Technical Characteristics:**
  - **Flat Keyspace:** No table structure, direct access via Key.
  - **Single-threaded:** No need to worry about lock contention during data manipulation.
- **Example:** `student:24521574:name`

<img src="/syntax-redis.jpeg" class="w-200 h-48" />

---

## Strings (Basic Data Type)

Optimized for storing single values, allowing you to map a key to a value.

```bash
# Set only if it does not exist (NX)
SET student:login:maipht "active" NX

# Store UIT student info simultaneously (MSET)
MSET student:24521574:name "Mai Phu Tan" student:24521574:gpa "6.5"

# Increment/Decrement values
INCR student:24521574:views
INCRBY student:24521574:views 10

# Get the value of a key
GET student:24521574:name
MGET student:24521574:name student:24521574:gpa
```

---

## Hashes (Object Structure)

Store objects with multiple attributes; a single key can map to multiple fields and values.

```bash
# Create a student profile as a single Hash (HSET)
HSET student:24521574 name "Mai Phu Tan" gpa 6.5 cohort "24"

# Get all information of this student
HGETALL student:24521574

# Update information for this student
HSET student:24521574 gpa 7.0

# Get specific information of this student
HGET student:24521574 name

# Arithmetic operation
HINCRBYFLOAT student:24521574 gpa 0.5

# Existence check
HEXISTS student:24521574 cohort

# Delete operation
HDEL student:24521574 cohort
```

---

## Sets & Sorted Sets

Manage unique and ordered lists of elements.

```bash
# Add students to class SE121 (Set)
SADD course:SE121:students "23521476" "23520952"

# Add students with GPA to the leaderboard (ZSET)
ZADD leaderboard:gpa:K24 9.2 "23521476" 8.5 "24521574"

# Check and count elements
SISMEMBER course:SE121:students "24521574"
SCARD course:SE121:students

# Query the leaderboard
ZREVRANGE leaderboard:gpa:K24 0 2 WITHSCORES
ZRANK leaderboard:gpa:K24 "24521574"
```

---

## Bitmaps (Memory Optimization)

Used for attendance tracking or state monitoring.

```bash
# Attendance for SE332 on March 1st, 2026
# Tan (ID 0): Present (1)
SETBIT attend:SE332:2026-03-01 0 1

# Count total students attending today
BITCOUNT attend:SE332:2026-03-01

# Check existence
GETBIT attend:SE332:2026-03-01 0 # Returns 1 (Tan is present)

# Logical operations
BITOP AND attend:full:both_days attend:SE332:03-01 attend:SE332:03-02 # Tan attended on both day 1 and day 2
```

---

## Comparison with SQL (Visualization)

The difference between relational queries and Key-Value queries.

| Feature        | SQL (MySQL/PostgreSQL)  | Redis                      |
| :------------- | :---------------------- | :------------------------- |
| **Data Model** | Tables (Rows & Columns) | Key-Value, Data Structures |
| **Schema**     | Fixed (Strong Schema)   | Flexible (Schema-less)     |
| **Storage**    | Disk (Disk-based)       | Memory (In-memory)         |
| **Speed**      | Milliseconds (a few ms) | Sub-millisecond (< 1ms)    |
| **Querying**   | Complex SQL language    | Atomic Commands            |

---
hideInToc: true
---

## Comparison with SQL (Concrete Example)

How to shift mindset from tables to Key-Value.

**Problem: Update student GPA**

- **SQL:** Must find the row, acquire lock, write to disk.
  ```sql
  UPDATE students SET gpa = gpa + 0.5 WHERE id = '24521574';
  ```
- **Hash Update (Atomic)**
  ```bash
  HINCRBYFLOAT student:24521574 gpa 0.5
  ```

---

## Why choose Redis as a "Primary Database"?

- **Atomic Operations:** Ensure data consistency without complex locking mechanisms.
- **Rich Data Structures:** Hash, Set, ZSet, and Bitmap provide highly optimized operations that are difficult to execute efficiently in SQL.
- **Cost Optimization:** Store millions of states (e.g., attendance) in just a few MBs using Bitmaps.
- **Scalability:** Easily scalable and capable of handling massive loads for systems like Course Registration.
