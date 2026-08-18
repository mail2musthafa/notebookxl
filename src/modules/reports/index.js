/**
 * NotebookXL Single-Page A4 Precision Report Card Module (ES Module)
 * Formatted strictly for 1 single A4 page with horizontal Part 2 & Part 3 layout.
 */

export function renderReportCards(state, students, currentStudent, studentAverage, studentAttendance, tenant, subjects, displayGrade, sectionHead, escapeHTML, fullName) {
  let allStudents = typeof students === 'function' ? students() : [];
  if (!allStudents || allStudents.length === 0) {
    allStudents = [
      { id: 'student-1', firstName: 'Amaan', lastName: 'Khan', rollNumber: '17', studentId: 'NXL-MKS-000421', admissionNumber: 'MKS-ADM-2018-00421', grade: '8', section: 'A', dateOfBirth: '2012-05-17', parentName: 'Dr. Tariq Khan', motherName: 'Mrs. Nilofer Khan', bloodGroup: 'O +ve', academicAverage: 97.4, attendanceRate: 98.2, parentMobile: '+91 98450 98765' },
      { id: 'student-2', firstName: 'Sara', lastName: 'Ahmed', rollNumber: '18', studentId: 'NXL-MKS-000422', admissionNumber: 'MKS-ADM-2018-00422', grade: '8', section: 'A', dateOfBirth: '2012-08-22', parentName: 'Mr. Farhan Ahmed', motherName: 'Mrs. Shabana Ahmed', bloodGroup: 'A +ve', academicAverage: 95.8, attendanceRate: 97.0, parentMobile: '+91 98451 22334' },
      { id: 'student-3', firstName: 'Zayan', lastName: 'Malik', rollNumber: '19', studentId: 'NXL-MKS-000423', admissionNumber: 'MKS-ADM-2018-00423', grade: '8', section: 'B', dateOfBirth: '2012-03-10', parentName: 'Mrs. Fatima Malik', motherName: 'Mrs. Fatima Malik', bloodGroup: 'B +ve', academicAverage: 94.2, attendanceRate: 96.5, parentMobile: '+91 98452 33445' }
    ];
  }

  const selectedStudentId = state.selectedReportCardStudentId || (state.role === 'STUDENT' ? currentStudent()?.id : allStudents[0]?.id);
  const student = allStudents.find(s => s.id === selectedStudentId) || (typeof currentStudent === 'function' ? currentStudent() : null) || allStudents[0];
  const selectedTerm = state.reportCardTerm || 'Term 2 (Mid-Term)';

  const avg = typeof studentAverage === 'function' ? studentAverage(student) : (student.academicAverage || 96);
  const att = typeof studentAttendance === 'function' ? studentAttendance(student) : (student.attendanceRate || 98);
  const sch = typeof tenant === 'function' ? tenant() : null;
  const schName = sch?.school?.name || sch?.name || 'Meezan Kids School';
  const studName = typeof fullName === 'function' ? fullName(student) : `${student.firstName || ''} ${student.lastName || ''}`.trim();
  const studGrade = typeof displayGrade === 'function' ? displayGrade(student) : `${student.grade || '8'}${student.section || 'A'}`;
  const seedNum = Math.abs(parseInt(String(student.id).replace(/\D/g, ''), 10)) || 17;

  // 6 Core CBSE / State subjects
  const subjectList = [
    { code: 'MAT-041', name: 'Mathematics', fa: 19, nb: 9, se: 10, sa: 59, remarks: 'Outstanding analytical accuracy' },
    { code: 'SCI-086', name: 'Science (Physics, Chem, Bio)', fa: 18, nb: 10, se: 9, sa: 58, remarks: 'Strong conceptual clarity' },
    { code: 'ENG-184', name: 'English Language & Literature', fa: 19, nb: 9, se: 9, sa: 57, remarks: 'Articulate expression & vocabulary' },
    { code: 'SST-087', name: 'Social Science (Hist, Civ, Geo)', fa: 18, nb: 9, se: 10, sa: 58, remarks: 'Insightful analytical & map skills' },
    { code: 'LAN-002', name: 'Second Language (Hindi / Regional)', fa: 19, nb: 10, se: 10, sa: 59, remarks: 'Flawless grammatical fluency' },
    { code: 'CSC-165', name: 'Computer Science & AI Applications', fa: 20, nb: 10, se: 10, sa: 60, remarks: 'Exceptional algorithmic logic' }
  ];

  const scoredSubjects = subjectList.map((sub, idx) => {
    const variance = ((seedNum * (idx + 3)) % 5) - 2;
    const baseSubjectAvg = Math.min(99, Math.max(55, Math.round(avg + variance)));
    
    const faScore = Math.min(20, Math.max(12, Math.round(baseSubjectAvg * 0.20)));
    const nbScore = Math.min(10, Math.max(7, Math.round(baseSubjectAvg * 0.10)));
    const seScore = Math.min(10, Math.max(7, Math.round(baseSubjectAvg * 0.10)));
    const saScore = Math.min(60, Math.max(30, Math.round(baseSubjectAvg * 0.60)));
    const totalScore = faScore + nbScore + seScore + saScore;

    const letterGrade = totalScore >= 91 ? 'A1' : totalScore >= 81 ? 'A2' : totalScore >= 71 ? 'B1' : totalScore >= 61 ? 'B2' : 'C1';
    const gradePoint = totalScore >= 91 ? '10.0' : totalScore >= 81 ? '9.0' : totalScore >= 71 ? '8.0' : totalScore >= 61 ? '7.0' : '6.0';

    return {
      ...sub,
      fa: faScore,
      nb: nbScore,
      se: seScore,
      sa: saScore,
      total: totalScore,
      letterGrade,
      gradePoint
    };
  });

  const grandTotal = scoredSubjects.reduce((sum, s) => sum + s.total, 0);
  const maxGrandTotal = scoredSubjects.length * 100;
  const overallPercentage = Number(((grandTotal / maxGrandTotal) * 100).toFixed(1));
  const overallGrade = overallPercentage >= 91 ? 'A1 (Outstanding)' : overallPercentage >= 81 ? 'A2 (Excellent)' : 'B1 (Very Good)';
  const classRank = overallPercentage >= 95 ? 'Rank #1' : overallPercentage >= 90 ? 'Rank #2' : 'Rank #3';

  const totalDays = 180;
  const attendedDays = Math.round((att / 100) * totalDays);
  const parentMobile = (student.parentMobile || student.phone || '+91 98450 98765').replace(/\D/g, '');
  const waReportText = encodeURIComponent(`Dear ${student.parentName || 'Parent'}, Official Academic Progress Report for ${studName} (Grade ${studGrade}) for ${selectedTerm} at ${schName}: Total Score: ${grandTotal}/${maxGrandTotal} (${overallPercentage}%), Overall Grade: ${overallGrade}, Class Rank: ${classRank}.`);

  return `
    <!-- Selection & Action Toolbar -->
    <section class="card" style="margin-bottom:1.25rem; background:#f8fafc; border:1.5px solid #cbd5e1; padding:0.85rem 1.15rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
        <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
          ${state.role !== 'STUDENT' ? `
            <label style="font-size:0.82rem; font-weight:800; color:#0f172a; display:flex; align-items:center; gap:0.35rem;">
              <span>👨‍🎓</span> Student:
              <select id="report-card-student-picker" style="padding:0.4rem 0.75rem; border:1.5px solid #2563eb; border-radius:6px; font-weight:800; color:#1e40af; background:#ffffff; cursor:pointer; min-width:240px; font-size:0.82rem;">
                ${allStudents.map(s => `
                  <option value="${s.id}" ${s.id === student.id ? 'selected' : ''}>
                    ${escapeHTML(typeof fullName === 'function' ? fullName(s) : (s.name || s.firstName))} · Grade ${escapeHTML(typeof displayGrade === 'function' ? displayGrade(s) : `${s.grade||'8'}${s.section||'A'}`)}
                  </option>
                `).join('')}
              </select>
            </label>
          ` : ''}

          <label style="font-size:0.82rem; font-weight:800; color:#0f172a; display:flex; align-items:center; gap:0.35rem;">
            <span>🗓️</span> Term:
            <select id="report-card-term-picker" style="padding:0.4rem 0.75rem; border:1.5px solid #2563eb; border-radius:6px; font-weight:800; color:#1e40af; background:#ffffff; cursor:pointer; font-size:0.82rem;">
              <option value="Term 1 (First Assessment)" ${selectedTerm.includes('Term 1') ? 'selected' : ''}>Term 1 (First Assessment)</option>
              <option value="Term 2 (Mid-Term)" ${selectedTerm.includes('Term 2') || selectedTerm.includes('Mid-Term') ? 'selected' : ''}>Term 2 (Mid-Term Evaluation)</option>
              <option value="Annual Final Examination 2026-27" ${selectedTerm.includes('Annual') ? 'selected' : ''}>Annual Final Examination 2026–27</option>
            </select>
          </label>
        </div>

        <div style="display:flex; gap:0.5rem; flex-wrap:wrap; align-items:center;">
          <a href="https://wa.me/91${parentMobile}?text=${waReportText}" target="_blank" class="wa-reminder-btn" style="font-size:0.8rem; padding:0.4rem 0.85rem;" title="Send WhatsApp to Parent">
            💬 WhatsApp Report
          </a>
          <button class="btn btn-primary" style="font-size:0.82rem; font-weight:800; padding:0.4rem 0.9rem; box-shadow:0 4px 12px rgba(37,99,235,0.25);" data-action="print-report-card">
            🖨️ Print / Save Single-Page A4 PDF
          </button>
        </div>
      </div>
    </section>

    <!-- STRICT SINGLE-PAGE A4 REPORT CARD CONTAINER -->
    <div style="display:flex; justify-content:center; margin-bottom:2rem;">
      <div class="cbse-report-card-container single-a4-page-frame" id="printable-report-card" style="width:100%; max-width:800px; background:#ffffff; border:2.5px solid #0f172a; border-radius:8px; padding:1.25rem 1.4rem; box-shadow:0 12px 30px rgba(0,0,0,0.1); font-family:Inter, -apple-system, sans-serif; color:#0f172a; box-sizing:border-box;">
        
        <!-- Institutional Header (Compact A4 Fit) -->
        <div style="border-bottom:2px solid #0f172a; padding-bottom:0.6rem; margin-bottom:0.75rem; text-align:center;">
          <div style="display:flex; align-items:center; justify-content:center; gap:0.65rem; margin-bottom:0.2rem;">
            <span style="font-size:1.8rem;">🏫</span>
            <div>
              <h1 style="margin:0; font-size:1.35rem; font-weight:900; color:#0f172a; text-transform:uppercase; letter-spacing:0.03em; line-height:1.2;">
                ${escapeHTML(schName)}
              </h1>
              <p style="margin:0.1rem 0 0; font-size:0.72rem; color:#475569; font-weight:600; line-height:1.25;">
                Affiliated to State Board & CBSE Pattern · Indiranagar, Rajendranagar, Hyderabad - 500052, Telangana<br/>
                Email: contact@iams.school.edu | Phone: +91 40 2401 5678
              </p>
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.35rem; border-top:1px dashed #cbd5e1; padding-top:0.35rem;">
            <span style="font-size:0.75rem; font-weight:900; background:#0f172a; color:#ffffff; padding:0.2rem 0.75rem; border-radius:12px; text-transform:uppercase; letter-spacing:0.04em;">
              Continuous & Comprehensive Evaluation (CCE) Report
            </span>
            <span style="font-size:0.75rem; font-weight:800; color:#2563eb;">
              Session 2026–2027 · ${escapeHTML(selectedTerm.toUpperCase())}
            </span>
          </div>
        </div>

        <!-- Student Profile Meta Grid (2-Row Compact Grid) -->
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; padding:0.55rem 0.75rem; margin-bottom:0.75rem;">
          <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:0.35rem 0.65rem; font-size:0.74rem;">
            <div><span style="color:#64748b;">Student Name:</span> <b style="color:#0f172a; font-size:0.82rem;">${escapeHTML(studName)}</b></div>
            <div><span style="color:#64748b;">Roll No:</span> <b style="color:#0f172a;">#${escapeHTML(student.rollNumber || '17')}</b></div>
            <div><span style="color:#64748b;">Class & Sec:</span> <b style="color:#0f172a;">Grade ${escapeHTML(studGrade)}</b></div>
            <div><span style="color:#64748b;">Adm / ID:</span> <b style="color:#0f172a;">${escapeHTML(student.admissionNumber || student.studentId || 'MKS-ADM-000421')}</b></div>
            <div><span style="color:#64748b;">Father's Name:</span> <b style="color:#0f172a;">${escapeHTML(student.parentName || student.guardianName || 'Dr. Tariq Khan')}</b></div>
            <div><span style="color:#64748b;">Mother's Name:</span> <b style="color:#0f172a;">${escapeHTML(student.motherName || 'Mrs. Nilofer Khan')}</b></div>
            <div><span style="color:#64748b;">Date of Birth:</span> <b style="color:#0f172a;">${escapeHTML(student.dateOfBirth || '17 May 2012')}</b></div>
            <div><span style="color:#64748b;">Attendance:</span> <b style="color:#16a34a;">${attendedDays}/${totalDays} (${att.toFixed(1)}%)</b></div>
          </div>
        </div>

        <!-- PART 1: Scholastic Performance Table -->
        <div style="margin-bottom:0.75rem;">
          <div style="font-size:0.76rem; font-weight:900; text-transform:uppercase; color:#0f172a; margin-bottom:0.25rem; letter-spacing:0.03em;">
            PART 1: SCHOLASTIC EVALUATION (Core Academic Disciplines)
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:0.72rem; border:1.5px solid #0f172a; text-align:left;">
            <thead>
              <tr style="background:#0f172a; color:#ffffff;">
                <th style="padding:0.35rem 0.5rem; border:1px solid #334155;">Subject Name & Code</th>
                <th style="padding:0.35rem 0.3rem; text-align:center; border:1px solid #334155;">PA (20)</th>
                <th style="padding:0.35rem 0.3rem; text-align:center; border:1px solid #334155;">NB (10)</th>
                <th style="padding:0.35rem 0.3rem; text-align:center; border:1px solid #334155;">SE (10)</th>
                <th style="padding:0.35rem 0.3rem; text-align:center; border:1px solid #334155;">Exam (60)</th>
                <th style="padding:0.35rem 0.35rem; text-align:center; border:1px solid #334155;">Total (100)</th>
                <th style="padding:0.35rem 0.35rem; text-align:center; border:1px solid #334155;">Grade</th>
                <th style="padding:0.35rem 0.5rem; border:1px solid #334155;">Subject Teacher Remarks</th>
              </tr>
            </thead>
            <tbody>
              ${scoredSubjects.map((s, idx) => `
                <tr style="background:${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                  <td style="padding:0.32rem 0.5rem; border:1px solid #cbd5e1; font-weight:700;">
                    ${escapeHTML(s.name)} <small style="color:#64748b; font-size:0.65rem;">[${escapeHTML(s.code)}]</small>
                  </td>
                  <td style="padding:0.32rem 0.3rem; text-align:center; border:1px solid #cbd5e1;">${s.fa}</td>
                  <td style="padding:0.32rem 0.3rem; text-align:center; border:1px solid #cbd5e1;">${s.nb}</td>
                  <td style="padding:0.32rem 0.3rem; text-align:center; border:1px solid #cbd5e1;">${s.se}</td>
                  <td style="padding:0.32rem 0.3rem; text-align:center; border:1px solid #cbd5e1;">${s.sa}</td>
                  <td style="padding:0.32rem 0.35rem; text-align:center; border:1px solid #cbd5e1; font-weight:900; color:#0f172a; font-size:0.78rem;">${s.total}</td>
                  <td style="padding:0.32rem 0.35rem; text-align:center; border:1px solid #cbd5e1;">
                    <span class="grade-badge-pill ${s.letterGrade === 'A1' ? 'grade-a1' : s.letterGrade === 'A2' ? 'grade-a2' : 'grade-b1'}" style="font-size:0.65rem; padding:0.1rem 0.35rem;">
                      ${s.letterGrade}
                    </span>
                  </td>
                  <td style="padding:0.32rem 0.5rem; border:1px solid #cbd5e1; font-size:0.68rem; color:#334155;">
                    ${escapeHTML(s.remarks)}
                  </td>
                </tr>
              `).join('')}
              <tr style="background:#f1f5f9; font-weight:900; border-top:1.5px solid #0f172a;">
                <td style="padding:0.4rem 0.5rem; border:1px solid #94a3b8; font-size:0.75rem;">GRAND SCHOLASTIC TOTAL</td>
                <td colspan="4" style="padding:0.4rem; text-align:right; border:1px solid #94a3b8; color:#475569; font-size:0.7rem;">Cumulative Aggregate:</td>
                <td style="padding:0.4rem; text-align:center; border:1px solid #94a3b8; font-size:0.85rem; color:#2563eb;">${grandTotal}/${maxGrandTotal}</td>
                <td style="padding:0.4rem; text-align:center; border:1px solid #94a3b8; font-size:0.82rem; color:#16a34a;">${overallPercentage}%</td>
                <td style="padding:0.4rem 0.5rem; border:1px solid #94a3b8; font-size:0.72rem; color:#b45309;">
                  Overall Grade: <b>${overallGrade}</b> · <b>${classRank}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- PART 2 & PART 3 HORIZONTAL SIDE-BY-SIDE GRID (Exact User Spec) -->
        <div style="display:grid; grid-template-columns:1.2fr 0.8fr; gap:0.65rem; margin-bottom:0.75rem;">
          
          <!-- PART 2: CO-SCHOLASTIC ACTIVITIES (3-Point Scale) -->
          <div style="border:1px solid #cbd5e1; border-radius:6px; padding:0.5rem 0.65rem; background:#ffffff;">
            <div style="font-size:0.72rem; font-weight:900; color:#0f172a; text-transform:uppercase; margin-bottom:0.3rem; letter-spacing:0.02em;">
              PART 2: CO-SCHOLASTIC ACTIVITIES (3-Point Scale)
            </div>
            <table style="width:100%; border-collapse:collapse; font-size:0.68rem;">
              <thead>
                <tr style="background:#f1f5f9; border-bottom:1px solid #cbd5e1;">
                  <th style="padding:0.25rem 0.35rem; text-align:left;">Activity Area</th>
                  <th style="padding:0.25rem 0.35rem; text-align:center; width:95px;">Grade</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:0.25rem 0.35rem;">Work Education / Computer Coding</td>
                  <td style="padding:0.25rem 0.35rem; text-align:center;"><b style="color:#16a34a;">A (Outstanding)</b></td>
                </tr>
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:0.25rem 0.35rem;">Art Education / Visual & Performing Arts</td>
                  <td style="padding:0.25rem 0.35rem; text-align:center;"><b style="color:#16a34a;">A (Outstanding)</b></td>
                </tr>
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:0.25rem 0.35rem;">Health & Physical Education (Sports)</td>
                  <td style="padding:0.25rem 0.35rem; text-align:center;"><b style="color:#16a34a;">A (Exemplary)</b></td>
                </tr>
                <tr>
                  <td style="padding:0.25rem 0.35rem;">Discipline & Campus Ethics</td>
                  <td style="padding:0.25rem 0.35rem; text-align:center;"><b style="color:#16a34a;">A (Role Model)</b></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- PART 3: HEALTH & METRICS (Exact User Spec) -->
          <div style="border:1px solid #cbd5e1; border-radius:6px; padding:0.5rem 0.65rem; background:#ffffff;">
            <div style="font-size:0.72rem; font-weight:900; color:#0f172a; text-transform:uppercase; margin-bottom:0.3rem; letter-spacing:0.02em;">
              PART 3: HEALTH & METRICS
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.25rem 0.4rem; font-size:0.68rem; margin-top:0.2rem;">
              <div><span style="color:#64748b;">Height:</span> <b>148 cm</b></div>
              <div><span style="color:#64748b;">Weight:</span> <b>42 kg</b></div>
              <div><span style="color:#64748b;">Blood Group:</span> <b>${escapeHTML(student.bloodGroup || 'O +ve')}</b></div>
              <div><span style="color:#64748b;">Vision:</span> <b>Normal (6/6)</b></div>
              <div><span style="color:#64748b;">Dental Hygiene:</span> <b>Good</b></div>
              <div><span style="color:#64748b;">BMI Status:</span> <b style="color:#16a34a;">19.2 (Healthy)</b></div>
            </div>
          </div>
        </div>

        <!-- Remarks & Verdict (Compact Row) -->
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; padding:0.5rem 0.75rem; margin-bottom:0.85rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.4rem;">
            <div style="flex:1; min-width:280px;">
              <b style="font-size:0.72rem; color:#0f172a; text-transform:uppercase;">Class Teacher Observations:</b>
              <span style="font-size:0.7rem; color:#334155; font-style:italic; margin-left:0.3rem;">
                "${escapeHTML(studName)} exhibits remarkable scholarly discipline, active classroom leadership, and consistent academic depth across STEM and Languages."
              </span>
            </div>
            <div>
              <span style="display:inline-block; background:#dcfce7; color:#15803d; border:1px solid #86efac; font-weight:900; font-size:0.72rem; padding:0.2rem 0.65rem; border-radius:4px;">
                🌟 PROMOTED WITH DISTINCTION (${classRank})
              </span>
            </div>
          </div>
        </div>

        <!-- Triple Official Signatures Strip -->
        <div class="report-card-signatures" style="display:flex; justify-content:space-between; align-items:flex-end; padding-top:0.6rem; border-top:1.5px solid #0f172a;">
          <div style="text-align:center; min-width:120px;">
            <div style="font-family:'Brush Script MT', cursive, sans-serif; font-size:1.15rem; color:#1e40af; margin-bottom:0.05rem; line-height:1;">
              Priya Sharma
            </div>
            <div style="border-top:1px solid #0f172a; padding-top:0.15rem; font-weight:800; font-size:0.68rem;">
              Class Teacher Signature
            </div>
          </div>

          <div style="text-align:center; min-width:120px;">
            <div style="height:16px;"></div>
            <div style="border-top:1px solid #0f172a; padding-top:0.15rem; font-weight:800; font-size:0.68rem;">
              Parent / Guardian Signature
            </div>
          </div>

          <div style="text-align:center; min-width:140px; position:relative;">
            <div style="display:inline-block; width:38px; height:38px; border:1.5px dashed #b45309; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 0.15rem; background:rgba(245,158,11,0.06);">
              <span style="font-size:0.48rem; font-weight:900; color:#b45309; text-align:center; line-height:1;">
                OFFICIAL<br/>SEAL
              </span>
            </div>
            <div style="border-top:1px solid #0f172a; padding-top:0.15rem; font-weight:900; font-size:0.7rem; color:#0f172a;">
              Principal & Head of School
            </div>
            <small style="color:#64748b; font-size:0.62rem;">Dr. Farah Khan, Ph.D.</small>
          </div>
        </div>

      </div>
    </div>
  `;
}
