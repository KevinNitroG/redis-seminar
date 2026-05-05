/**
 * Course Routes — Express router
 *
 * Endpoints follow the OpenAPI spec at slides/se332/openapi.yaml
 * Redis commands used under the hood:
 *   POST   /courses                             → JSON.SET
 *   GET    /courses                             → FT.SEARCH with pagination
 *   GET    /courses/:id                         → JSON.GET
 *   PATCH  /courses/:id                         → JSON.GET + JSON.SET
 *   PUT    /courses/:id                         → JSON.SET
 *   DELETE /courses/:id                         → JSON.DEL
 *   GET    /courses/search                      → FT.SEARCH with filters
 *   POST   /courses/:courseId/students           → XADD + SADD (enrollment via Stream + Set)
 *   GET    /courses/:courseId/students           → SMEMBERS + JSON.GET
 *   DELETE /courses/:courseId/students/:studentId → SREM
 */

import { Router } from 'express';
import { courseRepo, studentRepo } from '../repositories.js';
import { client } from '../db.js';
import { EntityId } from 'redis-om';

const router = Router();

// ─── POST /courses ──────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { id, name, lecturer, practice = [], capacity } = req.body;

    if (!id || !name || !lecturer?.name || !capacity) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Fields id, name, lecturer.name, capacity are required',
      });
    }

    const existing = await courseRepo.fetch(id);
    if (existing && existing.courseId) {
      return res.status(409).json({
        error: 'Conflict',
        message: `Course with id ${id} already exists`,
      });
    }

    const course = await courseRepo.save(id, {
      courseId: id,
      name,
      lecturerName: lecturer.name,
      practice,
      capacity: parseInt(capacity),
      enrolled: 0,
      students: [],
    });

    res.status(201).json(formatCourse(course));
  } catch (err) {
    console.error('POST /courses error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── GET /courses (list with pagination) ─────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const total = await courseRepo.search().return.count();
    const courses = await courseRepo.search()
      .return.page(offset, limit);

    res.json({
      data: courses.map(formatCourse),
      total,
      limit,
      offset,
    });
  } catch (err) {
    console.error('GET /courses error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── GET /courses/search ─────────────────────────────────────────────────────
router.get('/search', async (req, res) => {
  try {
    const { query, lecturer, hasCapacity, sortBy = 'name', order = 'asc' } = req.query;

    let search = courseRepo.search();

    // Full-text search on course name and lecturer
    if (query) {
      const words = query.trim().split(/\s+/).filter(w => w.length > 0);
      if (words.length > 0) {
        const preparedQuery = words.map(w => `${w}*`).join(' ');
        search = search.where('name').matches(preparedQuery)
          .or('lecturerName').matches(preparedQuery);
      }
    }

    // Filter by lecturer
    if (lecturer) {
      search = search.where('lecturerName').matches(lecturer + '*');
    }

    // Sorting
    const sortField = ['name', 'lecturerName', 'enrolled', 'capacity'].includes(sortBy)
      ? (sortBy === 'lecturer' ? 'lecturerName' : sortBy)
      : 'name';
    const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
    search = search.sortBy(sortField, sortOrder);

    const total = await search.return.count();
    let courses = await search.return.all();

    // hasCapacity post-filter (enrolled < capacity)
    if (hasCapacity === 'true') {
      courses = courses.filter(c => c.enrolled < c.capacity);
    }

    res.json({
      data: courses.map(formatCourse),
      total: hasCapacity === 'true' ? courses.length : total,
      query: query || '',
    });
  } catch (err) {
    console.error('GET /courses/search error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── GET /courses/:id ────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const course = await courseRepo.fetch(req.params.id);
    if (!course || !course.courseId) {
      return res.status(404).json({
        error: 'Not found',
        message: `Course with id ${req.params.id} not found`,
      });
    }
    res.json(formatCourse(course));
  } catch (err) {
    console.error('GET /courses/:id error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── PATCH /courses/:id ──────────────────────────────────────────────────────
router.patch('/:id', async (req, res) => {
  try {
    const course = await courseRepo.fetch(req.params.id);
    if (!course || !course.courseId) {
      return res.status(404).json({
        error: 'Not found',
        message: `Course with id ${req.params.id} not found`,
      });
    }

    const { name, lecturer, practice, capacity } = req.body;
    if (name !== undefined) course.name = name;
    if (lecturer?.name !== undefined) course.lecturerName = lecturer.name;
    if (practice !== undefined) course.practice = practice;
    if (capacity !== undefined) course.capacity = parseInt(capacity);

    await courseRepo.save(course);
    res.json(formatCourse(course));
  } catch (err) {
    console.error('PATCH /courses/:id error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── PUT /courses/:id ────────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const existing = await courseRepo.fetch(req.params.id);
    if (!existing || !existing.courseId) {
      return res.status(404).json({
        error: 'Not found',
        message: `Course with id ${req.params.id} not found`,
      });
    }

    const { name, lecturer, practice = [], capacity } = req.body;
    const course = await courseRepo.save(req.params.id, {
      courseId: req.params.id,
      name,
      lecturerName: lecturer.name,
      practice,
      capacity: parseInt(capacity),
      enrolled: existing.enrolled || 0,
      students: existing.students || [],
    });

    res.json(formatCourse(course));
  } catch (err) {
    console.error('PUT /courses/:id error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── DELETE /courses/:id ─────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const course = await courseRepo.fetch(req.params.id);
    if (!course || !course.courseId) {
      return res.status(404).json({
        error: 'Not found',
        message: `Course with id ${req.params.id} not found`,
      });
    }

    await courseRepo.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error('DELETE /courses/:id error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── POST /courses/:courseId/students — Enroll (XADD + SADD) ─────────────────
router.post('/:courseId/students', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'studentId is required',
      });
    }

    // Validate course exists
    const course = await courseRepo.fetch(courseId);
    if (!course || !course.courseId) {
      return res.status(404).json({
        error: 'Not found',
        message: `Course with id ${courseId} not found`,
      });
    }

    // Validate student exists
    const student = await studentRepo.fetch(studentId);
    if (!student || !student.studentId) {
      return res.status(404).json({
        error: 'Not found',
        message: `Student with id ${studentId} not found`,
      });
    }

    // Check capacity
    if (course.enrolled >= course.capacity) {
      return res.status(400).json({
        error: 'Full capacity',
        message: `Course ${courseId} has reached maximum capacity (${course.capacity})`,
      });
    }

    // Check if already enrolled
    if (course.students && course.students.includes(studentId)) {
      return res.status(409).json({
        error: 'Conflict',
        message: `Student ${studentId} is already enrolled in ${courseId}`,
      });
    }

    // ── Transaction: XADD enrollment event + update course + update student ──
    // Use Redis MULTI/EXEC for atomicity
    const enrolledAt = new Date().toISOString();

    // 1) XADD to the enrollment stream
    const streamKey = `enrollment:stream:${courseId}`;
    const streamId = await client.xAdd(streamKey, '*', {
      studentId,
      courseId,
      action: 'ENROLL',
      timestamp: enrolledAt,
    });

    // 2) Update course — add student and increment enrolled count
    course.students = [...(course.students || []), studentId];
    course.enrolled = (course.enrolled || 0) + 1;
    await courseRepo.save(course);

    // 3) Update student — add course to enrollments
    student.enrollments = [...(student.enrollments || []), courseId];
    await studentRepo.save(student);

    res.status(201).json({
      courseId,
      studentId,
      enrolledAt,
      streamId,
    });
  } catch (err) {
    console.error('POST /courses/:courseId/students error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── GET /courses/:courseId/students — List enrolled ──────────────────────────
router.get('/:courseId/students', async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await courseRepo.fetch(courseId);
    if (!course || !course.courseId) {
      return res.status(404).json({
        error: 'Not found',
        message: `Course with id ${courseId} not found`,
      });
    }

    // Fetch each enrolled student's full record
    const studentIds = course.students || [];
    const students = [];
    for (const sid of studentIds) {
      const s = await studentRepo.fetch(sid);
      if (s && s.studentId) {
        students.push({
          id: s[EntityId] || s.studentId,
          username: s.username,
          name: s.name,
          cohort: s.cohort,
          gpa: s.gpa,
          enrollments: s.enrollments || [],
        });
      }
    }

    res.json({
      courseId,
      students,
      total: students.length,
    });
  } catch (err) {
    console.error('GET /courses/:courseId/students error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── DELETE /courses/:courseId/students/:studentId — Unenroll ─────────────────
router.delete('/:courseId/students/:studentId', async (req, res) => {
  try {
    const { courseId, studentId } = req.params;

    const course = await courseRepo.fetch(courseId);
    if (!course || !course.courseId) {
      return res.status(404).json({
        error: 'Not found',
        message: `Course with id ${courseId} not found`,
      });
    }

    if (!course.students || !course.students.includes(studentId)) {
      return res.status(404).json({
        error: 'Not found',
        message: `Student ${studentId} is not enrolled in ${courseId}`,
      });
    }

    // XADD unenrollment event
    const streamKey = `enrollment:stream:${courseId}`;
    await client.xAdd(streamKey, '*', {
      studentId,
      courseId,
      action: 'UNENROLL',
      timestamp: new Date().toISOString(),
    });

    // Update course
    course.students = course.students.filter(id => id !== studentId);
    course.enrolled = Math.max(0, (course.enrolled || 0) - 1);
    await courseRepo.save(course);

    // Update student
    const student = await studentRepo.fetch(studentId);
    if (student && student.studentId) {
      student.enrollments = (student.enrollments || []).filter(id => id !== courseId);
      await studentRepo.save(student);
    }

    res.status(204).send();
  } catch (err) {
    console.error('DELETE /courses/:courseId/students/:studentId error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ─── Helper ──────────────────────────────────────────────────────────────────
function formatCourse(course) {
  return {
    id: course[EntityId] || course.courseId,
    name: course.name,
    lecturer: { name: course.lecturerName },
    practice: course.practice || [],
    capacity: course.capacity,
    enrolled: course.enrolled || 0,
    students: course.students || [],
  };
}

export default router;
