/**
 * Student Routes — Express router
 *
 * Endpoints follow the OpenAPI spec at slides/se332/openapi.yaml
 * Redis commands used under the hood:
 *   POST   /students          → JSON.SET  (via redis-om .save())
 *   GET    /students          → FT.SEARCH (via redis-om .search()) with pagination
 *   GET    /students/:id      → JSON.GET  (via redis-om .fetch())
 *   PATCH  /students/:id      → JSON.GET + JSON.SET (fetch → merge → save)
 *   PUT    /students/:id      → JSON.SET  (full replace)
 *   DELETE /students/:id      → JSON.DEL  (via redis-om .remove())
 *   GET    /students/search   → FT.SEARCH with full-text + filters
 */

import { Router } from 'express';
import { studentRepo } from '../repositories.js';
import { client } from '../db.js';
import { EntityId } from 'redis-om';

const router = Router();

// ─── POST /students ─────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { id, username, name, cohort, gpa, password } = req.body;

    if (!id || !username || !name || !cohort || gpa === undefined) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Fields id, username, name, cohort, gpa are required',
      });
    }

    // Check if student already exists
    const existing = await studentRepo.fetch(id);
    if (existing && existing.studentId) {
      return res.status(409).json({
        error: 'Conflict',
        message: `Student with id ${id} already exists`,
      });
    }

    const student = await studentRepo.save(id, {
      studentId: id,
      username,
      password: password || username,
      name,
      cohort,
      gpa: parseFloat(gpa),
      enrollments: [],
    });

    res.status(201).json(formatStudent(student));
  } catch (err) {
    console.error('POST /students error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── GET /students (list with pagination) ────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    // FT.SEARCH Student:idx * LIMIT offset limit
    const total = await studentRepo.search().return.count();
    const students = await studentRepo.search()
      .return.page(offset, limit);

    res.json({
      data: students.map(formatStudent),
      total,
      limit,
      offset,
    });
  } catch (err) {
    console.error('GET /students error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── GET /students/search ────────────────────────────────────────────────────
// Must be BEFORE /:id to avoid treating "search" as an ID
router.get('/search', async (req, res) => {
  try {
    const { query, cohort, minGpa, maxGpa, sortBy = 'gpa', order = 'desc' } = req.query;

    const clauses = [];
    let queryUsesRediSearch = false;

    if (query) {
      const words = tokenizeSearch(query).filter(word => word.length >= 2);
      if (words.length > 0) {
        queryUsesRediSearch = true;
        clauses.push(words.map(word => {
          const fuzzy = word.length >= 3 ? `|@name:%${word}%|@username:%${word}%` : '';
          return `(@name:${word}*|@username:${word}*${fuzzy})`;
        }).join(' '));
      }
    }

    if (cohort) {
      clauses.push(`@cohort:{${escapeTag(cohort)}}`);
    }

    if (minGpa !== undefined && maxGpa !== undefined) {
      clauses.push(`@gpa:[${parseFloat(minGpa)} ${parseFloat(maxGpa)}]`);
    } else if (minGpa !== undefined) {
      clauses.push(`@gpa:[${parseFloat(minGpa)} +inf]`);
    } else if (maxGpa !== undefined) {
      clauses.push(`@gpa:[-inf ${parseFloat(maxGpa)}]`);
    }

    const rediSearchQuery = clauses.length ? clauses.join(' ') : '*';
    const sortField = ['gpa', 'name', 'cohort'].includes(sortBy) ? sortBy : 'gpa';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
    const result = await safeFtSearch('Student:index', rediSearchQuery, {
      SORTBY: { BY: sortField, DIRECTION: sortOrder },
      LIMIT: { from: 0, size: 100 },
    });
    let students = result.documents.map(doc => doc.value);

    if (query) {
      const allStudents = await fetchAllStudents();
      const foldedMatches = allStudents.filter(student => matchesFoldedSearch([
        student.studentId,
        student.username,
        student.name,
      ], query));
      students = queryUsesRediSearch
        ? uniqueById([...students, ...foldedMatches], 'studentId')
        : foldedMatches;
    }

    students = students
      .filter(student => !cohort || String(student.cohort) === String(cohort))
      .filter(student => minGpa === undefined || Number(student.gpa) >= parseFloat(minGpa))
      .filter(student => maxGpa === undefined || Number(student.gpa) <= parseFloat(maxGpa));

    students = sortByField(students, sortField, order);

    res.json({
      data: students.map(formatStudent),
      total: students.length,
      query: query || '',
    });
  } catch (err) {
    console.error('GET /students/search error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── GET /students/:id ──────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const student = await studentRepo.fetch(req.params.id);
    if (!student || !student.studentId) {
      return res.status(404).json({
        error: 'Not found',
        message: `Student with id ${req.params.id} not found`,
      });
    }
    res.json(formatStudent(student));
  } catch (err) {
    console.error('GET /students/:id error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── PATCH /students/:id ────────────────────────────────────────────────────
router.patch('/:id', async (req, res) => {
  try {
    const student = await studentRepo.fetch(req.params.id);
    if (!student || !student.studentId) {
      return res.status(404).json({
        error: 'Not found',
        message: `Student with id ${req.params.id} not found`,
      });
    }

    // Merge updates
    const { username, name, cohort, gpa, password } = req.body;
    if (username !== undefined) student.username = username;
    if (password !== undefined) student.password = password;
    if (name !== undefined) student.name = name;
    if (cohort !== undefined) student.cohort = cohort;
    if (gpa !== undefined) student.gpa = parseFloat(gpa);

    await studentRepo.save(student);
    res.json(formatStudent(student));
  } catch (err) {
    console.error('PATCH /students/:id error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── PUT /students/:id ──────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const existing = await studentRepo.fetch(req.params.id);
    if (!existing || !existing.studentId) {
      return res.status(404).json({
        error: 'Not found',
        message: `Student with id ${req.params.id} not found`,
      });
    }

    const { id, username, name, cohort, gpa, password } = req.body;
    const student = await studentRepo.save(req.params.id, {
      studentId: req.params.id,
      username,
      password: password || existing.password || username,
      name,
      cohort,
      gpa: parseFloat(gpa),
      enrollments: existing.enrollments || [],
    });

    res.json(formatStudent(student));
  } catch (err) {
    console.error('PUT /students/:id error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── DELETE /students/:id ────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const student = await studentRepo.fetch(req.params.id);
    if (!student || !student.studentId) {
      return res.status(404).json({
        error: 'Not found',
        message: `Student with id ${req.params.id} not found`,
      });
    }

    await studentRepo.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error('DELETE /students/:id error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── Helper ──────────────────────────────────────────────────────────────────
function tokenizeSearch(value) {
  return String(value)
    .trim()
    .split(/\s+/)
    .map(word => word.replace(/[^\p{L}\p{N}_-]/gu, ''))
    .filter(Boolean);
}

function escapeTag(value) {
  return String(value).replace(/[{}|,\\]/g, '\\$&');
}

async function safeFtSearch(index, query, options) {
  try {
    return await client.ft.search(index, query, options);
  } catch (err) {
    console.warn(`FT.SEARCH fallback for ${index}:`, err.message);
    return { total: 0, documents: [] };
  }
}

async function fetchAllStudents() {
  const result = await client.ft.search('Student:index', '*', {
    LIMIT: { from: 0, size: 1000 },
  });
  return result.documents.map(doc => doc.value);
}

function foldText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

function matchesFoldedSearch(fields, query) {
  const haystack = foldText(fields.join(' '));
  return foldText(query)
    .split(/\s+/)
    .filter(Boolean)
    .every(token => haystack.includes(token));
}

function uniqueById(items, idField) {
  return [...new Map(items.map(item => [String(item[idField]), item])).values()];
}

function sortByField(items, field, order) {
  const direction = order === 'asc' ? 1 : -1;
  return [...items].sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (typeof av === 'number' && typeof bv === 'number') {
      return (av - bv) * direction;
    }
    return String(av ?? '').localeCompare(String(bv ?? ''), 'vi', { sensitivity: 'base' }) * direction;
  });
}

function formatStudent(student) {
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
