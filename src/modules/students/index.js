/**
 * NotebookXL Students Directory Module
 */

export function renderPeople(state, tenant, icon, compact, button, lower, fullName, studentGrade, badge, studentAcademicGamification, studentAttendance, studentAverage, decimal, getTenantFeeRecords, avatar, teacherAssignments, teacherAttendance, teacherWorkload, sectionHead, renderGamifiedAvatar, escapeHTML) {
  const isStudent = state.page === 'students' || state.page === 'my-students';
  const tenantObj = tenant() || {};
  const rawList = isStudent ? (tenantObj.students || []) : (tenantObj.teachers || []);
  const list = isStudent && state.role === 'TEACHER' ? rawList.slice(0, 30) : rawList;
  const query = lower(state.filters?.peopleQuery || '');
  const grade = state.filters?.grade || '';
  const section = state.filters?.section || '';
  const gender = state.filters?.gender || '';
  const feeLedger = typeof getTenantFeeRecords === 'function' ? getTenantFeeRecords() : [];
  
  const filtered = list.filter((person) => {
    const nameMatch = !query || lower(fullName(person)).includes(query) || lower(person.studentId || person.employeeId).includes(query);
    const gradeMatch = !isStudent || !grade || studentGrade(person) === grade;
    const sectionMatch = !isStudent || !section || person.section === section;
    const genderMatch = !gender || person.gender === gender;
    return nameMatch && gradeMatch && sectionMatch && genderMatch;
  });

  const title = isStudent ? 'Students' : 'Teachers';
  const action = isStudent ? `${icon('plus')} Add student` : `${icon('plus')} Add teacher`;

  return `${sectionHead('People', title, `${compact(list.length)} ${title.toLowerCase()} enrolled in ${tenant()?.school?.name || tenant()?.name || 'this school'}.`, button(action, isStudent ? 'open-add-student' : 'open-add-teacher', 'primary'))}
    <section class="card list-card">
      <div class="filters">
        <label class="filter-search">${icon('search')}<input data-filter="peopleQuery" value="${escapeHTML(state.filters?.peopleQuery || '')}" placeholder="Search by name or ${isStudent ? 'Student ID' : 'Employee ID'}" /></label>
        ${isStudent ? `<select data-filter="grade"><option value="">All grades</option>${[1,2,3,4,5,6,7,8,9,10].map((item) => `<option value="${item}" ${grade === String(item) ? 'selected' : ''}>Grade ${item}</option>`).join('')}</select><select data-filter="section"><option value="">All sections</option>${['A','B','C','D'].map((item) => `<option value="${item}" ${section === item ? 'selected' : ''}>Section ${item}</option>`).join('')}</select>` : `<select data-filter="gender"><option value="">All genders</option><option value="Female" ${gender === 'Female' ? 'selected' : ''}>Female</option><option value="Male" ${gender === 'Male' ? 'selected' : ''}>Male</option></select>`}
        <button class="btn btn-secondary filter-btn">${icon('filter')} Filters</button>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>${isStudent ? '<th>Student</th><th>Level / Tier</th><th>ID & Roll</th><th>Grade & Sec</th><th>Attendance</th><th>Academic Average</th><th>Fee Ledger Status</th><th>Actions</th>' : '<th>Name</th><th>Employee ID</th><th>Department</th><th>Classes</th><th>Attendance</th><th>Workload</th><th>Status</th><th>Action</th>'}</tr>
          </thead>
          <tbody>
            ${filtered.slice(0, 80).map((person) => {
              if (isStudent) {
                const g = studentAcademicGamification ? studentAcademicGamification(person) : { level: 1, levelIcon: '🎖️', pillClass: 'pill-bronze', tier: 'standard' };
                const attRate = studentAttendance ? studentAttendance(person) : 95;
                const parentMobile = (person.parentMobile || person.phone || '9845098765').replace(/\D/g, '');
                const waMsg = encodeURIComponent(`Dear Parent of ${fullName(person)}, notification regarding academic status & attendance (${decimal ? decimal(attRate) : attRate}%) from ${tenant()?.name || 'Meezan Kids School'}.`);
                const rec = (feeLedger || []).find((r) => r.id === person.id || r.student?.id === person.id) || { balanceDue: 0, status: 'Paid' };

                return `<tr class="clickable-row">
                  <td>
                    <button data-action="open-student" data-id="${escapeHTML(person.id)}" style="background:none; border:none; padding:0; display:flex; align-items:center; gap:0.65rem; text-align:left; cursor:pointer;">
                      ${renderGamifiedAvatar(person, 'avatar-small')}
                      <span><b>${escapeHTML(fullName(person))}</b><br/><small style="color:#64748b;">${escapeHTML(person.gender || 'Student')}</small></span>
                    </button>
                  </td>
                  <td><span class="community-author-level-pill ${g?.pillClass || 'pill-bronze'}">${g?.levelIcon || '🎖️'} Lv.${g?.level || 1} ${g?.tier && g.tier !== 'standard' ? String(g.tier).toUpperCase() : ''}</span></td>
                  <td><b>${escapeHTML(person.studentId || 'NXL-MKS-000001')}</b><small style="display:block; color:#64748b;">Roll #${escapeHTML(person.rollNumber || '17')}</small></td>
                  <td>Grade ${escapeHTML(studentGrade(person))}${escapeHTML(person.section || 'A')}</td>
                  <td>
                    <b style="color:${attRate < 75 ? '#dc2626' : '#16a34a'};">${decimal ? decimal(attRate) : attRate}%</b>
                    ${attRate < 75 ? '<small style="display:block; color:#b91c1c; font-weight:700;">⚠️ Below 75%</small>' : '<small style="display:block; color:#16a34a;">🟢 Healthy</small>'}
                  </td>
                  <td><b>${studentAverage && decimal ? decimal(studentAverage(person)) : '88.5'}%</b></td>
                  <td>
                    ${rec.balanceDue > 0 
                      ? `<span style="background:#fee2e2; color:#b91c1c; padding:0.2rem 0.5rem; border-radius:6px; font-size:0.75rem; font-weight:800;">₹${rec.balanceDue.toLocaleString()} Due</span>` 
                      : `<span style="background:#dcfce7; color:#15803d; padding:0.2rem 0.5rem; border-radius:6px; font-size:0.75rem; font-weight:800;">🟢 Paid in Full</span>`}
                  </td>
                  <td>
                    <div style="display:flex; gap:0.4rem; align-items:center;">
                      <button class="btn btn-secondary" style="font-size:0.72rem; padding:0.25rem 0.5rem;" data-action="quick-view-id-card" data-segment="STUDENT" data-id="${escapeHTML(person.id)}">🪪 ID</button>
                      <a href="https://wa.me/91${parentMobile}?text=${waMsg}" target="_blank" class="wa-reminder-btn" style="padding:0.25rem 0.5rem; font-size:0.72rem; border-radius:6px; font-weight:700; text-decoration:none;">💬 Alert</a>
                    </div>
                  </td>
                </tr>`;
              }
              return `<tr class="clickable-row" data-action="open-teacher" data-id="${escapeHTML(person.id)}"><td><span class="table-person">${avatar(person)}<span><b>${escapeHTML(fullName(person))}</b><small>${escapeHTML(person.gender || 'Teacher')}</small></span></span></td><td>${escapeHTML(person.employeeId || 'MKS-T-001')}</td><td>${escapeHTML(person.department || 'Academics')}</td><td>${teacherAssignments(person).slice(0,2).map((entry) => `G${entry.grade}${entry.section}`).join(', ')}<small>+${Math.max(0, teacherAssignments(person).length - 2)} more</small></td><td><b>${decimal(teacherAttendance(person))}</b></td><td>${badge(`${teacherWorkload(person).weeklyPeriods || 24} periods`, 'info')}</td><td>${badge(person.status || 'Active')}</td><td><button class="btn btn-secondary" style="font-size:0.75rem; padding:0.25rem 0.5rem;" data-action="quick-view-id-card" data-segment="TEACHER" data-id="${escapeHTML(person.id)}">🪪 ID Card</button></td></tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
      <div class="table-footer"><span>Showing ${Math.min(filtered.length, 80)} of ${filtered.length} ${title.toLowerCase()}</span><span>Page 1 of ${Math.max(1, Math.ceil(filtered.length / 80))}</span></div>
    </section>`;
}
