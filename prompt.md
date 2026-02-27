I need to present redis before class, as a seminar, it is about 20 minute seminar about redis, as mainly a database, and other feature like caching, pubsub.

here is my research on redis already:

---

- need to keep in mind redis is key value
- [prefix type][action]
- keyspace

Data type:

- Strings
- Lists
- Sets
- Sorted Sets
- Hashes
- Bit Arrays
- HyperLogLogs
- Streams
- Geospatial Indexes

- show the error when getting key but not appropriate value type, or not exist, or manipulate on read only?
- If the member exists in the set, an integer 1 is returned. If the member does not exist, an integer 0 is returned.
- Hash only stores string values. But string can present string bool and number or float. So, using HINCRBY or HINCRBYFLOAT. Cannot store set list bitmap in this type. If want more flexible and nested, use redisjson

- EXPIRE, EXPIREAT <> PERSIST

- Redis stream
    - ~ approximately O(1) instead without is O(n)

So we have -, +, $, > and \*, and all have a different meaning, and most of the time, can be used in different contexts.
Each of command syntax slide should search for existing command syntax diagram and add to slidev https://redis.io/docs/latest/images/railroad/bitfield.svg

- JSON redis use jsonpath syntax (like jq?)
- vấn đề durability persistence của redis (log, snapshot)
- redis best practice https://redis.io/blog/5-key-takeaways-for-developing-with-redis/
- namespace best practice: https://oneuptime.com/blog/post/2026-01-21-redis-key-design-naming/view

- Cloud native: https://ot-container-kit.github.io/redis-operator/guide/#supported-features (tls, cloudnative tự tạo tự upgrade...?)
- redis for kubernetes is not free(enterprise)
- Authentik cũ depend redis

Redis on Flash
Redis on Flash (RoF), available with Redis Enterprise Software and Redis Enterprise Cloud, enables the database to be stored not only in RAM but also on dedicated flash memory such as a solid-state drive (SSD). With RoF, keys and data are maintained in RAM, while less frequently used values are placed in flash. Spe- cifically, hot values are maintained in RAM and warm values in flash. Redis intelligently chooses which values to place in flash with the implementation of a least recently used (LRU) algorithm.

A CLOSER LOOK AT ACID
ACID is a concept that stretches back many years across multiple iter-ations of database architectures. ACID describes fundamental charac- teristics that are needed for enterprise database systems:
• Atomicity: The ability to ensure that a write or change to data is either fully written to the database or not committed at all. In other words, no partial writes that could lead to inconsistencies in the data.
• Consistency: The data is correct both before and after a transac- tion occurs.
• Isolation: Isolation helps to ensure consistency by requiring con- current transactions to be separate from each other.
• Durability: Durability is data persistence that ensures that when a transaction is complete, it can be retrieved in the event of a system failure.

Atomicity: Redis provides transaction-related commands, including WATCH, MULTI, and EXEC. These commands ensure that operations on the database are indivisible and irreducible.
» Consistency: Only permitted writes are allowed to be performed through the validation provided by Redis.
» Isolation: Being single-threaded, each single command or transaction using MULTI/EXEC is thereby isolated.
» Durability: Redis can be configured to respond to a client write to confirm that a write operation has been written to disk
» Use it as your primary database. Redis is not just a NoSQL database. It goes well beyond NoSQL to implement numer- ous features for today’s enterprise customers. Redis is more than simple key-value storage — it provides multiple data models and multiple methods to access data. Redis can be utilized by the entire application stack within an organization.
» Cache the most frequently used pieces of data. Load data from slower data sources into Redis and provide near-instant response times. Redis keeps data in random access memory (RAM) to make retrieval fast. » Use it for session storage. Session storage requires very fast response times, both for writing data as users progress through an application and for reading that information back. For example, Redis is frequently used for shopping carts.

- Viblo about redis caching:
- https://viblo.asia/p/su-dung-redis-cache-thong-minh-trong-nodejs-yZjJYnD6LOE
- https://viblo.asia/p/su-dung-redis-lam-cache-de-tang-toc-do-truy-van-GrLZD0dwZk0 (có hình!!!)

Redis alternative: dragonflydb, valkey. Check test container

---

You will create a detail plan for storyboard, but first ask me questions to clarify the content and structure.

I need it to have redis examples arround topic of school, students. The context is university of information technology (UIT).
Student:

```
{
  "students": [
    {
      "id": "23521476",
      "name": "Đặng Phú Thiện",
      "cohort": "23",
      "gpa": 9.2
    },
    {
      "id": "23520952",
      "name": "Phan Lê Minh",
      "cohort": "23",
      "gpa": 9.0
    },
    {
      "id": "23520161",
      "name": "Trần Nguyễn Thái Bình",
      "cohort": "23",
      "gpa": 8.5
    },
    {
      "id": "23521049",
      "name": "Nguyễn Thái Gia Nguyễn",
      "cohort": "23",
      "gpa": 8.9
    },
    {
      "id": "24521574",
      "name": "Mai Phú Tân",
      "cohort": "24",
      "gpa": 6
    }
  ],
  "courses": [
    {
      "id": "PE232.Q21",
      "name": "Giáo dục thể chất 2",
      "theory": "Cao Hồng Châu"
    },
    {
      "id": "SE121.Q21",
      "name": "Đồ án 1",
      "theory": "Trần Hạnh Xuân"
    },
    {
      "id": "SE332.Q21",
      "name": "Chuyên đề CSDL nâng cao",
      "theory": "Trần Thị Hồng Yến"
    },
    {
      "id": "SE109.Q21",
      "name": "Phát triển, vận hành, bảo trì phần mềm",
      "theory": "Nguyễn Thị Thanh Trúc"
    },
    {
      "id": "SE359.Q21",
      "name": "DevOps trong phát triển phần mềm",
      "theory": "Kiệt Võ Tuấn",
      "practice": "Quan Chí Khánh An"
    },
    {
      "id": "SE361.Q21",
      "name": "Phát triển Phần mềm theo Kiến trúc Microservices",
      "theory": "Nguyễn Duy Khánh",
      "practice": "Đặng Việt Dũng"
    },
    {
      "id": "SS003.Q12",
      "name": "Tư tưởng Hồ Chí Minh",
      "theory": "Phạm Thị Thu Hương"
    },
    {
      "id": "PE231.Q15",
      "name": "Giáo dục thể chất 1"
    },
    {
      "id": "SE113.Q11",
      "name": "Kiểm chứng phần mềm",
      "theory": "Nguyễn Thị Thanh Trúc",
      "practice": ["Nguyễn Ngọc Quí", "Nguyễn Trịnh Đông"]
    },
    {
      "id": "SE313.Q11",
      "name": "Một số thuật toán thông minh",
      "theory": "Nguyễn Thị Xuân Hương"
    },
    {
      "id": "SE357.Q12",
      "name": "Kỹ thuật phân tích yêu cầu",
      "theory": "Nguyễn Trịnh Đông",
      "practice": ["Đặng Việt Dũng", "Lê Văn Tuấn"]
    },
    {
      "id": "SE358.Q12",
      "name": "Quản lý dự án Phát triển Phần mềm",
      "theory": "Lê Văn Tuấn",
      "practice": "Trần Anh Dũng"
    },
    {
      "id": "SS004.P22",
      "name": "Kỹ năng nghề nghiệp",
      "theory": "Đoàn Duy"
    },
    {
      "id": "SS008.P25",
      "name": "Kinh tế chính trị Mác – Lênin",
      "theory": "Trương Thị Thanh Thùy"
    },
    {
      "id": "SS010.P21",
      "name": "Lịch sử Đảng Cộng sản Việt Nam",
      "theory": "Nguyễn Thị Thảo"
    },
    {
      "id": "SE101.P21",
      "name": "Phương pháp mô hình hóa",
      "theory": "Nguyễn Công Hoan"
    },
    {
      "id": "SE104.P22",
      "name": "Nhập môn Công nghệ phần mềm",
      "theory": "Đỗ Thị Thanh Tuyền",
      "practice": "Đặng Việt Dũng"
    },
    {
      "id": "SE114.P23",
      "name": "Nhập môn ứng dụng di động",
      "theory": ["Nguyễn Tấn Toàn", "Trinh Huỳnh Hồ Thị Mộng"]
    }
  ]
}
```

---

I need slide should divided into parts:

- Introduction to Redis (History, what, why)
- Redis Data Types & Commands (with examples related to students and courses)
- Redis patterns and datastructures (like pubsub, stream, redisjson, redissearch, with examples related to students and courses)
- Redis Persistence and Durability, ACID, transactions (with examples related to students and courses)
- Redis in Cloud and Kubernetes (with examples related to students and courses)
- Redis opensource and enterprise features different, and opensource alternative (with examples related to students and courses)
- A real project for CRUD operations on students and courses using Redis (with code in JS backend and frontend, but first just design and the openapi spec)
- Final thoughts, when to use, learning resources (give book details from source in NotebookLM I gave you)

Please extend if need, but suite in 20 minutes presentation.

I will use slidev to create the presentation. We need to plan in detail first, just no slidev code for now.
