export function renderAboutFeature(deps) {
  const { button } = deps || {};

  const pillars = [
    {
      icon: '🔒',
      title: 'True Multi-Tenant Isolation',
      desc: 'Every school operates within its own dedicated, encrypted database partition with custom subdomains (e.g. yourschool.notebookxl.com). Student and fee records are completely private and isolated.'
    },
    {
      icon: '📋',
      title: 'Native Indian Curricula Support',
      desc: 'Built specifically for CBSE Continuous and Comprehensive Evaluation (CCE), Periodic Assessments, Term 1 & 2 weightages, State Board grading formats, and 1-click printable report cards.'
    },
    {
      icon: '⚡',
      title: 'Teacher-First Usability',
      desc: 'Designed around the classroom reality. Teachers can complete daily roll calls in under 30 seconds, record marks in seconds, and access class timetables with zero clutter.'
    },
    {
      icon: '🧠',
      title: 'Proactive AI Intelligence (Erum AI)',
      desc: 'Beyond storing records, NotebookXL utilizes Erum AI to generate daily management briefs, flag students falling below attendance thresholds, and optimize substitute teacher coverage.'
    }
  ];

  const metrics = [
    { value: '1,400+', label: 'Active Students Managed' },
    { value: '95.8%', label: 'Daily Attendance Precision' },
    { value: '48 Hours', label: 'Average School Onboarding' },
    { value: '15+ Hours', label: 'Admin Time Saved / Week' }
  ];

  return `<main class="about-page-modern home-v2" id="about-home">
      <!-- Unified Header -->
      <header class="h2-navbar">
        <div class="h2-nav-inner">
          <a href="/" class="h2-logo">NOTEBOOK<span>XL</span></a>
          <nav class="h2-nav-menu" aria-label="Primary">
            <a href="/">Home</a>
            <a href="/#solutions">Solutions</a>
            <a href="/about" class="active" aria-current="page">About Us</a>
            <a href="/contact">Contact Us</a>
          </nav>
          <div class="h2-nav-actions">
            <button type="button" class="h2-signin" data-action="go-login">Get Started</button>
            <button type="button" class="h2-nav-demo" data-action="go-demo">Book a Demo</button>
          </div>
        </div>
      </header>

      <!-- Hero Header Section -->
      <section class="about-hero-modern">
        <div class="about-hero-container">
          <div class="about-hero-badge">
            <span class="badge-dot"></span>
            <span>ABOUT NOTEBOOKXL &bull; A PRODUCT OF QUENIX ANALYTICS</span>
          </div>
          <h1>Empowering Indian Schools with an Intelligent Operating System</h1>
          <p>We are on a mission to replace disconnected spreadsheets, paper registers, and clunky legacy software with a unified, lightning-fast School OS built for management, teachers, and students.</p>
          
          <div class="about-hero-actions">
            <button type="button" class="about-btn-primary" data-action="go-demo">Book a Guided Demo &rarr;</button>
            <a href="/contact" class="about-btn-secondary">Contact Our Team</a>
          </div>
        </div>
      </section>

      <!-- Impact Metrics Bar -->
      <section class="about-metrics-section">
        <div class="about-metrics-container">
          ${metrics.map((m) => `
            <div class="about-metric-card">
              <strong>${m.value}</strong>
              <small>${m.label}</small>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Mission & Before/After Section -->
      <section class="about-mission-section">
        <div class="about-container">
          <div class="about-section-head">
            <span class="about-eyebrow">OUR MISSION & PHILOSOPHY</span>
            <h2>Reimagining How Modern Schools Operate</h2>
            <p>Schools manage thousands of critical academic, operational, and student records daily, yet most still battle legacy software built two decades ago.</p>
          </div>

          <div class="about-comparison-grid">
            <div class="comparison-card legacy-card">
              <div class="comparison-header">
                <span class="comparison-tag warning">THE LEGACY ERP WAY</span>
                <h3>Disconnected & Complex</h3>
              </div>
              <ul class="comparison-list">
                <li><span>&times;</span> Manual paper registers leading to lost records and human errors</li>
                <li><span>&times;</span> Slow, cluttered interfaces with steep learning curves for teachers</li>
                <li><span>&times;</span> Management lacks live visibility into daily attendance and school health</li>
                <li><span>&times;</span> Shared database risks with slow performance during exam result peaks</li>
                <li><span>&times;</span> Rigid grading templates requiring expensive custom developer hours</li>
              </ul>
            </div>

            <div class="comparison-card modern-card">
              <div class="comparison-header">
                <span class="comparison-tag success">THE NOTEBOOKXL WAY</span>
                <h3>Fast, Unified & Intelligent</h3>
              </div>
              <ul class="comparison-list">
                <li><span>&check;</span> 30-second digital roll calls accessible on mobile, tablet, or PC</li>
                <li><span>&check;</span> Zero-clutter modern interface designed for busy classroom teachers</li>
                <li><span>&check;</span> Live School Pulse giving trustees instant operational dashboards</li>
                <li><span>&check;</span> Dedicated tenant data isolation with 99.9% uptime SLA guarantee</li>
                <li><span>&check;</span> Built-in CBSE CCE, State Board, and ICSE custom evaluation engines</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 4 Core Pillars Section -->
      <section class="about-pillars-section">
        <div class="about-container">
          <div class="about-section-head">
            <span class="about-eyebrow">ENGINEERING EXCELLENCE</span>
            <h2>Four Pillars of the NotebookXL Platform</h2>
            <p>Built from the ground up to solve the real everyday challenges of school administration.</p>
          </div>

          <div class="about-pillars-grid">
            ${pillars.map((pillar) => `
              <article class="about-pillar-card">
                <div class="pillar-icon-wrap">${pillar.icon}</div>
                <h3>${pillar.title}</h3>
                <p>${pillar.desc}</p>
              </article>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Company & Innovation Lab Section -->
      <section class="about-company-section">
        <div class="about-container">
          <div class="company-card-inner">
            <div class="company-badge-row">
              <span class="company-pill">THE INNOVATION TEAM</span>
            </div>
            <h2>Developed by Quenix Analytics Pvt. Ltd.</h2>
            <p>Headquartered in the technology hub of <b>Hitech City, Hyderabad, India</b>, Quenix Analytics is committed to engineering enterprise-grade, high-performance software systems for the educational sector.</p>
            
            <div class="company-details-grid">
              <div class="company-detail-item">
                <span class="detail-icon">📍</span>
                <div>
                  <strong>Headquarters</strong>
                  <p>Hitech City, Hyderabad, Telangana 500081</p>
                </div>
              </div>

              <div class="company-detail-item">
                <span class="detail-icon">📞</span>
                <div>
                  <strong>Direct Inquiries</strong>
                  <p><a href="tel:+917396361618">+91 73963 61618</a> &bull; <a href="tel:+919667770727">+91 96677 70727</a></p>
                </div>
              </div>

              <div class="company-detail-item">
                <span class="detail-icon">✉️</span>
                <div>
                  <strong>Institutional Sales</strong>
                  <p><a href="mailto:sales@notebookxl.com">sales@notebookxl.com</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA Section -->
      <section class="about-cta-section">
        <div class="about-container">
          <div class="about-cta-card">
            <h2>Ready to Transform Your School's Digital Operations?</h2>
            <p>Join forward-thinking schools that have simplified attendance, academics, and management reporting with NotebookXL.</p>
            <div class="about-cta-actions">
              <button type="button" class="about-btn-primary" data-action="go-demo">Book a Guided Demo &rarr;</button>
              <a href="/contact" class="about-btn-outline">Contact Sales Team</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Unified Modern Footer -->
      <footer class="h2-footer" id="resources">
        <div class="h2-footer-grid">
          <div>
            <div class="h2-footer-logo">NOTEBOOKXL</div>
            <div class="h2-footer-about">A multi-tenant school operating system developed by Quenix Analytics Pvt. Ltd. for modern Indian educational institutions.</div>
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
              <a href="/about" class="active">About Us</a>
              <a href="/contact">Contact Us</a>
              <a href="/demo">Book a Demo</a>
              <button type="button" data-action="go-login">Sign In</button>
            </div>
          </div>
        </div>
        <div class="h2-footer-bottom">© 2026 Quenix Analytics Pvt. Ltd. · NotebookXL School OS</div>
      </footer>
    </main>`;
}
