export function renderDemoFeature(deps) {
  const { state } = deps || {};
  const success = state?.lastSubmissionSuccess?.type === 'DEMO_REQUEST' ? state.lastSubmissionSuccess : null;

  const demoBenefits = [
    {
      icon: '⏱️',
      title: '30-Second Attendance Roll Call',
      desc: 'See how teachers take class roll calls in seconds on any smartphone, with automated parent absentee SMS alerts.'
    },
    {
      icon: '📊',
      title: 'School Pulse & Erum AI Morning Brief',
      desc: 'Experience real-time morning operational summaries, staff presence, and automated at-risk student monitoring.'
    },
    {
      icon: '📋',
      title: 'CBSE CCE & Custom Marksheet Engine',
      desc: 'Watch automated percentage and grade computations, term weightages, and 1-click printable report cards.'
    },
    {
      icon: '🗓️',
      title: 'Conflict-Free Timetable & Substitutes',
      desc: 'See how teacher leaves automatically recommend substitute teachers with 0 classroom downtime.'
    },
    {
      icon: '🔒',
      title: 'Multi-Tenant Campus Isolation',
      desc: 'Explore dedicated database partitions and custom subdomains for multi-branch education trusts.'
    }
  ];

  return `<main class="demo-page-modern home-v2" id="demo-home">
      <!-- Standardized Clean Header -->
      <header class="h2-navbar">
        <div class="h2-nav-inner">
          <a href="/" class="h2-logo">NOTEBOOK<span>XL</span></a>
          <nav class="h2-nav-menu" aria-label="Primary">
            <a href="/">Home</a>
            <a href="/#solutions">Solutions</a>
            <a href="/about">About Us</a>
            <a href="/contact">Contact Us</a>
          </nav>
          <div class="h2-nav-actions">
            <button type="button" class="h2-signin" data-action="go-login">Get Started</button>
            <button type="button" class="h2-nav-demo active" data-action="go-demo" aria-current="page">Book a Demo</button>
          </div>
        </div>
      </header>

      <!-- Hero Header Section (Deep Navy Theme) -->
      <section class="demo-hero-modern">
        <div class="demo-hero-container">
          <div class="demo-hero-badge">
            <span class="badge-dot"></span>
            <span>SCHEDULE A GUIDED 20-MINUTE WALKTHROUGH</span>
          </div>
          <h1>Experience NotebookXL Tailored to Your School</h1>
          <p>Tell us about your institution and we'll arrange a live, 1-on-1 walkthrough customized for your trustees, principal, and academic coordinators.</p>
        </div>
      </section>

      <!-- 2-Column Main Demo Grid -->
      <section class="demo-content-section">
        <div class="demo-main-grid">
          
          <!-- Left: What You'll Experience in the Demo -->
          <aside class="demo-info-card">
            <div class="info-card-header">
              <span class="info-card-pill">20-MINUTE GUIDED TOUR</span>
              <h2>What You'll Explore During the Session</h2>
              <p>Our education technology consultant will walk you through real school scenarios and answer technical and curriculum questions.</p>
            </div>

            <div class="demo-benefits-list">
              ${demoBenefits.map((b) => `
                <div class="demo-benefit-item">
                  <div class="benefit-icon-box">${b.icon}</div>
                  <div class="benefit-text">
                    <strong>${b.title}</strong>
                    <p>${b.desc}</p>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Direct Contact Box -->
            <div class="demo-direct-reach-box">
              <div class="reach-header">
                <strong>Need an immediate meeting today?</strong>
                <small>Call our sales & demo team directly:</small>
              </div>
              <div class="reach-phones-row">
                <a href="tel:+917396361618" class="reach-phone-btn">📞 +91 73963 61618</a>
                <a href="tel:+919667770727" class="reach-phone-btn">📞 +91 96677 70727</a>
              </div>
              <div class="reach-location-note">
                📍 Quenix Analytics Pvt. Ltd. &bull; Hitech City, Hyderabad, India
              </div>
            </div>
          </aside>

          <!-- Right: Smart Demo Booking Form OR Success Card -->
          <div class="demo-form-wrapper">
            ${success ? `
            <div class="demo-success-modal-card">
              <div class="success-icon-badge">✓</div>
              <span class="success-eyebrow">DEMO WALKTHROUGH SCHEDULED</span>
              <h2>🎉 Thank You, ${success.name}!</h2>
              <p class="success-sub">Your 20-minute guided demonstration request for <strong>${success.school}</strong> has been registered with our team.</p>
              
              <div class="success-ref-grid">
                <div class="success-ref-pill">
                  <small>Lead Reference ID</small>
                  <strong>#${success.id}</strong>
                </div>
                <div class="success-ref-pill">
                  <small>Preferred Time Window</small>
                  <strong>${success.timeslot}</strong>
                </div>
                <div class="success-ref-pill">
                  <small>Contact Follow-up</small>
                  <strong>+91 ${success.mobile}</strong>
                </div>
              </div>

              <div class="success-reassurance-box">
                <span class="reassurance-icon">⚡</span>
                <p>Our Senior Education Consultant has received your request. We will reach out via WhatsApp & Call on <strong>+91 ${success.mobile}</strong> within 2 business hours with your private video meeting link.</p>
              </div>

              <div class="success-action-buttons">
                <a href="https://wa.me/917396361618?text=Hi%20NotebookXL%20Team%2C%20I%20just%20scheduled%20a%20demo%20for%20${encodeURIComponent(success.school)}%20(Lead%20Ref%3A%20${success.id})." target="_blank" rel="noopener noreferrer" class="success-wa-btn">
                  <span>💬 Chat on WhatsApp Now</span>
                </a>
                <button type="button" class="success-demo-btn" data-action="open-demo-dashboard">
                  <span>Explore Live Interactive Demo &rarr;</span>
                </button>
              </div>

              <button type="button" class="book-another-btn" data-action="reset-demo-submission">
                Schedule another demo / Change school details
              </button>
            </div>
            ` : `
            <div class="smart-demo-card">
              <div class="form-card-header">
                <span class="form-card-pill">SCHEDULE SESSION</span>
                <h3>Book Your Free 1-on-1 Walkthrough</h3>
                <p>Pick your preferred timing and tell us which modules you want to see.</p>
              </div>

              <form id="demo-booking-form" class="smart-demo-form">
                
                <div class="form-row-2col">
                  <div class="form-group">
                    <label for="demo-name">Your Full Name *</label>
                    <input type="text" id="demo-name" name="name" placeholder="e.g. Dr. Rajesh Kumar" required />
                  </div>
                  <div class="form-group">
                    <label for="demo-designation">Designation / Role *</label>
                    <select id="demo-designation" name="designation" required>
                      <option value="" disabled selected>Select Your Role</option>
                      <option value="Principal">Principal / Headmaster</option>
                      <option value="Trustee / Chairman">School Trustee / Chairman</option>
                      <option value="Academic Coordinator">Academic Coordinator</option>
                      <option value="Administrator">School Administrator</option>
                      <option value="Teacher">Senior Teacher</option>
                      <option value="Other">Other Decision Maker</option>
                    </select>
                  </div>
                </div>

                <div class="form-row-2col">
                  <div class="form-group">
                    <label for="demo-school">School / Institution Name *</label>
                    <input type="text" id="demo-school" name="school" placeholder="e.g. Delhi Public School" required />
                  </div>
                  <div class="form-group">
                    <label for="demo-location">City & State *</label>
                    <input type="text" id="demo-location" name="location" placeholder="e.g. Hyderabad, Telangana" required />
                  </div>
                </div>

                <div class="form-row-2col">
                  <div class="form-group">
                    <label for="demo-board">Curriculum / Board *</label>
                    <select id="demo-board" name="board" required>
                      <option value="" disabled selected>Select Educational Board</option>
                      <option value="CBSE">CBSE (Continuous Evaluation)</option>
                      <option value="State Board">State Board</option>
                      <option value="ICSE">ICSE / ISC</option>
                      <option value="Cambridge / IB">Cambridge / IB International</option>
                      <option value="Pre-School Chain">Pre-School / Early Learning</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="demo-strength">Student Strength *</label>
                    <select id="demo-strength" name="strength" required>
                      <option value="" disabled selected>Select Student Strength</option>
                      <option value="Below 200">Below 200 Students (Starter)</option>
                      <option value="200-400">200 – 400 Students (Growth)</option>
                      <option value="400-1000">400 – 1,000 Students</option>
                      <option value="1000+ Multi-Campus">1,000+ Multi-Campus Trust</option>
                    </select>
                  </div>
                </div>

                <div class="form-row-2col">
                  <div class="form-group">
                    <label for="demo-email">Official Email ID *</label>
                    <input type="email" id="demo-email" name="email" placeholder="principal@school.edu.in" required />
                  </div>
                  <div class="form-group">
                    <label for="demo-mobile">Mobile Number (WhatsApp) *</label>
                    <input type="tel" id="demo-mobile" name="mobile" placeholder="e.g. 9876543210" required />
                  </div>
                </div>

                <div class="form-group">
                  <label for="demo-timeslot">Preferred Demo Time Window *</label>
                  <select id="demo-timeslot" name="timeslot" required>
                    <option value="Morning (10:00 AM - 01:00 PM)" selected>Morning (10:00 AM – 01:00 PM)</option>
                    <option value="Afternoon (02:00 PM - 05:00 PM)">Afternoon (02:00 PM – 05:00 PM)</option>
                    <option value="Evening (05:00 PM - 07:00 PM)">Evening (05:00 PM – 07:00 PM)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="demo-requirements">Specific Questions or Focus Areas</label>
                  <textarea id="demo-requirements" name="requirements" rows="2" placeholder="Tell us if you want to focus on CBSE marksheets, substitute teachers, timetable, or fee collection..."></textarea>
                </div>

                <button type="submit" class="submit-demo-btn">
                  <span>Schedule 20-Minute Live Demo</span>
                  <span class="btn-arrow">&rarr;</span>
                </button>

                <div class="form-trust-footer">
                  <span>🔒 100% Privacy Guaranteed &bull; No Spam &bull; Meeting link sent via WhatsApp & Email</span>
                </div>
              </form>
            </div>
            `}
          </div>

        </div>
      </section>

      <!-- Unified Modern Footer -->
      <footer class="h2-footer" id="resources">
        <div class="h2-footer-grid">
          <div>
            <div class="h2-footer-logo">NOTEBOOKXL</div>
            <div class="h2-footer-about">A connected multi-tenant school operating system developed by Quenix Analytics Pvt. Ltd. for Indian schools.</div>
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
              <a href="/contact">Contact Us</a>
              <a href="/demo" class="active">Book a Demo</a>
              <button type="button" data-action="go-login">Sign In</button>
            </div>
          </div>
        </div>
        <div class="h2-footer-bottom">© 2026 Quenix Analytics Pvt. Ltd. &bull; NotebookXL School OS</div>
      </footer>
    </main>`;
}
