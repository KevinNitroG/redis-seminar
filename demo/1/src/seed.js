/**
 * Seed script — populates Redis with sample data from slides/se332/data.json
 *
 * Usage: node src/seed.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectRedis } from './db.js';
import { createIndexes, studentRepo, courseRepo } from './repositories.js';
import { client } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.resolve(__dirname, '../../../slides/se332/data.json');

async function seed() {
  console.log('🌱 Starting seed from data.json...\n');

  try {
    const rawData = fs.readFileSync(DATA_PATH, 'utf8');
    const { students, courses } = JSON.parse(rawData);

    await connectRedis();
    await createIndexes();

    // Clear existing data (optional but recommended for clean demo)
    console.log('🧹 Clearing old data...');
    const studentKeys = await client.keys('Student:*');
    const courseKeys = await client.keys('Course:*');
    const streamKeys = await client.keys('enrollment:stream:*');
    if (studentKeys.length) await client.del(studentKeys);
    if (courseKeys.length) await client.del(courseKeys);
    if (streamKeys.length) await client.del(streamKeys);

    // Seed students
    console.log(`👩‍🎓 Creating ${students.length} students...`);
    for (const s of students) {
      await studentRepo.save(s.id, {
        studentId: s.id,
        username: s.username,
        name: s.name,
        cohort: s.cohort,
        gpa: s.gpa || 0,
        enrollments: [],
      });
    }

    // Seed courses
    console.log(`\n📚 Creating ${courses.length} courses...`);
    for (const c of courses) {
      // Map theory -> lecturerName
      let lecturerName = 'TBA';
      if (Array.isArray(c.theory)) {
        lecturerName = c.theory.join(', ');
      } else if (c.theory) {
        lecturerName = c.theory;
      }

      // Map practice to array of strings
      let practice = [];
      if (Array.isArray(c.practice)) {
        practice = c.practice;
      } else if (c.practice) {
        practice = [c.practice];
      }

      await courseRepo.save(c.id, {
        courseId: c.id,
        name: c.name,
        lecturerName: lecturerName,
        practice: practice,
        capacity: 40, // Default UIT capacity
        enrolled: 0,
        students: [],
      });
    }

    // Randomly enroll some students to make it look "alive"
    console.log('\n📝 Processing random enrollments...');
    for (let i = 0; i < 15; i++) {
      const randomStudent = students[Math.floor(Math.random() * students.length)];
      const randomCourse = courses[Math.floor(Math.random() * courses.length)];

      // Fetch current state
      const course = await courseRepo.fetch(randomCourse.id);
      const student = await studentRepo.fetch(randomStudent.id);

      if (!course.students.includes(student.studentId)) {
        course.students.push(student.studentId);
        course.enrolled += 1;
        await courseRepo.save(course);

        student.enrollments.push(course.courseId);
        await studentRepo.save(student);

        // XADD enrollment event to stream
        const streamKey = `enrollment:stream:${course.courseId}`;
        await client.xAdd(streamKey, '*', {
          studentId: student.studentId,
          courseId: course.courseId,
          action: 'ENROLL',
          timestamp: new Date().toISOString(),
        });
        console.log(`   ✅ ${student.studentId} → ${course.courseId}`);
      }
    }

    console.log('\n🎉 Seed complete!');
    console.log(`   ${students.length} students, ${courses.length} courses created.`);

  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    await client.destroy();
    process.exit(0);
  }
}

seed();
