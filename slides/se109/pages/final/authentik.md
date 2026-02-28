---
hideInToc: true
---

# Case Study: Authentik Removed Redis

Sometimes simplicity wins over performance.

```mermaid
graph TD
    subgraph "Previous Architecture (Pre-2025.10)"
        U1([User / Browser]) --> R1[Authentik Server\nRouter & Core]
        R1 <--> DB1[(PostgreSQL\nConfig & Data)]
        R1 <--> Cache[(Redis\nCache · Sessions · WebSockets)]
        W1[Authentik Worker\nBackground Tasks] <--> DB1
        W1 <--> Cache
    end

    subgraph "Current Architecture (2025.10+)"
        U2([User / Browser]) --> R2[Authentik Server\nRouter & Core]
        R2 <--> DB2[(PostgreSQL\nConfig · Data · Cache\nSessions · WebSockets · Tasks)]
        W2[Authentik Worker\nBackground Tasks] <--> DB2
    end
```

<div v-click class="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200 text-sm">

**Lesson**: Redis adds operational complexity. Only add it when the performance gain justifies it.

</div>

<!--
- Authentik is an open-source Identity Provider
- They removed Redis to simplify deployment (fewer containers to manage)
- PostgreSQL LISTEN/NOTIFY replaced Pub/Sub; pg cache replaced Redis cache
- Tradeoff: slightly higher latency, much simpler ops
-->
