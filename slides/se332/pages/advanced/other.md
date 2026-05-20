---
hideInToc: true
---

## Beyond the Basics — Probabilistic Structures

Trade a tiny, controlled margin of error (under 1%) for massive memory savings (**O(1) space complexity**).

| Structure | Purpose | UIT Scenario | Key Metric |
| :--- | :--- | :--- | :--- |
| **HyperLogLog** | Cardinality estimation | Count unique portal visitors daily | 10M+ uniques in just **12 KB** (0.81% error) |
| **Bloom Filter** | Membership testing | Check if Student ID exists before hitting DB | Instantly rejects non-existent IDs |
| **Top-K / CMS** | Frequency & popularity | Track most-searched courses in real time | O(1) space, dynamic ranking |

<!--
Tiếp theo là các cấu trúc dữ liệu xác suất (Probabilistic Data Structures) dành cho Big Data.

Điểm cốt lõi: Chấp nhận sai số siêu nhỏ (<1%) để đổi lấy mức tiêu thụ RAM cố định (O(1)), giải quyết hàng trăm triệu bản ghi mà không phình bộ nhớ.

1. HyperLogLog: Đếm số lượng phần tử duy nhất. Thay vì tốn hàng trăm MB dùng Set để đếm 10 triệu sinh viên, HyperLogLog chỉ tốn đúng 12 KB (sai số 0.81%).
2. Bloom Filter: Màng lọc kiểm tra sự tồn tại trước khi gọi DB. Nếu báo "Không tồn tại" -> chắc chắn 100% không có, chặn request sớm. Báo "Có" mới query DB.
3. Top-K / CMS: Đếm tần suất và xếp hạng thời gian thực (như môn học hot nhất UIT) bằng dung lượng RAM rất nhỏ.
-->

---
hideInToc: true
layout: two-cols-header
layoutClass: gap-6
---

## Beyond the Basics — Vector Search & AI

Perform sub-millisecond semantic similarity searches for modern AI and RAG applications.

::left::

### Redis as a Vector DB

<div class="bg-blue-50 border border-blue-300 rounded-lg p-4 text-sm">

- **Vector Similarity Search (VSS):** Native Approximate Nearest Neighbors (ANN) using **HNSW** and **FLAT** algorithms.
- **UIT Chatbot Scenario:** Student asks *"tìm môn về lập trình di động"* → AI translates query to vector → Redis returns semantic matches instantly.

</div>

::right::

### Hybrid Query Capability

<div class="bg-green-50 border border-green-300 rounded-lg p-4 text-sm">

Combine vector similarity and metadata filtering:

> *"Find courses similar to 'Web Development' taught in English, worth 3 credits, with open seats."*

- **Pre-filtering:** `capacity > 0`, `credits = 3`, `language = English`.
- **Semantic Sort:** Vector match in one pass.

</div>

<!--
Redis Stack hiện đã là một Vector Database thực thụ chạy trên RAM.

Tìm kiếm Vector (VSS) cho phép tìm thông tin theo ngữ nghĩa (semantic) thay vì chỉ khớp từ khóa. Ví dụ: Chatbot UIT nhận câu hỏi "tìm môn về mobile", AI dịch thành vector, Redis trả về môn "Lập trình di động" tức thì dù không khớp nguyên văn.

Điểm mạnh lớn nhất là Hybrid Query (truy vấn kết hợp): Bạn có thể vừa tìm kiếm ngữ nghĩa, vừa dùng filter truyền thống (như tín chỉ = 3, ngôn ngữ = Tiếng Anh, lớp còn chỗ). Tất cả thực thi đồng thời trong 1 câu truy vấn với hiệu năng cực cao.
-->

---
hideInToc: true
layout: figure
figureUrl: https://cdn.sanity.io/images/sy1jschh/production/40954abf490e6598d3a1cad0bd5503d3386e7faf-655x450.svg
figureCaption: 'Redis vector search performance benchmark: Throughput vs. Latency'
---

## Benchmark: Vector Search Performance

<!--
Biểu đồ benchmark này minh chứng hiệu năng của Redis Vector Search. 

Dù chứa hàng triệu vector và chịu tải cao, Redis vẫn duy trì throughput (số truy vấn/giây) vượt trội, trong khi độ trễ (latency) luôn nằm dưới 1 mili-giây.

Tốc độ này biến Redis thành lựa chọn hàng đầu cho Chatbot AI thời gian thực và ứng dụng RAG, khẳng định vị thế cơ sở dữ liệu đa mô hình thay vì chỉ là một cache đơn thuần.
-->
