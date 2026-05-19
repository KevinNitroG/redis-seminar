---
layout: figure
figureUrl: /demo/06-student-search.png
figureCaption: RediSearch powers autocomplete and fuzzy student search.
hideInToc: true
---

<!--
- Demo bước 3: ở tab Students, gõ `thie` vào search box.
- Nói RediSearch index các field `name`, `username`, `cohort`, `gpa` của Student JSON.
- Backend build query raw `FT.SEARCH Student:index` để kết hợp prefix search, fuzzy search, filter cohort và range GPA.
- Có thể gõ sai nhẹ để nói fuzzy search giúp UX tốt hơn autocomplete bình thường.
-->

---
hideInToc: true
---

## Search Query Behind the UI

```sh
# Prefix / autocomplete
FT.SEARCH Student:index "(@name:thie*|@username:thie*)"

# Combine text + filter + numeric range
FT.SEARCH Student:index "@cohort:{23} @gpa:[8 +inf]" \
  SORTBY gpa DESC

# Course search uses another index
FT.SEARCH Course:index "(@name:redis*|@lecturerName:redis*)"
```

<!--
- Dùng slide này để giải thích tại sao search nhanh: Redis không scan toàn bộ JSON document.
- RediSearch index field text và number nên có thể combine nhiều điều kiện trong một query.
- Prefix query phục vụ autocomplete; numeric range phục vụ lọc GPA.
- Nhắc nhẹ: trong demo backend dùng raw `FT.SEARCH` để kiểm soát query rõ hơn.
-->
