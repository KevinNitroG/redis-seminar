---
hideInToc: true
---

# Bitmaps

Not a separate type — a **String treated as an array of bits**. 1 bit per state.

```
Student offset:  0=Tân   1=Minh   2=Bình
attend:SE332:2026-03-01  →  [ 1 | 0 | 1 | 0 | 0 | ... ]
                               ↑         ↑
                             Present   Present
```

<!--
- Physically a string, accessed bit-by-bit
- 100 students × 100 days = 12.5 KB vs 40 KB with bool/int fields
- Ideal for: attendance, feature flags, user online status
-->

---
hideInToc: true
---

# Bitmaps — SETBIT / GETBIT / BITCOUNT

<<<@/snippets/bitmaps sh {1-2|1-5|1-8|1-11|1-14}

<div v-click class="mt-4 grid grid-cols-2 gap-4 text-sm">

<div class="p-3 bg-green-50 rounded border border-green-200">

**Space efficient**
100 students × 100 days = **12.5 KB**
(vs 40 KB with bool fields)

</div>

<div class="p-3 bg-blue-50 rounded border border-blue-200">

**BITOP**: `AND`, `OR`, `XOR`, `NOT`
Combine attendance patterns across days

</div>

</div>

<!--
- SETBIT/GETBIT: O(1)
- BITCOUNT: O(N) — counts set bits across range
- BITOP: combine multiple bitmaps — "who was present all week?"
-->
