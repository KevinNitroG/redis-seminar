/**
 * Redis OM Repositories — the ORM layer for Redis.
 *
 * A Repository wraps a Schema and the Redis connection to provide:
 *   .save(entity)        → JSON.SET
 *   .fetch(id)           → JSON.GET
 *   .remove(id)          → JSON.DEL
 *   .search()            → FT.SEARCH  (query builder)
 *   .createIndex()       → FT.CREATE  (creates the RediSearch index)
 */

import { Repository } from 'redis-om';
import { client } from './db.js';
import { studentSchema, courseSchema } from './schemas.js';

export const studentRepo = new Repository(studentSchema, client);
export const courseRepo = new Repository(courseSchema, client);

/**
 * Create RediSearch indexes for both entities.
 * Safe to call multiple times — redis-om handles "index already exists".
 */
export async function createIndexes() {
  await studentRepo.createIndex();
  await courseRepo.createIndex();
  console.log('🔍 RediSearch indexes created (Student, Course)');
}
