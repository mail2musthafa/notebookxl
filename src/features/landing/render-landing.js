export function renderLandingFeature(deps) {
  const { state } = deps || {};

  const metrics = [
    { value: '1,400+', label: 'Active Students Managed' },
    { value: '95.8%', label: 'Daily Attendance Precision' },
    { value: '48 Hours', label: 'Rapid School Onboarding' },
    { value: '15+ Hours', label: 'Admin Hours Saved / Week' }
  ];

  const coreModules = [
    {
      icon: '👥',
      title: 'Student Information System (SIS)',
      badge: 'Core Records',
      text: 'Manage comprehensive student profiles, parent contacts, blood groups, admission records, and class rosters in one organized repository.'
    },
    {
      icon: '✓',
      title: 'Daily Attendance & Roll Call Register',
      badge: '30-Sec Roll Call',
      text: 'Mark class attendance from any smartphone or PC with instant absentee logging, parent SMS notifications, and monthly audit reports.'
    },
    {
      icon: '📋',
      title: 'Academics & CCE Marksheets',
      badge: 'CBSE & State Ready',
      text: 'Automate grade calculations, periodic test weightages, term averages, and 1-click generation of board-compliant printable report cards.'
    },
    {
      icon: '🗓️',
      title: 'Timetable & Substitution Engine',
      badge: 'Conflict-Free',
      text: 'Generate balanced 7-period weekly class timetables, teacher workload matrices, and instant substitute teacher allocation.'
    },
    {
      icon: '🔔',
      title: 'School Community & Circulars',
      badge: 'Real-Time Updates',
      text: 'Broadcast official school circulars, holiday notices, examination schedules, and event updates with attachments to teachers and students.'
    },
    {
      icon: '✦',
      title: 'Erum AI School Assistant',
      badge: 'Smart Intelligence',
      text: 'Query institutional records in plain English, receive daily management briefs, and detect at-risk students before exams arrive.'
    }
  ];

  const activeSolutionTab = state?.activeSolutionTab || 'management';

  return `<main class="landing home-v2" id="home">
      <!-- Standardized Clean Navbar (Strict 4 items + 2 actions) -->
      <header class="h2-navbar">
        <div class="h2-nav-inner">
          <a href="/" class="h2-logo">NOTEBOOK<span>XL</span></a>
          <nav class="h2-nav-menu" aria-label="Primary">
            <a href="/" class="active" aria-current="page">Home</a>
            <a href="/#solutions">Solutions</a>
            <a href="/about">About Us</a>
            <a href="/contact">Contact Us</a>
          </nav>
          <div class="h2-nav-actions">
            <button type="button" class="h2-signin" data-action="go-login">Get Started</button>
            <button type="button" class="h2-nav-demo" data-action="go-demo">Book a Demo</button>
          </div>
        </div>
      </header>

      <!-- Modern Hero Section (Deep Navy Theme) -->
      <section class="home-hero-modern" id="home-hero">
        <div class="home-hero-container">
          <div class="home-hero-badge">
            <span class="badge-dot"></span>
            <span>NOTEBOOKXL SCHOOL OPERATING SYSTEM</span>
          </div>
          <h1>A Smarter, Connected Operating System for Modern Schools</h1>
          <p>Bring students, teachers, academics, attendance, and school intelligence together into one lightning-fast platform designed for Indian educational institutions.</p>
          
          <div class="home-hero-actions">
            <button type="button" class="home-btn-primary" data-action="go-demo">Book a Guided Demo &rarr;</button>
            <button type="button" class="home-btn-secondary" data-action="open-demo-dashboard">Explore Live Demo</button>
            <a href="#pricing" class="home-btn-outline">View Pricing Plans</a>
          </div>

          <!-- Instant 1-Click Role Access -->
          <div class="home-role-access-bar" aria-label="Quick role login">
            <span class="role-access-label">Instant 1-Click Persona Access:</span>
            <div class="role-access-buttons">
              <button type="button" class="role-quick-btn" data-action="go-login-role" data-role="SCHOOL_ADMIN">🏛️ Management</button>
              <button type="button" class="role-quick-btn" data-action="go-login-role" data-role="TEACHER">👩‍🏫 Teacher</button>
              <button type="button" class="role-quick-btn" data-action="go-login-role" data-role="STUDENT">🎓 Student</button>
            </div>
          </div>
          
          <div class="home-hero-subtext">A product of Quenix Analytics Pvt. Ltd. &bull; Hitech City, Hyderabad, India</div>
        </div>
      </section>

      <!-- Impact Metrics Bar -->
      <section class="landing-metrics-strip">
        <div class="landing-metrics-container">
          ${metrics.map((m) => `
            <div class="landing-metric-item">
              <strong>${m.value}</strong>
              <small>${m.label}</small>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Tailored Role Solutions Section -->
      <section class="solutions-showcase-section" id="solutions">
        <div class="h2-container">
          <div class="h2-section-heading">
            <span class="h2-eyebrow">TAILORED SOLUTIONS FOR EVERY STAKEHOLDER</span>
            <h2>One Unified School OS. Distinct Role Experiences.</h2>
            <p>Every member of your school community accesses the tools, metrics, and workflows specific to their everyday responsibilities.</p>
          </div>

          <!-- Role Switcher Tabs -->
          <div class="solutions-role-tabs" role="tablist" aria-label="Solutions by Role">
            <button type="button" class="solution-tab-btn ${(!activeSolutionTab || activeSolutionTab === 'management') ? 'active' : ''}" data-action="switch-solution-tab" data-tab="management">
              <span class="tab-icon">🏛️</span>
              <span class="tab-label">For Management & Trustees</span>
            </button>
            <button type="button" class="solution-tab-btn ${activeSolutionTab === 'teacher' ? 'active' : ''}" data-action="switch-solution-tab" data-tab="teacher">
              <span class="tab-icon">👩‍🏫</span>
              <span class="tab-label">For Principals & Teachers</span>
            </button>
            <button type="button" class="solution-tab-btn ${activeSolutionTab === 'student' ? 'active' : ''}" data-action="switch-solution-tab" data-tab="student">
              <span class="tab-icon">🎓</span>
              <span class="tab-label">For Students & Parents</span>
            </button>
          </div>

          <!-- Solution Active Content Card -->
          ${(() => {
            if (activeSolutionTab === 'teacher') {
              return `
              <div class="solution-detail-card">
                <div class="solution-content-col">
                  <span class="solution-pill">CLASSROOM SIMPLICITY & ACADEMIC DELIVERY</span>
                  <h3>Save Hours Every Week on Daily Classroom Administration</h3>
                  <p class="solution-desc">Designed around classroom reality. Teachers can take roll calls in under 30 seconds, record marks without spreadsheet headaches, and manage lesson plans effortlessly.</p>
                  
                  <div class="solution-highlights-grid">
                    <div class="solution-highlight-item">
                      <span class="highlight-check">✓</span>
                      <div>
                        <strong>30-Second Digital Roll Call</strong>
                        <small>Rapid mobile attendance register with instant absentee logging.</small>
                      </div>
                    </div>
                    <div class="solution-highlight-item">
                      <span class="highlight-check">✓</span>
                      <div>
                        <strong>CBSE CCE & Custom Marksheets</strong>
                        <small>Automated grade computation, term weightages, and 1-click report cards.</small>
                      </div>
                    </div>
                    <div class="solution-highlight-item">
                      <span class="highlight-check">✓</span>
                      <div>
                        <strong>Conflict-Free Timetables</strong>
                        <small>View personal daily schedules and live period countdown timers.</small>
                      </div>
                    </div>
                    <div class="solution-highlight-item">
                      <span class="highlight-check">✓</span>
                      <div>
                        <strong>Digital Homework & Lesson Plans</strong>
                        <small>Create assignments, attach study material, and track submissions.</small>
                      </div>
                    </div>
                  </div>

                  <div class="solution-action-row">
                    <button type="button" class="solution-cta-btn" data-action="go-login-role" data-role="TEACHER">Launch Teacher Workspace Demo &rarr;</button>
                  </div>
                </div>

                <div class="solution-preview-col">
                  <div class="solution-mockup-card">
                    <div class="mockup-header">
                      <span class="mockup-dot red"></span>
                      <span class="mockup-dot yellow"></span>
                      <span class="mockup-dot green"></span>
                      <span class="mockup-title">👩‍🏫 Teacher Workspace &bull; Grade 8A</span>
                    </div>
                    <div class="mockup-body">
                      <div class="mockup-stat-row">
                        <div class="mockup-stat-pill"><b>Today's Classes</b><span>5 Periods</span></div>
                        <div class="mockup-stat-pill"><b>Roll Call</b><span class="badge-success">Completed</span></div>
                        <div class="mockup-stat-pill"><b>Pending Marks</b><span>1 Subject</span></div>
                      </div>
                      <div class="mockup-feature-box">
                        <small class="mockup-eyebrow">CURRENT RUNNING PERIOD</small>
                        <h4>Mathematics &bull; Chapter 4 Linear Equations</h4>
                        <div class="mockup-progress-bar"><div class="progress-fill" style="width: 65%;"></div></div>
                        <div class="mockup-meta"><span>Period 3 &bull; 10:15 – 11:00 AM</span><span class="text-blue">15 mins remaining</span></div>
                      </div>
                      <div class="mockup-quick-tasks">
                        <div class="task-check-row"><span>☑</span> Grade 8 Periodic Test 1 Marks Entered</div>
                        <div class="task-check-row"><span>☐</span> Prepare Chemistry Lesson Plan for Friday</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>`;
            } else if (activeSolutionTab === 'student') {
              return `
              <div class="solution-detail-card">
                <div class="solution-content-col">
                  <span class="solution-pill">LEARNING TRANSPARENCY & COMMUNICATION</span>
                  <h3>A Connected Workspace for Academics, Homework & Notices</h3>
                  <p class="solution-desc">Keep students organized and parents confident with immediate visibility into attendance records, exam schedules, homework checklists, and school circulars.</p>
                  
                  <div class="solution-highlights-grid">
                    <div class="solution-highlight-item">
                      <span class="highlight-check">✓</span>
                      <div>
                        <strong>Personalized Academic Progress</strong>
                        <small>Track term marks, subject averages, attendance %, and class rank.</small>
                      </div>
                    </div>
                    <div class="solution-highlight-item">
                      <span class="highlight-check">✓</span>
                      <div>
                        <strong>Homework & Assignment Checklist</strong>
                        <small>Clear checklist of pending assignments with instructions and due dates.</small>
                      </div>
                    </div>
                    <div class="solution-highlight-item">
                      <span class="highlight-check">✓</span>
                      <div>
                        <strong>Daily Timetable & Period Schedule</strong>
                        <small>View today's class schedule, subject teachers, and room numbers.</small>
                      </div>
                    </div>
                    <div class="solution-highlight-item">
                      <span class="highlight-check">✓</span>
                      <div>
                        <strong>School Community & Notices</strong>
                        <small>Real-time circulars for holidays, exam dates, and cultural events.</small>
                      </div>
                    </div>
                  </div>

                  <div class="solution-action-row">
                    <button type="button" class="solution-cta-btn" data-action="go-login-role" data-role="STUDENT">Launch Student Workspace Demo &rarr;</button>
                  </div>
                </div>

                <div class="solution-preview-col">
                  <div class="solution-mockup-card">
                    <div class="mockup-header">
                      <span class="mockup-dot red"></span>
                      <span class="mockup-dot yellow"></span>
                      <span class="mockup-dot green"></span>
                      <span class="mockup-title">🎓 Student Portal &bull; Roll No. 24</span>
                    </div>
                    <div class="mockup-body">
                      <div class="mockup-stat-row">
                        <div class="mockup-stat-pill"><b>My Attendance</b><span class="badge-success">96.4%</span></div>
                        <div class="mockup-stat-pill"><b>Term Average</b><span>88.5%</span></div>
                        <div class="mockup-stat-pill"><b>Next Exam</b><span>Science (18 Aug)</span></div>
                      </div>
                      <div class="mockup-feature-box">
                        <small class="mockup-eyebrow">TODAY'S HOMEWORK ASSIGNMENT</small>
                        <h4>Physics: Force & Pressure Worksheet</h4>
                        <div class="mockup-meta"><span>Assigned by Mr. Sharma</span><span class="text-amber">Due Tomorrow &bull; 9:00 AM</span></div>
                      </div>
                      <div class="mockup-quick-tasks">
                        <div class="task-check-row"><span>☑</span> Mathematics Trigonometry Exercise 3.2 Submitted</div>
                        <div class="task-check-row"><span>🔔</span> Annual Science Exhibition registration now open!</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>`;
            } else {
              return `
              <div class="solution-detail-card">
                <div class="solution-content-col">
                  <span class="solution-pill">INSTITUTIONAL GOVERNANCE & OVERSIGHT</span>
                  <h3>Real-Time Visibility into Every Campus & Classroom</h3>
                  <p class="solution-desc">Gain complete macro command over daily attendance, teacher leaves, academic health, and multi-branch operations from one central dashboard.</p>
                  
                  <div class="solution-highlights-grid">
                    <div class="solution-highlight-item">
                      <span class="highlight-check">✓</span>
                      <div>
                        <strong>Live School Pulse</strong>
                        <small>Instant morning operational brief on student attendance %, staff, and periods.</small>
                      </div>
                    </div>
                    <div class="solution-highlight-item">
                      <span class="highlight-check">✓</span>
                      <div>
                        <strong>Teacher Workload & Substitution</strong>
                        <small>Automated substitute recommendations when teachers are absent.</small>
                      </div>
                    </div>
                    <div class="solution-highlight-item">
                      <span class="highlight-check">✓</span>
                      <div>
                        <strong>Academic Health & Trends</strong>
                        <small>Macro subject health metrics, class averages, and early at-risk alerts.</small>
                      </div>
                    </div>
                    <div class="solution-highlight-item">
                      <span class="highlight-check">✓</span>
                      <div>
                        <strong>Multi-Campus Tenant Isolation</strong>
                        <small>Manage multiple school branches with dedicated database boundaries.</small>
                      </div>
                    </div>
                  </div>

                  <div class="solution-action-row">
                    <button type="button" class="solution-cta-btn" data-action="go-login-role" data-role="SCHOOL_ADMIN">Launch Management Workspace Demo &rarr;</button>
                  </div>
                </div>

                <div class="solution-preview-col">
                  <div class="solution-mockup-card">
                    <div class="mockup-header">
                      <span class="mockup-dot red"></span>
                      <span class="mockup-dot yellow"></span>
                      <span class="mockup-dot green"></span>
                      <span class="mockup-title">🏛️ School Pulse Command Center</span>
                    </div>
                    <div class="mockup-body">
                      <div class="mockup-stat-row">
                        <div class="mockup-stat-pill"><b>Student Attendance</b><span class="badge-success">93.1%</span></div>
                        <div class="mockup-stat-pill"><b>Staff Present</b><span>18 / 20</span></div>
                        <div class="mockup-stat-pill"><b>Active Periods</b><span class="badge-blue">7 Running</span></div>
                      </div>
                      <div class="mockup-feature-box">
                        <small class="mockup-eyebrow">ERUM AI MORNING BRIEFING</small>
                        <h4>93.1% Student Attendance Today</h4>
                        <p style="font-size: 0.82rem; color: #cbd5e1; margin: 4px 0 8px;">2 teachers absent today. Substitute classes assigned for Grade 8 Mathematics & Grade 9 Chemistry.</p>
                        <div class="mockup-meta"><span>Status: Optimal</span><span class="text-green">&bull; All 7 periods covered</span></div>
                      </div>
                      <div class="mockup-quick-tasks">
                        <div class="task-check-row"><span>🔔</span> 4 students flagged below 75% attendance threshold</div>
                        <div class="task-check-row"><span>📊</span> Term 1 Assessment marksheets finalized for Grade 10</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>`;
            }
          })()}

          <!-- Institution Types Grid -->
          <div class="institution-solutions-strip">
            <div class="institution-card">
              <span class="inst-icon">🏫</span>
              <h4>K-12 Schools (CBSE / State / ICSE)</h4>
              <p>Pre-configured assessment rubrics, CCE grading rules, and 1-click printable report cards matching board formats.</p>
            </div>
            <div class="institution-card">
              <span class="inst-icon">🏢</span>
              <h4>Multi-Campus Education Trusts</h4>
              <p>Centralized trust oversight with isolated tenant subdomains, individual branch logins, and group-wide analytics.</p>
            </div>
            <div class="institution-card">
              <span class="inst-icon">🎒</span>
              <h4>Pre-Schools & Early Learning</h4>
              <p>Simplified roll calls, meal and activity updates, and streamlined parent communication.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Core Capabilities Modules Grid -->
      <section class="h2-features" id="features">
        <div class="h2-container">
          <div class="h2-section-heading">
            <span class="h2-eyebrow">COMPREHENSIVE MODULES</span>
            <h2>Built Around the Everyday School Ecosystem</h2>
            <p>Every core tool your administrative and academic teams need to manage operations with zero clutter.</p>
          </div>
          <div class="h2-features-grid">
            ${coreModules.map((m) => `
              <article class="h2-feature-card-modern">
                <div class="module-card-head">
                  <div class="h2-feature-icon">${m.icon}</div>
                  <span class="module-badge">${m.badge}</span>
                </div>
                <h3>${m.title}</h3>
                <p>${m.text}</p>
              </article>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Transparent Pricing Grid (Modern Cohesive Palette) -->
      <section class="h2-pricing pricing-section-modern" id="pricing">
        <div class="h2-container">
          <div class="h2-section-heading">
            <span class="h2-eyebrow">TRANSPARENT INSTITUTIONAL PRICING</span>
            <h2>Simple Annual Plans for Every School Size</h2>
            <p>Predictable yearly pricing for your academic session. Unlimited teacher, student, and parent logins included.</p>
          </div>
          <div class="h2-pricing-grid pricing-grid-modern">
            
            <!-- Plan 1: Starter (Below 200 Students) -->
            <article class="pricing-card-modern">
              <div class="pricing-card-head">
                <span class="plan-capacity-tag">BELOW 200 STUDENTS</span>
                <h3 class="plan-name-title">Starter</h3>
                <p class="plan-desc-text">Essential digital roll calls, student profiles, timetable, and parent SMS alerts for primary & middle schools.</p>
              </div>
              <div class="pricing-amount-row">
                <div class="price-val"><strong>₹3,999</strong><span>/ Year</span></div>
                <small class="per-student-approx">&bull; Billed annually &bull; ~₹333 / month flat</small>
              </div>
              <div class="plan-usp-box">
                <span>⚡ Works on Any 4G Phone &bull; Zero Hardware Needed</span>
              </div>
              <button type="button" class="pricing-action-btn" data-action="go-demo">Book Starter Demo &rarr;</button>
              <div class="plan-divider-line"></div>
              <div class="plan-includes-label">CORE ESSENTIALS INCLUDED:</div>
              <div class="plan-features-list">
                <div class="plan-feat-row"><span class="feat-check">✓</span>Complete Student & Staff Profile Directory</div>
                <div class="plan-feat-row"><span class="feat-check">✓</span>30-Second Mobile Daily Roll Call Register</div>
                <div class="plan-feat-row"><span class="feat-check">✓</span>Automated Parent Absentee SMS Alerts</div>
                <div class="plan-feat-row"><span class="feat-check">✓</span>7-Period Master Timetable & Class Schedules</div>
                <div class="plan-feat-row"><span class="feat-check">✓</span>Official School Community Circulars & Notices</div>
                <div class="plan-feat-row"><span class="feat-check">✓</span>Daily Morning Management Attendance Summary</div>
                <div class="plan-feat-row"><span class="feat-check">✓</span>Unlimited Teacher & Parent User Accounts</div>
                <div class="plan-feat-row"><span class="feat-check">✓</span>Free 48-Hour Excel Data Migration & Setup</div>
              </div>
            </article>

            <!-- Plan 2: Growth (200 - 400 Students - MOST POPULAR) -->
            <article class="pricing-card-modern featured-plan">
              <span class="featured-badge-pill">MOST POPULAR CHOICE FOR CBSE SCHOOLS</span>
              <div class="pricing-card-head">
                <span class="plan-capacity-tag popular-tag">200 TO 400 STUDENTS</span>
                <h3 class="plan-name-title">Growth</h3>
                <p class="plan-desc-text">Complete academic engine with CBSE CCE marksheets, automated teacher substitution, and student portal.</p>
              </div>
              <div class="pricing-amount-row">
                <div class="price-val text-blue"><strong>₹5,999</strong><span>/ Year</span></div>
                <small class="per-student-approx">&bull; Billed annually &bull; ~₹499 / month flat</small>
              </div>
              <div class="plan-usp-box highlighted-usp">
                <span>🚀 Saves 15+ Hours / Week on Marksheets & Substitutes</span>
              </div>
              <button type="button" class="pricing-action-btn featured-btn" data-action="go-demo">Book Growth Demo &rarr;</button>
              <div class="plan-divider-line"></div>
              <div class="plan-includes-label">EVERYTHING IN STARTER, PLUS:</div>
              <div class="plan-features-list">
                <div class="plan-feat-row"><span class="feat-check">✓</span><strong>CBSE CCE & State Board Marksheet Engine</strong></div>
                <div class="plan-feat-row"><span class="feat-check">✓</span><strong>1-Click Printable Board-Compliant Report Cards</strong></div>
                <div class="plan-feat-row"><span class="feat-check">✓</span>Automated Substitute Teacher Engine</div>
                <div class="plan-feat-row"><span class="feat-check">✓</span>Teacher Workload & Period Matrix</div>
                <div class="plan-feat-row"><span class="feat-check">✓</span>Student & Parent Portal Dashboards</div>
                <div class="plan-feat-row"><span class="feat-check">✓</span>Digital Homework & Assignment Tracker</div>
                <div class="plan-feat-row"><span class="feat-check">✓</span>Class Rank & Subject Average Analytics</div>
                <div class="plan-feat-row"><span class="feat-check">✓</span>Priority Phone & WhatsApp Support</div>
              </div>
            </article>

            <!-- Plan 3: Multi-Campus (400+ Students & Multi-Branch) -->
            <article class="pricing-card-modern">
              <div class="pricing-card-head">
                <span class="plan-capacity-tag">400+ STUDENTS & MULTI-BRANCH</span>
                <h3 class="plan-name-title">Multi-Campus</h3>
                <p class="plan-desc-text">For large institutions & multi-branch education trusts requiring multi-campus oversight and Erum AI.</p>
              </div>
              <div class="pricing-amount-row">
                <div class="price-val"><strong>₹9,999</strong><span>/ Year</span></div>
                <small class="per-student-approx">&bull; Billed annually &bull; Complete group licensing</small>
              </div>
              <div class="plan-usp-box">
                <span>🏛️ Centralized Trust Governance & Subdomains</span>
              </div>
              <button type="button" class="pricing-action-btn" data-action="go-demo">Contact Enterprise Team &rarr;</button>
              <div class="plan-divider-line"></div>
              <div class="plan-includes-label">EVERYTHING IN GROWTH, PLUS:</div>
              <div class="plan-features-list">
                <div class="plan-feat-row"><span class="feat-check">✓</span><strong>Multi-Campus Trust Master Command Portal</strong></div>
                <div class="plan-feat-row"><span class="feat-check">✓</span><strong>Isolated Tenant Subdomains (school.notebookxl.com)</strong></div>
                <div class="plan-feat-row"><span class="feat-check">✓</span>Erum AI Assistant & Instant Morning Briefings</div>
                <div class="plan-feat-row"><span class="feat-check">✓</span>Biometric Fingerprint & RFID Hardware Sync</div>
                <div class="plan-feat-row"><span class="feat-check">✓</span>Custom Report Card Layouts & Grading Rubrics</div>
                <div class="plan-feat-row"><span class="feat-check">✓</span>Multi-Branch Student & Staff Record Transfers</div>
                <div class="plan-feat-row"><span class="feat-check">✓</span>Dedicated School Success Manager</div>
                <div class="plan-feat-row"><span class="feat-check">✓</span>99.9% Uptime SLA & In-Person Teacher Training</div>
              </div>
            </article>

          </div>
        </div>
      </section>

      <!-- Final Call-to-Action Section -->
      <section class="h2-final-cta">
        <div class="h2-cta-card">
          <h2>Discover a Smarter Way to Run Your School</h2>
          <p>Bring your students, teachers, academics, operations and school intelligence together with NotebookXL.</p>
          <div class="h2-cta-actions">
            <button type="button" class="home-btn-primary" data-action="go-demo">Book a Guided Demo &rarr;</button>
            <a href="/contact" class="home-btn-secondary">Contact Our Team</a>
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
              <a href="/demo">Book a Demo</a>
              <button type="button" data-action="go-login">Sign In</button>
            </div>
          </div>
        </div>
        <div class="h2-footer-bottom">© 2026 Quenix Analytics Pvt. Ltd. &bull; NotebookXL School OS</div>
      </footer>
    </main>`;
}
