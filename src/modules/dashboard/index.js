/**
 * NotebookXL Management Overview & School Pulse Module (ES Module)
 */

export function renderDashboard(state, currentUser, remoteSchool, dashboardSyncPill, button, icon, stateRemoteDashboards, students, compact, attendanceValue, ops, teachersMetric, academicValue, assignmentsValue, filterToolbar, metric, attentionItems, studentAttendance, escapeHTML, sectionHead) {
  const attentionStudents = [...students()].sort((a, b) => studentAttendance(a) - studentAttendance(b)).slice(0, 4);

  return `${sectionHead('Management workspace', `Good morning, ${currentUser().firstName || 'Farah'}`, `Here is how ${escapeHTML(remoteSchool)} is progressing today.`, `<div class="heading-actions">${dashboardSyncPill()} <button class="btn btn-secondary" style="background:#ef4444; color:#ffffff; border-color:#ef4444; font-weight:700;" data-action="open-emergency-broadcast">📢 Emergency Broadcast</button> ${button('Open School Pulse', 'open-pulse', 'secondary')} ${button(`${icon('plus')} Add student`, 'open-add-student', 'primary')}</div>`)}
    ${stateRemoteDashboards.loading ? '<div class="info-banner">Loading live management dashboard data…</div>' : ''}
    ${stateRemoteDashboards.error ? `<div class="info-banner warning">${escapeHTML(stateRemoteDashboards.error)}</div>` : ''}
    <section class="metric-grid" style="grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));">
      ${metric('Total Students', compact(students().length), `+${ops.students.newThisYear} this academic year`, 'blue', 'people')}
      ${metric('Student Attendance Today', `${attendanceValue.toFixed(1)}%`, `${ops.students.present} present · ${ops.students.absent} absent`, 'green', 'check')}
      ${metric('Teachers Present Today', `${ops.teachers.present}/${teachersMetric}`, `${ops.teachers.absent} absent · ${ops.teachers.leave} leave`, 'purple', 'people')}
      ${metric("Today's Fee Collections", "₹48,500", "₹2.4L Outstanding Dues", "green", "task")}
      ${metric('Pending Actions', `${attentionItems.length + ops.overdueTasks}`, `${ops.pendingMarks} marks pending · ${ops.overdueTasks} tasks overdue`, 'amber', 'task')}
    </section>
    <section class="dashboard-quick-actions">
      <button class="quick-action-btn" data-action="nav" data-page="leaderboard">🏆 3D Leaderboard</button>
      <button class="quick-action-btn" data-action="open-discord-voice" data-channel="management" style="background:#5865f2; color:#ffffff; font-weight:700;">🎧 Discord Principal Voice</button>
      <button class="quick-action-btn" data-action="nav" data-page="fees">💳 Fees & Dues</button>
      <button class="quick-action-btn" data-action="nav" data-page="report-cards">📄 Report Cards</button>
      <button class="quick-action-btn" data-action="nav" data-page="attendance">${icon('check')} Attendance</button>
      <button class="quick-action-btn" data-action="nav" data-page="announcements">${icon('bell')} Community</button>
      <button class="quick-action-btn" data-action="open-emergency-broadcast">📢 Broadcast Notice</button>
      <button class="quick-action-btn" data-action="nav" data-page="reports">${icon('chart')} Reports</button>
    </section>
    ${filterToolbar()}
    <article class="card pulse-card school-pulse" style="background:linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); border:1px solid #cbd5e1; border-radius:20px; padding:1.5rem; box-shadow:0 12px 32px rgba(15,23,42,0.08); margin-bottom:1.5rem;">
      <div class="card-heading" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:1rem; margin-bottom:1.25rem;">
        <div>
          <div style="display:flex; align-items:center; gap:0.65rem;">
            <h2 style="margin:0; font-size:1.4rem; color:#0f172a; font-weight:900;">🏫 School Pulse Command Center</h2>
            <span style="background:#dcfce7; color:#15803d; border:1px solid #86efac; padding:0.25rem 0.75rem; border-radius:20px; font-size:0.75rem; font-weight:800; display:inline-flex; align-items:center; gap:0.35rem;">
              <span style="width:8px; height:8px; background:#16a34a; border-radius:50%; display:inline-block; animation:pulse 1.5s infinite;"></span> LIVE REAL-TIME PULSE
            </span>
          </div>
          <p style="margin:0.25rem 0 0 0; color:#64748b; font-size:0.85rem;">Comprehensive campus operations, live attendance, academic health & financial ledger snapshot.</p>
        </div>
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <button class="btn btn-secondary" data-action="open-emergency-broadcast" style="background:#dc2626; color:#ffffff; border-color:#dc2626; font-weight:800; padding:0.5rem 1rem; border-radius:10px; font-size:0.82rem;">📢 Broadcast Alert</button>
          <button class="btn btn-secondary" data-action="open-pulse" style="font-weight:700; padding:0.5rem 1rem; border-radius:10px; font-size:0.82rem;">${state.pulseExpanded ? 'Collapse Insights' : 'Expand Insights ▾'}</button>
        </div>
      </div>

      <div class="school-pulse-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1rem; margin-bottom:1.25rem;">
        ${metric('Student Attendance', `${attendanceValue.toFixed(2)}%`, `${ops.students.present} Present · ${ops.students.absent} Absent`, 'green', 'check')}
        ${metric('Academic Average', `${(Math.round(academicValue * 10) / 10).toFixed(2)}%`, 'Across All Published Marks', 'purple', 'chart')}
        ${metric('Teacher Attendance', `${ops.teachers.present}/${teachersMetric}`, `${ops.teachers.absent} Absent`, 'blue', 'people')}
        ${metric("Today's Fee Collections", "₹48,500", "₹2.4L Dues Pending", "green", "task")}
        ${metric('Active Assignments', `${assignmentsValue}`, `${ops.pendingMarks} Marks Pending`, 'amber', 'task')}
        ${metric('Substitutes Required', `${ops.classes.substituteRequired}`, `${ops.teachers.absent} Teachers Away Today`, 'amber', 'people')}
      </div>
    </article>`;
}
