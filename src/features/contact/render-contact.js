export function renderContactFeature(deps) {
  const { state } = deps || {};
  const success = state?.lastSubmissionSuccess?.type === 'GENERAL_INQUIRY' ? state.lastSubmissionSuccess : null;

  const faqs = [
    {
      q: 'How long does school onboarding and data migration take?',
      a: 'Most schools are fully onboarded and active within 48 to 72 hours. Our dedicated onboarding team handles importing your existing student rolls, teacher records, class sections, and subject catalogues via simple Excel/CSV templates with zero operational downtime.'
    },
    {
      q: 'How does NotebookXL guarantee student and academic data security?',
      a: 'Every school operates within its own dedicated tenant database partition using strict Row-Level Security (RLS) and end-to-end encryption. Your school’s marks, fee details, and attendance records are completely isolated and never shared or accessible across institutions.'
    },
    {
      q: 'Does NotebookXL support CBSE and State Board grading patterns?',
      a: 'Yes. NotebookXL is built specifically for Indian school curricula, featuring customizable assessment engines for CBSE Continuous Evaluation (Periodic Tests, Half-Yearly, Annuals), State Board marks formats, and 1-click generation of board-compliant printable report cards.'
    },
    {
      q: 'Do you provide live training for teachers and administrative staff?',
      a: 'Yes. We conduct tailored online training sessions for management, academic coordinators, and classroom teachers. In addition, teachers get access to short video guides, and our support desk is available Monday through Saturday (8:00 AM – 7:00 PM IST).'
    },
    {
      q: 'Can NotebookXL integrate with biometric attendance machines or RFID tags?',
      a: 'Yes. NotebookXL supports automated sync with standard biometric fingerprint/facial recognition devices and RFID student smart card readers, automatically updating the daily attendance register and triggering absentee alerts.'
    }
  ];

  return `<main class="contact-page-modern home-v2" id="contact-home">
      <!-- Unified Header -->
      <header class="h2-navbar">
        <div class="h2-nav-inner">
          <a href="/" class="h2-logo">NOTEBOOK<span>XL</span></a>
          <nav class="h2-nav-menu" aria-label="Primary">
            <a href="/">Home</a>
            <a href="/#solutions">Solutions</a>
            <a href="/about">About Us</a>
            <a href="/contact" class="active" aria-current="page">Contact Us</a>
          </nav>
          <div class="h2-nav-actions">
            <button type="button" class="h2-signin" data-action="go-login">Get Started</button>
            <button type="button" class="h2-nav-demo" data-action="go-demo">Book a Demo</button>
          </div>
        </div>
      </header>

      <!-- Hero Header Section -->
      <section class="contact-hero-modern">
        <div class="contact-hero-container">
          <div class="contact-hero-badge">
            <span class="badge-dot"></span>
            <span>GET IN TOUCH WITH NOTEBOOKXL</span>
          </div>
          <h1>Let's Build a Smarter School Workspace Together</h1>
          <p>Whether you're exploring a unified School OS, scheduling a guided demo for your trustees, or migrating from legacy software, our Hyderabad team is here to help.</p>
        </div>
      </section>

      <!-- 2-Column Main Contact Grid -->
      <section class="contact-content-section">
        <div class="contact-main-grid">
          
          <!-- Left: Direct Channels & Office Info -->
          <aside class="contact-info-card">
            <div class="info-card-header">
              <span class="info-card-pill">OFFICE & DIRECT REACH</span>
              <h2>Speak with Our Education Consultants</h2>
              <p>Get in touch directly through any of our support or sales channels.</p>
            </div>

            <div class="contact-channels-stack">
              <div class="contact-channel-item">
                <div class="channel-icon-box google-location-box" title="Google Maps Location">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Google Maps Location">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335"/>
                    <circle cx="12" cy="9" r="2.8" fill="#FFFFFF"/>
                  </svg>
                </div>
                <div class="channel-text">
                  <strong>Headquarters & Innovation Lab</strong>
                  <p><a href="https://maps.google.com/?q=Hitech+City+Hyderabad+Telangana" target="_blank" rel="noopener noreferrer" style="color:#cbd5e1; text-decoration: none;">Quenix Analytics Pvt. Ltd.<br />Hitech City, Hyderabad, Telangana 500081, India <span style="color:#60a5fa; font-size: 0.8em;">↗</span></a></p>
                </div>
              </div>

              <div class="contact-channel-item">
                <div class="channel-icon-box">📞</div>
                <div class="channel-text">
                  <strong>Sales & Institutional Enquiries</strong>
                  <p><a href="tel:+917396361618">+91 73963 61618</a> &bull; <a href="tel:+919667770727">+91 96677 70727</a></p>
                  <small>Direct phone line for Principals & Trustees</small>
                </div>
              </div>

              <div class="contact-channel-item">
                <div class="channel-icon-box">✉️</div>
                <div class="channel-text">
                  <strong>Sales & Product Demos</strong>
                  <p><a href="mailto:sales@notebookxl.com">sales@notebookxl.com</a></p>
                  <small>Response within 2 hours</small>
                </div>
              </div>

              <div class="contact-channel-item">
                <div class="channel-icon-box">💬</div>
                <div class="channel-text">
                  <strong>Dedicated Technical Support</strong>
                  <p><a href="mailto:support@notebookxl.com">support@notebookxl.com</a></p>
                  <small>For active school administrators & teachers</small>
                </div>
              </div>

              <div class="contact-channel-item">
                <div class="channel-icon-box">⏱️</div>
                <div class="channel-text">
                  <strong>Working Hours (IST)</strong>
                  <p>Monday – Saturday: 8:00 AM – 7:00 PM</p>
                  <small>Sunday: Emergency technical standby</small>
                </div>
              </div>
            </div>

            <!-- Trust Badges Bar -->
            <div class="contact-trust-bar">
              <div class="trust-pill"><span>🔒</span> Dedicated Tenant Isolation</div>
              <div class="trust-pill"><span>⚡</span> 99.9% Uptime Guarantee</div>
              <div class="trust-pill"><span>📋</span> CBSE / State Compliant</div>
            </div>
          </aside>

          <!-- Right: Smart School Inquiry Form OR Success Card -->
          <article class="contact-form-wrapper">
            ${success ? `
            <div class="demo-success-modal-card">
              <div class="success-icon-badge">✓</div>
              <span class="success-eyebrow">MESSAGE DELIVERED TO SALES TEAM</span>
              <h2>🎉 Thank You, ${success.name}!</h2>
              <p class="success-sub">Your inquiry regarding <strong>${success.school}</strong> has been logged in our system.</p>
              
              <div class="success-ref-grid">
                <div class="success-ref-pill">
                  <small>Inquiry Reference ID</small>
                  <strong>#${success.id}</strong>
                </div>
                <div class="success-ref-pill">
                  <small>Institution Location</small>
                  <strong>${success.location}</strong>
                </div>
                <div class="success-ref-pill">
                  <small>Follow-up Contact</small>
                  <strong>+91 ${success.mobile}</strong>
                </div>
              </div>

              <div class="success-reassurance-box">
                <span class="reassurance-icon">⚡</span>
                <p>Our Education Technology Consultant will reach out to you via WhatsApp & Call on <strong>+91 ${success.mobile}</strong> within 2 business hours.</p>
              </div>

              <div class="success-action-buttons">
                <a href="https://wa.me/917396361618?text=Hi%20NotebookXL%20Team%2C%20I%20just%20submitted%20an%20inquiry%20for%20${encodeURIComponent(success.school)}%20(Ref%3A%20${success.id})." target="_blank" rel="noopener noreferrer" class="success-wa-btn">
                  <span>💬 Chat on WhatsApp Now</span>
                </a>
                <button type="button" class="success-demo-btn" data-action="open-demo-dashboard">
                  <span>Explore Live Interactive Demo &rarr;</span>
                </button>
              </div>

              <button type="button" class="book-another-btn" data-action="reset-demo-submission">
                Send another message / Change details
              </button>
            </div>
            ` : `
            <div class="form-wrapper-head">
              <h3>Send Us a Message</h3>
              <p>Tell us about your institution and requirements. We'll connect with you shortly.</p>
            </div>

            <form id="contact-us-form" class="smart-contact-form">
              <div class="form-row-duo">
                <div class="form-field-group">
                  <label for="contact-name">Your Full Name *</label>
                  <input id="contact-name" name="name" placeholder="e.g. Dr. Rajesh Sharma" required />
                </div>
                <div class="form-field-group">
                  <label for="contact-role">Your Role / Designation *</label>
                  <select id="contact-role" name="role" required>
                    <option value="" disabled selected>Select Designation</option>
                    <option value="Principal">Principal / Headmaster</option>
                    <option value="Trustee">School Trustee / Chairman</option>
                    <option value="Coordinator">Academic Coordinator</option>
                    <option value="Administrator">School Administrator</option>
                    <option value="IT_Head">IT / Systems Head</option>
                    <option value="Teacher">Teacher / Faculty</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div class="form-row-duo">
                <div class="form-field-group">
                  <label for="contact-school">School / Institution Name *</label>
                  <input id="contact-school" name="school" placeholder="e.g. Meezan Kids School" required />
                </div>
                <div class="form-field-group">
                  <label for="contact-location">City & State *</label>
                  <input id="contact-location" name="location" placeholder="e.g. Hyderabad, Telangana" required />
                </div>
              </div>

              <div class="form-row-duo">
                <div class="form-field-group">
                  <label for="contact-board">School Board / Affiliation *</label>
                  <select id="contact-board" name="board" required>
                    <option value="" disabled selected>Select Board</option>
                    <option value="CBSE">CBSE</option>
                    <option value="State">State Board</option>
                    <option value="ICSE">ICSE / ISC</option>
                    <option value="Cambridge">Cambridge / IB</option>
                    <option value="PreSchool">Pre-School / K-5</option>
                  </select>
                </div>
                <div class="form-field-group">
                  <label for="contact-strength">Student Strength *</label>
                  <select id="contact-strength" name="strength" required>
                    <option value="" disabled selected>Select Enrollment Range</option>
                    <option value="<500">Less than 500 Students</option>
                    <option value="500-1500">500 – 1,500 Students</option>
                    <option value="1500-3000">1,500 – 3,000 Students</option>
                    <option value="3000+">3,000+ Students (Multi-Campus)</option>
                  </select>
                </div>
              </div>

              <div class="form-row-duo">
                <div class="form-field-group">
                  <label for="contact-email">Official Email ID *</label>
                  <input type="email" id="contact-email" name="email" placeholder="admin@yourschool.edu.in" required />
                </div>
                <div class="form-field-group">
                  <label for="contact-mobile">Mobile Number (India) *</label>
                  <input id="contact-mobile" name="mobile" placeholder="+91 73963 61618" required />
                </div>
              </div>

              <div class="form-field-group">
                <label for="contact-category">Inquiry Subject / Area *</label>
                <select id="contact-category" name="category" required>
                  <option value="Demo">Request a Guided Live School Walkthrough</option>
                  <option value="Pricing">Request Pricing & Custom Quotation</option>
                  <option value="Migration">Data Migration from Legacy Software / ERP</option>
                  <option value="Grading">CBSE / State Custom Grading Assessment Needs</option>
                  <option value="Support">Technical Support for Existing School</option>
                  <option value="General">General Inquiry</option>
                </select>
              </div>

              <div class="form-field-group">
                <label for="contact-message">Message / Specific Requirements *</label>
                <textarea id="contact-message" name="message" rows="4" placeholder="Tell us what you'd like to achieve or any specific challenges your school is facing..." required></textarea>
              </div>

              <button class="contact-submit-btn" type="submit" id="contact-submit-btn">
                <span>Submit School Inquiry</span>
                <span class="btn-arrow">→</span>
              </button>

              <div class="form-privacy-note">
                <span>🔒 Your information is secure and will only be used to answer your school's inquiry.</span>
              </div>
            </form>
            `}
          </article>

        </div>
      </section>

      <!-- FAQ Section -->
      <section class="contact-faq-section">
        <div class="contact-faq-container">
          <div class="faq-section-head">
            <span class="faq-eyebrow">COMMON QUESTIONS</span>
            <h2>Frequently Asked Questions by School Leadership</h2>
            <p>Everything you need to know about adopting NotebookXL for your institution.</p>
          </div>

          <div class="faq-accordion-list">
            ${faqs.map((faq, index) => `
              <details class="faq-accordion-item" ${index === 0 ? 'open' : ''}>
                <summary class="faq-summary">
                  <span class="faq-question">${faq.q}</span>
                  <span class="faq-chevron">▾</span>
                </summary>
                <div class="faq-answer">
                  <p>${faq.a}</p>
                </div>
              </details>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Unified Modern Footer -->
      <footer class="h2-footer" id="resources">
        <div class="h2-footer-grid">
          <div>
            <div class="h2-footer-logo">NOTEBOOKXL</div>
            <div class="h2-footer-about">A multi-tenant school operating system developed by Quenix Analytics Pvt. Ltd. for Indian schools.</div>
          </div>
          <div>
            <h4>Platform</h4>
            <div class="h2-footer-links">
              <a href="/#solutions">Solutions</a>
              <a href="/#features">Modules</a>
              <a href="/#pricing">Pricing Plans</a>
            </div>
          </div>
          <div>
            <h4>Solutions</h4>
            <div class="h2-footer-links">
              <a href="/#solutions">For Management</a>
              <a href="/#solutions">For Teachers</a>
              <a href="/#solutions">For Students</a>
            </div>
          </div>
          <div>
            <h4>Company</h4>
            <div class="h2-footer-links">
              <a href="/about">About Us</a>
              <a href="/contact" class="active">Contact Us</a>
              <a href="/demo">Book a Demo</a>
              <button type="button" data-action="go-login">Sign In</button>
            </div>
          </div>
        </div>
        <div class="h2-footer-bottom">© 2026 Quenix Analytics Pvt. Ltd. · NotebookXL School OS</div>
      </footer>
    </main>`;
}
