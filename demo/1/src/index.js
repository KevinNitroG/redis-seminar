/**
 * UIT Course & Student Manager — Express.js Server
 *
 * Tech stack:
 *   - Express.js 5 (backend)
 *   - Redis Stack (RedisJSON + RediSearch + Streams)
 *   - redis-om (ORM for Redis)
 *   - Static HTML/CSS frontend served from /public
 */

import express from 'express';
import { connectRedis } from './db.js';
import { createIndexes } from './repositories.js';
import studentRoutes from './routes/students.js';
import courseRoutes from './routes/courses.js';

const PORT = process.env.PORT || 3000;
const app = express();

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.static('public'));

// ─── CORS for development ───────────────────────────────────────────────────
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use('/students', studentRoutes);
app.use('/courses', courseRoutes);

// ─── Health check ───────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Start server ───────────────────────────────────────────────────────────
async function start() {
  try {
    await connectRedis();
    await createIndexes();
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📊 API endpoints:`);
      console.log(`   GET/POST          /students`);
      console.log(`   GET/PATCH/PUT/DEL /students/:id`);
      console.log(`   GET               /students/search?query=...`);
      console.log(`   GET/POST          /courses`);
      console.log(`   GET/PATCH/PUT/DEL /courses/:id`);
      console.log(`   GET               /courses/search?query=...`);
      console.log(`   POST              /courses/:id/students`);
      console.log(`   GET               /courses/:id/students`);
      console.log(`   DELETE            /courses/:id/students/:studentId`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

start();
