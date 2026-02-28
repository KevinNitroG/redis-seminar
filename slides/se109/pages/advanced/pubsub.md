---
hideInToc: true
---

# Pub/Sub — Fire-and-Forget Messaging

<div class="grid grid-cols-2 gap-6 mt-2">

<div>

**Publisher** pushes to a **channel**; all connected **subscribers** receive instantly.  
No persistence — if no subscriber is listening, message is lost.

**Use Cases**

- Deadline reminders
- Exam announcements
- Grade release notifications
- Real-time alerts

</div>

<div>

![Socket.IO Redis Adapter](https://raw.githubusercontent.com/socketio/socket.io-redis-adapter/main/assets/adapter.png)

<div class="text-xs text-gray-400">Socket.IO horizontal scaling via Redis Pub/Sub</div>

</div>

</div>

<!--
- Unlike Streams/Queues: no persistence, no consumer groups
- Horizontal scaling: socket.io uses Redis as message bus between Node processes
- Pattern subscriptions (PSUBSCRIBE) allow wildcard channel matching
-->

---
hideInToc: true
---

# Pub/Sub — Commands

<<<@/snippets/pubsub sh {1-14}

<div v-click class="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200 text-sm">

**Key constraint**: `SUBSCRIBE` puts the connection in subscriber mode — it can only run `SUBSCRIBE`, `UNSUBSCRIBE`, `PSUBSCRIBE`, `PING`. Use a separate connection for publishing.

</div>

<!--
- SUBSCRIBE: blocks connection, enters listen mode
- PUBLISH returns number of subscribers that received the message
- PSUBSCRIBE: glob pattern matching — "course:*:deadline" catches all course deadlines
-->
