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
