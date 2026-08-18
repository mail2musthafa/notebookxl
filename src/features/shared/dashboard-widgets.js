export function calendarMonthsForYear(year) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const activityMonths = new Set([5, 6, 7, 8, 9, 10, 11, 0, 1, 2]);
  return months.map((month, index) => ({
    month,
    index,
    active: activityMonths.has(index),
    events: activityMonths.has(index) ? (index % 3 === 0 ? 4 : index % 2 === 0 ? 3 : 2) : 1,
    label: `${month} ${year}`
  }));
}

export function renderAcademicYearCalendarCard({ title, subtitle, year, months, upcoming, escapeHTML }) {
  return `<article class="card academic-calendar-card"><div class="card-heading"><div><h3>${escapeHTML(title)}</h3><p>${escapeHTML(subtitle)}</p></div><div class="calendar-year-controls"><button class="icon-button" data-action="change-calendar-year" data-direction="prev" aria-label="Previous year">‹</button><strong>${year}</strong><button class="icon-button" data-action="change-calendar-year" data-direction="next" aria-label="Next year">›</button></div></div><div class="month-grid">${months.map((item) => `<button class="month-tile ${item.active ? 'active' : ''}"><b>${item.month}</b><small>${item.events} events</small></button>`).join('')}</div><div class="calendar-upcoming"><b>Upcoming</b>${upcoming.map((entry) => `<p>${escapeHTML(entry)}</p>`).join('')}</div></article>`;
}

export function renderSchoolTimingCountdownCard({ countdown, config, escapeHTML }) {
  return `<article class="card school-timing-card"><div class="card-heading"><div><h3>School Timing Countdown</h3><p>Customizable by workspace</p></div><button class="btn btn-secondary" data-action="open-school-timing">Customize</button></div><div class="timing-main"><small>${escapeHTML(countdown.title)}</small><strong>${escapeHTML(countdown.value)}</strong><p>${escapeHTML(countdown.note)}</p></div><div class="timing-progress"><i style="width:${countdown.progress}%"></i></div><div class="timing-meta"><span>Start: <b>${escapeHTML(config.startTime)}</b></span><span>End: <b>${escapeHTML(config.endTime)}</b></span></div></article>`;
}
