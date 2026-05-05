/**
 * Redis OM Schemas for Student and Course entities.
 *
 * These schemas define:
 *  - The shape of each JSON document stored via RedisJSON
 *  - The RediSearch index fields used for FT.SEARCH queries
 *
 * Under the hood, redis‑om calls:
 *   FT.CREATE idx:student ON JSON PREFIX 1 Student: SCHEMA ...
 *   FT.CREATE idx:course  ON JSON PREFIX 1 Course:  SCHEMA ...
 */

import { Schema } from 'redis-om';

// ─── Student Schema ─────────────────────────────────────────────────────────

export const studentSchema = new Schema('Student', {
  // Student ID (e.g., "23521476") — stored as the entity ID
  studentId: { type: 'string', field: '$.studentId' },
  username:  { type: 'text',   field: '$.username' },   // TEXT → full-text searchable
  name:      { type: 'text',   field: '$.name' },       // TEXT → full-text searchable
  cohort:    { type: 'string', field: '$.cohort' },     // TAG-like exact match via string
  gpa:       { type: 'number', field: '$.gpa', sortable: true },
  enrollments: { type: 'string[]', field: '$.enrollments' },
}, {
  dataStructure: 'JSON',
});

// ─── Course Schema ──────────────────────────────────────────────────────────

export const courseSchema = new Schema('Course', {
  courseId:     { type: 'string', field: '$.courseId' },
  name:         { type: 'text',   field: '$.name' },
  lecturerName: { type: 'text',   field: '$.lecturerName' },
  practice:     { type: 'string[]', field: '$.practice' },
  capacity:     { type: 'number', field: '$.capacity', sortable: true },
  enrolled:     { type: 'number', field: '$.enrolled', sortable: true },
  students:     { type: 'string[]', field: '$.students' },
}, {
  dataStructure: 'JSON',
});
