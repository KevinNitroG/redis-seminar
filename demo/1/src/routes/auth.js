/**
 * Auth Routes - demo-grade login, logout, and profile editing.
 *
 * Redis commands used under the hood:
 *   POST   /auth/login  -> FT.SEARCH + SET session:<token> EX 3600
 *   POST   /auth/logout -> DEL session:<token>
 *   GET    /auth/me     -> GET session:<token> + JSON.GET Student:<id>
 *   PATCH  /auth/me     -> GET session:<token> + JSON.SET Student:<id>
 */

import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { EntityId } from 'redis-om';
import { client } from '../db.js';
import { studentRepo } from '../repositories.js';

const router = Router();
const SESSION_TTL_SECONDS = 60 * 60;
const SESSION_PREFIX = 'session:';

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Fields username and password are required',
      });
    }

    const student = await findStudentByUsername(username);
    const expectedPassword = student?.password || student?.username;

    if (!student || password !== expectedPassword) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid username or password',
      });
    }

    const token = randomUUID();
    const sessionKey = `${SESSION_PREFIX}${token}`;
    await client.set(sessionKey, JSON.stringify({
      studentId: student[EntityId] || student.studentId,
      username: student.username,
      createdAt: new Date().toISOString(),
    }), {
      EX: SESSION_TTL_SECONDS,
    });

    res.status(201).json({
      token,
      sessionKey,
      expiresIn: SESSION_TTL_SECONDS,
      user: formatProfile(student),
    });
  } catch (err) {
    console.error('POST /auth/login error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const token = getBearerToken(req);
    if (token) {
      await client.del(`${SESSION_PREFIX}${token}`);
    }
    res.status(204).send();
  } catch (err) {
    console.error('POST /auth/logout error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

router.get('/me', requireSession, async (req, res) => {
  res.json({
    sessionKey: req.session.sessionKey,
    expiresIn: SESSION_TTL_SECONDS,
    user: formatProfile(req.session.student),
  });
});

router.patch('/me', requireSession, async (req, res) => {
  try {
    const student = req.session.student;
    const { username, name, cohort, gpa } = req.body;

    if (username !== undefined) student.username = String(username).trim();
    if (name !== undefined) student.name = String(name).trim();
    if (cohort !== undefined) student.cohort = String(cohort).trim();
    if (gpa !== undefined) student.gpa = parseFloat(gpa);

    await studentRepo.save(student);

    await client.set(req.session.sessionKey, JSON.stringify({
      studentId: student[EntityId] || student.studentId,
      username: student.username,
      updatedAt: new Date().toISOString(),
    }), {
      EX: SESSION_TTL_SECONDS,
    });

    res.json({
      sessionKey: req.session.sessionKey,
      expiresIn: SESSION_TTL_SECONDS,
      user: formatProfile(student),
    });
  } catch (err) {
    console.error('PATCH /auth/me error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

async function requireSession(req, res, next) {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing bearer token',
      });
    }

    const sessionKey = `${SESSION_PREFIX}${token}`;
    const rawSession = await client.get(sessionKey);
    if (!rawSession) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Session expired or not found',
      });
    }

    const session = JSON.parse(rawSession);
    const student = await studentRepo.fetch(session.studentId);
    if (!student || !student.studentId) {
      await client.del(sessionKey);
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Session user no longer exists',
      });
    }

    await client.expire(sessionKey, SESSION_TTL_SECONDS);
    req.session = { token, sessionKey, student };
    next();
  } catch (err) {
    next(err);
  }
}

function getBearerToken(req) {
  const header = req.get('authorization') || '';
  const [scheme, token] = header.split(' ');
  return scheme?.toLowerCase() === 'bearer' ? token : '';
}

async function findStudentByUsername(username) {
  const normalized = String(username).trim();
  const candidates = await studentRepo.search().return.all();
  return candidates.find(student => student.username === normalized);
}

function formatProfile(student) {
  return {
    id: student[EntityId] || student.studentId,
    username: student.username,
    name: student.name,
    cohort: student.cohort,
    gpa: student.gpa,
    enrollments: student.enrollments || [],
  };
}

export default router;
