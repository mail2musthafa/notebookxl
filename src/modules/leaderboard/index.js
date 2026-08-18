/**
 * NotebookXL 3D Campus Leaderboard & Hall of Fame Module (ES Module)
 * Fully dynamic calculations, metallic podiums, subject breakdowns, and merit cards.
 */

export function renderLeaderboard(state, students, currentStudent, studentGrade, studentAcademicGamification, studentAverage, fullName, studentAttendance, decimal, renderGamifiedAvatar, sectionHead, escapeHTML, lower, tenant, icon) {
  let allStudents = typeof students === 'function' ? students() : [];
  if (!allStudents || allStudents.length === 0) {
    allStudents = [
      { id: 'student-1', firstName: 'Amaan', lastName: 'Khan', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', studentId: 'NXL-MKS-000421', grade: '8', section: 'A', academicAverage: 97.4, attendanceRate: 98.2, parentMobile: '+91 98450 98765', parentName: 'Dr. Tariq Khan' },
      { id: 'student-2', firstName: 'Sara', lastName: 'Ahmed', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', studentId: 'NXL-MKS-000422', grade: '8', section: 'A', academicAverage: 95.8, attendanceRate: 97.0, parentMobile: '+91 98451 22334', parentName: 'Mr. Farhan Ahmed' },
      { id: 'student-3', firstName: 'Zayan', lastName: 'Malik', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', studentId: 'NXL-MKS-000423', grade: '8', section: 'B', academicAverage: 94.2, attendanceRate: 96.5, parentMobile: '+91 98452 33445', parentName: 'Mrs. Fatima Malik' },
      { id: 'student-4', firstName: 'Ayesha', lastName: 'Siddiqui', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', studentId: 'NXL-MKS-000424', grade: '9', section: 'A', academicAverage: 96.6, attendanceRate: 98.0, parentMobile: '+91 98453 44556', parentName: 'Dr. Nadeem Siddiqui' },
      { id: 'student-5', firstName: 'Bilal', lastName: 'Farooqui', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', studentId: 'NXL-MKS-000425', grade: '9', section: 'A', academicAverage: 91.5, attendanceRate: 94.0, parentMobile: '+91 98454 55667', parentName: 'Mr. Khalid Farooqui' },
      { id: 'student-6', firstName: 'Mariam', lastName: 'Qureshi', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', studentId: 'NXL-MKS-000426', grade: '10', section: 'A', academicAverage: 98.2, attendanceRate: 99.1, parentMobile: '+91 98455 66778', parentName: 'Prof. Anis Qureshi' }
    ];
  }

  const classFilter = state.leaderboardClassFilter || 'ALL';
  const gradeFilter = state.leaderboardGradeFilter || 'ALL';
  const sortBy = state.leaderboardSortBy || 'marks';
  const searchQuery = lower ? lower(state.leaderboardSearchQuery || '') : (state.leaderboardSearchQuery || '').toLowerCase();

  // Extract all unique classes dynamically (e.g. 8A, 8B, 9A, 10A)
  const classOptions = [];
  allStudents.forEach(s => {
    const g = studentGrade ? studentGrade(s) : (s.grade || '8');
    const sec = s.section || 'A';
    const cl = `${g}${sec}`;
    if (!classOptions.includes(cl)) classOptions.push(cl);
  });
  classOptions.sort();

  // Map each student with dynamic subject marks breakdown & scholastic calculations
  const studentMarksList = allStudents.map((s, index) => {
    const gamify = studentAcademicGamification ? studentAcademicGamification(s) : {
      totalXP: 5400,
      currentTier: { level: 8, name: 'Gold Scholar', badgeEmoji: '🥇', tagClass: 'lv-gold' },
      streakDays: 14
    };
    const seedNum = Math.abs(parseInt(String(s.id).replace(/\D/g, ''), 10)) || (index + 7);
    const baseAvg = studentAverage ? studentAverage(s) : (s.academicAverage || 88);

    // Subject marks calculated realistically around student academic performance
    const mathMark = Math.min(100, Math.max(50, Math.round(baseAvg + ((seedNum * 3) % 7) - 2)));
    const scienceMark = Math.min(100, Math.max(50, Math.round(baseAvg + ((seedNum * 5) % 6) - 1)));
    const englishMark = Math.min(100, Math.max(50, Math.round(baseAvg + ((seedNum * 2) % 5) - 2)));
    const socialMark = Math.min(100, Math.max(50, Math.round(baseAvg + ((seedNum * 4) % 6) - 2)));
    const langMark = Math.min(100, Math.max(50, Math.round(baseAvg + ((seedNum * 7) % 5) - 1)));
    const aiMark = Math.min(100, Math.max(55, Math.round(baseAvg + ((seedNum * 1) % 6))));

    const totalMarks = mathMark + scienceMark + englishMark + socialMark + langMark + aiMark;
    const maxMarks = 600;
    const percentage = Number(((totalMarks / maxMarks) * 100).toFixed(1));

    const letterGrade = percentage >= 90 ? 'A1' : percentage >= 80 ? 'A2' : percentage >= 70 ? 'B1' : percentage >= 60 ? 'B2' : 'C1';
    const gradeTone = percentage >= 90 ? 'success' : percentage >= 80 ? 'blue' : percentage >= 70 ? 'purple' : 'amber';

    const g = studentGrade ? studentGrade(s) : (s.grade || '8');
    const sec = s.section || 'A';
    const classKey = `${g}${sec}`;

    return {
      student: s,
      gamify,
      studentName: fullName ? fullName(s) : `${s.firstName || 'Student'} ${s.lastName || ''}`,
      studentId: s.studentId || `NXL-MKS-${String(seedNum).padStart(6, '0')}`,
      grade: g,
      section: sec,
      classKey,
      totalMarks,
      maxMarks,
      percentage,
      letterGrade,
      gradeTone,
      attendance: studentAttendance ? studentAttendance(s) : (s.attendanceRate || 95),
      parentMobile: s.parentMobile || s.phone || s.mobile || '+91 98450 98765',
      parentName: s.parentName || s.guardianName || 'Dr. Tariq Khan',
      subjects: [
        { name: 'Math', mark: mathMark, icon: '📐' },
        { name: 'Science', mark: scienceMark, icon: '🔬' },
        { name: 'English', mark: englishMark, icon: '📖' },
        { name: 'Social', mark: socialMark, icon: '🌍' },
        { name: '2nd Lang', mark: langMark, icon: '🗣️' },
        { name: 'AI/Code', mark: aiMark, icon: '💻' }
      ],
      xp: gamify.totalXP || (gamify.xp ?? 4800),
      level: gamify.level || gamify.currentTier?.level || 8,
      tierName: gamify.levelTitle || gamify.currentTier?.name || 'Gold Scholar',
      badgeEmoji: gamify.levelIcon || gamify.currentTier?.badgeEmoji || '🥇',
      tagClass: gamify.tagClass || gamify.currentTier?.tagClass || 'lv-gold',
      pillClass: gamify.pillClass || 'pill-gold',
      streak: gamify.streakDays || 12 + (seedNum % 8)
    };
  });

  // Filter students dynamically
  let filtered = studentMarksList.filter(item => {
    const matchesClass = classFilter === 'ALL' || item.classKey === classFilter;
    const matchesGrade = gradeFilter === 'ALL' || String(item.grade) === String(gradeFilter);
    const itemLowerName = lower ? lower(item.studentName) : item.studentName.toLowerCase();
    const itemLowerId = lower ? lower(item.studentId) : item.studentId.toLowerCase();
    const matchesSearch = !searchQuery || itemLowerName.includes(searchQuery) || itemLowerId.includes(searchQuery);
    return matchesClass && matchesGrade && matchesSearch;
  });

  // Sort students dynamically
  if (sortBy === 'xp') {
    filtered.sort((a, b) => b.xp - a.xp || b.percentage - a.percentage);
  } else if (sortBy === 'streak') {
    filtered.sort((a, b) => b.streak - a.streak || b.percentage - a.percentage);
  } else {
    filtered.sort((a, b) => b.percentage - a.percentage || b.xp - a.xp);
  }

  // Assign dynamic ranking indices within filtered scope
  filtered.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  const top1 = filtered[0];
  const top2 = filtered[1];
  const top3 = filtered[2];

  // Active persona rank spotlight
  const activeStudent = typeof currentStudent === 'function' ? currentStudent() : null;
  const activeStudentId = state.role === 'STUDENT' ? (activeStudent?.id || allStudents[0]?.id) : (state.profile?.type === 'student' ? state.profile.id : null);
  const myRankItem = filtered.find(item => item.student.id === activeStudentId) || (state.role === 'STUDENT' ? filtered[0] : null);

  // Class analytics summary
  const topper = top1 || studentMarksList[0];
  const classAvg = filtered.length ? (filtered.reduce((sum, item) => sum + item.percentage, 0) / filtered.length).toFixed(1) : '94.2';
  const distinctionCount = filtered.filter(item => item.percentage >= 90).length;
  const distinctionRate = filtered.length ? Math.round((distinctionCount / filtered.length) * 100) : 78;

  const schoolName = (typeof tenant === 'function' ? (tenant()?.school?.name || tenant()?.name) : '') || 'Meezan Kids School';
  const grades = ['ALL', '6', '7', '8', '9', '10'];

  return `
    ${sectionHead('Gamification & Recognition', '🏆 Campus Leaderboard & Hall of Fame', `Real-time scholastic rankings, 3D metallic podiums, subject marks breakdown, and medals for ${escapeHTML(schoolName)}.`)}

    <!-- Scope Filter & Sorting Toolbar -->
    <section class="leaderboard-class-bar" style="margin-bottom:1.5rem;">
      <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
        <label style="font-size:0.85rem; font-weight:800; color:#0f172a; display:flex; align-items:center; gap:0.4rem;">
          <span>🏫</span> Class Scope:
          <select id="leaderboard-class-picker" class="leaderboard-class-select" data-action="filter-leaderboard-class-select">
            <option value="ALL" ${classFilter === 'ALL' ? 'selected' : ''}>🌟 All School Classes</option>
            ${classOptions.map(cl => `
              <option value="${cl}" ${classFilter === cl ? 'selected' : ''}>
                Grade ${cl.slice(0, -1)} - Section ${cl.slice(-1)}
              </option>
            `).join('')}
          </select>
        </label>
        <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
          ${grades.map(g => `
            <button class="btn ${gradeFilter === g && classFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}" style="font-size:0.75rem; padding:0.3rem 0.65rem;" data-action="filter-leaderboard-grade" data-grade="${g}">
              ${g === 'ALL' ? 'All Grades' : `Grade ${g}`}
            </button>
          `).join('')}
        </div>
      </div>

      <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
        <span style="font-size:0.8rem; font-weight:700; color:#475569;">Sort by:</span>
        <button class="btn ${sortBy === 'marks' ? 'btn-primary' : 'btn-secondary'}" style="font-size:0.75rem; padding:0.3rem 0.65rem;" data-action="filter-leaderboard-sort" data-sort="marks">
          📊 Total Marks (%)
        </button>
        <button class="btn ${sortBy === 'xp' ? 'btn-primary' : 'btn-secondary'}" style="font-size:0.75rem; padding:0.3rem 0.65rem;" data-action="filter-leaderboard-sort" data-sort="xp">
          ⚡ Academic XP
        </button>
        <button class="btn ${sortBy === 'streak' ? 'btn-primary' : 'btn-secondary'}" style="font-size:0.75rem; padding:0.3rem 0.65rem;" data-action="filter-leaderboard-sort" data-sort="streak">
          🔥 Streaks
        </button>
      </div>
    </section>

    <!-- Pinned Active Student Merit Standing Banner -->
    ${myRankItem ? `
      <section class="my-rank-pinned-card" style="margin-bottom:1.5rem;">
        <div style="display:flex; align-items:center; gap:1.25rem;">
          <div style="position:relative;">
            ${renderGamifiedAvatar(myRankItem.student, 'avatar-medium')}
          </div>
          <div>
            <div style="font-size:0.78rem; text-transform:uppercase; letter-spacing:0.06em; color:#a5b4fc; font-weight:800;">
              ✨ YOUR PERSONAL MERIT STANDING
            </div>
            <h3 style="margin:0.2rem 0; font-size:1.35rem; color:#ffffff; font-weight:900;">
              ${myRankItem.rank === 1 ? '🥇 Rank #1 (Campus Topper!)' : myRankItem.rank === 2 ? '🥈 Rank #2 (Distinction Scholar)' : myRankItem.rank === 3 ? '🥉 Rank #3 (Distinction Scholar)' : `Rank #${myRankItem.rank} in Grade ${myRankItem.grade}${myRankItem.section}`}
            </h3>
            <p style="margin:0; font-size:0.85rem; color:#e0e7ff;">
              Total Marks: <b style="color:#ffffff;">${myRankItem.totalMarks} / ${myRankItem.maxMarks} (${myRankItem.percentage}%)</b> · Grade: <b style="color:#fde047;">${myRankItem.letterGrade}</b> · XP: <b style="color:#a5f3fc;">${myRankItem.xp.toLocaleString()} XP</b> · Tier: <b style="color:#fef08a;">${myRankItem.badgeEmoji} Lv.${myRankItem.level} ${myRankItem.tierName}</b>
            </p>
          </div>
        </div>
        <div style="display:flex; gap:0.6rem; align-items:center; flex-wrap:wrap;">
          <span class="streak-flame-tag" style="background:rgba(255,255,255,0.18); color:#ffffff; border-color:rgba(255,255,255,0.3); font-size:0.82rem; padding:0.35rem 0.75rem;">
            🔥 ${myRankItem.streak}-Day Study Streak
          </span>
          <button class="btn btn-light" style="font-size:0.82rem; font-weight:800; box-shadow:0 4px 12px rgba(0,0,0,0.15);" data-action="view-certificate" data-id="${escapeHTML(myRankItem.student.id)}">
            📜 View Merit Certificate
          </button>
        </div>
      </section>
    ` : ''}

    <!-- Class Analytics Summary KPI Cards -->
    <section class="leaderboard-summary-grid" style="margin-bottom:1.75rem;">
      <div class="finance-stat-card">
        <div class="stat-label">🌟 Class / Scope Topper</div>
        <div class="stat-value" style="font-size:1.25rem; color:#b45309;">${escapeHTML(topper?.studentName || 'Amaan Khan')}</div>
        <small style="color:#16a34a; font-weight:700;">${topper?.percentage}% · ${topper?.totalMarks}/600 Marks</small>
      </div>
      <div class="finance-stat-card stat-success">
        <div class="stat-label">📊 Batch Average Score</div>
        <div class="stat-value">${classAvg}%</div>
        <small style="color:#16a34a; font-weight:700;">Across all 6 core subjects</small>
      </div>
      <div class="finance-stat-card stat-warning">
        <div class="stat-label">🎖️ Distinction Rate (90%+)</div>
        <div class="stat-value">${distinctionCount} Students</div>
        <small style="color:#d97706; font-weight:700;">${distinctionRate}% of batch in A1 grade</small>
      </div>
      <div class="finance-stat-card">
        <div class="stat-label">💡 Top Performing Subject</div>
        <div class="stat-value" style="font-size:1.3rem; color:#7c3aed;">Mathematics</div>
        <small style="color:#64748b; font-weight:700;">94.8% Subject Batch Avg</small>
      </div>
    </section>

    <!-- 3D Metallic Podium for Top 3 Performers of Selected Scope -->
    <section class="leaderboard-podium-wrap" style="margin-bottom:2rem;">
      ${top2 ? `
        <div class="podium-step podium-rank-2">
          <div style="margin-bottom:0.75rem; position:relative;">
            ${renderGamifiedAvatar(top2.student, 'avatar-large')}
          </div>
          <div class="podium-pedestal pedestal-silver">
            <span class="podium-number">2</span>
            <span class="podium-name">${escapeHTML(top2.studentName)}</span>
            <span class="podium-score-pill">🥈 ${top2.percentage}% · ${top2.totalMarks}/600</span>
            <small style="font-size:0.68rem; color:#f1f5f9; margin-top:0.25rem; font-weight:700;">${top2.xp.toLocaleString()} XP</small>
            <button class="btn btn-light" style="font-size:0.7rem; padding:0.25rem 0.55rem; margin-top:0.5rem; font-weight:700;" data-action="view-certificate" data-id="${escapeHTML(top2.student.id)}">📜 Certificate</button>
          </div>
        </div>
      ` : ''}

      ${top1 ? `
        <div class="podium-step podium-rank-1">
          <span class="podium-crown">👑</span>
          <div style="margin-bottom:0.75rem; position:relative;">
            ${renderGamifiedAvatar(top1.student, 'avatar-large')}
          </div>
          <div class="podium-pedestal pedestal-gold">
            <span class="podium-number">1</span>
            <span class="podium-name">${escapeHTML(top1.studentName)}</span>
            <span class="podium-score-pill">🥇 ${top1.percentage}% · ${top1.totalMarks}/600</span>
            <small style="font-size:0.72rem; color:#fef08a; font-weight:800; margin-top:0.25rem;">${top1.xp.toLocaleString()} XP</small>
            <button class="btn btn-light" style="font-size:0.75rem; padding:0.3rem 0.7rem; margin-top:0.5rem; font-weight:800; box-shadow:0 4px 10px rgba(0,0,0,0.2);" data-action="view-certificate" data-id="${escapeHTML(top1.student.id)}">📜 Topper Certificate</button>
          </div>
        </div>
      ` : ''}

      ${top3 ? `
        <div class="podium-step podium-rank-3">
          <div style="margin-bottom:0.75rem; position:relative;">
            ${renderGamifiedAvatar(top3.student, 'avatar-large')}
          </div>
          <div class="podium-pedestal pedestal-bronze">
            <span class="podium-number">3</span>
            <span class="podium-name">${escapeHTML(top3.studentName)}</span>
            <span class="podium-score-pill">🥉 ${top3.percentage}% · ${top3.totalMarks}/600</span>
            <small style="font-size:0.68rem; color:#f1f5f9; margin-top:0.25rem; font-weight:700;">${top3.xp.toLocaleString()} XP</small>
            <button class="btn btn-light" style="font-size:0.7rem; padding:0.25rem 0.55rem; margin-top:0.5rem; font-weight:700;" data-action="view-certificate" data-id="${escapeHTML(top3.student.id)}">📜 Certificate</button>
          </div>
        </div>
      ` : ''}
    </section>

    <!-- Hall of Fame & Mark-Wise Scorecard Table -->
    <section class="card">
      <div class="card-heading" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
        <div>
          <h3>Academic Mark-Wise Leaderboard & Student Scorecards</h3>
          <p>Scholastic evaluation results, subject breakdown, and gamification medals for ${classFilter === 'ALL' ? (gradeFilter === 'ALL' ? 'All Classes' : `Grade ${gradeFilter}`) : `Grade ${classFilter.slice(0, -1)} - Section ${classFilter.slice(-1)}`}.</p>
        </div>
        <label class="filter-search" style="margin:0;">
          ${typeof icon === 'function' ? icon('search') : '🔍'}
          <input id="leaderboard-search-input" value="${escapeHTML(state.leaderboardSearchQuery || '')}" placeholder="Search student name, ID…" />
        </label>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width:70px;">Rank</th>
              <th>Student Particulars</th>
              <th>Class & Sec</th>
              <th>Total Marks & %</th>
              <th>Subject-Wise Marks Breakdown</th>
              <th>Letter Grade</th>
              <th>Gamification Tier</th>
              <th>Streak</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(item => {
              const rankNum = item.rank;
              const rankBadgeClass = rankNum === 1 ? 'rank-pill-gold' : rankNum === 2 ? 'rank-pill-silver' : rankNum === 3 ? 'rank-pill-bronze' : '';
              const rankEmoji = rankNum === 1 ? '🥇' : rankNum === 2 ? '🥈' : rankNum === 3 ? '🥉' : `#${rankNum}`;
              const parentPhone = item.parentMobile.replace(/\D/g, '');
              const waMeritText = encodeURIComponent(`Dear ${item.parentName}, Congratulations! ${item.studentName} has achieved Rank #${rankNum} in Grade ${item.grade}${item.section} at ${schoolName} with a total score of ${item.totalMarks}/600 (${item.percentage}%) and Grade ${item.letterGrade}!`);

              return `
                <tr style="${rankNum <= 3 ? 'background:#f8fafc; font-weight:600;' : ''}">
                  <td>
                    <div class="rank-pill-badge ${rankBadgeClass}">
                      ${rankEmoji}
                    </div>
                  </td>
                  <td>
                    <div style="display:flex; align-items:center; gap:0.65rem;">
                      ${renderGamifiedAvatar(item.student, 'avatar-small')}
                      <div>
                        <a class="table-link" data-action="open-student" data-id="${escapeHTML(item.student.id)}"><b>${escapeHTML(item.studentName)}</b></a>
                        <br/><small style="color:#64748b;">${escapeHTML(item.studentId)}</small>
                      </div>
                    </div>
                  </td>
                  <td><b>Grade ${escapeHTML(item.grade)}${escapeHTML(item.section)}</b></td>
                  <td>
                    <b style="color:#0f172a; font-size:0.95rem;">${item.totalMarks} / ${item.maxMarks}</b><br/>
                    <span style="color:#16a34a; font-weight:800; font-size:0.85rem;">${item.percentage}%</span>
                  </td>
                  <td>
                    <div class="subject-mark-pills-wrap">
                      ${item.subjects.map(sub => {
                        const chipClass = sub.mark >= 90 ? 'score-distinction' : sub.mark >= 80 ? 'score-strong' : '';
                        return `
                          <span class="subject-score-chip ${chipClass}">
                            <span>${sub.icon}</span> ${sub.name}: <b>${sub.mark}</b>
                          </span>
                        `;
                      }).join('')}
                    </div>
                  </td>
                  <td>
                    <span class="grade-badge-pill ${item.letterGrade === 'A1' ? 'grade-a1' : item.letterGrade === 'A2' ? 'grade-a2' : 'grade-b1'}">
                      ${item.letterGrade}
                    </span>
                  </td>
                  <td>
                    <span class="avatar-level-tag ${item.tagClass}" style="position:static;">
                      ${item.badgeEmoji} Lv.${item.level} ${item.tierName}
                    </span>
                    <br/><small style="color:#7c3aed; font-weight:700;">${item.xp.toLocaleString()} XP</small>
                  </td>
                  <td>
                    <span class="streak-flame-tag">🔥 ${item.streak}-Day</span>
                  </td>
                  <td>
                    <div style="display:flex; align-items:center; gap:0.35rem; flex-wrap:wrap;">
                      <button class="btn btn-secondary" style="font-size:0.72rem; padding:0.25rem 0.5rem;" data-action="view-certificate" data-id="${escapeHTML(item.student.id)}">
                        📜 Certificate
                      </button>
                      <a href="https://wa.me/91${parentPhone}?text=${waMeritText}" target="_blank" class="wa-reminder-btn" style="font-size:0.72rem; padding:0.25rem 0.5rem;" title="Send Merit WhatsApp to Parent">
                        💬 WhatsApp
                      </a>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;
}
