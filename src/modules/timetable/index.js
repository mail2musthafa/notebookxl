/**
 * NotebookXL Timetable Module (ES Module)
 */

export function renderTimetable(state, currentTeacher, currentStudent, studentGrade, teacherAssignments, timetable, parseTimetableDate, lower, subjectName, calendarMonthsForYear, sectionHead, button, icon, tenant, escapeHTML) {
  const teacher = state.role === 'TEACHER' ? currentTeacher() : null;
  const student = state.role === 'STUDENT' ? currentStudent() : null;
  const classScope = state.classScope || { grade: student ? studentGrade(student) : teacher ? teacherAssignments(teacher)[0]?.grade || '8' : '8', section: student ? student.section : teacher ? teacherAssignments(teacher)[0]?.section || 'A' : 'A' };
  const entries = timetable().filter((entry) => (!entry.grade || String(entry.grade).replace(/^Grade\s*/i,'') === String(classScope.grade)) && (!entry.section || entry.section === classScope.section));
  const subjectsForGrid = entries.length ? entries : [['Mathematics','Priya Sharma'],['Science','Arjun Rao'],['English','Ayesha Khan'],['Social Science','Naveen Kumar'],['Computer Science','Vikram Reddy']].map(([subject, teacherName], index) => ({ subject, teacherName, day: ['Monday','Tuesday','Wednesday','Thursday','Friday'][index], period: index + 1, startTime: ['08:30','09:20','10:30','11:30','12:20'][index], room: ['201','Lab 1','108','202','Computer Lab'][index] }));
  const timetableDate = parseTimetableDate();
  const timetableView = state.timetableView || 'month';
  const dateLabel = timetableDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  const monthLabel = timetableDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const yearLabel = String(timetableDate.getFullYear());
  const weekday = timetableDate.toLocaleDateString('en-US', { weekday: 'long' });
  const weekdayKey = lower(weekday);

  const daySlots = ['08:30', '09:20', '10:30', '11:30', '12:20'].map((time, index) => {
    const found = subjectsForGrid.find((entry) => lower(entry.day || '') === weekdayKey && Number(entry.period || 0) === index + 1)
      || subjectsForGrid[index % Math.max(1, subjectsForGrid.length)];
    return {
      time,
      subject: found?.subject || subjectName(found?.subjectId) || 'Class session',
      teacherName: found?.teacherName || found?.teacher || 'Teacher',
      room: found?.room || 'Room 201'
    };
  });

  const monthFirst = new Date(timetableDate.getFullYear(), timetableDate.getMonth(), 1);
  const daysInMonth = new Date(timetableDate.getFullYear(), timetableDate.getMonth() + 1, 0).getDate();
  const monthStartsOn = monthFirst.getDay();
  const coveredWeekdays = new Set(subjectsForGrid.map((entry) => lower(entry.day || '')).filter(Boolean));
  const monthCells = Array.from({ length: monthStartsOn }, () => ({ empty: true }))
    .concat(Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const date = new Date(timetableDate.getFullYear(), timetableDate.getMonth(), day);
      const weekdayForCell = lower(date.toLocaleDateString('en-US', { weekday: 'long' }));
      const active = coveredWeekdays.has(weekdayForCell);
      const selected = day === timetableDate.getDate();
      return { day, active, selected };
    }));

  const months = calendarMonthsForYear(timetableDate.getFullYear());
  const monthWithMostLoad = months.reduce((best, current) => (current.events > best.events ? current : best), months[0]);

  const dayView = `<div class="timetable-day-list">${daySlots.map((slot, index) => `<button class="timetable-day-item ${index === 0 ? 'current-slot' : ''}" data-action="open-timetable-entry"><time>${slot.time}</time><span><b>${escapeHTML(slot.subject)}</b><small>${escapeHTML(slot.teacherName)} · ${escapeHTML(slot.room)}</small></span>${index === 0 ? '<em>Now</em>' : ''}</button>`).join('')}</div>`;
  const monthView = `<div class="timetable-month-view"><div class="timetable-weekdays">${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => `<span>${d}</span>`).join('')}</div><div class="timetable-month-grid">${monthCells.map((cell) => cell.empty ? '<span class="month-cell empty"></span>' : `<button class="month-cell ${cell.active ? 'active' : ''} ${cell.selected ? 'selected' : ''}" ${cell.selected ? '' : `data-action="set-timetable-date" data-day="${cell.day}"`}><b>${cell.day}</b><small>${cell.active ? 'Classes' : 'No classes'}</small></button>`).join('')}</div></div>`;
  const yearView = `<article class="card timetable-year-view"><div class="card-heading"><div><h3>Year timetable calendar</h3><p>Month-wise schedule intensity for ${escapeHTML(yearLabel)}</p></div></div><div class="month-grid">${months.map((item) => `<button class="month-tile ${item.active ? 'active' : ''}" data-action="set-timetable-month" data-month="${item.index}"><b>${escapeHTML(item.month)}</b><small>${item.events} class windows</small></button>`).join('')}</div><div class="calendar-upcoming"><b>Focus month</b><p>${escapeHTML(monthWithMostLoad?.label || monthLabel)} has the highest class activity.</p></div></article>`;

  return `${sectionHead(state.role === 'STUDENT' ? 'My learning day' : 'Academics', state.role === 'STUDENT' ? 'My timetable' : 'Timetable', `Grade ${classScope.grade}${classScope.section} · ${tenant()?.academicYear || '2026–27'}`, state.role === 'SCHOOL_ADMIN' ? button(`${icon('plus')} Add timetable entry`, 'open-add-timetable', 'primary') : '')}<section class="card timetable-card"><div class="timetable-toolbar"><div><button class="btn btn-secondary" data-action="change-class-scope">Grade ${escapeHTML(classScope.grade)}${escapeHTML(classScope.section)} ${icon('chevron')}</button><div class="timetable-view-switch"><button class="filter-chip ${timetableView === 'day' ? 'active' : ''}" data-action="set-timetable-view" data-view="day">Day</button><button class="filter-chip ${timetableView === 'month' ? 'active' : ''}" data-action="set-timetable-view" data-view="month">Month</button><button class="filter-chip ${timetableView === 'year' ? 'active' : ''}" data-action="set-timetable-view" data-view="year">Year</button></div></div><div class="timetable-nav"><button class="icon-button" data-action="change-timetable-date" data-direction="prev" aria-label="Previous">‹</button><strong>${escapeHTML(timetableView === 'day' ? `${weekday}, ${dateLabel}` : timetableView === 'month' ? monthLabel : yearLabel)}</strong><button class="icon-button" data-action="change-timetable-date" data-direction="next" aria-label="Next">›</button><button class="btn btn-secondary" data-action="change-timetable-date" data-direction="today">Today</button><button class="text-button" data-action="export-timetable">Export schedule</button></div></div><div class="timetable-panel">${timetableView === 'day' ? dayView : timetableView === 'year' ? yearView : monthView}</div></section>`;
}
