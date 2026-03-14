---
hideInToc: true
---

## Case Study: Authentik Removed Redis

<div class="grid grid-cols-2 gap-8 mt-4">

<div>

**Before (Pre-2025.10)**

```mermaid
graph TD
  U1([User / Browser]) --> R1[Authentik Server <br> Router & Core]
  R1 <--> DB1[(PostgreSQL <br> Config & Data)]
  R1 <--> Cache[(Redis <br> Cache, Sessions, WebSockets)]
  W1[Authentik Worker <br> Background Tasks] <--> DB1
  W1 <--> Cache
```

</div>

<div>

**After (2025.10+)**

```mermaid
graph TD
  U2([User / Browser]) --> R2[Authentik Server <br> Router & Core]
  R2 <--> DB2[(PostgreSQL <br> Config, Data, Cache, <br> Sessions, WebSockets, Tasks)]
  W2[Authentik Worker <br> Background Tasks] <--> DB2
```

</div>

</div>

<div v-click class="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mt-4 text-center text-sm">

**Lesson:** Redis adds operational complexity — only adopt when the performance gain justifies it

</div>

<!--
Authentik (open-source identity provider) removed Redis in favor of using PostgreSQL alone to reduce operational complexity.
The lesson: don't add infrastructure you don't need. Redis is powerful, but only when the use case warrants it.
-->
