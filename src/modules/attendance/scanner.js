/**
 * NotebookXL Universal Multi-Device Attendance Engine (ES Module)
 * Handles Barcode, QR Code, RFID, NFC, and Biometric attendance punch events.
 */

export function renderAttendanceScannerModal(state, students, fullName, studentGrade, render) {
  if (!state.activeScannerModal) return '';
  const allStuds = students();
  const lastScan = state.lastScannedRecord;

  return `
    <div class="modal-overlay" style="display:flex; align-items:center; justify-content:center; background:rgba(15, 23, 42, 0.85); backdrop-filter:blur(8px); z-index:9999;">
      <div class="card" style="width:100%; max-width:440px; border-radius:16px; border:2px solid #7c3aed; padding:1.5rem; background:#ffffff; box-shadow:0 25px 50px rgba(0,0,0,0.3);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid #e2e8f0; padding-bottom:0.65rem;">
          <div>
            <b style="font-size:1.1rem; color:#0f172a;">📷 Mobile Barcode & ID Scanner</b>
            <p style="margin:0; font-size:0.78rem; color:#64748b;">Real-time Check-In & Check-Out Punching</p>
          </div>
          <button class="icon-button" data-action="close-scanner-modal" style="font-size:1.2rem; cursor:pointer;">✕</button>
        </div>

        <div style="background:#0f172a; border-radius:12px; padding:1.25rem 1rem; text-align:center; position:relative; overflow:hidden; border:2px solid #38bdf8; margin-bottom:1rem;">
          <div style="font-size:0.75rem; color:#38bdf8; font-weight:800; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:0.5rem;">
            LIVE CAMERA BEAM ACTIVE
          </div>

          <div style="position:relative; width:220px; height:110px; margin:0 auto; border:2px dashed rgba(56, 189, 248, 0.6); border-radius:8px; display:flex; align-items:center; justify-content:center; background:rgba(15, 23, 42, 0.9);">
            <div class="scanner-laser-line"></div>
            <div style="color:#ffffff; font-family:monospace; font-size:0.75rem; opacity:0.88;">
              Point Phone Camera at Barcode or Select Below
            </div>
          </div>

          <p style="margin:0.5rem 0 0; color:#94a3b8; font-size:0.72rem;">
            First scan = Morning Check-In · Last scan = Evening Check-Out
          </p>
        </div>

        <div style="margin-bottom:1rem; background:#f8fafc; padding:0.85rem; border-radius:8px; border:1px solid #cbd5e1;">
          <label style="font-size:0.78rem; font-weight:800; color:#0f172a; display:block; margin-bottom:0.35rem;">
            Select Student to Trigger Camera Scan:
          </label>
          <div style="display:flex; gap:0.4rem;">
            <select id="scanner-sim-student" style="flex:1; padding:0.45rem; border:1.5px solid #7c3aed; border-radius:6px; font-weight:800; font-size:0.85rem; background:#ffffff;">
              ${allStuds.map(s => `
                <option value="${s.id}">
                  👨‍🎓 ${s.name || s.firstName} (Roll #${s.rollNumber || '17'} · Grade ${studentGrade(s)}${s.section||'A'})
                </option>
              `).join('')}
            </select>
            <button class="btn btn-primary" style="font-size:0.82rem; padding:0.45rem 0.85rem;" data-action="simulate-scan-submit">
              ⚡ Scan ID
            </button>
          </div>
        </div>

        <button class="btn btn-secondary" style="width:100%; font-size:0.88rem;" data-action="close-scanner-modal">
          Close Scanner
        </button>
      </div>
    </div>
  `;
}
