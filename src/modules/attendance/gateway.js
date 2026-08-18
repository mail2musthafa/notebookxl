/**
 * Universal Multi-Device Attendance Gateway (ES Module)
 * Connects Frontend UI to FastAPI Provider Endpoint (QR, Barcode, RFID, NFC, Biometric)
 */

export function renderUniversalAttendanceGatewayModal(state, escapeHTML) {
  if (!state.activeUniversalAttendanceGateway) return '';
  const lastResult = state.universalAttendanceLastPunchResult;

  return `
    <div class="modal-overlay" style="display:flex; align-items:center; justify-content:center; background:rgba(15, 23, 42, 0.85); backdrop-filter:blur(8px); z-index:9999;">
      <div class="card" style="width:100%; max-width:540px; border-radius:20px; border:2px solid #3b82f6; padding:1.75rem; background:#ffffff; box-shadow:0 25px 50px rgba(0,0,0,0.3);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid #e2e8f0; padding-bottom:0.75rem;">
          <div>
            <b style="font-size:1.15rem; color:#0f172a;">🌐 Universal Device Attendance Gateway</b>
            <p style="margin:0; font-size:0.8rem; color:#64748b;">FastAPI Endpoint Provider Simulator (QR, Barcode, RFID, NFC, Biometric)</p>
          </div>
          <button class="icon-button" data-action="close-universal-attendance-gateway" style="font-size:1.2rem; cursor:pointer;">✕</button>
        </div>

        <!-- Device Selector Slabs -->
        <div style="margin-bottom:1.25rem;">
          <label style="display:block; font-size:0.78rem; font-weight:800; color:#475569; text-transform:uppercase; margin-bottom:0.4rem;">Select Active Device Provider:</label>
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.4rem;">
            <button class="btn btn-secondary ${state.activeDeviceProvider === 'BARCODE' ? 'btn-primary' : ''}" style="font-size:0.75rem; padding:0.4rem 0.2rem;" data-action="set-device-provider" data-provider="BARCODE">📷 Barcode</button>
            <button class="btn btn-secondary ${state.activeDeviceProvider === 'QR_CODE' ? 'btn-primary' : ''}" style="font-size:0.75rem; padding:0.4rem 0.2rem;" data-action="set-device-provider" data-provider="QR_CODE">📱 QR Code</button>
            <button class="btn btn-secondary ${state.activeDeviceProvider === 'RFID' ? 'btn-primary' : ''}" style="font-size:0.75rem; padding:0.4rem 0.2rem;" data-action="set-device-provider" data-provider="RFID">💳 RFID Tag</button>
            <button class="btn btn-secondary ${state.activeDeviceProvider === 'NFC' ? 'btn-primary' : ''}" style="font-size:0.75rem; padding:0.4rem 0.2rem;" data-action="set-device-provider" data-provider="NFC">📲 NFC Smart</button>
            <button class="btn btn-secondary ${state.activeDeviceProvider === 'BIOMETRIC' ? 'btn-primary' : ''}" style="font-size:0.75rem; padding:0.4rem 0.2rem;" data-action="set-device-provider" data-provider="BIOMETRIC">👆 Biometric</button>
          </div>
        </div>

        <!-- Credential Scan Trigger Form -->
        <form data-submit="submit-universal-punch-event" style="margin-bottom:1.25rem; background:#f8fafc; padding:1rem; border-radius:12px; border:1px solid #e2e8f0;">
          <label style="display:block; font-size:0.78rem; font-weight:800; color:#0f172a; margin-bottom:0.3rem;">Secure Anonymized Credential Token (ID Card):</label>
          <div style="display:flex; gap:0.5rem;">
            <select name="credentialId" style="flex:1; padding:0.55rem 0.75rem; border-radius:8px; border:1px solid #cbd5e1; font-weight:600; font-size:0.88rem;">
              <option value="NXL-MKS-STU-000001">Amaan Khan (NXL-MKS-STU-000001 - Student)</option>
              <option value="NXL-MKS-STU-000002" selected>Zaid Khan (NXL-MKS-STU-000002 - Student)</option>
              <option value="NXL-MKS-T-000001">Zahra Patel (NXL-MKS-T-000001 - Teacher)</option>
            </select>
            <button type="submit" class="btn btn-primary" style="background:#2563eb; padding:0.55rem 1rem; font-size:0.88rem; font-weight:700;">⚡ Scan Punch</button>
          </div>
          <small style="display:block; color:#64748b; margin-top:0.4rem; font-size:0.72rem;">* 5-Second Cooldown protection active to prevent duplicate double-scans.</small>
        </form>

        ${lastResult ? `
          <div style="background:${lastResult.success ? '#f0fdf4' : '#fef2f2'}; border:1px solid ${lastResult.success ? '#bbf7d0' : '#fecaca'}; border-radius:12px; padding:1rem; margin-bottom:1.25rem;">
            <div style="display:flex; items-center; gap:0.75rem;">
              <img src="${escapeHTML(lastResult.daily_summary?.photo || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zaid')}" style="width:48px; height:48px; border-radius:50%; border:2px solid #3b82f6;" />
              <div>
                <span style="font-size:0.7rem; font-weight:800; text-transform:uppercase; color:${lastResult.success ? '#15803d' : '#b91c1c'};">
                  ${escapeHTML(lastResult.message)}
                </span>
                <h4 style="margin:0.1rem 0; font-size:0.98rem; color:#0f172a; font-weight:900;">
                  ${escapeHTML(lastResult.daily_summary?.name || 'User')} (${escapeHTML(lastResult.daily_summary?.person_type || 'Student')})
                </h4>
                <p style="margin:0; font-size:0.78rem; color:#475569;">
                  ${escapeHTML(lastResult.daily_summary?.identifier || '')} · Status: <b>${escapeHTML(lastResult.daily_summary?.current_status || 'IN')}</b>
                </p>
              </div>
            </div>
          </div>
        ` : ''}

        <button class="btn btn-secondary" style="width:100%; font-size:0.88rem;" data-action="close-universal-attendance-gateway">
          Close Gateway
        </button>
      </div>
    </div>
  `;
}
