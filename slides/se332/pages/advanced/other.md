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
Ngoài các cấu trúc dữ liệu quen thuộc, Redis còn sở hữu những "vũ khí bí mật" cực kỳ mạnh mẽ dành cho bài toán dữ liệu quy mô lớn (Big Data). Đó chính là các cấu trúc dữ liệu xác suất (Probabilistic Data Structures).

Điểm chung của các cấu trúc này là sự đánh đổi: chấp nhận một tỷ lệ sai số vô cùng nhỏ (thường dưới 1%) để đổi lấy hiệu năng xử lý siêu việt và mức tiêu thụ RAM tối thiểu ở mức O(1) — nghĩa là dung lượng RAM cố định, không hề tăng lên dù lượng dữ liệu đầu vào có lên tới hàng trăm triệu bản ghi.

1. **HyperLogLog**: Giúp đếm các phần tử không trùng lặp (Cardinality Estimation). Ví dụ, để đếm lượng sinh viên truy cập cổng UIT hàng ngày, nếu dùng Set truyền thống cho 10 triệu người dùng sẽ tiêu tốn hàng trăm MB RAM. Nhưng với HyperLogLog, ta chỉ tốn đúng 12 KB bộ nhớ cố định với tỷ lệ sai số cực nhỏ 0.81%.
2. **Bloom Filter**: Phục vụ kiểm tra sự tồn tại của phần tử (Membership Testing). Trước khi thực hiện truy vấn đắt đỏ xuống DB (như PostgreSQL), ta check qua Bloom Filter. Nếu nó báo "Không tồn tại", chắc chắn 100% phần tử không có và ta từ chối request ngay để bảo vệ DB. Nếu báo "Có", ta mới tiếp tục query xuống DB.
3. **Top-K và Count-Min Sketch (CMS)**: Hỗ trợ theo dõi tần suất xuất hiện và xếp hạng độ phổ biến của phần tử theo thời gian thực (ví dụ môn học được tìm nhiều nhất tại UIT) trong một không gian RAM cố định.
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
Xu hướng công nghệ AI và mô hình ngôn ngữ lớn (LLM) đang rất bùng nổ, và Redis Stack hiện tại đã trở thành một cơ sở dữ liệu Vector (Vector Database) thực thụ chạy trực tiếp trong RAM với thuật toán ANN (HNSW/FLAT) tối ưu cao.

Tìm kiếm Vector (VSS) cho phép ta tìm kiếm thông tin dựa trên ý nghĩa ngữ nghĩa (semantic similarity) thay vì chỉ so khớp từ khóa chính xác. Các đoạn văn bản sẽ được chuyển đổi thành các chuỗi số thực nhiều chiều (embeddings vector) trong Redis.

Hãy hình dung kịch bản UIT Chatbot tư vấn học tập: Sinh viên hỏi "tìm môn về lập trình di động", AI sẽ dịch câu hỏi thành vector. Redis sẽ tính khoảng cách vector và trả về ngay môn "Lập trình ứng dụng trên thiết bị di động" hay "Thiết kế giao diện di động" tức thì, dù câu hỏi không chứa từ khóa khớp chính xác.

Đặc biệt, Redis vượt trội nhờ khả năng truy vấn kết hợp (Hybrid Query). Bạn có thể vừa tìm kiếm ngữ nghĩa tương tự môn "Web Development", vừa lọc thêm các điều kiện có cấu trúc (ví dụ: giảng dạy bằng tiếng Anh, lớp còn chỗ, và có số tín chỉ bằng 3). Tất cả được Redis thực thi đồng thời và nguyên tử chỉ trong một câu query duy nhất, mang lại hiệu năng tối ưu tuyệt đối.
-->

---
hideInToc: true
layout: figure
figureUrl: https://cdn.sanity.io/images/sy1jschh/production/40954abf490e6598d3a1cad0bd5503d3386e7faf-655x450.svg
figureCaption: 'Redis vector search performance benchmark: Throughput vs. Latency'
---

## Benchmark: Vector Search Performance

<!--
Để minh chứng cho hiệu năng vượt trội, hãy cùng nhìn vào biểu đồ benchmark tìm kiếm vector của Redis ở trên slide.

Biểu đồ so sánh throughput (số lượng câu truy vấn/giây) và latency (độ trễ phản hồi/mili-giây) của Redis với các giải pháp khác. Dù cơ sở dữ liệu chứa hàng triệu vector và chịu tải truy cập cực kỳ nặng nề, Redis vẫn duy trì throughput vượt trội với độ trễ phản hồi luôn ở mức dưới 1 mili-giây.

Độ trễ cực thấp này biến Redis thành sự lựa chọn hàng đầu cho các ứng dụng chatbot AI thời gian thực, hệ thống gợi ý sản phẩm và các ứng dụng RAG. Qua đó, Redis đã thực sự tiến hóa từ một giải pháp cache đơn giản thành một cơ sở dữ liệu đa mô hình (multi-model database) hiện đại.
-->
