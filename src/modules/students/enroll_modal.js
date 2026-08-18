/**
 * NotebookXL Add Student Enrollment Modal Component
 */

export function renderAddStudentModal(state, students, escapeHTML) {
  if (state.modal !== 'add-student') return '';
  const nextStudentSeq = (students().length + 1).toString().padStart(3, '0');
  const autoStudentId = `NXL-MKS-STU-000${nextStudentSeq}`;

  return `
    <div class="modal-overlay" style="display:flex; align-items:center; justify-content:center; background:rgba(15, 23, 42, 0.85); backdrop-filter:blur(8px); z-index:9999;">
      <div class="card" style="width:100%; max-width:680px; border-radius:20px; border:2px solid #6366f1; padding:2rem; background:#ffffff; box-shadow:0 25px 50px rgba(0,0,0,0.3); max-height:90vh; overflow-y:auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; border-bottom:2px solid #e2e8f0; padding-bottom:0.85rem;">
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span style="background:#e0e7ff; color:#4338ca; padding:0.25rem 0.65rem; border-radius:8px; font-size:0.75rem; font-weight:800;">ENROLLMENT ENGINE</span>
              <h2 style="margin:0; font-size:1.35rem; color:#0f172a; font-weight:900;">🎓 Add New Student</h2>
            </div>
            <p style="margin:0.2rem 0 0 0; font-size:0.82rem; color:#64748b;">Enroll a student into the school master roster & generate ID badge.</p>
          </div>
          <button class="icon-button" data-action="close-modal" style="font-size:1.3rem; cursor:pointer;">✕</button>
        </div>

        <form data-submit="add-student-form" style="display:flex; flex-direction:column; gap:1.25rem;">
          <!-- Auto Generated Unique ID Banner -->
          <div style="background:linear-gradient(135deg, #1e1b4b, #312e81); color:#ffffff; padding:1rem 1.25rem; border-radius:12px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <small style="color:#a5b4fc; text-transform:uppercase; font-weight:800; font-size:0.7rem;">Auto-Generated Unique Student ID</small>
              <h3 style="margin:0; color:#ffffff; font-size:1.15rem; font-family:monospace;">${escapeHTML(autoStudentId)}</h3>
            </div>
            <span style="background:#4338ca; color:#e0e7ff; padding:0.35rem 0.75rem; border-radius:8px; font-size:0.75rem; font-weight:700;">Status: Ready for Admission</span>
          </div>

          <!-- 2-Column Form Fields -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div>
              <label style="display:block; font-size:0.8rem; font-weight:800; color:#0f172a; margin-bottom:0.3rem;">First Name *</label>
              <input type="text" name="firstName" placeholder="e.g. Amaan" required style="width:100%; padding:0.6rem 0.85rem; border:1.5px solid #cbd5e1; border-radius:8px; font-weight:600; font-size:0.9rem;" />
            </div>
            <div>
              <label style="display:block; font-size:0.8rem; font-weight:800; color:#0f172a; margin-bottom:0.3rem;">Last Name *</label>
              <input type="text" name="lastName" placeholder="e.g. Khan" required style="width:100%; padding:0.6rem 0.85rem; border:1.5px solid #cbd5e1; border-radius:8px; font-weight:600; font-size:0.9rem;" />
            </div>

            <div>
              <label style="display:block; font-size:0.8rem; font-weight:800; color:#0f172a; margin-bottom:0.3rem;">Grade / Class *</label>
              <select name="grade" style="width:100%; padding:0.6rem 0.85rem; border:1.5px solid #cbd5e1; border-radius:8px; font-weight:700; font-size:0.9rem; background:#ffffff;">
                ${[1,2,3,4,5,6,7,8,9,10].map(g => `<option value="${g}">Grade ${g}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="display:block; font-size:0.8rem; font-weight:800; color:#0f172a; margin-bottom:0.3rem;">Section *</label>
              <select name="section" style="width:100%; padding:0.6rem 0.85rem; border:1.5px solid #cbd5e1; border-radius:8px; font-weight:700; font-size:0.9rem; background:#ffffff;">
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
              </select>
            </div>

            <div>
              <label style="display:block; font-size:0.8rem; font-weight:800; color:#0f172a; margin-bottom:0.3rem;">Roll Number *</label>
              <input type="text" name="rollNumber" value="${(students().length + 1)}" required style="width:100%; padding:0.6rem 0.85rem; border:1.5px solid #cbd5e1; border-radius:8px; font-weight:600; font-size:0.9rem;" />
            </div>
            <div>
              <label style="display:block; font-size:0.8rem; font-weight:800; color:#0f172a; margin-bottom:0.3rem;">Gender *</label>
              <select name="gender" style="width:100%; padding:0.6rem 0.85rem; border:1.5px solid #cbd5e1; border-radius:8px; font-weight:700; font-size:0.9rem; background:#ffffff;">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label style="display:block; font-size:0.8rem; font-weight:800; color:#0f172a; margin-bottom:0.3rem;">Parent / Guardian Name *</label>
              <input type="text" name="parentName" placeholder="e.g. Dr. Tariq Khan" required style="width:100%; padding:0.6rem 0.85rem; border:1.5px solid #cbd5e1; border-radius:8px; font-weight:600; font-size:0.9rem;" />
            </div>
            <div>
              <label style="display:block; font-size:0.8rem; font-weight:800; color:#0f172a; margin-bottom:0.3rem;">Parent WhatsApp Mobile *</label>
              <input type="text" name="parentMobile" placeholder="e.g. +91 98450 98765" required style="width:100%; padding:0.6rem 0.85rem; border:1.5px solid #cbd5e1; border-radius:8px; font-weight:600; font-size:0.9rem;" />
            </div>

            <div>
              <label style="display:block; font-size:0.8rem; font-weight:800; color:#0f172a; margin-bottom:0.3rem;">Date of Birth</label>
              <input type="date" name="dob" value="2012-05-17" style="width:100%; padding:0.6rem 0.85rem; border:1.5px solid #cbd5e1; border-radius:8px; font-weight:600; font-size:0.9rem;" />
            </div>
            <div>
              <label style="display:block; font-size:0.8rem; font-weight:800; color:#0f172a; margin-bottom:0.3rem;">Blood Group</label>
              <select name="bloodGroup" style="width:100%; padding:0.6rem 0.85rem; border:1.5px solid #cbd5e1; border-radius:8px; font-weight:700; font-size:0.9rem; background:#ffffff;">
                <option value="O+">O +ve</option>
                <option value="A+">A +ve</option>
                <option value="B+">B +ve</option>
                <option value="AB+">AB +ve</option>
                <option value="O-">O -ve</option>
              </select>
            </div>
          </div>

          <!-- Buttons -->
          <div style="display:flex; gap:0.75rem; justify-content:flex-end; border-top:1px solid #e2e8f0; padding-top:1rem; margin-top:0.5rem;">
            <button type="button" class="btn btn-secondary" data-action="close-modal" style="font-weight:700; padding:0.6rem 1.25rem;">Cancel</button>
            <button type="submit" class="btn btn-primary" style="background:#4338ca; border:none; font-weight:800; padding:0.6rem 1.75rem; font-size:0.92rem;">
              💾 Save & Enroll Student
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
