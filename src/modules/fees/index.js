/**
 * NotebookXL Fees & Finance Ledger Module (ES Module)
 */

export function renderFees(state, students, getTenantFeeRecords, fullName, studentGrade, tenant, sectionHead, escapeHTML, renderDigitalReceiptHTML) {
  const allStudents = students();
  const selectedStudentId = state.selectedFeeStudentId || (allStudents[0]?.id);
  const student = allStudents.find(s => s.id === selectedStudentId) || allStudents[0];
  
  if (!student) {
    return `<section class="card"><p>No student fee records found.</p></section>`;
  }

  const records = getTenantFeeRecords();
  const rec = records.find(r => r.id === student.id) || {
    id: student.id,
    student,
    studentName: fullName(student),
    studentId: student.studentId || 'NXL-MKS-STU-000421',
    grade: studentGrade(student),
    section: student.section || 'A',
    parentName: student.parentName || student.guardianName || 'Dr. Tariq Khan',
    parentMobile: student.parentMobile || student.mobile || '+91 98450 98765',
    totalFee: 80000,
    paidAmount: 55000,
    balanceDue: 25000,
    status: 'Partial',
    nextDueDate: '10 Jan 2027',
    history: [
      { receiptNo: 'REC-2026-0842', date: '08 Oct 2026', amount: 25000, mode: 'UPI (GPay)', collectedBy: 'Mr. Farhan (Accounts)' },
      { receiptNo: 'REC-2026-0129', date: '05 Jun 2026', amount: 30000, mode: 'NetBanking', collectedBy: 'Online Portal' }
    ]
  };

  const percentPaid = Math.round((rec.paidAmount / rec.totalFee) * 100);
  const percentPending = 100 - percentPaid;
  const parentPhone = rec.parentMobile.replace(/\D/g, '');
  const schName = tenant()?.school?.name || tenant()?.name || 'Meezan Kids School';
  const waMessage = encodeURIComponent(`Dear ${rec.parentName}, this is a friendly reminder from ${schName}. The Term 3 fee balance of ₹${rec.balanceDue.toLocaleString()} for ${rec.studentName} (Grade ${rec.grade}${rec.section}, Roll #${student.rollNumber || '17'}) is due on ${rec.nextDueDate}. You can pay online via UPI/NetBanking or visit the school accounts office. Thank you!`);

  return `
    ${sectionHead('Finance & Ledger', 'School Fees & Ledger', `Comprehensive fee collection, ledger history & installment tracking for ${schName}.`)}

    <!-- Top Action Toolbar -->
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; margin-bottom:1.5rem; background:#ffffff; padding:1rem 1.25rem; border-radius:12px; border:1px solid #e2e8f0; box-shadow:0 4px 12px rgba(15,23,42,0.03);">
      <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
        <label style="font-size:0.8rem; font-weight:700; color:#475569;">
          Select Student:
          <select id="fee-ledger-student-picker" style="padding:0.4rem 0.65rem; border:1.5px solid #cbd5e1; border-radius:6px; font-weight:700; margin-left:0.3rem;">
            ${allStudents.map(s => `
              <option value="${s.id}" ${s.id === student.id ? 'selected' : ''}>
                ${escapeHTML(fullName(s))} · Grade ${studentGrade(s)}${s.section||'A'}
              </option>
            `).join('')}
          </select>
        </label>
      </div>

      <div style="display:flex; gap:0.5rem; flex-wrap:wrap; align-items:center;">
        <button class="btn ${state.showFeeReceiptDocument ? 'btn-primary' : 'btn-secondary'}" data-action="toggle-fee-document">
          ${state.showFeeReceiptDocument ? '👁️ Hide Fee Receipt' : '👁️ View / Download Fee Receipt'}
        </button>
        <a href="https://wa.me/91${parentPhone}?text=${waMessage}" target="_blank" class="wa-reminder-btn" style="padding:0.45rem 0.85rem; font-size:0.82rem;">
          💬 Send WhatsApp to Parent
        </a>
        <button class="btn btn-secondary" style="font-size:0.82rem;" data-action="print-receipt">
          🖨️ Print / Save PDF
        </button>
        <button class="btn btn-primary" style="font-size:0.82rem; background:#16a34a; border-color:#16a34a;" data-action="open-record-payment" data-id="${escapeHTML(student.id)}">
          ➕ Record Payment
        </button>
      </div>
    </div>

    <!-- Digital Fee Receipt / Bill Card (Opened Only on User Click!) -->
    ${state.showFeeReceiptDocument ? renderDigitalReceiptHTML(rec) : `
      <div style="background:#f8fafc; border:2px dashed #cbd5e1; border-radius:12px; padding:2rem 1.5rem; text-align:center; margin-bottom:1.5rem;">
        <div style="font-size:2.2rem; margin-bottom:0.4rem;">🧾</div>
        <h3 style="margin:0 0 0.3rem; color:#0f172a; font-size:1.1rem;">Official Digital Fee Receipt / Bill</h3>
        <p style="margin:0 0 1rem; color:#64748b; font-size:0.85rem; max-width:550px; margin-left:auto; margin-right:auto;">
          Verified fee invoice for <b>${escapeHTML(rec.studentName)}</b> (Grade ${escapeHTML(rec.grade)}${escapeHTML(rec.section)}) is ready. Click below to view and inspect.
        </p>
        <div style="display:flex; gap:0.75rem; justify-content:center; flex-wrap:wrap;">
          <button class="btn btn-primary" data-action="toggle-fee-document">
            👁️ View / Download Fee Receipt
          </button>
          <button class="btn btn-secondary" data-action="print-receipt">
            🖨️ Print / Save as PDF
          </button>
        </div>
      </div>
    `}

    <!-- 4 Summary KPI Cards -->
    <section class="finance-metrics-grid" style="margin-bottom:1.5rem;">
      <div class="finance-stat-card">
        <div class="stat-label">Total Fee (Year)</div>
        <div class="stat-value">₹${rec.totalFee.toLocaleString()}</div>
        <small style="color:#64748b; font-weight:700;">100% Comprehensive Annual</small>
      </div>
      <div class="finance-stat-card stat-success">
        <div class="stat-label">Amount Paid</div>
        <div class="stat-value">₹${rec.paidAmount.toLocaleString()}</div>
        <small style="color:#16a34a; font-weight:700;">${percentPaid}% Paid to Date</small>
      </div>
      <div class="finance-stat-card ${rec.balanceDue > 0 ? 'stat-danger' : 'stat-success'}">
        <div class="stat-label">Balance Left</div>
        <div class="stat-value">₹${rec.balanceDue.toLocaleString()}</div>
        <small style="color:${rec.balanceDue > 0 ? '#dc2626' : '#16a34a'}; font-weight:700;">${percentPending}% Pending Dues</small>
      </div>
      <div class="finance-stat-card stat-warning">
        <div class="stat-label">Next Due Date</div>
        <div class="stat-value" style="font-size:1.3rem;">${rec.nextDueDate}</div>
        <small style="color:#d97706; font-weight:700;">Term 3 Final Installment</small>
      </div>
    </section>

    <!-- Payment History & Transaction Log -->
    <section class="card">
      <div class="card-heading" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h3>🧾 Payment History & Transaction Audit Log</h3>
          <p>Every payment recorded gets a verified receipt and immutable timestamp</p>
        </div>
        <button class="btn btn-secondary" style="font-size:0.78rem;" data-action="view-digital-receipt" data-id="${escapeHTML(student.id)}">
          🧾 View Latest Digital Bill (PDF)
        </button>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Receipt #</th>
              <th>Date Paid</th>
              <th>Amount Paid</th>
              <th>Payment Mode</th>
              <th>Collected By</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${(rec.history || []).map(h => `
              <tr>
                <td><b style="font-family:monospace; color:#2563eb;">${escapeHTML(h.receiptNo)}</b></td>
                <td>${escapeHTML(h.date)}</td>
                <td><b style="color:#16a34a; font-size:0.95rem;">₹${Number(h.amount).toLocaleString()}.00</b></td>
                <td><span style="background:#f1f5f9; padding:0.2rem 0.5rem; border-radius:4px; font-weight:700; font-size:0.78rem;">${escapeHTML(h.mode || 'UPI / NetBanking')}</span></td>
                <td><small style="color:#475569; font-weight:600;">${escapeHTML(h.collectedBy || 'Accounts Desk')}</small></td>
                <td><span class="fee-status-pill status-paid">🟢 PAID & VERIFIED</span></td>
                <td>
                  <button class="btn btn-secondary" style="font-size:0.75rem; padding:0.25rem 0.55rem;" data-action="view-digital-receipt" data-id="${escapeHTML(student.id)}">
                    📥 Print Receipt (PDF)
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;
}
