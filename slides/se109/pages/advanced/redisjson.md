---
hideInToc: true
---

# RedisJSON — Native JSON Documents

Store, query, and atomically update **nested JSON** without serializing the whole document.

```
student:23521476  →  {
  "id": "23521476",
  "name": "Đặng Phú Thiện",
  "gpa": 9.2,
  "enrollments": ["SE332.Q21", "SE121.Q21"]
}
```

**JSONPath** (`$`) lets you target any field or array element atomically.

<!--
- Without RedisJSON: store as string, fetch entire doc, deserialize, modify, re-serialize, SET
- With RedisJSON: atomic path-level operations, no round-trip overhead
- Part of Redis Stack; available in Redis Cloud
-->

---
hideInToc: true
---

# RedisJSON — JSON.SET / JSON.GET

<<<@/snippets/redisjson-basic sh {1-3|1-5|1-8|1-11}

<!--
- JSON.SET with $ = set root document
- JSON.GET returns JSON string; path expressions filter fields
- Supports arrays, nested objects, scalars
-->

---
hideInToc: true
---

# RedisJSON — Atomic Updates

<<<@/snippets/redisjson-update sh {1-3|1-5|1-8|1-11|1-14}

<div v-click class="mt-4 p-3 bg-green-50 rounded border border-green-200 text-sm">

All operations are **atomic at the path level** — no need for `WATCH`/`MULTI`/`EXEC` for document mutations.

</div>

<!--
- JSON.SET $.gpa: update only the gpa field, rest of document untouched
- JSON.ARRAPPEND: push to array without fetching the whole doc
- JSON.NUMINCRBY: atomic numeric increment on nested field
- Best for: user profiles, course configs, complex documents
-->
