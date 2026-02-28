---
hideInToc: true
---

# Strings

The simplest type — a key mapping to a binary-safe value (max 512 MB).

<div class="text-center my-4">

![SET command railroad](https://redis.io/docs/latest/images/railroad/set.svg)

</div>

<!--
- Most versatile type: counters, session tokens, serialized JSON, flags
- EX sets TTL in seconds; NX = only set if key doesn't exist
- O(1) for GET/SET
-->

---
hideInToc: true
---

# Strings — SET / GET / DEL

<<<@/snippets/strings-basic sh {1-2|1-5|1-8|1-11}

<!--
- EX 3600: key expires in 1 hour — automatic TTL management
- NX: atomic check-and-set — safe for distributed locks / race-free init
- GET on missing key returns nil
- DEL returns count of deleted keys
-->

---
hideInToc: true
---

# Strings — MSET / MGET / Secondary Index

<<<@/snippets/strings-mset sh {1-2|1-5|1-9}

<div v-click class="mt-4 p-3 bg-blue-50 rounded border border-blue-200 text-sm">

**Pattern**: `SET student:username:maipht "24521574"` is a **secondary index** — look up ID by username in O(1).

</div>

<!--
- MSET/MGET: atomic multi-key read/write, O(N) where N = number of keys
- Flat keyspace: namespacing by convention, colon-separated
- Secondary index pattern: reverse mapping for O(1) lookups
-->
