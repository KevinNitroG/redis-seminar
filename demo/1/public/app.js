const API = '';

// ─── Utility ──────────────────────────────────────────────────────────────
async function api(path, opts = {}) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
  return data;
}

function toast(msg, type = 'info') {
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = msg;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function openModal(id) { document.getElementById(id).classList.add('show'); }
function closeModal(id) { document.getElementById(id).classList.remove('show'); }
window.closeModal = closeModal;

// ─── Tabs ─────────────────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
  });
});

// ─── GPA helpers ──────────────────────────────────────────────────────────
function gpaClass(gpa) { return gpa >= 8 ? 'gpa-high' : gpa >= 6 ? 'gpa-mid' : 'gpa-low'; }
function capacityColor(enrolled, capacity) {
  const pct = enrolled / capacity;
  return pct >= 0.9 ? 'var(--danger)' : pct >= 0.6 ? 'var(--warning)' : 'var(--success)';
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  STUDENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let allStudents = [];

async function loadStudents() {
  try {
    const res = await api('/students?limit=100');
    allStudents = res.data;
    renderStudents(allStudents);
    updateStudentStats(allStudents);
    populateCohortFilter(allStudents);
  } catch (e) { toast(e.message, 'error'); }
}

function updateStudentStats(list) {
  document.getElementById('stat-total-students').textContent = list.length;
  const avg = list.length ? (list.reduce((s, st) => s + st.gpa, 0) / list.length).toFixed(1) : '—';
  document.getElementById('stat-avg-gpa').textContent = avg;
  const cohorts = new Set(list.map(s => s.cohort));
  document.getElementById('stat-cohorts').textContent = cohorts.size;
}

function populateCohortFilter(list) {
  const sel = document.getElementById('filter-cohort');
  const cohorts = [...new Set(list.map(s => s.cohort))].sort();
  sel.innerHTML = '<option value="">All Cohorts</option>' +
    cohorts.map(c => `<option value="${c}">K${c}</option>`).join('');
}

function renderStudents(list) {
  const container = document.getElementById('student-list');
  if (!list.length) {
    container.innerHTML = '<div class="empty-state"><div class="icon">👩‍🎓</div><p>No students found</p></div>';
    return;
  }
  container.innerHTML = list.map(s => `
    <div class="card" data-id="${s.id}">
      <div class="card-header">
        <div>
          <div class="card-title">${s.name}</div>
          <div class="card-subtitle">@${s.username} · MSSV: ${s.id}</div>
        </div>
        <span class="badge badge-accent">K${s.cohort}</span>
      </div>
      <div class="card-body">
        <div class="card-field">
          <span class="label">GPA</span>
          <span class="value">${s.gpa.toFixed(1)}</span>
        </div>
        <div class="gpa-bar"><div class="fill ${gpaClass(s.gpa)}" style="width:${s.gpa * 10}%"></div></div>
        <div class="card-field" style="margin-top:8px">
          <span class="label">Enrollments</span>
          <span class="value">${(s.enrollments || []).length} courses</span>
        </div>
        ${(s.enrollments || []).length ? `<div class="tag-list">${s.enrollments.map(e => `<span class="tag">${e}</span>`).join('')}</div>` : ''}
      </div>
      <div class="card-actions">
        <button class="btn btn-secondary btn-sm" onclick="editStudent('${s.id}')">✏️ Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteStudent('${s.id}')">🗑️ Delete</button>
      </div>
    </div>
  `).join('');
}

// Add Student
document.getElementById('btn-add-student').addEventListener('click', () => {
  document.getElementById('sf-mode').value = 'create';
  document.getElementById('student-modal-title').textContent = 'Add Student';
  document.getElementById('sf-submit').textContent = 'Create';
  document.getElementById('student-form').reset();
  document.getElementById('sf-id').disabled = false;
  openModal('student-modal');
});

document.getElementById('student-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const mode = document.getElementById('sf-mode').value;
  const data = {
    id: document.getElementById('sf-id').value,
    username: document.getElementById('sf-username').value,
    name: document.getElementById('sf-name').value,
    cohort: document.getElementById('sf-cohort').value,
    gpa: parseFloat(document.getElementById('sf-gpa').value),
  };
  try {
    if (mode === 'create') {
      await api('/students', { method: 'POST', body: data });
      toast('Student created!', 'success');
    } else {
      await api(`/students/${data.id}`, { method: 'PATCH', body: data });
      toast('Student updated!', 'success');
    }
    closeModal('student-modal');
    loadStudents();
  } catch (e) { toast(e.message, 'error'); }
});

window.editStudent = async (id) => {
  try {
    const s = await api(`/students/${id}`);
    document.getElementById('sf-mode').value = 'edit';
    document.getElementById('student-modal-title').textContent = 'Edit Student';
    document.getElementById('sf-submit').textContent = 'Save';
    document.getElementById('sf-id').value = s.id;
    document.getElementById('sf-id').disabled = true;
    document.getElementById('sf-username').value = s.username;
    document.getElementById('sf-name').value = s.name;
    document.getElementById('sf-cohort').value = s.cohort;
    document.getElementById('sf-gpa').value = s.gpa;
    openModal('student-modal');
  } catch (e) { toast(e.message, 'error'); }
};

window.deleteStudent = async (id) => {
  if (!confirm(`Delete student ${id}?`)) return;
  try {
    await api(`/students/${id}`, { method: 'DELETE' });
    toast('Student deleted', 'success');
    loadStudents();
  } catch (e) { toast(e.message, 'error'); }
};

// Student Search with suggestions
let searchTimeout;
const studentSearchInput = document.getElementById('student-search');
const studentSuggestions = document.getElementById('student-suggestions');

studentSearchInput.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  const q = studentSearchInput.value.trim();
  if (!q) { studentSuggestions.classList.remove('show'); renderStudents(allStudents); return; }
  searchTimeout = setTimeout(async () => {
    try {
      const res = await api(`/students/search?query=${encodeURIComponent(q)}`);
      renderStudents(res.data);
      // Show suggestions
      if (res.data.length) {
        studentSuggestions.innerHTML = res.data.slice(0, 6).map(s =>
          `<div class="suggestion-item" onclick="selectStudentSuggestion('${s.id}')">
            <span>${highlightMatch(s.name, q)} <small style="color:var(--text-muted)">@${s.username}</small></span>
            <span class="sub">MSSV: ${s.id} · K${s.cohort} · GPA ${s.gpa}</span>
          </div>`
        ).join('');
        studentSuggestions.classList.add('show');
      } else {
        studentSuggestions.classList.remove('show');
      }
    } catch (e) { console.error(e); }
  }, 250);
});

studentSearchInput.addEventListener('blur', () => {
  setTimeout(() => studentSuggestions.classList.remove('show'), 200);
});

window.selectStudentSuggestion = (id) => {
  studentSuggestions.classList.remove('show');
  const s = allStudents.find(st => st.id === id);
  if (s) { studentSearchInput.value = s.name; renderStudents([s]); }
};

function highlightMatch(text, query) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return text.slice(0, idx) + `<span class="match">${text.slice(idx, idx + query.length)}</span>` + text.slice(idx + query.length);
}

// Filters
document.getElementById('btn-filter-students').addEventListener('click', async () => {
  const cohort = document.getElementById('filter-cohort').value;
  const minGpa = document.getElementById('filter-min-gpa').value;
  const maxGpa = document.getElementById('filter-max-gpa').value;
  const [sortBy, order] = document.getElementById('filter-sort-student').value.split('-');
  const params = new URLSearchParams();
  if (cohort) params.set('cohort', cohort);
  if (minGpa) params.set('minGpa', minGpa);
  if (maxGpa) params.set('maxGpa', maxGpa);
  params.set('sortBy', sortBy);
  params.set('order', order);
  try {
    const res = await api(`/students/search?${params}`);
    renderStudents(res.data);
    updateStudentStats(res.data);
  } catch (e) { toast(e.message, 'error'); }
});

document.getElementById('btn-reset-students').addEventListener('click', () => {
  document.getElementById('filter-cohort').value = '';
  document.getElementById('filter-min-gpa').value = '';
  document.getElementById('filter-max-gpa').value = '';
  document.getElementById('filter-sort-student').value = 'gpa-desc';
  document.getElementById('student-search').value = '';
  loadStudents();
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  COURSES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let allCourses = [];

async function loadCourses() {
  try {
    const res = await api('/courses?limit=100');
    allCourses = res.data;
    renderCourses(allCourses);
    updateCourseStats(allCourses);
  } catch (e) { toast(e.message, 'error'); }
}

function updateCourseStats(list) {
  document.getElementById('stat-total-courses').textContent = list.length;
  const totalEnrolled = list.reduce((s, c) => s + c.enrolled, 0);
  document.getElementById('stat-total-enrolled').textContent = totalEnrolled;
  const totalSeats = list.reduce((s, c) => s + (c.capacity - c.enrolled), 0);
  document.getElementById('stat-available-seats').textContent = totalSeats;
}

function renderCourses(list) {
  const container = document.getElementById('course-list');
  if (!list.length) {
    container.innerHTML = '<div class="empty-state"><div class="icon">📚</div><p>No courses found</p></div>';
    return;
  }
  container.innerHTML = list.map(c => `
    <div class="card" data-id="${c.id}">
      <div class="card-header">
        <div>
          <div class="card-title">${c.name}</div>
          <div class="card-subtitle">${c.id} · ${c.lecturer.name}</div>
        </div>
        <span class="badge ${c.enrolled >= c.capacity ? 'badge-warning' : 'badge-success'}">${c.enrolled}/${c.capacity}</span>
      </div>
      <div class="card-body">
        <div class="capacity-bar"><div class="fill" style="width:${(c.enrolled/c.capacity)*100}%;background:${capacityColor(c.enrolled,c.capacity)}"></div></div>
        ${c.practice.length ? `<div class="tag-list" style="margin-top:8px">${c.practice.map(p => `<span class="tag">${p}</span>`).join('')}</div>` : ''}
        <div class="enroll-section">
          <h3>Enrolled Students (${(c.students||[]).length})</h3>
          <div class="enrolled-list" id="enrolled-${c.id}">
            ${(c.students||[]).map(sid => `
              <span class="enrolled-chip">${sid}<span class="remove-btn" onclick="unenroll('${c.id}','${sid}')">✕</span></span>
            `).join('') || '<span style="color:var(--text-muted);font-size:0.82rem">No students enrolled</span>'}
          </div>
          <button class="btn btn-secondary btn-sm" style="margin-top:10px" onclick="openEnroll('${c.id}')">➕ Enroll</button>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn btn-secondary btn-sm" onclick="editCourse('${c.id}')">✏️ Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteCourse('${c.id}')">🗑️ Delete</button>
      </div>
    </div>
  `).join('');
}

// Add Course
document.getElementById('btn-add-course').addEventListener('click', () => {
  document.getElementById('cf-mode').value = 'create';
  document.getElementById('course-modal-title').textContent = 'Add Course';
  document.getElementById('cf-submit').textContent = 'Create';
  document.getElementById('course-form').reset();
  document.getElementById('cf-id').disabled = false;
  openModal('course-modal');
});

document.getElementById('course-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const mode = document.getElementById('cf-mode').value;
  const data = {
    id: document.getElementById('cf-id').value,
    name: document.getElementById('cf-name').value,
    lecturer: { name: document.getElementById('cf-lecturer').value },
    practice: document.getElementById('cf-practice').value.split(',').map(s => s.trim()).filter(Boolean),
    capacity: parseInt(document.getElementById('cf-capacity').value),
  };
  try {
    if (mode === 'create') {
      await api('/courses', { method: 'POST', body: data });
      toast('Course created!', 'success');
    } else {
      await api(`/courses/${data.id}`, { method: 'PATCH', body: data });
      toast('Course updated!', 'success');
    }
    closeModal('course-modal');
    loadCourses();
  } catch (e) { toast(e.message, 'error'); }
});

window.editCourse = async (id) => {
  try {
    const c = await api(`/courses/${id}`);
    document.getElementById('cf-mode').value = 'edit';
    document.getElementById('course-modal-title').textContent = 'Edit Course';
    document.getElementById('cf-submit').textContent = 'Save';
    document.getElementById('cf-id').value = c.id;
    document.getElementById('cf-id').disabled = true;
    document.getElementById('cf-name').value = c.name;
    document.getElementById('cf-lecturer').value = c.lecturer.name;
    document.getElementById('cf-practice').value = c.practice.join(', ');
    document.getElementById('cf-capacity').value = c.capacity;
    openModal('course-modal');
  } catch (e) { toast(e.message, 'error'); }
};

window.deleteCourse = async (id) => {
  if (!confirm(`Delete course ${id}?`)) return;
  try {
    await api(`/courses/${id}`, { method: 'DELETE' });
    toast('Course deleted', 'success');
    loadCourses();
  } catch (e) { toast(e.message, 'error'); }
};

// Course Search with suggestions
let courseSearchTimeout;
const courseSearchInput = document.getElementById('course-search');
const courseSuggestions = document.getElementById('course-suggestions');

courseSearchInput.addEventListener('input', () => {
  clearTimeout(courseSearchTimeout);
  const q = courseSearchInput.value.trim();
  if (!q) { courseSuggestions.classList.remove('show'); renderCourses(allCourses); return; }
  courseSearchTimeout = setTimeout(async () => {
    try {
      const res = await api(`/courses/search?query=${encodeURIComponent(q)}`);
      renderCourses(res.data);
      if (res.data.length) {
        courseSuggestions.innerHTML = res.data.slice(0, 6).map(c =>
          `<div class="suggestion-item" onclick="selectCourseSuggestion('${c.id}')">
            <span>${highlightMatch(c.name, q)}</span>
            <span class="sub">${c.id} · ${c.lecturer.name} · ${c.enrolled}/${c.capacity}</span>
          </div>`
        ).join('');
        courseSuggestions.classList.add('show');
      } else {
        courseSuggestions.classList.remove('show');
      }
    } catch (e) { console.error(e); }
  }, 250);
});

courseSearchInput.addEventListener('blur', () => {
  setTimeout(() => courseSuggestions.classList.remove('show'), 200);
});

window.selectCourseSuggestion = (id) => {
  courseSuggestions.classList.remove('show');
  const c = allCourses.find(co => co.id === id);
  if (c) { courseSearchInput.value = c.name; renderCourses([c]); }
};

// Enrollment
window.openEnroll = (courseId) => {
  document.getElementById('ef-courseId').value = courseId;
  document.getElementById('ef-studentId').value = '';
  openModal('enroll-modal');
};

document.getElementById('enroll-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const courseId = document.getElementById('ef-courseId').value;
  const studentId = document.getElementById('ef-studentId').value;
  try {
    await api(`/courses/${courseId}/students`, { method: 'POST', body: { studentId } });
    toast(`Enrolled ${studentId} in ${courseId}!`, 'success');
    closeModal('enroll-modal');
    loadCourses();
    loadStudents();
  } catch (e) { toast(e.message, 'error'); }
});

window.unenroll = async (courseId, studentId) => {
  if (!confirm(`Unenroll ${studentId} from ${courseId}?`)) return;
  try {
    await api(`/courses/${courseId}/students/${studentId}`, { method: 'DELETE' });
    toast(`Unenrolled ${studentId}`, 'success');
    loadCourses();
    loadStudents();
  } catch (e) { toast(e.message, 'error'); }
};

// Close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('show');
  });
});

// ─── Init ─────────────────────────────────────────────────────────────────
loadStudents();
loadCourses();
