import { renderLandingFeature } from './src/features/landing/render-landing.js';
import { renderLoginFeature } from './src/features/auth/render-login.js';
import { renderAboutFeature } from './src/features/about/render-about.js';
import { renderContactFeature } from './src/features/contact/render-contact.js';
import { renderDemoFeature } from './src/features/demo/render-demo.js';
import {
  calendarMonthsForYear as sharedCalendarMonthsForYear,
  renderAcademicYearCalendarCard as renderAcademicYearCalendarCardView,
  renderSchoolTimingCountdownCard as renderSchoolTimingCountdownCardView
} from './src/features/shared/dashboard-widgets.js';
import { renderAttendanceScannerModal } from './src/modules/attendance/scanner.js';
import { renderUniversalAttendanceGatewayModal } from './src/modules/attendance/gateway.js';
import { renderPeople as renderPeopleModule } from './src/modules/students/index.js';
import { renderAddStudentModal } from './src/modules/students/enroll_modal.js';
import { renderTimetable as renderTimetableModule } from './src/modules/timetable/index.js';
import { renderFees as renderFeesModule } from './src/modules/fees/index.js';
import { renderReportCards as renderReportCardsModule } from './src/modules/reports/index.js';
import { renderDashboard as renderDashboardModule } from './src/modules/dashboard/index.js';
import { renderLeaderboard as renderLeaderboardModule } from './src/modules/leaderboard/index.js';

/* NotebookXL prototype UI. Data is deliberately kept behind a tenant-scoped store. */
(function () {
  'use strict';

  const app = document.getElementById('app');
  const seed = window.NOTEBOOKXL_SEED || { tenants: [] };
  const today = new Date('2026-08-13T09:00:00');
  const AUTH_STORAGE_KEY = 'notebookxl.auth.session';
  const AUTH_API_BASE = window.NOTEBOOKXL_API_BASE || 'http://127.0.0.1:8000';
  const isAboutPath = (pathname) => pathname === '/about' || pathname === '/about.html';
  const isContactPath = (pathname) => pathname === '/contact' || pathname === '/contact.html';
  const isDemoPath = (pathname) => pathname === '/demo' || pathname === '/demo.html';
  const isLoginPath = (pathname) => pathname === '/login' || pathname === '/login.html' || pathname === '/signin';
  const storedAuthSession = readStoredAuthSession();
  const roleLabels = {
    SCHOOL_ADMIN: 'School management',
    PRINCIPAL: 'Principal',
    ACADEMIC_COORDINATOR: 'Academic coordinator',
    TEACHER: 'Teacher',
    STUDENT: 'Student'
  };
  const state = {
    view: storedAuthSession && storedAuthSession.token
      ? 'app'
      : isAboutPath(window.location.pathname)
        ? 'about'
        : isContactPath(window.location.pathname)
          ? 'contact'
        : isDemoPath(window.location.pathname)
          ? 'demo'
        : isLoginPath(window.location.pathname)
          ? 'login'
        : 'landing',
    isAuthenticated: Boolean(storedAuthSession && storedAuthSession.token),
    authSession: storedAuthSession || null,
    tenantId: storedAuthSession?.tenant?.id || (seed.tenants && seed.tenants[0] ? seed.tenants[0].id : null),
    role: storedAuthSession?.user?.role || 'SCHOOL_ADMIN',
    page: 'dashboard',
    profile: null,
    profileTab: 'overview',
    classScope: null,
    modal: null,
    airaOpen: false,
    mobileNav: false,
    filters: {},
    query: '',
    toast: null,
    selectedPerson: null,
    notificationOpen: false,
  authRole: storedAuthSession?.user?.role || 'SCHOOL_ADMIN',
  authMode: 'signin',
  authDraft: {
    workspace: storedAuthSession?.tenant?.slug || 'meezankids',
    userId: storedAuthSession?.user?.email || '',
    password: ''
  },
  isAuthenticated: Boolean(storedAuthSession?.token),
  authSession: storedAuthSession || null,
    remoteDashboards: {
      management: null,
      teacher: null,
      student: null,
      loading: false,
      error: ''
    },
    pulseExpanded: false,
    attendancePeriod: 'today',
    selectedTeacherReason: '',
    calendarYear: 2026,
    timetableView: 'month',
    timetableDate: '2026-08-13',
    communityByTenant: {},
    communityPostFilter: 'ALL',
    communitySearchQuery: '',
    activeSpotlightIndex: 0,
    campusPollByTenant: {},
    replyingToCommentId: null,
    activeReactionPickerPostId: null,
    composerMediaKind: 'text',
    schoolTimingByTenant: {},
    feeRecordsByTenant: {},
    leaderboardClassFilter: 'ALL',
    leaderboardGradeFilter: 'ALL',
    leaderboardSortBy: 'marks',
    leaderboardSearchQuery: '',
    showFeeReceiptDocument: false,
    showReportCardDocument: false,
    idCardSegmentFilter: 'ALL',
    selectedIDCardPersonId: null,
    showIDCardDocument: false,
    landingRoleTab: 'management',
    landingFeatureTab: 'students',
    schoolInquiries: (() => {
      try {
        const raw = localStorage.getItem('notebookxl_school_inquiries');
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return [
        {
          id: 'INQ-84921',
          type: 'DEMO_REQUEST',
          submittedAt: '2026-08-16T14:30:00.000Z',
          formattedDate: '16 Aug 2026, 08:00 PM',
          name: 'Sister Agnes',
          designation: 'Principal',
          school: "St. Mary's High School",
          location: 'Hyderabad, Telangana',
          board: 'CBSE',
          strength: '200-400 Students',
          email: 'principal@stmarys-hyd.edu.in',
          mobile: '9849012345',
          timeslot: 'Morning (10:00 AM - 01:00 PM)',
          category: 'Product Demo',
          requirements: 'Want to explore CBSE CCE marksheet calculations and teacher substitution engine.',
          status: 'DEMO_SCHEDULED'
        },
        {
          id: 'INQ-84920',
          type: 'DEMO_REQUEST',
          submittedAt: '2026-08-15T11:15:00.000Z',
          formattedDate: '15 Aug 2026, 04:45 PM',
          name: 'Rajesh Reddy',
          designation: 'Trustee / Chairman',
          school: 'Oakridge Educational Trust',
          location: 'Bengaluru, Karnataka',
          board: 'Cambridge / IB',
          strength: '1000+ Multi-Campus',
          email: 'chairman@oakridge-trust.org',
          mobile: '9740056789',
          timeslot: 'Afternoon (02:00 PM - 05:00 PM)',
          category: 'Multi-Campus Enterprise',
          requirements: 'Looking for multi-branch central command portal and biometric attendance machine sync for 3 school campuses.',
          status: 'NEW_LEAD'
        },
        {
          id: 'INQ-84919',
          type: 'GENERAL_INQUIRY',
          submittedAt: '2026-08-14T09:00:00.000Z',
          formattedDate: '14 Aug 2026, 02:30 PM',
          name: 'Priya Sharma',
          designation: 'Academic Coordinator',
          school: 'Geethanjali Global School',
          location: 'Secunderabad, Telangana',
          board: 'State Board',
          strength: 'Below 200',
          email: 'coordinator@geethanjali-global.in',
          mobile: '9667770727',
          timeslot: 'Morning (10:00 AM - 01:00 PM)',
          category: 'Curriculum & Setup',
          requirements: 'Need consultation regarding 48-hour Excel student data migration and timetable setup.',
          status: 'CONTACTED'
        }
      ];
    })(),
    lastSubmissionSuccess: null,
    inquiryFilter: 'all'
  };

  function escapeHTML(value) {
    return String(value == null ? '' : value)
      .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  }
  const compact = (value) => new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(value || 0));
  const decimal = (value) => {
    const num = Number(value || 0);
    const roundedTenth = Math.round(num * 10) / 10;
    return `${roundedTenth.toFixed(2)}%`;
  };
  const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  const initials = (name) => String(name || 'Notebook XL').split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  const fullName = (person) => person && (person.name || `${person.firstName || ''} ${person.lastName || ''}`.trim()) || '—';
  const uid = () => `nxl-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const lower = (value) => String(value || '').toLowerCase();
  const statusTone = (value) => {
    const key = lower(value);
    if (key.includes('complete') || key.includes('present') || key.includes('active') || key.includes('healthy')) return 'success';
    if (key.includes('overdue') || key.includes('absent') || key.includes('late') || key.includes('attention')) return 'danger';
    if (key.includes('progress') || key.includes('pending') || key.includes('leave')) return 'warning';
    return 'info';
  };
  const badge = (value, tone) => `<span class="badge ${tone || statusTone(value)}">${escapeHTML(value)}</span>`;

  function readStoredAuthSession() {
    try {
      const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw);
      if (session?.tenant?.slug === 'meezankids' || session?.tenant?.id === 'tenant-meezan-kids' || session?.tenant?.id === 'tenant-meezankids') {
        session.tenant = {
          id: 'tenant-iams-school',
          slug: 'iams',
          name: 'IAMS (ISRAR AHMED MISSION SCHOOL)',
          schoolName: 'IAMS (ISRAR AHMED MISSION SCHOOL)'
        };
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      }
      return session;
    } catch (_) {
      return null;
    }
  }
  function writeStoredAuthSession(session) {
    try {
      if (!session) window.localStorage.removeItem(AUTH_STORAGE_KEY);
      else window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } catch (_) {
      // Ignore storage failures in demo mode.
    }
  }
  function makeSchoolCode(schoolName) {
    const letters = String(schoolName || 'NXL').toUpperCase().replace(/[^A-Z]/g, '');
    return (letters.slice(0, 3) || 'NXL').padEnd(3, 'X');
  }
  function upsertTenantFromAuth(tenantInfo) {
    if (!tenantInfo || !tenantInfo.id) return null;
    const tenants = seed.tenants || (seed.tenants = []);
    let existing = tenants.find((item) => item.id === tenantInfo.id || item.slug === tenantInfo.slug);
    if (!existing) {
      const template = JSON.parse(JSON.stringify(tenants[0] || {}));
      existing = template;
      tenants.push(existing);
    }
    existing.id = tenantInfo.id;
    existing.slug = tenantInfo.slug;
    existing.code = tenantInfo.code || existing.code || makeSchoolCode(tenantInfo.schoolName);
    existing.name = tenantInfo.schoolName;
    existing.schoolId = existing.schoolId || existing.code;
    existing.subdomain = tenantInfo.slug;
    existing.school = {
      ...(existing.school || {}),
      name: tenantInfo.schoolName,
      subdomain: tenantInfo.slug,
      schoolId: existing.code,
      shortName: tenantInfo.schoolName
    };
    if (!seed.tenantsBySlug) seed.tenantsBySlug = {};
    seed.tenantsBySlug[tenantInfo.slug] = existing;
    return existing;
  }
  function applyAuthenticatedSession(session, toastMessage) {
    const normalized = {
      token: session.token,
      user: session.user,
      tenant: session.tenant
    };
    const tenantRecord = upsertTenantFromAuth(normalized.tenant);
    state.authSession = normalized;
    state.isAuthenticated = true;
    state.authRole = normalized.user.role || 'SCHOOL_ADMIN';
    state.role = normalized.user.role || 'SCHOOL_ADMIN';
    state.authDraft = {
      workspace: normalized.tenant?.slug || state.authDraft?.workspace || 'meezankids',
      userId: normalized.user?.email || state.authDraft?.userId || '',
      password: ''
    };
    state.tenantId = tenantRecord?.id || normalized.tenant?.id || state.tenantId;
    state.view = 'app';
    state.page = 'dashboard';
    state.modal = null;
    state.mobileNav = false;
    state.profile = null;
    state.airaOpen = false;
    writeStoredAuthSession(normalized);
    try { window.history.pushState({}, '', '/'); } catch (e) {}
    render();
    loadRoleDashboardData(true);
    loadCommunityPosts(true);
    if (toastMessage) notify(toastMessage, 'success');
  }
  function toClientAuthSession(payload) {
    if (!payload) return null;
    if (payload.token && payload.user && payload.tenant) return payload;
    if (!payload.access_token || !payload.tenant_id) return null;
    return {
      token: payload.access_token,
      user: {
        id: payload.user_id || payload.userId || 'user',
        name: payload.user_name || payload.userName || 'User',
        email: payload.user_id || payload.userId || '',
        role: payload.role || 'SCHOOL_ADMIN',
        tenantId: payload.tenant_id
      },
      tenant: {
        id: payload.tenant_id,
        slug: payload.tenant_slug,
        schoolName: payload.school_name,
        code: makeSchoolCode(payload.school_name)
      }
    };
  }
  function isValidEmail(value) {
    const val = String(value || '').trim();
    return val.length > 0;
  }
  function isStrongPassword(value) {
    return PASSWORD_PATTERN.test(String(value || '').trim());
  }
  async function postJSON(url, payload) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    let body = {};
    try {
      body = await response.json();
    } catch (_) {
      body = {};
    }
    if (!response.ok) throw new Error(body.message || body.detail || 'Request failed');
    return body;
  }
  async function getJSON(url) {
    const response = await fetch(url, {
      headers: state.authSession?.token ? { Authorization: `Bearer ${state.authSession.token}` } : {}
    });
    let body = {};
    try {
      body = await response.json();
    } catch (_) {
      body = {};
    }
    if (!response.ok) throw new Error(body.message || body.detail || 'Request failed');
    return body;
  }
  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Failed to read attachment file.'));
      reader.readAsDataURL(file);
    });
  }
  async function toCommunityAttachment(file) {
    if (!(file instanceof File) || !file.size) return null;
    const rawType = String(file.type || '').toLowerCase();
    const kind = rawType.startsWith('image/') ? 'image' : rawType.startsWith('video/') ? 'video' : 'file';
    const src = await readFileAsDataURL(file);
    return {
      id: uid(),
      name: file.name || 'attachment',
      type: rawType,
      kind,
      size: file.size,
      src
    };
  }
  async function loadRoleDashboardData(force = false) {
    if (!state.isAuthenticated) return;
    const role = state.role || state.authRole;
    const key = role === 'SCHOOL_ADMIN' ? 'management' : role === 'TEACHER' ? 'teacher' : 'student';
    if (!force && state.remoteDashboards[key]) return;

    const workspaceSlug = state.authSession?.tenant?.slug || tenant()?.slug;
    const endpoint = key === 'management'
      ? `${AUTH_API_BASE}/api/v1/dashboards/management/${encodeURIComponent(workspaceSlug || '')}`
      : `${AUTH_API_BASE}/api/v1/dashboards/${key}`;

    state.remoteDashboards.loading = true;
    state.remoteDashboards.error = '';
    try {
      const payload = await getJSON(endpoint);
      state.remoteDashboards[key] = payload;
      state.remoteDashboards.loading = false;
      render();
    } catch (error) {
      state.remoteDashboards.loading = false;
      state.remoteDashboards.error = '';
      render();
    }
  }

  if (storedAuthSession?.tenant) {
    upsertTenantFromAuth(storedAuthSession.tenant);
    loadRoleDashboardData();
    loadCommunityPosts();
  }

  function tenant() {
    return (seed.tenants || []).find((item) => item.id === state.tenantId) || (seed.tenants || [])[0];
  }
  function getArray(object, key) { return Array.isArray(object && object[key]) ? object[key] : []; }
  function studentGrade(student) { return String(student?.grade || student?.gradeName || student?.class || '8').replace(/^Grade\s*/i, ''); }
  function displayGrade(student) { return `Grade ${studentGrade(student)}${student?.section || ''}`; }
  function studentAttendance(student) { return Number(student?.attendanceRate ?? student?.attendance ?? 92.4); }
  function studentAverage(student) { return Number(student?.academicAverage ?? student?.average ?? 78.4); }
  function teacherAttendance(teacher) { return Number(teacher?.attendanceRate ?? teacher?.attendance ?? 95.2); }
  function teacherWorkload(teacher) { return teacher.workload || { classes: getArray(teacher, 'assignments').length || 4, subjects: 2, students: 148, weeklyPeriods: 24, lessonPlanCompletion: 91, pendingReviews: 7 }; }
  function subjects() { return getArray(tenant(), 'subjects'); }
  function students() { return getArray(tenant(), 'students'); }
  function teachers() { return getArray(tenant(), 'teachers'); }
  function assignments() { return getArray(tenant(), 'assignments'); }
  function assessments() { return getArray(tenant(), 'assessments'); }
  function tasks() { return getArray(tenant(), 'tasks'); }
  function timetable() { return getArray(tenant(), 'timetable'); }
  function nowTimeLabel() {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  function audienceLabel(audience) {
    if (audience === 'TEACHERS') return 'Teachers';
    if (audience === 'STUDENTS') return 'Students';
    return 'Everyone';
  }
  function roleCanViewAudience(role, audience) {
    if (audience === 'ALL') return true;
    if (audience === 'TEACHERS') return role === 'TEACHER' || role === 'SCHOOL_ADMIN';
    if (audience === 'STUDENTS') return role === 'STUDENT' || role === 'SCHOOL_ADMIN';
    return false;
  }
  function communityWorkspaceSlug() {
    return state.authSession?.tenant?.slug || tenant()?.slug || 'meezankids';
  }
  function tenantCommunityStore() {
    const key = state.tenantId || 'default';
    if (!state.communityByTenant[key]) {
      state.communityByTenant[key] = {
        posts: [
          {
            id: `community-${key}-1`,
            authorRole: 'SCHOOL_ADMIN',
            authorName: 'Farah Ahmed',
            authorTitle: 'Principal & Head of Institution',
            authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
            audience: 'ALL',
            category: 'Events',
            headline: '🏆 Annual Science & AI Innovation Expo 2026 Announced!',
            message: `Thrilled to announce our Annual Science & AI Innovation Expo! Over 40+ working AI, Robotics, and Clean Tech projects will be demonstrated live this Friday at the Main Campus Auditorium. 🌟\n\nDon’t miss the autonomous drone obstacle avoidance demo by our Grade 8 & 9 Robotics Club!\n\n#ScienceFair #AIInEducation #StudentInnovators #CBSEExcellence #SchoolPulse`,
            createdAt: '2 hours ago',
            media: {
              kind: 'video',
              src: 'https://assets.mixkit.co/videos/preview/mixkit-students-working-on-a-science-project-41710-large.mp4',
              poster: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
              title: 'Robotics Team Live Demonstration Preview',
              duration: '1:45 min'
            },
            reactions: { like: 28, love: 19, celebrate: 14, insightful: 8, support: 5, awesome: 11 },
            userReaction: 'like',
            repostsCount: 7,
            comments: [
              {
                id: `c-${key}-101`,
                authorName: 'Dr. Arjun Rao',
                authorRole: 'TEACHER',
                authorTitle: 'Senior Physics & Robotics Mentor',
                authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80',
                createdAt: '1 hour ago',
                text: 'The students have put in incredible work after school hours calibrating their micro-controllers. Looking forward to the live demonstration!',
                likes: 8,
                userLiked: true,
                replies: [
                  {
                    id: `r-${key}-101-1`,
                    authorName: 'Ahmed Khan',
                    authorRole: 'STUDENT',
                    authorTitle: 'Grade 8A • Robotics Lead',
                    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80',
                    createdAt: '45 mins ago',
                    text: '@Dr. Arjun Rao Thank you sir! The ultrasonic sensor obstacle avoidance code is working with 99.4% accuracy now! 🚀',
                    likes: 5,
                    userLiked: false
                  },
                  {
                    id: `r-${key}-101-2`,
                    authorName: 'Farah Ahmed',
                    authorRole: 'SCHOOL_ADMIN',
                    authorTitle: 'Principal',
                    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100&q=80',
                    createdAt: '30 mins ago',
                    text: 'Proud of our young engineers. We have set up a special exhibition booth for your team at the central atrium.',
                    likes: 6,
                    userLiked: true
                  }
                ]
              },
              {
                id: `c-${key}-102`,
                authorName: 'Priya Sharma',
                authorRole: 'TEACHER',
                authorTitle: 'Class 8A Class Teacher',
                authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100&q=80',
                createdAt: '50 mins ago',
                text: 'Class 8A has also prepared an interactive Solar System Model with augmented reality cards. All parents are welcome!',
                likes: 4,
                userLiked: false,
                replies: []
              }
            ]
          },
          {
            id: `community-${key}-2`,
            authorRole: 'SCHOOL_ADMIN',
            authorName: 'Academic Directorate',
            authorTitle: 'CBSE Examination Wing • Meezan Kids',
            authorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&h=120&q=80',
            audience: 'ALL',
            category: 'Circulars',
            headline: '📋 Official Notification: Half-Yearly & Practical Exam Schedule 2026',
            message: `The official schedule and room allocation guidelines for the upcoming Half-Yearly Assessments and Class 10/12 Science Practicals have been published.\n\nAll subject teachers must submit internal assessment scores via NotebookXL by 24th August.\n\nPlease download and review the attached official circular PDF.\n\n#CBSECircular #Exams2026 #AcademicOperations #AssessmentReadiness`,
            createdAt: '4 hours ago',
            media: {
              kind: 'circular',
              title: 'Circular_CBSE_Practicals_Schedule_2026_Term1.pdf',
              size: '2.4 MB',
              pages: '4 Pages • Signed by Controller of Examinations'
            },
            reactions: { like: 42, love: 5, celebrate: 8, insightful: 21, support: 12, awesome: 4 },
            userReaction: null,
            repostsCount: 15,
            comments: [
              {
                id: `c-${key}-201`,
                authorName: 'Ayesha Khan',
                authorRole: 'TEACHER',
                authorTitle: 'Chemistry Faculty',
                authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80',
                createdAt: '3 hours ago',
                text: 'Noted. The practical lab slots for Chemistry have been verified and locked on the timetable engine.',
                likes: 7,
                userLiked: false,
                replies: []
              }
            ]
          },
          {
            id: `community-${key}-3`,
            authorRole: 'SCHOOL_ADMIN',
            authorName: 'Meezan Kids Management',
            authorTitle: 'School Operations & HR',
            authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
            audience: 'ALL',
            category: 'Achievements',
            headline: '🌟 Celebrating Educator Excellence at Meezan Kids School',
            message: `Congratulations to Ms. Priya Sharma and Mr. Arjun Rao for being awarded the "National STEM Educator Citation" for exemplary curriculum delivery and student engagement! 💐✨\n\nThank you for inspiring our students every single day.\n\n#TeacherAppreciation #FacultyExcellence #InspiringEducators #SchoolCommunity`,
            createdAt: 'Yesterday',
            media: {
              kind: 'image',
              src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
              caption: 'Staff Felicitation Ceremony at Central Quadrangle'
            },
            reactions: { like: 65, love: 48, celebrate: 32, insightful: 12, support: 9, awesome: 22 },
            userReaction: 'love',
            repostsCount: 11,
            comments: [
              {
                id: `c-${key}-301`,
                authorName: 'Ahmed Khan',
                authorRole: 'STUDENT',
                authorTitle: 'Student Council President',
                authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80',
                createdAt: 'Yesterday',
                text: 'Hearty congratulations Priya Ma’am and Arjun Sir! Best teachers ever! 🎉',
                likes: 14,
                userLiked: true,
                replies: [
                  {
                    id: `r-${key}-301-1`,
                    authorName: 'Priya Sharma',
                    authorRole: 'TEACHER',
                    authorTitle: 'Class 8A Class Teacher',
                    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100&q=80',
                    createdAt: 'Yesterday',
                    text: 'Thank you Ahmed! Your enthusiasm in class makes teaching so rewarding! 😊',
                    likes: 6,
                    userLiked: false
                  }
                ]
              }
            ]
          }
        ],
        loaded: true,
        loading: false
      };
    }
    return state.communityByTenant[key];
  }
  async function loadCommunityPosts(force = false) {
    const store = tenantCommunityStore();
    if (store.loading) return;
    if (store.loaded && !force) return;
    const workspace = communityWorkspaceSlug();
    if (!workspace) return;
    store.loading = true;
    try {
      const payload = await getJSON(`${AUTH_API_BASE}/api/v1/community/posts?workspace=${encodeURIComponent(workspace)}&role=${encodeURIComponent(state.role || 'STUDENT')}`);
      if (payload && Array.isArray(payload.posts) && payload.posts.length) {
        store.posts = payload.posts;
      }
      store.loaded = true;
      store.loading = false;
      render();
    } catch (error) {
      store.loading = false;
    }
  }
  function tenantCampusPoll() {
    const key = state.tenantId || 'default';
    if (!state.campusPollByTenant) state.campusPollByTenant = {};
    if (!state.campusPollByTenant[key]) {
      state.campusPollByTenant[key] = {
        id: `poll-${key}-1`,
        question: '📊 Campus Choice: Which STEM Workshop should we host next month?',
        totalVotes: 142,
        options: [
          { id: 'opt-1', label: '🤖 AI & Autonomous Drone Robotics', votes: 78 },
          { id: 'opt-2', label: '🌱 Clean Energy, Solar & Eco-Sensors', votes: 42 },
          { id: 'opt-3', label: '🚀 Space Exploration & Astronomy Lab', votes: 22 }
        ],
        userVotedOptionId: null
      };
    }
    return state.campusPollByTenant[key];
  }

  function tenantCampusSpotlights() {
    const list = students();
    const currentSchoolName = tenant()?.school?.name || tenant()?.name || 'Meezan Kids School';

    // Sort students strictly by academicAverage descending to find Real Toppers for THIS specific school
    const sortedByMarks = [...list].sort((a, b) => Number(b.academicAverage || 0) - Number(a.academicAverage || 0));
    const sortedByAttendance = [...list].sort((a, b) => Number(b.attendanceRate || 0) - Number(a.attendanceRate || 0));

    const top1 = sortedByMarks[0] || { name: 'Ahmed Khan', grade: '8', section: 'A', academicAverage: 98.4, id: 's-1' };
    const top2 = sortedByMarks[1] || { name: 'Sara Fatima', grade: '9', section: 'B', academicAverage: 97.2, id: 's-2' };
    const top3 = sortedByAttendance[0] || { name: 'Zaid Ali', grade: '7', section: 'A', attendanceRate: 100, academicAverage: 94.5, id: 's-3' };
    const top4 = sortedByMarks[2] || { name: 'Mariam Siddiqui', grade: '8', section: 'A', academicAverage: 96.8, id: 's-4' };
    const top5 = sortedByMarks[3] || { name: 'Rohan Varma', grade: '9', section: 'A', academicAverage: 95.5, id: 's-5' };

    const avatars = [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=140&h=140&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=140&h=140&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=140&h=140&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=140&h=140&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=140&h=140&q=80'
    ];

    return [
      {
        id: top1.id,
        name: fullName(top1),
        badge: '🏆 Academic Topper (Rank 1)',
        class: `Class ${top1.grade}${top1.section ? '-' + top1.section : ''}`,
        school: currentSchoolName,
        score: `${Number(top1.academicAverage || 98.4).toFixed(1)}% GPA`,
        achievement: 'Highest GPA across all term assessments in the school.',
        avatar: top1.avatarUrl || avatars[0],
        tag: '🌟 Overall School Topper'
      },
      {
        id: top2.id,
        name: fullName(top2),
        badge: '🥈 Rank 2 Scholar & Science Lead',
        class: `Class ${top2.grade}${top2.section ? '-' + top2.section : ''}`,
        school: currentSchoolName,
        score: `${Number(top2.academicAverage || 97.2).toFixed(1)}% Score`,
        achievement: 'Selected for National Science Olympiad finals.',
        avatar: top2.avatarUrl || avatars[1],
        tag: '🔬 Olympiad Finalist'
      },
      {
        id: top3.id,
        name: fullName(top3),
        badge: '💯 100% Attendance Star',
        class: `Class ${top3.grade}${top3.section ? '-' + top3.section : ''}`,
        school: currentSchoolName,
        score: `${top3.attendanceRate || 100}% Attendance`,
        achievement: 'Flawless zero-absence record for the entire academic session.',
        avatar: top3.avatarUrl || avatars[2],
        tag: '🌟 Punctuality Champion'
      },
      {
        id: top4.id,
        name: fullName(top4),
        badge: '📐 Mathematics Distinction',
        class: `Class ${top4.grade}${top4.section ? '-' + top4.section : ''}`,
        school: currentSchoolName,
        score: `${Number(top4.academicAverage || 96.8).toFixed(1)}% Score`,
        achievement: 'Perfect centum scores across weekly math Olympiad drills.',
        avatar: top4.avatarUrl || avatars[3],
        tag: '📐 Math Prodigy'
      },
      {
        id: top5.id,
        name: fullName(top5),
        badge: '🤖 Robotics & AI Innovator',
        class: `Class ${top5.grade}${top5.section ? '-' + top5.section : ''}`,
        school: currentSchoolName,
        score: 'Science Expo 1st Prize',
        achievement: 'Designed autonomous ultrasonic obstacle detection software.',
        avatar: top5.avatarUrl || avatars[4],
        tag: '🚀 AI & Robotics Lead'
      }
    ];
  }

  function visibleCommunityPosts() {
    const role = state.role || 'SCHOOL_ADMIN';
    const filter = state.communityPostFilter || 'ALL';
    const query = (state.communitySearchQuery || '').trim().toLowerCase();
    return tenantCommunityStore().posts
      .filter((post) => {
        if (!roleCanViewAudience(role, post.audience || 'ALL')) return false;
        if (filter === 'CIRCULARS' && post.category !== 'Circulars' && post.media?.kind !== 'circular') return false;
        if (filter === 'EVENTS' && post.category !== 'Events' && post.media?.kind !== 'video') return false;
        if (filter === 'ACADEMIC' && post.category !== 'Academic' && post.category !== 'Timetable') return false;
        if (filter === 'ACHIEVEMENTS' && post.category !== 'Achievements' && post.media?.kind !== 'image') return false;
        if (query) {
          const matchMsg = (post.message || '').toLowerCase().includes(query);
          const matchHead = (post.headline || '').toLowerCase().includes(query);
          const matchAuthor = (post.authorName || '').toLowerCase().includes(query);
          const matchMedia = (post.media?.title || '').toLowerCase().includes(query);
          if (!matchMsg && !matchHead && !matchAuthor && !matchMedia) return false;
        }
        return true;
      });
  }
  function communityNotificationItems(limit = 3) {
    return visibleCommunityPosts().slice(0, limit).map((post) => ({
      tone: 'info',
      title: 'Community update',
      text: post.message,
      time: post.createdAt,
      page: 'announcements'
    }));
  }
  function subjectName(subjectId) {
    const found = subjects().find((subject) => subject.id === subjectId || subject.code === subjectId || subject.name === subjectId);
    return found ? found.name : String(subjectId || 'Mathematics');
  }
  function currentTeacher() { return teachers()[0] || { id: 'teacher-01', name: 'Priya Sharma', employeeId: 'MKS-T-001', department: 'Mathematics', assignments: [] }; }
  function currentStudent() { return students()[420] || students()[0] || { id: 'student-01', name: 'Ahmed Khan', studentId: 'NXL-MKS-000421', grade: '8', section: 'A', rollNumber: 17, attendanceRate: 94.2, academicAverage: 82.4, subjects: ['Mathematics', 'Science', 'English'] }; }
  function currentUser() {
    if (state.role === 'TEACHER') return currentTeacher();
    if (state.role === 'STUDENT') return currentStudent();
    return { id: 'admin-01', name: 'Farah Ahmed', firstName: 'Farah', role: state.role, employeeId: 'MKS-A-001' };
  }
  function countStudentsFor(grade, section) {
    return students().filter((student) => (!grade || studentGrade(student) === String(grade).replace(/^Grade\s*/i, '')) && (!section || student.section === section)).length;
  }
  function dashboardMetrics() {
    const allStudents = students();
    const allTeachers = teachers();
    const mean = (list, getter, fallback) => list.length ? list.reduce((sum, item) => sum + Number(getter(item) || 0), 0) / list.length : fallback;
    const completion = assignments().length ? mean(assignments(), (assignment) => assignment.completionRate ?? assignment.completedPercent ?? 88, 91.8) : 91.8;
    return {
      students: allStudents.length || 1000,
      teachers: allTeachers.length || 20,
      classes: Math.max(40, new Set(allStudents.map((student) => `${studentGrade(student)}${student.section || ''}`)).size || 40),
      attendance: mean(allStudents, studentAttendance, 93.8),
      teacherAttendance: mean(allTeachers, teacherAttendance, 96.1),
      academic: mean(allStudents, studentAverage, 78.4),
      completion
    };
  }
  function activeAcademicYear() {
    const years = getArray(tenant(), 'academicYears');
    const current = years.find((year) => year.isCurrent || String(year.status).toLowerCase() === 'active');
    return current?.name || tenant()?.academicYear || '2026–27';
  }
  function managementOpsSummary() {
    const totalStudents = students().length || 1000;
    const totalTeachers = teachers().length || 20;
    const studentAttendancePct = dashboardMetrics().attendance;
    const studentPresent = Math.round((studentAttendancePct / 100) * totalStudents);
    const studentLate = Math.max(6, Math.round(totalStudents * 0.012));
    const studentLeave = Math.max(4, Math.round(totalStudents * 0.006));
    const studentAbsent = Math.max(0, totalStudents - studentPresent - studentLate - studentLeave);
    const teacherPresent = teachers().filter((teacher) => teacherAttendance(teacher) >= 95).length || Math.max(1, totalTeachers - 2);
    const teacherLate = Math.max(0, Math.round(totalTeachers * 0.05));
    const teacherLeave = Math.max(0, Math.round(totalTeachers * 0.05));
    const teacherAbsent = Math.max(0, totalTeachers - teacherPresent - teacherLate - teacherLeave);
    const totalPeriods = Math.max(110, timetable().length || 140);
    const runningPeriods = 8;
    const completedPeriods = Math.round(totalPeriods * 0.45);
    const cancelledPeriods = 3;
    const substituteRequired = Math.max(1, teacherAbsent - 1);
    const upcomingPeriods = Math.max(0, totalPeriods - runningPeriods - completedPeriods - cancelledPeriods);
    const pendingMarks = Math.max(3, assessments().filter((item) => !lower(item.status).includes('published')).length);
    const activeAssignments = assignments().filter((item) => !lower(item.status).includes('complete')).length || 8;
    const overdueTasks = tasks().filter((task) => lower(task.status).includes('overdue')).length || 7;
    return {
      students: {
        total: totalStudents,
        newThisYear: Math.max(24, Math.round(totalStudents * 0.04)),
        attendanceToday: Number(studentAttendancePct.toFixed(1)),
        present: studentPresent,
        absent: studentAbsent,
        late: studentLate,
        leave: studentLeave
      },
      teachers: {
        total: totalTeachers,
        present: teacherPresent,
        absent: teacherAbsent,
        late: teacherLate,
        leave: teacherLeave,
        attendanceToday: Number(((teacherPresent / Math.max(1, totalTeachers)) * 100).toFixed(1))
      },
      classes: {
        scheduled: totalPeriods,
        completed: completedPeriods,
        running: runningPeriods,
        upcoming: upcomingPeriods,
        cancelled: cancelledPeriods,
        substituteRequired
      },
      pendingMarks,
      activeAssignments,
      overdueTasks
    };
  }
  function classAttendanceRows() {
    return Array.from({ length: 10 }, (_, index) => {
      const grade = String(index + 1);
      const gradeStudents = students().filter((student) => studentGrade(student) === grade);
      const avgAttendance = gradeStudents.length ? gradeStudents.reduce((sum, student) => sum + studentAttendance(student), 0) / gradeStudents.length : 92 - index * 0.4;
      const avgAcademic = gradeStudents.length ? gradeStudents.reduce((sum, student) => sum + studentAverage(student), 0) / gradeStudents.length : 74 + index * 0.6;
      return { grade, attendance: Number(avgAttendance.toFixed(1)), academic: Number(avgAcademic.toFixed(1)), students: gradeStudents.length || 95 + index * 2 };
    });
  }
  function lowAttendanceStudents(threshold = 75) {
    return [...students()]
      .map((student) => ({
        ...student,
        attendance: studentAttendance(student),
        consecutiveAbsence: studentAttendance(student) < threshold ? Math.min(5, Math.max(2, Math.round((threshold - studentAttendance(student)) / 4))) : 0,
        lastAttendanceDate: studentAttendance(student) < threshold ? '11 Aug 2026' : '13 Aug 2026'
      }))
      .filter((student) => student.attendance < threshold)
      .sort((a, b) => a.attendance - b.attendance)
      .slice(0, 8);
  }
  function subjectHealthRows() {
    return subjects().slice(0, 8).map((subject, index) => {
      const base = 64 + (index % 5) * 4;
      return {
        subject: subject.name,
        avg: Math.min(91, base + 2),
        passRate: Math.min(98, base + 18),
        change: [-5.1, -2.4, 1.8, 3.2, -0.7, 2.1, -3.4, 1.2][index % 8],
        teachersCount: Math.max(1, teachers().filter((teacher) => teacherAssignments(teacher).some((entry) => entry.subject === subject.name)).length),
        coverage: `${Math.max(2, Math.min(10, (subject.gradeLevels || subject.grades || []).length))} grades`
      };
    });
  }
  function attentionSignals() {
    const lowAttendance = lowAttendanceStudents(75);
    const ops = managementOpsSummary();
    return [
      {
        id: 'att-low-75',
        severity: 'high',
        category: 'Student Attendance',
        title: `${lowAttendance.length || 18} students below attendance threshold`,
        description: `Attendance is below 75% for ${lowAttendance.length || 18} active students this academic year.`,
        affected: 'Student group',
        count: lowAttendance.length || 18,
        time: '10:30 AM',
        actionLabel: 'View Students',
        actionPage: 'students'
      },
      {
        id: 'att-pending-6c',
        severity: 'critical',
        category: 'Attendance',
        title: 'Attendance pending for Class 6C',
        description: 'Class attendance has not been submitted before the school cutoff.',
        affected: 'Class 6C',
        count: 1,
        time: '09:55 AM',
        actionLabel: 'View Attendance',
        actionPage: 'attendance'
      },
      {
        id: 'teacher-substitute',
        severity: 'medium',
        category: 'Timetable',
        title: `${ops.classes.substituteRequired} substitute class${ops.classes.substituteRequired > 1 ? 'es' : ''} required`,
        description: `${ops.teachers.absent} teachers are absent and have scheduled periods today.`,
        affected: 'Teacher schedule',
        count: ops.classes.substituteRequired,
        time: '08:50 AM',
        actionLabel: 'Open Timetable',
        actionPage: 'timetable'
      },
      {
        id: 'marks-pending',
        severity: 'high',
        category: 'Marks',
        title: `${ops.pendingMarks} subjects have pending marks submission`,
        description: 'Marks deadlines are due today for selected class-subject combinations.',
        affected: 'Exam evaluation',
        count: ops.pendingMarks,
        time: '08:40 AM',
        actionLabel: 'View Pending Marks',
        actionPage: 'assessments'
      },
      {
        id: 'tasks-overdue',
        severity: 'medium',
        category: 'Tasks',
        title: `${ops.overdueTasks} teacher tasks are overdue`,
        description: 'Follow-up is required on overdue academic operations tasks.',
        affected: 'Teacher tasks',
        count: ops.overdueTasks,
        time: '08:10 AM',
        actionLabel: 'View Tasks',
        actionPage: 'tasks'
      }
    ];
  }
  function recentSchoolActivity() {
    return [
      { time: '10:45 AM', category: 'Attendance', text: 'Ayesha Fatima submitted Class 8B attendance.' },
      { time: '10:32 AM', category: 'Marks', text: 'Rahman Khan submitted Class 9A Physics marks.' },
      { time: '09:55 AM', category: 'Exams', text: 'Half-Yearly Examination schedule was updated.' },
      { time: '09:31 AM', category: 'Students', text: 'Ahmed Khan enrolled into Class 6A.' },
      { time: '09:12 AM', category: 'Timetable', text: 'Class 7B timetable updated with substitute period.' }
    ];
  }
  function attendanceBreakdown(records) {
    const total = records.length || 42;
    const yearRate = records.length ? records.reduce((sum, item) => sum + studentAttendance(item), 0) / records.length : 93.8;
    const monthRate = Math.max(78, Math.min(99, yearRate - 0.8));
    const dayRate = Math.max(80, Math.min(99, yearRate + 1.2));
    const presentToday = Math.round((dayRate / 100) * total);
    const lateToday = Math.max(1, Math.round(total * 0.03));
    const absentToday = Math.max(0, total - presentToday - lateToday);
    const schoolDaysMonth = 26;
    const presentMonth = Math.round((monthRate / 100) * schoolDaysMonth);
    const absentMonth = Math.max(0, schoolDaysMonth - presentMonth);
    const schoolDaysYear = 181;
    const presentYear = Math.round((yearRate / 100) * schoolDaysYear);
    const absentYear = Math.max(0, schoolDaysYear - presentYear);
    return {
      day: { rate: dayRate, present: presentToday, absent: absentToday, late: lateToday },
      month: { rate: monthRate, present: presentMonth, absent: absentMonth, totalDays: schoolDaysMonth },
      year: { rate: yearRate, present: presentYear, absent: absentYear, totalDays: schoolDaysYear }
    };
  }
  function getSchoolTimingConfig() {
    if (!state.schoolTimingByTenant) {
      state.schoolTimingByTenant = {};
    }
    const key = state.tenantId || 'default';
    if (!state.schoolTimingByTenant[key]) {
      state.schoolTimingByTenant[key] = {
        startTime: '08:30',
        endTime: '15:30',
        label: 'Regular School Day'
      };
    }
    return state.schoolTimingByTenant[key];
  }
  function toMinutes(value) {
    const [hours, minutes] = String(value || '00:00').split(':').map((part) => Number(part || 0));
    return (hours * 60) + minutes;
  }
  function formatCountdown(totalSeconds) {
    const safe = Math.max(0, Math.floor(totalSeconds));
    const hours = Math.floor(safe / 3600);
    const minutes = Math.floor((safe % 3600) / 60);
    const seconds = safe % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  function schoolTimingCountdown() {
    const config = getSchoolTimingConfig();
    const now = new Date();
    const currentMinutes = (now.getHours() * 60) + now.getMinutes();
    const startMinutes = toMinutes(config.startTime);
    const endMinutes = toMinutes(config.endTime);
    const schoolDuration = Math.max(1, endMinutes - startMinutes);

    if (currentMinutes < startMinutes) {
      const secondsLeft = (startMinutes - currentMinutes) * 60 - now.getSeconds();
      return {
        mode: 'before-school',
        title: 'School starts in',
        value: formatCountdown(secondsLeft),
        note: `${config.label} · Starts at ${config.startTime}`,
        progress: 0
      };
    }

    if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
      const secondsLeft = (endMinutes - currentMinutes) * 60 - now.getSeconds();
      const elapsed = currentMinutes - startMinutes;
      return {
        mode: 'in-session',
        title: 'School closes in',
        value: formatCountdown(secondsLeft),
        note: `${config.label} · Ends at ${config.endTime}`,
        progress: Math.min(100, Math.round((elapsed / schoolDuration) * 100))
      };
    }

    const tomorrowStartSeconds = ((24 * 60) - currentMinutes + startMinutes) * 60 - now.getSeconds();
    return {
      mode: 'after-school',
      title: 'Next school start in',
      value: formatCountdown(tomorrowStartSeconds),
      note: `${config.label} · Next start ${config.startTime}`,
      progress: 100
    };
  }
  function calendarMonthsForYear(year) {
    return sharedCalendarMonthsForYear(year);
  }
  function renderAcademicYearCalendarCard(title = 'Academic Calendar', subtitle = 'Year-wise school calendar') {
    const months = calendarMonthsForYear(state.calendarYear);
    const upcoming = [
      `Reopening & Orientation · 10 Jun ${state.calendarYear}`,
      `Unit Assessments Window · 18 Aug ${state.calendarYear}`,
      `Half-Yearly Schedule Draft · 22 Sep ${state.calendarYear}`,
      `Term Review and Reports · 12 Dec ${state.calendarYear}`
    ];
    return renderAcademicYearCalendarCardView({
      title,
      subtitle,
      year: state.calendarYear,
      months,
      upcoming,
      escapeHTML
    });
  }
  function renderSchoolTimingCountdownCard() {
    const countdown = schoolTimingCountdown();
    return renderSchoolTimingCountdownCardView({ countdown, config: getSchoolTimingConfig(), escapeHTML });
  }
  function parseTimetableDate() {
    const raw = state.timetableDate || new Date().toISOString().slice(0, 10);
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) return new Date();
    return parsed;
  }
  function setTimetableDate(nextDate) {
    state.timetableDate = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;
  }
  function shiftTimetableDate(direction) {
    const base = parseTimetableDate();
    if (direction === 'today') {
      setTimetableDate(new Date());
      return;
    }
    const step = direction === 'prev' ? -1 : 1;
    if (state.timetableView === 'day') base.setDate(base.getDate() + step);
    else if (state.timetableView === 'year') base.setFullYear(base.getFullYear() + step);
    else base.setMonth(base.getMonth() + step);
    setTimetableDate(base);
  }

  const icons = {
    dashboard: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    people: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3.5 20c.6-3.5 2.5-5.2 5.5-5.2s4.9 1.7 5.5 5.2M16 5.5c2.5.3 3.8 1.6 3.8 3.8 0 1.2-.4 2.2-1.2 2.9M16 14.8c2.6.2 4.1 1.9 4.5 5.2"/></svg>',
    book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H7.5A3.5 3.5 0 0 0 4 22z"/><path d="M4 5.5v13"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
    chart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
    settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.1 2.1-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.55v.1h-3v-.1A1.7 1.7 0 0 0 10.7 18.6a1.7 1.7 0 0 0-1.88.34l-.06.06-2.1-2.1.06-.06A1.7 1.7 0 0 0 7.06 15a1.7 1.7 0 0 0-1.55-1.03h-.1v-3h.1A1.7 1.7 0 0 0 7.06 9.94 1.7 1.7 0 0 0 6.72 8.06L6.66 8 8.76 5.9l.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.55v-.1h3v.1a1.7 1.7 0 0 0 1.03 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06L19.8 8l-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.55 1.03h.1v3h-.1A1.7 1.7 0 0 0 19.4 15z"/></svg>',
    task: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/></svg>',
    bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5zM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z"/></svg>',
    bot: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="8.5" cy="15.5" r="1.5"/><circle cx="15.5" cy="15.5" r="1.5"/><path d="M12 2v4M8 6h8M2 14h1M21 14h1"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    filter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16l-6 7v5l-4 2v-7z"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 10 4 4 4-4"/></svg>'
  };
  const icon = (name) => icons[name] || icons.dashboard;

  function button(label, action, variant = 'secondary', extra = '') {
    return `<button class="btn btn-${variant}" data-action="${action}" ${extra}>${label}</button>`;
  }
  function avatar(person, size = '') {
    const photoUrl = person?.avatar || person?.avatarUrl || person?.photo || person?.image || person?.profileImage || (state.customAvatars && person?.id && state.customAvatars[person.id]);
    if (photoUrl && typeof photoUrl === 'string' && photoUrl.trim()) {
      return `<span class="avatar ${size} avatar-has-img" aria-label="${escapeHTML(fullName(person))}"><img src="${escapeHTML(photoUrl.trim())}" alt="${escapeHTML(fullName(person))}" class="avatar-photo-img" style="width:100%; height:100%; object-fit:cover; border-radius:inherit; display:block;" onerror="this.style.display='none'; this.parentElement.classList.remove('avatar-has-img');" /></span>`;
    }
    return `<span class="avatar ${size}" aria-label="${escapeHTML(fullName(person))}">${escapeHTML(initials(fullName(person)))}</span>`;
  }
  function metric(label, value, note, tone = 'navy', iconName = 'chart') {
    return `<article class="metric-card tone-${tone}"><div class="metric-top"><span class="metric-icon">${icon(iconName)}</span><span class="metric-label">${escapeHTML(label)}</span></div><strong>${value}</strong><p>${note || ''}</p></article>`;
  }
  function sectionHead(eyebrow, title, description, action) {
    return `<div class="page-heading"><div><p class="eyebrow">${escapeHTML(eyebrow || '')}</p><h1>${escapeHTML(title)}</h1>${description ? `<p>${escapeHTML(description)}</p>` : ''}</div>${action || ''}</div>`;
  }
  function dashboardSyncPill() {
    if (state.remoteDashboards.loading) {
      return '<span class="dashboard-sync-pill info">Syncing live data…</span>';
    }
    if (state.remoteDashboards.error) {
      return '<span class="dashboard-sync-pill warning">Using local snapshot</span>';
    }
    return '<span class="dashboard-sync-pill success">Live data connected</span>';
  }
  function chart(label, values, color = '#2563eb') {
    const cleanNum = (n) => (Math.round(Number(n || 0) * 10) / 10).toFixed(2);
    const max = Math.max(...values, 100);
    const min = Math.min(...values, 60);
    const range = Math.max(1, max - min + 15);
    const rawLatest = values[values.length - 1];
    const rawPrev = values[values.length - 2] || rawLatest;
    const latestValFormatted = cleanNum(rawLatest);
    const diffNum = Number((rawLatest - rawPrev).toFixed(1));
    const isPositive = diffNum >= 0;

    // Build SVG path with smooth cubic bezier curves
    const pts = values.map((val, idx) => {
      const x = 12 + idx * (236 / Math.max(1, values.length - 1));
      const y = 110 - (((val - min + 5) / range) * 85);
      return { x, y, val };
    });

    let pathD = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const ctrlX = (curr.x + next.x) / 2;
      pathD += ` C ${ctrlX} ${curr.y}, ${ctrlX} ${next.y}, ${next.x} ${next.y}`;
    }

    const areaD = `${pathD} L ${pts[pts.length - 1].x} 118 L ${pts[0].x} 118 Z`;
    const chartId = label.replace(/\W/g, '');

    return `
      <article class="card chart-card" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:1.25rem; box-shadow:0 8px 24px rgba(15,23,42,0.06); transition:transform 0.2s ease;">
        <div class="card-heading" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <h3 style="margin:0; font-size:1.05rem; color:#0f172a; font-weight:800;">${escapeHTML(label)}</h3>
              <span style="background:${isPositive ? '#dcfce7' : '#fee2e2'}; color:${isPositive ? '#15803d' : '#b91c1c'}; padding:0.15rem 0.55rem; border-radius:12px; font-size:0.72rem; font-weight:800;">
                ${isPositive ? '▲ +' : '▼ '}${Math.abs(diffNum)}%
              </span>
            </div>
            <p style="margin:0.2rem 0 0 0; color:#64748b; font-size:0.78rem;">7-Day Rolling Trend • High Precision</p>
          </div>
          <div style="text-align:right;">
            <span style="font-size:1.35rem; font-weight:900; color:#0f172a; display:block;">${latestValFormatted}%</span>
            <small style="color:#64748b; font-size:0.7rem; font-weight:600;">CURRENT AVG</small>
          </div>
        </div>

        <div style="position:relative; width:100%;">
          <svg class="line-chart" viewBox="0 0 260 128" style="width:100%; height:auto; overflow:visible;" role="img" aria-label="${escapeHTML(label)} chart">
            <defs>
              <linearGradient id="grad-${chartId}" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="${color}" stop-opacity="0.38"/>
                <stop offset="70%" stop-color="${color}" stop-opacity="0.05"/>
                <stop offset="100%" stop-color="${color}" stop-opacity="0.0"/>
              </linearGradient>
              <filter id="glow-${chartId}" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="${color}" flood-opacity="0.4"/>
              </filter>
            </defs>

            <!-- Background Grid Lines -->
            <line x1="12" y1="25" x2="248" y2="25" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4 4"/>
            <line x1="12" y1="65" x2="248" y2="65" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4 4"/>
            <line x1="12" y1="105" x2="248" y2="105" stroke="#e2e8f0" stroke-width="1"/>

            <!-- Smooth Curved Area Fill -->
            <path d="${areaD}" fill="url(#grad-${chartId})" />

            <!-- Glowing Smooth Line Path -->
            <path d="${pathD}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow-${chartId})" />

            <!-- Interactive Glowing Points -->
            ${pts.map((p, i) => `
              <g class="chart-point-group">
                <circle cx="${p.x}" cy="${p.y}" r="5" fill="#ffffff" stroke="${color}" stroke-width="2.5" />
                ${i === pts.length - 1 ? `<circle cx="${p.x}" cy="${p.y}" r="8" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.6"><animate attributeName="r" values="5;11;5" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite"/></circle>` : ''}
              </g>
            `).join('')}
          </svg>
        </div>

        <div class="chart-labels" style="display:flex; justify-space-between; margin-top:0.4rem; padding:0 0.2rem; font-size:0.72rem; font-weight:700; color:#94a3b8;">
          ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'].map(day => `<span>${day}</span>`).join('')}
        </div>
      </article>
    `;
  }
  function filterToolbar() {
    const ranges = [
      ['today', 'Today'],
      ['yesterday', 'Yesterday'],
      ['week', 'This Week'],
      ['month', 'This Month'],
      ['year', 'This Year']
    ];
    return `<section class="card filter-toolbar"><div class="filter-chips">${ranges.map(([key, label]) => `<button class="filter-chip ${state.attendancePeriod === key ? 'active' : ''}" data-action="set-period" data-period="${key}">${label}</button>`).join('')}</div><div class="filter-controls"><select data-filter="grade"><option value="">All Classes</option>${[1,2,3,4,5,6,7,8,9,10].map((grade) => `<option value="${grade}">Class ${grade}</option>`).join('')}</select><select data-filter="section"><option value="">All Sections</option>${['A','B','C','D'].map((section) => `<option value="${section}">Section ${section}</option>`).join('')}</select><button class="btn btn-secondary" data-action="export-report">Export</button></div></section>`;
  }
  function donutCard(title, subtitle, centerLabel, centerValue, rows, palette, action = '') {
    const values = rows.map((row) => Number(row.value || 0));
    const total = values.reduce((sum, value) => sum + value, 0);
    if (!total) {
      return `<article class="card"><div class="card-heading"><div><h3>${escapeHTML(title)}</h3><p>${escapeHTML(subtitle)}</p></div></div><div class="empty-inline">No data available for selected filter.</div></article>`;
    }
    let offset = 0;
    const segments = rows.map((row, index) => {
      const percent = (Number(row.value || 0) / total) * 100;
      const color = palette[index % palette.length];
      const start = offset;
      const end = offset + percent;
      offset = end;
      return `${color} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
    }).join(', ');
    return `<article class="card"><div class="card-heading"><div><h3>${escapeHTML(title)}</h3><p>${escapeHTML(subtitle)}</p></div></div><div class="donut-layout"><div class="donut-chart" style="--segments:${segments}"><div class="donut-center"><small>${escapeHTML(centerLabel)}</small><b>${escapeHTML(String(centerValue))}</b></div></div><div class="donut-legend">${rows.map((row, index) => {
      const percent = ((Number(row.value || 0) / total) * 100);
      const color = palette[index % palette.length];
      const click = action ? ` data-action="${action}" data-reason="${escapeHTML(row.label)}"` : '';
      return `<button class="legend-item"${click}><span class="legend-dot" style="background:${color}"></span><span>${escapeHTML(row.label)}</span><b>${escapeHTML(String(row.value))}</b><small>${percent.toFixed(1)}%</small></button>`;
    }).join('')}</div></div></article>`;
  }
  function absenceByClassRows() {
    return classAttendanceRows().map((row) => {
      const absent = Math.max(0, Math.round((100 - row.attendance) / 100 * row.students));
      return {
        className: `Class ${row.grade}`,
        strength: row.students,
        absent,
        percentAbsent: row.students ? ((absent / row.students) * 100) : 0
      };
    }).sort((a, b) => b.absent - a.absent).slice(0, 6);
  }
  function teacherAbsenceReasonData() {
    const absentTotal = managementOpsSummary().teachers.absent;
    if (absentTotal <= 0) return { total: 0, reasons: [] };
    const templates = [
      { label: 'Medical Leave', value: 1 },
      { label: 'Personal Leave', value: 1 },
      { label: 'Emergency Leave', value: 1 },
      { label: 'Official Duty', value: 1 },
      { label: 'Training', value: 1 }
    ];
    const reasons = [];
    for (let i = 0; i < absentTotal; i += 1) {
      const t = templates[i % templates.length];
      const existing = reasons.find((item) => item.label === t.label);
      if (existing) existing.value += 1;
      else reasons.push({ ...t });
    }
    return { total: absentTotal, reasons };
  }
  function absentTeachersForReason() {
    const absentCount = managementOpsSummary().teachers.absent;
    const absentTeachers = [...teachers()].sort((a, b) => teacherAttendance(a) - teacherAttendance(b)).slice(0, absentCount || 0);
    return absentTeachers.map((teacher, index) => ({
      ...teacher,
      reason: teacherAbsenceReasonData().reasons[index % Math.max(1, teacherAbsenceReasonData().reasons.length)]?.label || 'Medical Leave',
      classesToday: 3 + (index % 3),
      substituteRequired: 1 + (index % 2),
      substituteAssigned: 2 + (index % 2)
    }));
  }

  function renderLanding() {
    return renderLandingFeature({ dashboardMetrics, button, icon, state });
  }

  function renderLogin() {
    return renderLoginFeature({ seed, state, tenant, escapeHTML, button, icon });
  }

  function renderAbout() {
    return renderAboutFeature({ button });
  }

  function renderContact() {
    return renderContactFeature({ button, state });
  }

  function renderDemo() {
    return renderDemoFeature({ button, state });
  }

  const managementNav = [
    ['dashboard', 'Management', 'dashboard'], ['timetable', 'Timetable', 'calendar'], ['attendance', 'Attendance', 'check'], ['teachers', 'Teachers', 'people'], ['students', 'Students', 'people'], ['exam-studio', 'AI Exam Studio', 'sparkle'], ['ai-prep', 'AI Study Coach', 'sparkle'], ['pocket-portal', 'Parent & Student Portal', 'sparkle'], ['announcements', 'Community', 'people'], ['leaderboard', 'Leaderboard', 'chart'], ['fees', 'Fees & Finance', 'task'], ['report-cards', 'Report cards', 'chart'], ['id-cards', 'ID Cards', 'people'], ['inquiries', 'Inquiries & Leads', 'task'], ['academic-years', 'Academic years', 'calendar'], ['subjects', 'Subjects', 'book'], ['assignments', 'Assignments', 'book'], ['assessments', 'Assessments', 'chart'], ['tasks', 'Tasks', 'task'], ['workload', 'Teacher workload', 'chart'], ['calendar', 'Calendar', 'calendar'], ['reports', 'Reports', 'chart'], ['analytics', 'Analytics', 'chart'], ['aira', 'Erum AI', 'bot'], ['notifications', 'Notifications', 'bell'], ['audit-logs', 'Audit logs', 'task'], ['settings', 'School settings', 'settings']
  ];
  const teacherNav = [
    ['dashboard', 'Teacher', 'dashboard'], ['my-classes', 'My classes', 'people'], ['my-students', 'My students', 'people'], ['exam-studio', 'AI Exam Studio', 'sparkle'], ['ai-prep', 'AI Study Coach', 'sparkle'], ['pocket-portal', 'Parent & Student Portal', 'sparkle'], ['announcements', 'Community', 'people'], ['leaderboard', 'Leaderboard', 'chart'], ['report-cards', 'Report cards', 'chart'], ['id-cards', 'ID Cards', 'people'], ['my-subjects', 'My subjects', 'book'], ['timetable', 'Timetable', 'calendar'], ['attendance', 'Attendance', 'check'], ['lesson-plans', 'Lesson plans', 'book'], ['assignments', 'Assignments', 'book'], ['assessments', 'Assessments', 'chart'], ['tasks', 'Tasks', 'task'], ['reports', 'Reports', 'chart'], ['profile', 'My profile', 'settings']
  ];
  const studentNav = [
    ['dashboard', 'Student', 'dashboard'], ['my-classes', 'My classes', 'people'], ['my-subjects', 'My subjects', 'book'], ['ai-prep', 'AI Study Coach', 'sparkle'], ['pocket-portal', 'Parent & Student Portal', 'sparkle'], ['announcements', 'Community', 'people'], ['leaderboard', 'Leaderboard', 'chart'], ['report-cards', 'My report card', 'chart'], ['fees', 'My fee dues', 'task'], ['id-cards', 'My ID Card', 'people'], ['timetable', 'My timetable', 'calendar'], ['assignments', 'Assignments', 'book'], ['results', 'Results & marks', 'chart'], ['attendance', 'My attendance', 'check'], ['performance', 'My performance', 'chart'], ['history', 'Academic history', 'calendar'], ['achievements', 'Achievements', 'task']
  ];
  function navigation() { return state.role === 'TEACHER' ? teacherNav : state.role === 'STUDENT' ? studentNav : managementNav; }
  function pageTitle() {
    const match = navigation().find((entry) => entry[0] === state.page);
    if (!match) return 'NotebookXL';
    if (match[0] === 'dashboard') return state.role === 'TEACHER' ? 'Teacher Overview' : state.role === 'STUDENT' ? 'Student Overview' : 'Management Overview';
    if (match[0] === 'aira') return '🤖 Erum AI School Intelligence Copilot';
    if (match[0] === 'ai-prep') return '🤖 AI Personal Study Coach & Exam Prep';
    if (match[0] === 'pocket-portal') return '📱 Parent & Student Pocket Portal';
    if (match[0] === 'announcements') return 'School Community';
    if (match[0] === 'leaderboard') return '🏆 Campus Leaderboard & Hall of Fame';
    if (match[0] === 'fees') return '💳 School Fees & Finance';
    if (match[0] === 'report-cards') return '📄 Student Report Cards';
    if (match[0] === 'id-cards') return '🪪 Official School ID Cards';
    return match[1];
  }
  function renderSidebar() {
    const school = tenant();
    const schoolName = school?.school?.name || school?.name || 'NotebookXL School';
    const role = roleLabels[state.role] || 'School management';
    return `<aside class="sidebar ${state.mobileNav ? 'sidebar-open' : ''}"><div class="sidebar-top"><a class="brand brand-light" data-action="dashboard"><span class="brand-mark">N</span>Notebook<span>XL</span></a><button class="mobile-close" data-action="toggle-sidebar-collapse" title="Collapse sidebar to full-width view">${icon('close')}</button></div><button class="workspace-switcher" data-action="open-workspace"><span class="workspace-avatar">${escapeHTML(initials(schoolName))}</span><span><b>${escapeHTML(schoolName)}</b><small>${escapeHTML(role)}</small></span>${icon('chevron')}</button><nav class="sidebar-nav" aria-label="Workspace navigation"><p>Workspace</p>${navigation().map(([id, label, iconName]) => `<button class="nav-link ${state.page === id && !state.profile ? 'active' : ''}" data-action="nav" data-page="${id}"><span>${icon(iconName)}</span>${escapeHTML(label)}</button>`).join('')}</nav><div class="sidebar-bottom"><button class="aira-nav" data-action="toggle-aira"><span>${icon('bot')}</span><span><b>Erum AI</b><small>Ask your AI assistant</small></span></button><button class="user-switcher" data-action="open-user-menu">${avatar(currentUser())}<span><b>${escapeHTML(fullName(currentUser()))}</b><small>${escapeHTML(role)}</small></span>${icon('chevron')}</button></div></aside>`;
  }
  function renderTopbar() {
    const school = tenant();
    const contextLabel = state.profile ? state.profile.type === 'student' ? 'Student profile' : 'Teacher profile' : pageTitle();
    const notices = communityNotificationItems(3);
    return `<header class="topbar"><div class="topbar-left"><button class="icon-button" data-action="toggle-sidebar-collapse" title="${state.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar for full-width view'}" style="display:flex; align-items:center; justify-content:center;">${icon('menu')}</button><div class="breadcrumb-wrap"><div class="breadcrumb"><span class="school-pill">${escapeHTML(school?.school?.name || school?.name || 'NotebookXL')}</span><b>${escapeHTML(contextLabel)}</b></div><small class="header-meta">Academic Year ${escapeHTML(activeAcademicYear())} · Thursday, 13 August 2026</small></div></div><div class="topbar-actions"><label class="global-search"><span>${icon('search')}</span><input id="global-search" value="${escapeHTML(state.query)}" placeholder="Search students, teachers…" /></label><button class="icon-button notification-button ${state.notificationOpen ? 'active' : ''}" data-action="toggle-notifications" aria-label="Notifications">${icon('bell')}<i>${notices.length}</i></button><button class="btn btn-secondary" data-action="logout">Logout</button>${avatar(currentUser(), 'avatar-small')}</div>${state.notificationOpen ? `<div class="notification-popover"><div><b>Notifications</b><button data-action="close-notifications">Mark all read</button></div>${notices.map((item) => `<button class="notice-row" data-action="nav" data-page="${item.page}"><span class="dot ${item.tone}"></span><span><b>${escapeHTML(item.title)}</b><small>${escapeHTML(item.time)}</small><p>${escapeHTML(item.text)}</p></span></button>`).join('')}</div>` : ''}</header>`;
  }
  function renderShell() {
    return `<div class="app-shell ${state.sidebarCollapsed ? 'sidebar-collapsed' : ''}">${renderSidebar()}<div class="main-area">${renderTopbar()}<main class="page-content"><div class="dashboard-container">${renderPage()}</div></main></div>${state.mobileNav ? '<button class="nav-scrim" data-action="toggle-mobile-nav" aria-label="Close navigation"></button>' : ''}</div>${renderAira()}${renderModal()}`;
  }

  function renderManagementDashboard() {
    const attentionItems = attentionSignals();
    const ops = managementOpsSummary();
    const attendanceValue = dashboardMetrics().attendance;
    const academicValue = dashboardMetrics().academicAverage;
    const teacherAttendanceValue = dashboardMetrics().teacherAttendance;
    const assignmentsValue = dashboardMetrics().activeAssignments;
    const teachersMetric = teachers().length;
    const remoteSchool = tenant()?.school?.name || tenant()?.name || 'Meezan Kids School';
    return renderDashboardModule(state, currentUser, remoteSchool, dashboardSyncPill, button, icon, state.remoteDashboards, students, compact, attendanceValue, ops, teachersMetric, academicValue, assignmentsValue, filterToolbar, metric, attentionItems, studentAttendance, escapeHTML, sectionHead);
  }

  function teacherAssignments(teacher) {
    const direct = getArray(teacher, 'assignments');
    if (direct.length) return direct.map((assignment, index) => ({ grade: String(assignment.grade || assignment.class || [8, 7, 8, 6][index % 4]).replace(/^Grade\s*/i, ''), section: assignment.section || ['A', 'B', 'C', 'A'][index % 4], subject: assignment.subject || subjectName(assignment.subjectId) || 'Mathematics', students: assignment.students || 38 }));
    return [{ grade: '8', section: 'A', subject: 'Mathematics', students: 42 }, { grade: '8', section: 'B', subject: 'Mathematics', students: 39 }, { grade: '7', section: 'A', subject: 'Mathematics', students: 41 }, { grade: '7', section: 'B', subject: 'Mathematics', students: 42 }];
  }
  function renderTeacherDashboard() {
    const remote = state.remoteDashboards.teacher;
    const teacher = currentTeacher();
    const work = teacherWorkload(teacher);
    const classes = teacherAssignments(teacher);
    const teacherName = remote?.teacher_name || fullName(teacher);
    const teacherFirst = teacherName.split(' ')[0] || teacher.firstName || 'Teacher';
    const classLabels = getArray(remote, 'classes');
    const schedule = getArray(remote, 'today_schedule');
    const remoteClasses = classLabels.length
      ? classLabels.map((entry, index) => {
          const label = String(entry || 'Grade 8A').replace(/^Grade\s*/i, '');
          const grade = label.match(/\d+/)?.[0] || '8';
          const section = label.match(/[A-Z]$/)?.[0] || ['A', 'B', 'C'][index % 3];
          return {
            grade,
            section,
            subject: schedule[index] ? String(schedule[index]).replace(/^\d{2}:\d{2}\s*/, '') : classes[index]?.subject || 'Mathematics',
            students: classes[index]?.students || countStudentsFor(grade, section)
          };
        })
      : classes;
    const todayClasses = remoteClasses.slice(0, 3).map((entry, index) => ({ ...entry, time: ['08:30', '09:20', '10:30'][index] }));
    const remoteAttendance = Number(remote?.attendance_rate ?? work.lessonPlanCompletion ?? 94);
    const remotePending = Number(remote?.pending_tasks ?? work.pendingReviews ?? 12);
    return `${sectionHead('Teacher workspace', `Good morning, ${escapeHTML(teacherFirst)}`, 'Your day, classes and teaching priorities in one place.', `<div class="heading-actions">${dashboardSyncPill()} ${button(`${icon('plus')} Create assignment`, 'open-add-assignment', 'primary')}</div>`)}
      ${state.remoteDashboards.loading && !remote ? '<div class="info-banner">Loading live teacher dashboard data…</div>' : ''}
      ${state.remoteDashboards.error && !remote ? `<div class="info-banner warning">${escapeHTML(state.remoteDashboards.error)}</div>` : ''}
      <section class="metric-grid teacher-metrics">${metric('Today’s classes', todayClasses.length, 'First class begins at 08:30', 'blue', 'calendar')}${metric('My students', work.students || countStudentsFor('8', 'A') * 4, 'Across active class groups', 'green', 'people')}${metric('Pending reviews', remotePending, 'Submissions awaiting review', 'amber', 'task')}${metric('Active assignments', assignments().filter((item) => lower(item.status) !== 'completed').length || 5, '2 due this week', 'purple', 'book')}</section>
      <section class="dashboard-quick-actions">
        <button class="quick-action-btn" data-action="nav" data-page="leaderboard">🏆 Leaderboard</button>
        <button class="quick-action-btn" data-action="open-discord-voice" data-channel="teacher" style="background:#5865f2; color:#ffffff; font-weight:700;">🎙️ Discord Faculty Voice Call</button>
        <button class="quick-action-btn" data-action="nav" data-page="report-cards">📄 Report Cards</button>
        <button class="quick-action-btn" data-action="nav" data-page="my-classes">${icon('people')} My classes</button>
        <button class="quick-action-btn" data-action="nav" data-page="timetable">${icon('calendar')} Timetable</button>
        <button class="quick-action-btn" data-action="open-take-attendance">${icon('check')} Take attendance</button>
        <button class="quick-action-btn" data-action="nav" data-page="tasks">${icon('task')} My tasks</button>
      </section>
      <section class="dashboard-grid teacher-dashboard-grid"><article class="card today-card"><div class="card-heading"><div><h3>Today’s classes</h3><p>Thursday, 13 August</p></div><button class="text-button" data-action="nav" data-page="timetable">Full timetable</button></div><div class="schedule-list">${todayClasses.map((entry, index) => `<button class="schedule-row" data-action="open-class" data-grade="${entry.grade}" data-section="${entry.section}" data-subject="${escapeHTML(entry.subject)}"><time>${entry.time}</time><span class="schedule-line ${index === 0 ? 'current' : ''}"></span><span><b>${escapeHTML(entry.subject)}</b><small>Grade ${escapeHTML(entry.grade)}${escapeHTML(entry.section)} · ${entry.students || countStudentsFor(entry.grade, entry.section)} students</small></span>${index === 0 ? '<em>Now</em>' : ''}</button>`).join('')}</div></article><article class="card progress-card"><div class="card-heading"><div><h3>Teaching progress</h3><p>This academic term</p></div></div><div class="donut-wrap"><div class="donut" style="--percent:${remoteAttendance}"><span>${remoteAttendance.toFixed(1)}%</span></div><div><b>${escapeHTML(teacherName)}</b><p>${escapeHTML(schedule[0] || 'Your classes and submissions are synced from backend data.')}</p><button class="text-button" data-action="nav" data-page="lesson-plans">View lesson plans</button></div></div><div class="progress-pairs"><span>Assignment completion <b>91%</b></span><div><i style="width:91%"></i></div><span>Assessment reviews <b>${Math.min(100, Math.max(0, 100 - remotePending * 3)).toFixed(0)}%</b></span><div><i style="width:${Math.min(100, Math.max(0, 100 - remotePending * 3))}%"></i></div></div></article></section>
    <section class="dashboard-grid dashboard-bottom-grid"><article class="card"><div class="card-heading"><div><h3>My classes</h3><p>${classes.length} active teaching assignments</p></div><button class="text-button" data-action="nav" data-page="my-classes">View all</button></div><div class="class-chip-grid">${classes.map((entry) => `<button class="class-chip" data-action="open-class" data-grade="${entry.grade}" data-section="${entry.section}" data-subject="${escapeHTML(entry.subject)}"><span>Grade ${escapeHTML(entry.grade)}${escapeHTML(entry.section)}</span><b>${escapeHTML(entry.subject)}</b><small>${entry.students || countStudentsFor(entry.grade, entry.section)} students</small></button>`).join('')}</div></article><article class="card task-preview"><div class="card-heading"><div><h3>Today’s tasks</h3><p>Keep the day moving</p></div><button class="text-button" data-action="nav" data-page="tasks">All tasks</button></div>${tasks().slice(0, 3).map((task) => `<button class="task-item" data-action="toggle-task" data-id="${escapeHTML(task.id)}"><span class="task-check ${lower(task.status).includes('completed') ? 'done' : ''}">${lower(task.status).includes('completed') ? '✓' : ''}</span><span><b>${escapeHTML(task.title || task.name || 'Prepare assessment')}</b><small>Due ${escapeHTML(task.dueDate || '18 Aug 2026')} · ${escapeHTML(task.priority || 'Medium')}</small></span>${badge(task.status || 'In Progress')}</button>`).join('') || '<div class="empty-inline">No priority tasks today.</div>'}</article></section>
    <section class="dashboard-grid dashboard-bottom-grid">${renderAcademicYearCalendarCard('Teacher Calendar', 'Plan classes by academic year and month')}${renderSchoolTimingCountdownCard()}</section>`;
  }

  function studentAcademicGamification(student) {
    if (!student) student = currentStudent();
    const avg = Number(student.academicAverage || studentAverage(student) || 85);
    const att = Number(student.attendanceRate || studentAttendance(student) || 95);
    
    // Calculate total academic XP
    const xp = Math.min(10000, Math.round(avg * 65 + att * 28 + 600));

    let level = 1;
    let levelTitle = 'Novice Scholar';
    let levelIcon = '🎖️';
    let medalName = 'Novice Badge';
    let tier = 'standard';
    let haloClass = 'medal-halo-lv1';
    let tagClass = 'lv-standard';
    let pillClass = 'pill-bronze';
    let nextLevelXP = 1000;
    let perks = ['Classroom Portal Access', 'Weekly Quiz Entry'];

    if (xp >= 9600) {
      level = 10;
      levelTitle = 'Gold Medal Grandmaster';
      levelIcon = '🥇';
      medalName = 'Legendary Gold Medal';
      tier = 'gold';
      haloClass = 'medal-halo-lv10';
      tagClass = 'lv-gold';
      pillClass = 'pill-gold';
      nextLevelXP = 10000;
      perks = ['🥇 Gold Medal Scholar Citation', '🌟 Hall of Fame Placement', '👑 Principal’s Circle', '🚀 Leadership Council'];
    } else if (xp >= 8800) {
      level = 9;
      levelTitle = 'Silver Medal Master';
      levelIcon = '🥈';
      medalName = 'Radiant Silver Medal';
      tier = 'silver';
      haloClass = 'medal-halo-lv9';
      tagClass = 'lv-silver';
      pillClass = 'pill-silver';
      nextLevelXP = 9600;
      perks = ['🥈 Silver Medal Distinction', '🔬 Olympiad Delegate', '📚 Academic Honors'];
    } else if (xp >= 8000) {
      level = 8;
      levelTitle = 'Bronze Medal Elite';
      levelIcon = '🥉';
      medalName = 'Luminous Bronze Medal';
      tier = 'bronze';
      haloClass = 'medal-halo-lv8';
      tagClass = 'lv-bronze';
      pillClass = 'pill-bronze';
      nextLevelXP = 8800;
      perks = ['🥉 Bronze Medal Citation', '🏆 Topper Recognition', '📐 STEM Club Pass'];
    } else if (xp >= 7000) {
      level = 7;
      levelTitle = 'Distinction Scholar';
      levelIcon = '💎';
      medalName = 'Ruby Star';
      tier = 'standard';
      haloClass = 'medal-halo-lv7';
      tagClass = 'lv-standard';
      pillClass = 'pill-bronze';
      nextLevelXP = 8000;
      perks = ['Distinction Honors', 'Subject Excellence'];
    } else if (xp >= 5800) {
      level = 6;
      levelTitle = 'Master Problem Solver';
      levelIcon = '🟣';
      medalName = 'Amethyst Badge';
      tier = 'standard';
      haloClass = 'medal-halo-lv6';
      tagClass = 'lv-standard';
      pillClass = 'pill-bronze';
      nextLevelXP = 7000;
      perks = ['Problem Solver Badge', 'Peer Mentor Status'];
    } else if (xp >= 4600) {
      level = 5;
      levelTitle = 'Classroom Champion';
      levelIcon = '🟢';
      medalName = 'Emerald Shield';
      tier = 'standard';
      haloClass = 'medal-halo-lv5';
      tagClass = 'lv-standard';
      pillClass = 'pill-bronze';
      nextLevelXP = 5800;
      perks = ['Top 20% in Class', 'Fast Learner Recognition'];
    } else if (xp >= 3400) {
      level = 4;
      levelTitle = 'Knowledge Seeker';
      levelIcon = '🔹';
      medalName = 'Sapphire Insignia';
      tier = 'standard';
      haloClass = 'medal-halo-lv4';
      tagClass = 'lv-standard';
      pillClass = 'pill-bronze';
      nextLevelXP = 4600;
      perks = ['Curiosity Explorer', 'Study Group Lead'];
    } else if (xp >= 2200) {
      level = 3;
      levelTitle = 'Diligent Learner';
      levelIcon = '🔰';
      medalName = 'Steel Emblem';
      tier = 'standard';
      haloClass = 'medal-halo-lv3';
      tagClass = 'lv-standard';
      pillClass = 'pill-bronze';
      nextLevelXP = 3400;
      perks = ['Consistent Attendance', 'Assignment Punctuality'];
    } else if (xp >= 1000) {
      level = 2;
      levelTitle = 'Rising Explorer';
      levelIcon = '🥉';
      medalName = 'Copper Badge';
      tier = 'standard';
      haloClass = 'medal-halo-lv2';
      tagClass = 'lv-standard';
      pillClass = 'pill-bronze';
      nextLevelXP = 2200;
      perks = ['Classroom Participant', 'Early Submissions'];
    }

    const progressPct = Math.min(100, Math.round((xp / nextLevelXP) * 100));

    return {
      level,
      levelTitle,
      levelIcon,
      medalName,
      tier,
      haloClass,
      tagClass,
      pillClass,
      currentXP: xp,
      totalXP: xp,
      nextLevelXP,
      progressPct,
      perks,
      currentTier: {
        level,
        name: levelTitle,
        badgeEmoji: levelIcon,
        tagClass
      }
    };
  }

  function renderGamifiedAvatar(person, size = 'avatar-profile') {
    const gamification = studentAcademicGamification(person);
    return `<div class="avatar-gamified-wrapper">
      <span class="medal-halo-ring ${gamification.haloClass}"></span>
      ${avatar(person, size)}
      <span class="avatar-level-tag ${gamification.tagClass}">
        ${gamification.levelIcon} Lv.${gamification.level} ${gamification.tier !== 'standard' ? gamification.tier.toUpperCase() : ''}
      </span>
    </div>`;
  }

  function renderGamificationShowcaseCard(student) {
    const g = studentAcademicGamification(student);
    const milestones = [
      { lv: 1, title: 'Novice', icon: '🎖️', req: '500 XP' },
      { lv: 2, title: 'Explorer', icon: '🥉', req: '1K XP' },
      { lv: 3, title: 'Learner', icon: '🔰', req: '2.2K XP' },
      { lv: 4, title: 'Seeker', icon: '🔹', req: '3.4K XP' },
      { lv: 5, title: 'Champion', icon: '🟢', req: '4.6K XP' },
      { lv: 6, title: 'Master', icon: '🟣', req: '5.8K XP' },
      { lv: 7, title: 'Distinction', icon: '💎', req: '7K XP' },
      { lv: 8, title: 'Bronze Medal', icon: '🥉', req: '8K XP', medal: true },
      { lv: 9, title: 'Silver Medal', icon: '🥈', req: '8.8K XP', medal: true },
      { lv: 10, title: 'Gold Medal', icon: '🥇', req: '9.6K XP', medal: true }
    ];

    return `<section class="gamification-showcase-card">
      <div class="gamification-header-row">
        <div class="gamification-header-left">
          <span class="gamification-medal-3d">${g.levelIcon}</span>
          <div class="gamification-title-block">
            <h3>Level ${g.level} • ${escapeHTML(g.levelTitle)}</h3>
            <p>Academic Mastery Tier • ${escapeHTML(tenant()?.school?.name || tenant()?.name || 'School')}</p>
          </div>
        </div>
        <div class="gamification-xp-badge">
          ⚡ ${g.currentXP.toLocaleString()} Academic XP
        </div>
      </div>

      <div class="gamification-xp-bar-wrap">
        <div class="gamification-xp-bar-fill" style="width: ${g.progressPct}%;"></div>
      </div>
      <div class="gamification-xp-meta">
        <span><b>${g.currentXP.toLocaleString()} XP</b> accumulated</span>
        <span><b>${g.level === 10 ? 'MAX TIER REACHED 👑' : `${g.nextLevelXP.toLocaleString()} XP to Level ${g.level + 1}`}</b> (${g.progressPct}%)</span>
      </div>

      <div class="gamification-shelf-grid">
        ${milestones.map((m) => {
          const unlocked = g.level >= m.lv;
          const isActive = g.level === m.lv;
          return `<div class="gamification-milestone-item ${unlocked ? 'unlocked' : ''} ${isActive ? 'active-level' : ''}">
            <span class="gamification-milestone-icon">${m.icon}</span>
            <span class="gamification-milestone-title">Lv.${m.lv} ${m.title}</span>
            <small class="gamification-milestone-sub">${unlocked ? (isActive ? '★ Active' : '✓ Earned') : m.req}</small>
          </div>`;
        }).join('')}
      </div>
    </section>`;
  }

  function renderStudentDashboard() {
    const remote = state.remoteDashboards.student;
    const student = currentStudent();
    const subjectList = getArray(student, 'subjects').length ? getArray(student, 'subjects').map((item) => typeof item === 'string' ? item : item.name) : ['Mathematics', 'Science', 'English'];
    const upcoming = assessments().slice(0, 2);
    const remoteName = remote?.student_name || fullName(student);
    const remoteFirst = remoteName.split(' ')[0] || student.firstName || 'Student';
    const remoteClass = remote?.class_name || displayGrade(student);
    const remoteAttendance = Number(remote?.attendance_rate ?? studentAttendance(student));
    const remoteAverage = Number(remote?.academic_average ?? studentAverage(student));
    const remoteItems = getArray(remote, 'items');
    const pendingRows = (remoteItems.length
      ? remoteItems
      : assignments().slice(0, 3).map((assignment, index) => `${assignment.title || `${subjectList[index % subjectList.length]} practice`} · ${assignment.subject || subjectName(assignment.subjectId)} · Due ${assignment.dueDate || '18 Aug'}`)
    ).slice(0, 3);
    return `${sectionHead('Student workspace', `Good morning, ${escapeHTML(remoteFirst)}`, `${escapeHTML(remoteClass)} · Academic Year ${tenant()?.academicYear || tenant()?.academicYears?.[0]?.name || '2026–27'}`, `<div class="heading-actions">${dashboardSyncPill()}</div>`)}
      ${state.remoteDashboards.loading && !remote ? '<div class="info-banner">Loading live student dashboard data…</div>' : ''}
      ${state.remoteDashboards.error && !remote ? `<div class="info-banner warning">${escapeHTML(state.remoteDashboards.error)}</div>` : ''}
      <section class="student-hero-card"><div>${renderGamifiedAvatar(student, 'avatar-large')}<div><span>Your learning overview</span><h2>${escapeHTML(remoteName)}</h2><p>${escapeHTML(student.studentId || 'NXL-MKS-000421')} · Roll no. ${escapeHTML(student.rollNumber || '17')}</p></div></div><div class="student-hero-stats"><span><b>${decimal(remoteAttendance)}</b><small>Attendance</small></span><span><b>${decimal(remoteAverage)}</b><small>Academic average</small></span><span><b>${remoteItems.length || 2}</b><small>Pending work</small></span></div></section>
      ${renderGamificationShowcaseCard(student)}
      <section class="dashboard-quick-actions">
        <button class="quick-action-btn" data-action="nav" data-page="leaderboard">🏆 Campus Leaderboard</button>
        <button class="quick-action-btn" data-action="open-discord-voice" data-channel="student" style="background:#5865f2; color:#ffffff; font-weight:700;">🎧 Join Classroom Discord Voice Call</button>
        <button class="quick-action-btn" data-action="nav" data-page="report-cards">📄 My Report Card</button>
        <button class="quick-action-btn" data-action="nav" data-page="fees">💳 My Fee Dues</button>
        <button class="quick-action-btn" data-action="nav" data-page="timetable">${icon('calendar')} Timetable</button>
        <button class="quick-action-btn" data-action="nav" data-page="assignments">${icon('book')} Assignments</button>
        <button class="quick-action-btn" data-action="nav" data-page="attendance">${icon('check')} Attendance</button>
      </section>
      <section class="dashboard-grid student-main-grid"><article class="card today-card"><div class="card-heading"><div><h3>Today’s classes</h3><p>Thursday, 13 August</p></div><button class="text-button" data-action="nav" data-page="timetable">My timetable</button></div><div class="schedule-list">${subjectList.slice(0, 3).map((subject, index) => `<div class="schedule-row"><time>${['08:30','09:20','10:30'][index]}</time><span class="schedule-line ${index === 0 ? 'current' : ''}"></span><span><b>${escapeHTML(subject)}</b><small>${['Room 201','Science Lab','Room 108'][index]} · ${['Ms. Priya Sharma','Mr. Arjun Rao','Ms. Ayesha Khan'][index]}</small></span>${index === 0 ? '<em>Now</em>' : ''}</div>`).join('')}</div></article><article class="card student-progress-card"><div class="card-heading"><div><h3>My progress</h3><p>Across current subjects</p></div><button class="text-button" data-action="nav" data-page="performance">Details</button></div>${subjectList.slice(0, 4).map((subject, index) => { const value = Math.max(64, Math.min(96, studentAverage(student) + [4, -2, 1, -5][index])); return `<div class="subject-progress"><span><b>${escapeHTML(subject)}</b><strong>${Math.round(value)}%</strong></span><div><i style="width:${value}%"></i></div></div>`; }).join('')}</article></section>
  <section class="dashboard-grid dashboard-bottom-grid"><article class="card"><div class="card-heading"><div><h3>Pending assignments</h3><p>Stay ahead of your due dates</p></div><button class="text-button" data-action="nav" data-page="assignments">All assignments</button></div><div class="assignment-stack">${pendingRows.map((item, index) => `<button class="assignment-row" ${remoteItems.length ? '' : `data-action="open-assignment" data-id="${escapeHTML(assignments()[index]?.id || '')}"`}><span class="assignment-icon ${index === 0 ? 'purple' : 'blue'}">${icon('book')}</span><span><b>${escapeHTML(String(item).split(' · ')[0] || ('Task ' + (index + 1)))}</b><small>${escapeHTML(String(item).split(' · ').slice(1).join(' · ') || 'Upcoming learning item')}</small></span>${badge(index === 0 ? 'Due soon' : 'Pending', index === 0 ? 'warning' : 'info')}</button>`).join('') || '<div class="empty-inline">You are all caught up.</div>'}</div></article><article class="card"><div class="card-heading"><div><h3>Upcoming exams</h3><p>Plan your revision</p></div><button class="text-button" data-action="nav" data-page="results">My results</button></div><div class="exam-stack">${upcoming.map((assessment, index) => `<div class="exam-row"><time><b>${[18,22][index]}</b><span>AUG</span></time><span><b>${escapeHTML(assessment.name || assessment.title || 'Unit Test')}</b><small>${escapeHTML(assessment.subject || subjectName(assessment.subjectId) || subjectList[index])} · ${escapeHTML(assessment.type || 'Unit Test')}</small></span></div>`).join('') || '<div class="empty-inline">No upcoming exams have been published.</div>'}</div></article></section>
    <section class="dashboard-grid dashboard-bottom-grid">${renderAcademicYearCalendarCard('Student Calendar', 'Academic year calendar for classes and assessments')}${renderSchoolTimingCountdownCard()}</section>`;
  }

  function renderPeople(kind) {
    state.page = kind || state.page;
    return renderPeopleModule(state, tenant, icon, compact, button, lower, fullName, studentGrade, badge, studentAcademicGamification, studentAttendance, studentAverage, decimal, getTenantFeeRecords, avatar, teacherAssignments, teacherAttendance, teacherWorkload, sectionHead, renderGamifiedAvatar, escapeHTML);
  }

  function profileTabs(type) {
    const studentTabs = [
      ['overview','Overview & Medals'],
      ['id-card','🪪 School ID Card'],
      ['fees','💳 Fees & Invoices'],
      ['academic','Academic information'],
      ['attendance','Attendance'],
      ['assessments','Exams & marks'],
      ['assignments','Assignments'],
      ['performance','Performance & XP'],
      ['history','Academic history'],
      ['activity','Activity history']
    ];
    const teacherTabs = [
      ['overview','Overview'],
      ['id-card','🪪 Faculty ID Card'],
      ['employment','Employment'],
      ['teaching','Subjects & classes'],
      ['attendance','Attendance & leave'],
      ['workload','Teaching workload'],
      ['learning','Teaching & learning'],
      ['performance','Class performance'],
      ['activity','Activity history']
    ];
    return type === 'student' ? studentTabs : teacherTabs;
  }
  function renderProfile() {
    const profile = state.profile;
    const isStudent = profile.type === 'student';
    const person = (isStudent ? students() : teachers()).find((item) => item.id === profile.id) || (isStudent ? currentStudent() : currentTeacher());
    const tab = state.profileTab || 'overview';
    const title = fullName(person);
    const overview = isStudent ? renderStudentProfileContent(person, tab) : renderTeacherProfileContent(person, tab);
    const heroAvatar = isStudent ? renderGamifiedAvatar(person, 'avatar-profile') : avatar(person, 'avatar-profile');
    return `<div class="profile-page"><button class="back-button" data-action="close-profile">← Back to ${isStudent ? 'students' : 'teachers'}</button><section class="profile-hero"><div>${heroAvatar}<div><p class="eyebrow">${isStudent ? 'Student profile' : 'Teacher profile'}</p><h1>${escapeHTML(title)}</h1><p>${isStudent ? `${escapeHTML(person.studentId || 'NXL-MKS-000421')} · ${escapeHTML(displayGrade(person))} · Roll no. ${escapeHTML(person.rollNumber || '17')}` : `${escapeHTML(person.employeeId || 'MKS-T-001')} · ${escapeHTML(person.department || 'Academics')}`}</p></div></div><div class="profile-actions">${badge(person.status || 'Active')}<button class="btn btn-secondary" data-action="open-edit-profile">Edit profile</button><button class="icon-button" aria-label="More options">•••</button></div></section><nav class="profile-tabs">${profileTabs(profile.type).map(([id, label]) => `<button class="${tab === id ? 'active' : ''}" data-action="set-profile-tab" data-tab="${id}">${escapeHTML(label)}</button>`).join('')}</nav><section class="profile-content">${overview}</section></div>`;
  }
  function renderFees() {
    return renderFeesModule(state, students, getTenantFeeRecords, fullName, studentGrade, tenant, sectionHead, escapeHTML, renderDigitalReceiptHTML);
  }
  function renderStudentProfileContent(student, tab) {
    const subjectList = getArray(student, 'subjects').length ? getArray(student, 'subjects').map((item) => typeof item === 'string' ? item : item.name) : ['Mathematics', 'Science', 'English', 'Social Science'];
    if (tab === 'id-card') {
      const schName = tenant()?.school?.name || tenant()?.name || 'Meezan Kids School';
      const targetMobile = (student.parentMobile || student.phone || '9845098765').replace(/\D/g, '');
      const waMsg = encodeURIComponent(`Dear Parent, official digital CR80 School ID Card for ${fullName(student)} (Grade ${studentGrade(student)}${student.section||'A'}) is ready. Published by ${schName}.`);

      return `
        ${sectionHead('', 'Official Student ID Card', 'Official scannable CR80 student identity badge with embedded roll number & barcode.')}
        <section class="card" style="margin-bottom:1.25rem; background:#f8fafc; border:1.5px solid #cbd5e1; padding:1rem 1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
            <div>
              <b style="color:#0f172a; font-size:1.05rem;">🪪 ${escapeHTML(fullName(student))} — Grade ${escapeHTML(studentGrade(student))}${escapeHTML(student.section||'A')}</b>
              <p style="margin:0.1rem 0 0; font-size:0.82rem; color:#64748b;">
                Roll No: #${escapeHTML(student.rollNumber || '17')} · Student ID: ${escapeHTML(student.studentId || 'NXL-MKS-STU-000421')}
              </p>
            </div>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <button class="btn ${state.showIDCardDocument ? 'btn-primary' : 'btn-secondary'}" style="font-size:0.85rem;" data-action="toggle-id-card">
                ${state.showIDCardDocument ? '👁️ Hide ID Card' : '👁️ View / Download ID Card'}
              </button>
              <a href="https://wa.me/91${targetMobile}?text=${waMsg}" target="_blank" class="wa-reminder-btn" style="font-size:0.85rem; padding:0.45rem 0.95rem;">
                💬 Send WhatsApp
              </a>
              <button class="btn btn-primary" style="font-size:0.85rem;" data-action="print-id-card">
                🖨️ Print / Save as PDF
              </button>
            </div>
          </div>
        </section>

        ${state.showIDCardDocument ? renderIDCardHTML(student, 'STUDENT') : `
          <div style="background:#f8fafc; border:2px dashed #cbd5e1; border-radius:12px; padding:2.5rem 1.5rem; text-align:center; margin-bottom:1.5rem;">
            <div style="font-size:2.5rem; margin-bottom:0.4rem;">🪪</div>
            <h3 style="margin:0 0 0.3rem; color:#0f172a; font-size:1.15rem;">Official Scannable CR80 Student ID Card</h3>
            <p style="margin:0 0 1.25rem; color:#64748b; font-size:0.88rem; max-width:550px; margin-left:auto; margin-right:auto;">
              Scannable Code-128 barcode ID badge for <b>${escapeHTML(fullName(student))}</b> is ready. Click below to view and inspect.
            </p>
            <div style="display:flex; gap:0.75rem; justify-content:center; flex-wrap:wrap;">
              <button class="btn btn-primary" data-action="toggle-id-card">
                👁️ View / Download ID Card
              </button>
              <button class="btn btn-secondary" data-action="print-id-card">
                🖨️ Print / Save as PDF
              </button>
            </div>
          </div>
        `}
      `;
    }
    if (tab === 'fees') return renderStudentProfileFees(student);
    if (tab === 'attendance') return `${sectionHead('', 'Attendance record', 'Daily and academic-year attendance overview.')}<section class="metric-grid profile-metrics">${metric('Academic year', decimal(studentAttendance(student)), 'Present on 171 of 181 days', 'green', 'check')}${metric('This month', '92.6%', '2 days absent · 1 late', 'blue', 'calendar')}${metric('Class average', '93.8%', '0.8% above student', 'amber', 'chart')}</section>${chart('Attendance trend', [89, 94, 92, 95, 93, 91, studentAttendance(student)], '#17865b')}`;
    if (tab === 'assessments') return `${sectionHead('', 'Exams & marks', 'Published assessment results for the current academic year.', button(`${icon('plus')} Record mark`, 'open-record-mark', 'primary'))}<section class="card"><div class="table-wrap"><table class="data-table"><thead><tr><th>Assessment</th><th>Subject</th><th>Date</th><th>Score</th><th>Class average</th><th>Result</th></tr></thead><tbody>${assessments().slice(0, 6).map((assessment, index) => { const mark = Math.max(45, Math.round(studentAverage(student) + [3, -4, 2, 5, -2, 1][index])); return `<tr><td><b>${escapeHTML(assessment.name || assessment.title || 'Unit Test')}</b><small>${escapeHTML(assessment.type || 'Unit Test')}</small></td><td>${escapeHTML(assessment.subject || subjectName(assessment.subjectId) || subjectList[index % subjectList.length])}</td><td>${escapeHTML(assessment.date || '08 Aug 2026')}</td><td><b>${mark}%</b></td><td>${Math.max(55, mark - 3)}%</td><td>${badge(mark >= 75 ? 'Strong' : 'Developing', mark >= 75 ? 'success' : 'warning')}</td></tr>`; }).join('')}</tbody></table></div></section>`;
    if (tab === 'assignments') return `${sectionHead('', 'Assignments & homework', 'Current and completed classroom work.')}<section class="card assignment-full-list">${assignments().slice(0, 8).map((assignment, index) => `<div class="assignment-full"><span class="assignment-icon ${index % 2 ? 'blue' : 'purple'}">${icon('book')}</span><div><b>${escapeHTML(assignment.title || 'Practice worksheet')}</b><p>${escapeHTML(assignment.subject || subjectName(assignment.subjectId) || subjectList[index % subjectList.length])} · Due ${escapeHTML(assignment.dueDate || '18 Aug 2026')}</p></div>${badge(index < 2 ? 'Pending' : 'Completed', index < 2 ? 'warning' : 'success')}<button class="btn btn-secondary" data-action="open-assignment" data-id="${escapeHTML(assignment.id)}">View</button></div>`).join('')}</section>`;
    if (tab === 'history') return renderHistory(student, subjectList);
    if (tab === 'performance') return `${sectionHead('', 'Academic performance & XP', 'Subject trends, strengths and gamified XP tier.')}${renderGamificationShowcaseCard(student)}<section class="dashboard-grid dashboard-bottom-grid">${chart('Performance trend', [73, 76, 78, 77, 81, 80, studentAverage(student)], '#7659d9')}<article class="card"><div class="card-heading"><div><h3>Subject performance</h3><p>Current academic year</p></div></div>${subjectList.map((subject, index) => { const value = Math.round(studentAverage(student) + [4, -2, 1, -5][index]); return `<div class="subject-progress"><span><b>${escapeHTML(subject)}</b><strong>${value}%</strong></span><div><i style="width:${value}%"></i></div></div>`; }).join('')}</article></section>`;
    if (tab === 'activity') return renderActivityLog('student', student);
    return `${renderGamificationShowcaseCard(student)}<section class="metric-grid profile-metrics">${metric('Attendance', decimal(studentAttendance(student)), 'Academic year to date', 'green', 'check')}${metric('Academic average', decimal(studentAverage(student)), 'Across published results', 'purple', 'chart')}${metric('Assignments', '24 complete', '2 pending', 'blue', 'book')}${metric('Status', student.status || 'Active', 'Enrolled for 2026–27', 'amber', 'calendar')}</section><section class="dashboard-grid dashboard-bottom-grid"><article class="card detail-card"><div class="card-heading"><div><h3>Personal information</h3><p>Student identity, contact and admission record</p></div><button class="text-button" data-action="open-edit-profile" data-id="${escapeHTML(student.id)}">✏️ Edit details</button></div><dl><div><dt>Admission no.</dt><dd>${escapeHTML(student.admissionNumber || student.admissionNo || 'MKS-2020-421')}</dd></div><div><dt>Date of birth</dt><dd>${escapeHTML(student.dateOfBirth || student.dob || '17 May 2012')}</dd></div><div><dt>Gender</dt><dd>${escapeHTML(student.gender || 'Male')}</dd></div><div><dt>Blood group</dt><dd>${escapeHTML(student.bloodGroup || 'O+')}</dd></div><div><dt>Contact email</dt><dd>${escapeHTML(student.email || 'student@meezan.school.edu')}</dd></div><div><dt>Parent contact</dt><dd>${escapeHTML(student.parentMobile || '+91 98450 98765')}</dd></div><div><dt>Student ID</dt><dd>${escapeHTML(student.studentId || 'NXL-MKS-000421')}</dd></div></dl></article><article class="card"><div class="card-heading"><div><h3>Current subjects</h3><p>Active enrolment for ${tenant()?.academicYear || '2026–27'}</p></div></div><div class="subject-tags">${subjectList.map((subject) => `<span>${escapeHTML(subject)}</span>`).join('')}</div><div class="teacher-note"><span>✦</span><p><b>Teacher feedback</b><br/>Shows strong curiosity in practical work and benefits from a structured revision plan.</p></div></article></section>`;
  }
  function renderHistory(student, subjectList) {
    const history = getArray(student, 'history');
    const years = history.length ? history : [{ year: '2026–27', grade: displayGrade(student), attendance: studentAttendance(student), average: studentAverage(student) }, { year: '2025–26', grade: `Grade ${Math.max(1, Number(studentGrade(student)) - 1)}A`, attendance: Math.min(99, studentAttendance(student) + 1.1), average: Math.max(60, studentAverage(student) - 3) }, { year: '2024–25', grade: `Grade ${Math.max(1, Number(studentGrade(student)) - 2)}A`, attendance: Math.min(99, studentAttendance(student) + .3), average: Math.max(60, studentAverage(student) - 5) }];
    return `${sectionHead('', 'Academic history', 'Published records remain linked to their original academic year.')}<div class="history-timeline">${history.map((record, index) => `<article class="history-card"><div class="history-marker">${index + 1}</div><div class="history-main"><p class="eyebrow">${escapeHTML(record.year || record.academicYear || '2026–27')}</p><h3>${escapeHTML(record.grade || displayGrade(student))}</h3><div class="history-stats"><span><b>${decimal(record.attendance ?? studentAttendance(student))}</b>Attendance</span><span><b>${decimal(record.average ?? studentAverage(student))}</b>Academic average</span></div><div class="history-subjects">${subjectList.slice(0,3).map((subject, i) => `<span>${escapeHTML(subject)} <b>${Math.round((record.average ?? studentAverage(student)) + [2,-1,3][i])}%</b></span>`).join('')}</div></div><button class="btn btn-secondary" data-action="view-year">View record</button></article>`).join('')}</div>`;
  }
  function renderTeacherProfileContent(teacher, tab) {
    const work = teacherWorkload(teacher);
    const classes = teacherAssignments(teacher);
    if (tab === 'id-card') {
      const schName = tenant()?.school?.name || tenant()?.name || 'Meezan Kids School';
      const targetMobile = (teacher.mobile || teacher.phone || '9845188990').replace(/\D/g, '');
      const waMsg = encodeURIComponent(`Hello ${fullName(teacher)}, your official digital CR80 Faculty ID Card is issued by ${schName}.`);

      return `
        ${sectionHead('', 'Official Faculty & Staff ID Card', 'Official scannable CR80 faculty identity badge with designation & barcode.')}
        <section class="card" style="margin-bottom:1.25rem; background:#f8fafc; border:1.5px solid #cbd5e1; padding:1rem 1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
            <div>
              <b style="color:#0f172a; font-size:1.05rem;">🪪 ${escapeHTML(fullName(teacher))} — Senior PGT ${escapeHTML(teacher.subject || 'Mathematics')}</b>
              <p style="margin:0.1rem 0 0; font-size:0.82rem; color:#64748b;">
                Faculty ID: ${escapeHTML(teacher.teacherId || teacher.employeeId || 'NXL-MKS-TCH-000108')} · Dept: ${escapeHTML(teacher.department || 'Academics')}
              </p>
            </div>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <button class="btn ${state.showIDCardDocument ? 'btn-primary' : 'btn-secondary'}" style="font-size:0.85rem;" data-action="toggle-id-card">
                ${state.showIDCardDocument ? '👁️ Hide ID Card' : '👁️ View / Download ID Card'}
              </button>
              <a href="https://wa.me/91${targetMobile}?text=${waMsg}" target="_blank" class="wa-reminder-btn" style="font-size:0.85rem; padding:0.45rem 0.95rem;">
                💬 Send WhatsApp
              </a>
              <button class="btn btn-primary" style="font-size:0.85rem;" data-action="print-id-card">
                🖨️ Print / Save as PDF
              </button>
            </div>
          </div>
        </section>

        ${state.showIDCardDocument ? renderIDCardHTML(teacher, 'TEACHER') : `
          <div style="background:#f8fafc; border:2px dashed #cbd5e1; border-radius:12px; padding:2.5rem 1.5rem; text-align:center; margin-bottom:1.5rem;">
            <div style="font-size:2.5rem; margin-bottom:0.4rem;">🪪</div>
            <h3 style="margin:0 0 0.3rem; color:#0f172a; font-size:1.15rem;">Official Scannable CR80 Faculty ID Card</h3>
            <p style="margin:0 0 1.25rem; color:#64748b; font-size:0.88rem; max-width:550px; margin-left:auto; margin-right:auto;">
              Scannable Code-128 barcode ID badge for <b>${escapeHTML(fullName(teacher))}</b> is ready. Click below to view and inspect.
            </p>
            <div style="display:flex; gap:0.75rem; justify-content:center; flex-wrap:wrap;">
              <button class="btn btn-primary" data-action="toggle-id-card">
                👁️ View / Download ID Card
              </button>
              <button class="btn btn-secondary" data-action="print-id-card">
                🖨️ Print / Save as PDF
              </button>
            </div>
          </div>
        `}
      `;
    }
    if (tab === 'teaching') return `${sectionHead('', 'Subjects & classes', 'Current teaching assignments and class teacher responsibilities.')}<section class="class-chip-grid large-chips">${classes.map((entry) => `<button class="class-chip" data-action="open-class" data-grade="${entry.grade}" data-section="${entry.section}" data-subject="${escapeHTML(entry.subject)}"><span>Grade ${escapeHTML(entry.grade)}${escapeHTML(entry.section)}</span><b>${escapeHTML(entry.subject)}</b><small>${entry.students || countStudentsFor(entry.grade, entry.section)} students</small></button>`).join('')}</section>`;
    if (tab === 'attendance') return `${sectionHead('', 'Attendance & leave', 'Teacher attendance for the current academic year.')}<section class="metric-grid profile-metrics">${metric('Academic year', decimal(teacherAttendance(teacher)), 'Present on 174 of 181 days', 'green', 'check')}${metric('This month', '100%', 'No absences recorded', 'blue', 'calendar')}${metric('Leave balance', '8 days', '4 casual · 4 medical', 'purple', 'calendar')}</section>${chart('Attendance trend', [95, 97, 94, 98, 96, 100, teacherAttendance(teacher)], '#17865b')}`;
    if (tab === 'workload') return `${sectionHead('', 'Teaching workload', 'A balanced view of teaching, preparation and review work.')}<section class="metric-grid profile-metrics">${metric('Classes', work.classes || classes.length, 'Active assigned class groups', 'blue', 'people')}${metric('Students', work.students || 164, 'Across assigned classes', 'green', 'people')}${metric('Weekly periods', work.weeklyPeriods || 26, 'Teaching schedule load', 'purple', 'calendar')}${metric('Pending reviews', work.pendingReviews || 12, 'Assignment & assessment reviews', 'amber', 'task')}</section><section class="dashboard-grid dashboard-bottom-grid"><article class="card"><div class="card-heading"><div><h3>Workload allocation</h3><p>Current week</p></div></div><div class="workload-bars"><span>Teaching <b>26h</b><i style="width:83%"></i></span><span>Planning <b>5h</b><i style="width:44%"></i></span><span>Reviews <b>4h</b><i style="width:34%"></i></span><span>Coordination <b>2h</b><i style="width:18%"></i></span></div></article><article class="card"><div class="card-heading"><div><h3>Workload signal</h3><p>Based on active workload</p></div></div><div class="workload-signal"><strong>Well balanced</strong><p>Teaching load is within the school’s recommended range.</p>${badge('Healthy', 'success')}</div></article></section>`;
    if (tab === 'learning') return `${sectionHead('', 'Teaching & learning', 'Lesson planning, assessments and current learning material.')}<section class="metric-grid profile-metrics">${metric('Lesson plans', `${work.lessonPlanCompletion || 94}%`, 'Completed this term', 'green', 'book')}${metric('Assignments', '8 active', '2 due this week', 'blue', 'task')}${metric('Assessments', '3 upcoming', '1 awaiting review', 'purple', 'chart')}${metric('Resources', '14 saved', 'Worksheets & material', 'amber', 'book')}</section>`;
    if (tab === 'performance') return `${sectionHead('', 'Class performance', 'Performance across this teacher’s assigned classes.')}<section class="card"><div class="table-wrap"><table class="data-table"><thead><tr><th>Class</th><th>Subject</th><th>Students</th><th>Attendance</th><th>Class average</th><th>Signal</th></tr></thead><tbody>${classes.map((entry, index) => `<tr><td><b>Grade ${entry.grade}${entry.section}</b></td><td>${escapeHTML(entry.subject)}</td><td>${entry.students || countStudentsFor(entry.grade, entry.section)}</td><td>${94 - index}%</td><td>${82 - index * 2}%</td><td>${badge(index === 2 ? 'Watch' : 'Healthy', index === 2 ? 'warning' : 'success')}</td></tr>`).join('')}</tbody></table></div></section>`;
    if (tab === 'activity') return renderActivityLog('teacher', teacher);
    if (tab === 'employment') return `${sectionHead('', 'Employment', 'Employment and operational details.')}<section class="dashboard-grid dashboard-bottom-grid"><article class="card detail-card"><dl><div><dt>Employee ID</dt><dd>${escapeHTML(teacher.employeeId || 'MKS-T-001')}</dd></div><div><dt>Department</dt><dd>${escapeHTML(teacher.department || 'Mathematics')}</dd></div><div><dt>Joined on</dt><dd>${escapeHTML(teacher.joinedOn || '10 Jun 2020')}</dd></div><div><dt>Employment status</dt><dd>${badge(teacher.status || 'Active')}</dd></div></dl></article><article class="card"><div class="card-heading"><div><h3>Roles</h3><p>School operational assignments</p></div></div><div class="subject-tags"><span>Teacher</span><span>Class teacher · Grade 8A</span><span>Mathematics department</span></div></article></section>`;
    return `<section class="metric-grid profile-metrics">${metric('Attendance', decimal(teacherAttendance(teacher)), 'Academic year to date', 'green', 'check')}${metric('Weekly periods', work.weeklyPeriods || 26, `${classes.length} active classes`, 'purple', 'calendar')}${metric('My students', work.students || 164, 'Across teaching assignments', 'blue', 'people')}${metric('Lesson plans', `${work.lessonPlanCompletion || 94}%`, 'Completed this term', 'amber', 'book')}</section><section class="dashboard-grid dashboard-bottom-grid"><article class="card detail-card"><div class="card-heading"><div><h3>Personal information</h3><p>Teacher profile and contact record</p></div><button class="text-button" data-action="open-edit-profile" data-id="${escapeHTML(teacher.id)}">✏️ Edit details</button></div><dl><div><dt>Employee ID</dt><dd>${escapeHTML(teacher.employeeId || 'MKS-T-001')}</dd></div><div><dt>Department</dt><dd>${escapeHTML(teacher.department || 'Mathematics')}</dd></div><div><dt>Gender</dt><dd>${escapeHTML(teacher.gender || 'Female')}</dd></div><div><dt>Contact email</dt><dd>${escapeHTML(teacher.email || 'priya.sharma@meezan.school.edu')}</dd></div><div><dt>Mobile</dt><dd>${escapeHTML(teacher.mobile || '+91 98451 88990')}</dd></div><div><dt>Primary role</dt><dd>Teacher</dd></div></dl></article><article class="card"><div class="card-heading"><div><h3>Today’s teaching</h3><p>Thursday, 13 August</p></div></div><div class="schedule-list compact">${classes.slice(0,3).map((entry, index) => `<div class="schedule-row"><time>${['08:30','09:20','10:30'][index]}</time><span class="schedule-line"></span><span><b>${escapeHTML(entry.subject)}</b><small>Grade ${entry.grade}${entry.section}</small></span></div>`).join('')}</div></article></section>`;
  }
  function renderActivityLog(type, person) {
    const items = type === 'student' ? ['Submitted Mathematics worksheet', 'Attendance was marked Present', 'Unit Test 2 result was published', 'Profile updated by management'] : ['Published Grade 8A Mathematics assignment', 'Attendance was marked Present', 'Completed a lesson plan', 'Updated Unit Test assessment'];
    return `${sectionHead('', 'Activity history', 'Auditable activity related to this profile.')}<section class="card activity-log">${items.map((item, index) => `<div><span class="activity-dot ${index === 0 ? 'purple' : ''}"></span><span><b>${escapeHTML(item)}</b><small>${['Today, 10:42 AM','Yesterday, 08:37 AM','11 Aug 2026, 02:15 PM','08 Aug 2026, 04:20 PM'][index]}</small></span></div>`).join('')}</section>`;
  }

  function renderSubjects() {
    const active = subjects().filter((subject) => subject.active !== false && subject.status !== 'Disabled');
    return `${sectionHead('Academics', 'Subjects', 'Create, assign and manage subjects for your school.', button(`${icon('plus')} Add subject`, 'open-add-subject', 'primary'))}<section class="card list-card"><div class="filters"><label class="filter-search">${icon('search')}<input data-filter="subjectQuery" value="${escapeHTML(state.filters.subjectQuery || '')}" placeholder="Search subjects" /></label><select data-filter="subjectStatus"><option value="">All statuses</option><option value="Active">Active</option><option value="Disabled">Disabled</option></select><button class="btn btn-secondary filter-btn">${icon('filter')} Filters</button></div><div class="subject-grid">${active.filter((subject) => !state.filters.subjectQuery || lower(subject.name).includes(lower(state.filters.subjectQuery))).map((subject) => `<article class="subject-card"><div><span class="subject-code">${escapeHTML(subject.code || subject.name.slice(0,3).toUpperCase())}</span>${badge(subject.status || 'Active')}</div><h3>${escapeHTML(subject.name)}</h3><p>Assigned to ${(subject.gradeLevels || subject.grades || [1,2,3]).map((grade) => `Grade ${grade}`).join(', ')}</p><div class="subject-card-bottom"><span>${Math.max(1, teachers().filter((teacher) => teacherAssignments(teacher).some((entry) => entry.subject === subject.name)).length)} teachers</span><button class="text-button" data-action="open-subject" data-id="${escapeHTML(subject.id)}">Manage</button></div></article>`).join('')}</div></section><section class="academic-flow-banner"><span class="flow-icon">${icon('book')}</span><div><b>Subject changes flow to the right people.</b><p>Assign a subject to grades, sections and teachers to make it available in their workspaces.</p></div><button class="btn btn-light" data-action="open-add-subject">Add a subject</button></section>`;
  }
  function renderAcademicYears() {
    const years = getArray(tenant(), 'academicYears').length ? getArray(tenant(), 'academicYears') : [{ id: '2026-27', name: '2026–27', status: 'Current', startDate: '01 Jun 2026', endDate: '31 Mar 2027' }, { id:'2025-26',name:'2025–26',status:'Archived',startDate:'01 Jun 2025',endDate:'31 Mar 2026' }];
    return `${sectionHead('Academics', 'Academic years', 'Keep current and historical academic records distinct.', button(`${icon('plus')} Create academic year`, 'open-add-year', 'primary'))}<section class="card"><div class="table-wrap"><table class="data-table"><thead><tr><th>Academic year</th><th>Start date</th><th>End date</th><th>Students</th><th>Status</th><th></th></tr></thead><tbody>${years.map((year, index) => `<tr><td><b>${escapeHTML(year.name || year.label || year)}</b>${index === 0 ? '<small>Default academic year</small>' : ''}</td><td>${escapeHTML(year.startDate || '01 Jun 2026')}</td><td>${escapeHTML(year.endDate || '31 Mar 2027')}</td><td>${index === 0 ? compact(students().length) : compact(students().length * .96)}</td><td>${badge(year.status || (index === 0 ? 'Current' : 'Archived'), index === 0 ? 'success' : 'info')}</td><td><button class="icon-button">•••</button></td></tr>`).join('')}</tbody></table></div></section><section class="info-note"><span>${icon('calendar')}</span><p><b>Historical records are protected.</b> Enrollment, attendance and marks remain associated with their original academic year.</p></section>`;
  }
  function renderTimetable() {
    return renderTimetableModule(state, currentTeacher, currentStudent, studentGrade, teacherAssignments, timetable, parseTimetableDate, lower, subjectName, calendarMonthsForYear, sectionHead, button, icon, tenant, escapeHTML);
  }
  function getTodayPunchLogs() {
    const key = state.tenantId || 'default';
    if (!state.studentPunchLogsByTenant) state.studentPunchLogsByTenant = {};
    if (!state.studentPunchLogsByTenant[key]) {
      state.studentPunchLogsByTenant[key] = [
        { id: 'student-1', studentId: 'NXL-MKS-STU-000421', name: 'Amaan Khan', rollNumber: '17', grade: '8', section: 'A', firstCheckIn: '08:12 AM', lastCheckOut: '03:45 PM', punchCount: 2, status: 'CHECKED OUT' },
        { id: 'student-2', studentId: 'NXL-MKS-STU-000422', name: 'Ananya Khan', rollNumber: '18', grade: '8', section: 'A', firstCheckIn: '08:18 AM', lastCheckOut: '—', punchCount: 1, status: 'PRESENT' },
        { id: 'student-3', studentId: 'NXL-MKS-STU-000423', name: 'Zayd Ali', rollNumber: '19', grade: '8', section: 'A', firstCheckIn: '08:25 AM', lastCheckOut: '—', punchCount: 1, status: 'PRESENT' }
      ];
    }
    return state.studentPunchLogsByTenant[key];
  }

  function recordStudentBarcodeScan(studentId) {
    const logs = getTodayPunchLogs();
    const allStuds = students();
    const stud = allStuds.find(s => s.id === studentId || s.studentId === studentId) || allStuds[0];
    if (!stud) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sName = fullName(stud);
    const rollNum = stud.rollNumber || '17';

    let logItem = logs.find(l => l.id === stud.id);
    if (!logItem) {
      logItem = {
        id: stud.id,
        studentId: stud.studentId || `NXL-MKS-STU-000${stud.id}`,
        name: sName,
        rollNumber: rollNum,
        grade: studentGrade(stud),
        section: stud.section || 'A',
        firstCheckIn: timeStr,
        lastCheckOut: '—',
        punchCount: 1,
        status: 'PRESENT'
      };
      logs.unshift(logItem);
      state.lastScannedRecord = { student: stud, type: 'CHECK_IN', time: timeStr, log: logItem };
      notify(`🟢 Morning Check-In: ${sName} (Roll #${rollNum}) recorded at ${timeStr}! WhatsApp alert sent to parent.`, 'success');
    } else {
      logItem.lastCheckOut = timeStr;
      logItem.punchCount += 1;
      logItem.status = 'CHECKED OUT';
      state.lastScannedRecord = { student: stud, type: 'CHECK_OUT', time: timeStr, log: logItem };
      notify(`🔵 Evening Check-Out: ${sName} (Roll #${rollNum}) updated at ${timeStr}! WhatsApp alert sent to parent.`, 'info');
    }
    render();
  }

  function renderAttendanceScannerModal() {
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

          <!-- Camera Scanner Beam Animation Frame -->
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

          <!-- Quick Member Barcode Scan Selector / Simulator -->
          <div style="margin-bottom:1rem; background:#f8fafc; padding:0.85rem; border-radius:8px; border:1px solid #cbd5e1;">
            <label style="font-size:0.78rem; font-weight:800; color:#0f172a; display:block; margin-bottom:0.35rem;">
              Select Student to Trigger Camera Scan:
            </label>
            <div style="display:flex; gap:0.4rem;">
              <select id="scanner-sim-student" style="flex:1; padding:0.45rem; border:1.5px solid #7c3aed; border-radius:6px; font-weight:800; font-size:0.85rem; background:#ffffff;">
                ${allStuds.map(s => `
                  <option value="${s.id}">
                    👨‍🎓 ${escapeHTML(fullName(s))} (Roll #${s.rollNumber || '17'} · Grade ${studentGrade(s)}${s.section||'A'})
                  </option>
                `).join('')}
              </select>
              <button class="btn btn-primary" style="font-size:0.82rem; padding:0.45rem 0.85rem;" data-action="simulate-scan-submit">
                ⚡ Scan ID
              </button>
            </div>
          </div>

          <!-- Last Scan Real-Time Feedback Card -->
          ${lastScan ? `
            <div style="background:${lastScan.type === 'CHECK_IN' ? '#f0fdf4' : '#eff6ff'}; border:1.5px solid ${lastScan.type === 'CHECK_IN' ? '#22c55e' : '#3b82f6'}; border-radius:10px; padding:0.85rem; margin-bottom:1rem;">
              <div style="display:flex; align-items:center; gap:0.75rem;">
                ${renderGamifiedAvatar(lastScan.student, 'avatar-large')}
                <div>
                  <span class="badge ${lastScan.type === 'CHECK_IN' ? 'badge-success' : 'badge-info'}" style="font-size:0.68rem; margin-bottom:0.15rem;">
                    ${lastScan.type === 'CHECK_IN' ? '🟢 MORNING CHECK-IN' : '🔵 EVENING CHECK-OUT'}
                  </span>
                  <h4 style="margin:0; font-size:0.98rem; color:#0f172a; font-weight:900;">
                    ${escapeHTML(fullName(lastScan.student))}
                  </h4>
                  <p style="margin:0.1rem 0 0; font-size:0.78rem; color:#475569;">
                    Roll #${lastScan.student.rollNumber || '17'} · Time: <b>${lastScan.time}</b>
                  </p>
                </div>
              </div>
            </div>
          ` : ''}

          <button class="btn btn-secondary" style="width:100%; font-size:0.88rem;" data-action="close-scanner-modal">
            Close Scanner
          </button>
        </div>
      </div>
    `;
  }

  function renderUniversalAttendanceGatewayModal() {
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
            <!-- Live Punch Response Card -->
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


  function renderAttendance() {
    const student = state.role === 'STUDENT' ? currentStudent() : null;
    if (student) return `${sectionHead('My record', 'My attendance', 'Your attendance for the current academic year.')}<section class="metric-grid profile-metrics">${metric('Academic year', decimal(studentAttendance(student)), '171 present · 6 absent · 4 late', 'green', 'check')}${metric('This month', '92.6%', '23 present · 2 absent', 'blue', 'calendar')}${metric('Class average', '93.8%', '0.8% above your rate', 'purple', 'chart')}</section>${chart('Attendance trend', [94, 91, 95, 93, 94, 92, studentAttendance(student)], '#17865b')}<section class="card attendance-calendar"><div class="card-heading"><div><h3>August 2026</h3><p>Daily attendance record</p></div><div class="attendance-key"><span class="present"></span>Present <span class="absent"></span>Absent <span class="late"></span>Late</div></div><div class="calendar-days">${Array.from({length:31}, (_, i) => `<span class="${[6,13,20,27].includes(i) ? 'absent' : [3,17].includes(i) ? 'late' : 'present'}">${i + 1}</span>`).join('')}</div></section>`;
    
    const list = state.role === 'TEACHER' ? students().filter((item) => { const assignment = teacherAssignments(currentTeacher())[0]; return assignment ? studentGrade(item) === String(assignment.grade) && item.section === assignment.section : true; }).slice(0, 42) : students().filter((item) => studentGrade(item) === '8' && item.section === 'A').slice(0, 42);
    const breakdown = attendanceBreakdown(list);
    const punchLogs = getTodayPunchLogs();

    return `
      ${sectionHead(state.role === 'TEACHER' ? 'My classes' : 'Students', 'Attendance', state.role === 'TEACHER' ? 'Grade 8A · Mathematics · Thursday, 13 August 2026' : 'Monitor daily student and teacher attendance.', `<div style="display:flex; gap:0.5rem; flex-wrap:wrap;">${button('🌐 Universal Multi-Device Gateway', 'open-universal-attendance-gateway', 'secondary')} ${button('📷 Mobile Barcode Scanner', 'open-scanner-modal', 'primary')}</div>`)}
      
      ${renderAttendanceScannerModal(state, students, fullName, studentGrade, render)}
      ${renderUniversalAttendanceGatewayModal(state, escapeHTML)}

      <!-- Barcode Punch Callout Banner -->
      <section class="card" style="margin-bottom:1.5rem; background:linear-gradient(135deg, #1e1b4b, #312e81); color:#ffffff; padding:1.25rem 1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <div style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.08em; color:#a5b4fc; font-weight:800; margin-bottom:0.25rem;">
              📷 SMARTPHONE BARCODE ATTENDANCE SYSTEM
            </div>
            <h3 style="margin:0 0 0.25rem; font-size:1.2rem; color:#ffffff;">Scan ID Cards via Mobile Camera (No Hardware Device Needed!)</h3>
            <p style="margin:0; font-size:0.85rem; color:#c7d2fe; max-width:650px;">
              First scan of the day records <b>Morning Check-In (Login)</b>. Subsequent scans update <b>Evening Check-Out (Logout)</b>.
            </p>
          </div>
          <button class="btn btn-primary" style="background:#6366f1; border:none; font-size:0.9rem; padding:0.55rem 1.25rem;" data-action="open-scanner-modal">
            📷 Open Mobile Scanner
          </button>
        </div>
      </section>

      <!-- Real-Time Barcode Punch Logs Table -->
      <section class="card" style="margin-bottom:1.5rem; border:2px solid #6366f1;">
        <div class="card-heading">
          <div>
            <h3>⏱️ Live Barcode Attendance Punch Logs (Today)</h3>
            <p>First Check-In (Login) & Last Check-Out (Logout) timestamps</p>
          </div>
          <button class="btn btn-secondary" data-action="open-scanner-modal">📷 Scan Student</button>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No</th>
                <th>Grade & Sec</th>
                <th>Morning Check-In (First Scan)</th>
                <th>Evening Check-Out (Last Scan)</th>
                <th>Total Scans</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${punchLogs.map((log) => `
                <tr>
                  <td>
                    <span class="table-person">
                      <b>${escapeHTML(log.name)}</b>
                      <small>${escapeHTML(log.studentId)}</small>
                    </span>
                  </td>
                  <td><b>#${escapeHTML(log.rollNumber)}</b></td>
                  <td>Grade ${escapeHTML(log.grade)}${escapeHTML(log.section)}</td>
                  <td><span class="badge badge-success" style="font-size:0.75rem;">🟢 ${escapeHTML(log.firstCheckIn)}</span></td>
                  <td>
                    ${log.lastCheckOut !== '—' 
                      ? `<span class="badge badge-info" style="font-size:0.75rem;">🔵 ${escapeHTML(log.lastCheckOut)}</span>` 
                      : `<span style="color:#94a3b8; font-size:0.8rem;">— (On Campus)</span>`}
                  </td>
                  <td><b>${log.punchCount} scan${log.punchCount > 1 ? 's' : ''}</b></td>
                  <td>${badge(log.status === 'CHECKED OUT' ? 'Checked Out' : 'Present', log.status === 'CHECKED OUT' ? 'info' : 'success')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <section class="attendance-categories"><article class="period-card period-day"><div><p>Day view</p><h3>${breakdown.day.rate.toFixed(1)}%</h3></div><small>${breakdown.day.present} present · ${breakdown.day.absent} absent · ${breakdown.day.late} late</small></article><article class="period-card period-month"><div><p>Month view</p><h3>${breakdown.month.rate.toFixed(1)}%</h3></div><small>${breakdown.month.present}/${breakdown.month.totalDays} days healthy attendance</small></article><article class="period-card period-year"><div><p>Year view</p><h3>${breakdown.year.rate.toFixed(1)}%</h3></div><small>${breakdown.year.present}/${breakdown.year.totalDays} total school days covered</small></article></section><section class="metric-grid profile-metrics">${metric('Student attendance', decimal(dashboardMetrics().attendance), 'Academic year to date', 'green', 'check')}${metric('Today', `${breakdown.day.rate.toFixed(1)}%`, `${breakdown.day.present} present · ${breakdown.day.absent} absent · ${breakdown.day.late} late`, 'blue', 'calendar')}${state.role === 'SCHOOL_ADMIN' ? metric('Teacher attendance', decimal(dashboardMetrics().teacherAttendance), '19 of 20 teachers present', 'purple', 'people') : metric('Class average', '94.0%', 'Grade 8A current rate', 'purple', 'chart')}</section><section class="card"><div class="card-heading"><div><h3>${state.role === 'TEACHER' ? 'Grade 8A attendance' : 'Today’s student attendance'}</h3><p>${list.length} students · Thursday, 13 August</p></div><button class="btn btn-secondary" data-action="open-take-attendance">Edit attendance</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Student</th><th>Grade</th><th>Academic attendance</th><th>Today</th><th></th></tr></thead><tbody>${list.map((person, index) => `<tr><td><span class="table-person">${avatar(person)}<span><b>${escapeHTML(fullName(person))}</b><small>${escapeHTML(person.studentId || '')}</small></span></span></td><td>${escapeHTML(displayGrade(person))}</td><td>${decimal(studentAttendance(person))}</td><td>${badge(['Present','Present','Present','Late','Present','Absent'][index % 6])}</td><td><button class="text-button" data-action="open-student" data-id="${escapeHTML(person.id)}">View</button></td></tr>`).join('')}</tbody></table></div></section>`;
  }
  function renderAssignments() {
    const list = assignments();
    return `${sectionHead(state.role === 'STUDENT' ? 'My learning' : 'Teaching & learning', state.role === 'STUDENT' ? 'My assignments' : 'Assignments', state.role === 'STUDENT' ? 'All current classroom work and due dates.' : 'Create, publish and monitor classroom work.', state.role === 'STUDENT' ? '' : button(`${icon('plus')} Create assignment`, 'open-add-assignment', 'primary'))}<section class="assignment-board">${[['Active', list.filter((item) => !lower(item.status).includes('complete'))],['Needs attention', list.filter((item, index) => index % 4 === 0)],['Completed', list.filter((item) => lower(item.status).includes('complete'))]].map(([label, items], column) => `<section><header><span class="board-dot ${['blue','amber','green'][column]}"></span><b>${label}</b><small>${items.length || (column === 2 ? 8 : column === 1 ? 3 : 5)}</small></header>${(items.length ? items : list.slice(column, column + 3)).slice(0, 5).map((assignment, index) => `<button class="assignment-board-card" data-action="open-assignment" data-id="${escapeHTML(assignment.id)}"><span class="assignment-icon ${['purple','blue','amber'][index % 3]}">${icon('book')}</span><b>${escapeHTML(assignment.title || `${subjectName(assignment.subjectId)} practice assignment`)}</b><p>${escapeHTML(assignment.subject || subjectName(assignment.subjectId) || 'Mathematics')} · Grade ${escapeHTML(assignment.grade || '8')}${escapeHTML(assignment.section || 'A')}</p><div><span>${escapeHTML(assignment.dueDate || '18 Aug 2026')}</span>${badge(assignment.status || (column === 2 ? 'Completed' : column === 1 ? 'Overdue' : 'In Progress'))}</div></button>`).join('')}</section>`).join('')}</section>`;
  }
  function renderAssessments() {
    return `${sectionHead('Teaching & learning', 'Assessments', 'Plan assessments, publish results and retain every mark historically.', state.role === 'STUDENT' ? '' : button(`${icon('plus')} Create assessment`, 'open-add-assessment', 'primary'))}<section class="metric-grid profile-metrics">${metric('Upcoming', assessments().filter((item) => !lower(item.status).includes('published')).length || 3, 'Across 8 active classes', 'blue', 'calendar')}${metric('Published', assessments().filter((item) => lower(item.status).includes('published')).length || 12, 'Current academic year', 'green', 'check')}${metric('Awaiting marks', '4', 'Teacher action required', 'amber', 'task')}${metric('Academic average', decimal(dashboardMetrics().academic), 'Across published results', 'purple', 'chart')}</section><section class="card"><div class="table-wrap"><table class="data-table"><thead><tr><th>Assessment</th><th>Subject</th><th>Class</th><th>Date</th><th>Type</th><th>Status</th><th></th></tr></thead><tbody>${assessments().slice(0, 20).map((assessment, index) => `<tr><td><b>${escapeHTML(assessment.name || assessment.title || 'Mathematics Unit Test')}</b></td><td>${escapeHTML(assessment.subject || subjectName(assessment.subjectId) || ['Mathematics','Science','English'][index % 3])}</td><td>Grade ${escapeHTML(assessment.grade || '8')}${escapeHTML(assessment.section || 'A')}</td><td>${escapeHTML(assessment.date || '18 Aug 2026')}</td><td>${escapeHTML(assessment.type || 'Unit Test')}</td><td>${badge(assessment.status || (index % 3 === 0 ? 'Scheduled' : 'Published'))}</td><td><button class="text-button" data-action="open-assessment" data-id="${escapeHTML(assessment.id)}">${state.role === 'STUDENT' ? 'View result' : 'Manage'}</button></td></tr>`).join('')}</tbody></table></div></section>`;
  }
  function renderTasks() {
    const own = state.role === 'TEACHER' ? tasks().filter((task) => !task.assignedTo || task.assignedTo === currentTeacher().id || lower(task.assignedTo).includes(lower(fullName(currentTeacher())))) : tasks();
    return `${sectionHead('Operations', state.role === 'TEACHER' ? 'My tasks' : 'School tasks', 'Keep high-priority academic work on track.', button(`${icon('plus')} Create task`, 'open-add-task', 'primary'))}<section class="task-summary"><span><b>${own.filter((task) => lower(task.status).includes('progress')).length || 3}</b>In progress</span><span><b>${own.filter((task) => lower(task.status).includes('overdue')).length || 2}</b>Overdue</span><span><b>${own.filter((task) => lower(task.status).includes('complete')).length || 8}</b>Completed</span></section><section class="task-list-full">${own.slice(0, 24).map((task, index) => `<article class="task-full"><button class="task-check ${lower(task.status).includes('complete') ? 'done' : ''}" data-action="toggle-task" data-id="${escapeHTML(task.id)}">${lower(task.status).includes('complete') ? '✓' : ''}</button><div><div><h3>${escapeHTML(task.title || task.name || 'Prepare Grade 8 Mathematics Unit Test')}</h3>${badge(task.status || ['In Progress','Not Started','Completed','Overdue'][index % 4])}</div><p>${escapeHTML(task.description || 'Academic operations task assigned from the school workspace.')}</p><div class="task-meta"><span>Assigned to <b>${escapeHTML(task.assigneeName || task.assignedToName || fullName(currentTeacher()))}</b></span><span>Due <b>${escapeHTML(task.dueDate || '18 Aug 2026')}</b></span><span>Priority ${badge(task.priority || 'Medium')}</span></div></div><button class="icon-button">•••</button></article>`).join('')}</section>`;
  }
  function renderWorkload() {
    return `${sectionHead('Teachers', 'Teacher workload', 'See teaching load, planning time and review work across the school.')}<section class="workload-overview"><article><span class="workload-number green">${teachers().filter((teacher) => (teacherWorkload(teacher).weeklyPeriods || 22) < 28).length || 14}</span><div><b>Balanced workload</b><p>Within recommended teaching range</p></div></article><article><span class="workload-number amber">${Math.max(2, Math.floor(teachers().length * .2))}</span><div><b>Review attention</b><p>High pending review counts</p></div></article><article><span class="workload-number danger">${Math.max(1, Math.floor(teachers().length * .1))}</span><div><b>High workload</b><p>Support recommended this week</p></div></article></section><section class="card"><div class="card-heading"><div><h3>Teaching workload by teacher</h3><p>Current academic week</p></div><button class="btn btn-secondary" data-action="export-workload">Export report</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Teacher</th><th>Classes</th><th>Students</th><th>Weekly periods</th><th>Lesson plans</th><th>Pending reviews</th><th>Signal</th></tr></thead><tbody>${teachers().map((teacher, index) => { const work = teacherWorkload(teacher); const signal = (work.weeklyPeriods || 22) >= 29 || index % 9 === 0 ? 'High' : index % 5 === 0 ? 'Watch' : 'Healthy'; return `<tr class="clickable-row" data-action="open-teacher" data-id="${escapeHTML(teacher.id)}"><td><span class="table-person">${avatar(teacher)}<span><b>${escapeHTML(fullName(teacher))}</b><small>${escapeHTML(teacher.department || 'Academics')}</small></span></span></td><td>${work.classes || teacherAssignments(teacher).length}</td><td>${work.students || 150}</td><td><b>${work.weeklyPeriods || 24}</b></td><td>${work.lessonPlanCompletion || 92}%</td><td>${work.pendingReviews || 5}</td><td>${badge(signal, signal === 'Healthy' ? 'success' : signal === 'High' ? 'danger' : 'warning')}</td></tr>`; }).join('')}</tbody></table></div></section>`;
  }
  function renderReports() {
    const metrics = dashboardMetrics();
    return `${sectionHead('Insights', 'Reports', 'Data-backed reporting for management and academic teams.', button('Export report', 'export-report', 'secondary'))}<section class="report-grid"><button data-action="open-report"><span>${icon('people')}</span><b>Student report</b><p>Enrollment, attendance and academic outcomes.</p><i>Open report ${icon('arrow')}</i></button><button data-action="open-report"><span>${icon('check')}</span><b>Attendance report</b><p>Daily, monthly and academic-year attendance.</p><i>Open report ${icon('arrow')}</i></button><button data-action="open-report"><span>${icon('chart')}</span><b>Academic report</b><p>Class, subject and assessment performance.</p><i>Open report ${icon('arrow')}</i></button><button data-action="open-report"><span>${icon('book')}</span><b>Teacher report</b><p>Workload, assignments and teaching readiness.</p><i>Open report ${icon('arrow')}</i></button></section><section class="dashboard-grid dashboard-bottom-grid">${chart('Academic performance', [75,76,78,77,80,79,metrics.academic], '#7357d8')}${chart('Assignment completion', [86,88,89,91,90,92,metrics.completion], '#d08b16')}</section>`;
  }
  function renderAnnouncements() {
    const store = tenantCommunityStore();
    const posts = visibleCommunityPosts();
    const filter = state.communityPostFilter || 'ALL';
    const user = currentUser();
    const userRole = state.role || 'SCHOOL_ADMIN';
    const canPost = true; // All authenticated members can share updates or questions

    const formatHashtags = (text) => {
      return escapeHTML(text || '').replace(/#([a-zA-Z0-9_]+)/g, '<span class="post-hashtag" data-action="filter-hashtag" data-tag="$1">#$1</span>');
    };

    const reactionEmojiMap = {
      like: '👍',
      love: '❤️',
      celebrate: '👏',
      insightful: '💡',
      support: '🎯',
      awesome: '🔥'
    };

    const renderPostMediaItem = (media) => {
      if (!media || !media.kind) return '';
      if (media.kind === 'video' && media.src) {
        return `<div class="post-media-video-container">
          <video controls preload="metadata" poster="${escapeHTML(media.poster || '')}" src="${escapeHTML(media.src)}"></video>
        </div>`;
      }
      if (media.kind === 'image' && media.src) {
        return `<div class="post-media-image-container">
          <img src="${escapeHTML(media.src)}" alt="Post image" loading="lazy" />
        </div>`;
      }
      if (media.kind === 'circular') {
        return `<div class="post-media-circular-card">
          <div class="circular-card-left">
            <div class="circular-pdf-icon">📄</div>
            <div class="circular-card-details">
              <b>${escapeHTML(media.title || 'Official_Circular.pdf')}</b>
              <small>${escapeHTML(media.size || '1.8 MB')} • ${escapeHTML(media.pages || 'Official School Memo')}</small>
            </div>
          </div>
          <button type="button" class="circular-download-btn" data-action="download-circular" data-title="${escapeHTML(media.title || 'Circular.pdf')}">
            📥 Download PDF
          </button>
        </div>`;
      }
      return '';
    };

    const filterTabs = `<div class="community-filter-tabs">
      <button class="community-filter-btn ${filter === 'ALL' ? 'active' : ''}" data-action="filter-community" data-filter="ALL">🌐 All Posts</button>
      <button class="community-filter-btn ${filter === 'CIRCULARS' ? 'active' : ''}" data-action="filter-community" data-filter="CIRCULARS">📢 Circulars & Notices</button>
      <button class="community-filter-btn ${filter === 'EVENTS' ? 'active' : ''}" data-action="filter-community" data-filter="EVENTS">🏆 Events & Expos</button>
      <button class="community-filter-btn ${filter === 'ACADEMIC' ? 'active' : ''}" data-action="filter-community" data-filter="ACADEMIC">📚 Academic Updates</button>
      <button class="community-filter-btn ${filter === 'ACHIEVEMENTS' ? 'active' : ''}" data-action="filter-community" data-filter="ACHIEVEMENTS">🥇 Staff & Student Spotlights</button>
    </div>`;

    const composerCard = `<section class="community-composer-card">
      <form id="community-post-form">
        <div class="composer-author-row">
          <div class="composer-author-info">
            <div class="composer-avatar">${escapeHTML((user.name || user.firstName || 'U')[0])}</div>
            <div class="composer-author-details">
              <b>${escapeHTML(fullName(user))}</b>
              <span>${escapeHTML(roleLabels[userRole] || userRole)} • Meezan Kids School</span>
            </div>
          </div>
          <select class="composer-audience-select" name="audience">
            <option value="ALL">🌐 Everyone</option>
            <option value="TEACHERS">👩‍🏫 Faculty & Staff Only</option>
            <option value="STUDENTS">🎓 Students & Parents</option>
          </select>
        </div>

        <input type="text" name="headline" placeholder="Headline / Announcement Title (optional)" style="width: 100%; box-sizing: border-box; padding: 0.55rem 0.85rem; border-radius: 8px; border: 1.5px solid #e2e8f0; font-weight: 700; font-size: 0.88rem; margin: 0.45rem 0 0.3rem;" />

        <textarea class="composer-textarea" name="message" placeholder="What would you like to announce to the school community? Use #hashtags like #ScienceExpo, #CBSEExams, #SportsDay..." required></textarea>

        <div class="composer-media-inputs" id="composer-media-options">
          <label>Attach Media (Optional):</label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem;">
            <input name="mediaKind" id="composer-media-kind" list="media-kind-options" placeholder="Media type: image / video / circular" value="${escapeHTML(state.composerMediaKind || 'text')}" />
            <datalist id="media-kind-options">
              <option value="text">Text Only</option>
              <option value="image">Photo / Image</option>
              <option value="video">Video Demo</option>
              <option value="circular">Circular PDF</option>
            </datalist>
            <input name="mediaSrc" placeholder="Media URL (Image / Video MP4 / Circular file)" value="" />
          </div>
        </div>

        <div class="composer-toolbar">
          <div class="composer-attachment-buttons">
            <button type="button" class="composer-attach-btn ${state.composerMediaKind === 'image' ? 'active' : ''}" data-action="set-composer-media" data-kind="image">📸 Photo</button>
            <button type="button" class="composer-attach-btn ${state.composerMediaKind === 'video' ? 'active' : ''}" data-action="set-composer-media" data-kind="video">🎬 Video Demo</button>
            <button type="button" class="composer-attach-btn ${state.composerMediaKind === 'circular' ? 'active' : ''}" data-action="set-composer-media" data-kind="circular">📎 Circular PDF</button>
          </div>
          <button class="composer-submit-btn" type="submit">Post to Feed 🚀</button>
        </div>
      </form>
    </section>`;

    const renderPostCard = (post) => {
      const reactions = post.reactions || { like: 0, love: 0, celebrate: 0, insightful: 0, support: 0, awesome: 0 };
      const totalReactions = Object.values(reactions).reduce((sum, n) => sum + Number(n || 0), 0);
      const comments = post.comments || [];
      const userReaction = post.userReaction;
      const isReactionPickerOpen = state.activeReactionPickerPostId === post.id;
      const roleSlug = lower(post.authorRole || 'STUDENT');
      const badgeClass = roleSlug.includes('admin') ? 'admin' : roleSlug.includes('teacher') ? 'teacher' : 'student';

      const isStudentAuthor = roleSlug === 'student';
      let studentGamificationPill = '';
      if (isStudentAuthor) {
        const studentObj = students().find((s) => fullName(s) === post.authorName) || currentStudent();
        const g = studentAcademicGamification(studentObj);
        studentGamificationPill = `<span class="community-author-level-pill ${g.pillClass}">${g.levelIcon} Lv.${g.level} ${g.tier !== 'standard' ? g.tier.toUpperCase() : ''}</span>`;
      }

      return `<article class="community-linkedin-card" id="post-${escapeHTML(post.id)}">
        <!-- Author Header -->
        <div class="post-card-header">
          <div class="post-author-block">
            ${post.authorAvatar ? `<img class="post-author-avatar" src="${escapeHTML(post.authorAvatar)}" alt="${escapeHTML(post.authorName)}" />` : `<div class="post-author-avatar">${escapeHTML((post.authorName || 'U')[0])}</div>`}
            <div class="post-author-meta">
              <b>${escapeHTML(post.authorName)} <span class="post-role-badge ${badgeClass}">${escapeHTML(roleLabels[post.authorRole] || post.authorRole)}</span> ${studentGamificationPill}</b>
              <span class="post-author-title">${escapeHTML(post.authorTitle || 'Meezan Kids School Campus 1')}</span>
              <div class="post-timestamp-row">
                <span>${escapeHTML(post.createdAt || 'Just now')}</span> • <span>🌐 ${escapeHTML(audienceLabel(post.audience || 'ALL'))}</span>
              </div>
            </div>
          </div>
          <div class="post-options-dropdown">
            <button class="post-options-btn" data-action="toggle-post-menu" data-post-id="${escapeHTML(post.id)}" title="Post options">•••</button>
          </div>
        </div>

        <!-- Headline & Text Body -->
        ${post.headline ? `<h4 class="post-headline">${escapeHTML(post.headline)}</h4>` : ''}
        <p class="post-message-body">${formatHashtags(post.message)}</p>

        <!-- Media Attachment -->
        ${renderPostMediaItem(post.media)}

        <!-- Engagement Metrics Counter -->
        <div class="post-engagement-bar">
          <div class="engagement-reactions-summary">
            <span class="reaction-icons-stack">👍❤️👏💡</span>
            <span>${totalReactions} reactions</span>
          </div>
          <div class="engagement-stats-right">
            <span>${comments.length} comments</span> • <span>${post.repostsCount || 0} reposts</span>
          </div>
        </div>

        <!-- 4-Action Toolbar with Floating Reaction Picker -->
        <div class="post-actions-toolbar">
          ${isReactionPickerOpen ? `<div class="linkedin-reaction-picker">
            <button type="button" class="reaction-emoji-btn" title="Like" data-action="react-post-emoji" data-post-id="${escapeHTML(post.id)}" data-emoji="like">👍</button>
            <button type="button" class="reaction-emoji-btn" title="Love" data-action="react-post-emoji" data-post-id="${escapeHTML(post.id)}" data-emoji="love">❤️</button>
            <button type="button" class="reaction-emoji-btn" title="Celebrate" data-action="react-post-emoji" data-post-id="${escapeHTML(post.id)}" data-emoji="celebrate">👏</button>
            <button type="button" class="reaction-emoji-btn" title="Insightful" data-action="react-post-emoji" data-post-id="${escapeHTML(post.id)}" data-emoji="insightful">💡</button>
            <button type="button" class="reaction-emoji-btn" title="Support" data-action="react-post-emoji" data-post-id="${escapeHTML(post.id)}" data-emoji="support">🎯</button>
            <button type="button" class="reaction-emoji-btn" title="Awesome" data-action="react-post-emoji" data-post-id="${escapeHTML(post.id)}" data-emoji="awesome">🔥</button>
          </div>` : ''}

          <button type="button" class="action-toolbar-btn ${userReaction ? `active-${userReaction}` : ''}" data-action="open-reaction-picker" data-post-id="${escapeHTML(post.id)}">
            ${userReaction ? reactionEmojiMap[userReaction] || '👍' : '👍'} <span>${userReaction ? userReaction[0].toUpperCase() + userReaction.slice(1) : 'Like'}</span>
          </button>
          <button type="button" class="action-toolbar-btn" data-action="focus-comment-input" data-post-id="${escapeHTML(post.id)}">
            💬 <span>Comment</span>
          </button>
          <button type="button" class="action-toolbar-btn" data-action="repost-community-post" data-post-id="${escapeHTML(post.id)}">
            🔄 <span>Repost</span>
          </button>
          <button type="button" class="action-toolbar-btn" data-action="share-community-post" data-post-id="${escapeHTML(post.id)}">
            📤 <span>Share</span>
          </button>
        </div>

        <!-- Threaded Comments & Nested Re-Comments (Replies) -->
        <div class="post-comments-container">
          <!-- Top Comment Input -->
          <form class="community-comment-form" data-post-id="${escapeHTML(post.id)}">
            <div class="comment-composer-inline">
              <div class="composer-avatar" style="width: 34px; height: 34px; font-size: 0.8rem;">${escapeHTML((user.name || user.firstName || 'U')[0])}</div>
              <div class="comment-input-wrap">
                <input name="commentText" placeholder="Add a comment on this post..." required />
              </div>
              <button type="submit" class="comment-send-btn">Post</button>
            </div>
          </form>

          <!-- List of Comments -->
          <div class="comments-list">
            ${comments.map((comment) => {
              const replies = comment.replies || [];
              const isReplying = state.replyingToCommentId === comment.id;
              const isStudentCommenter = lower(comment.authorRole || comment.role || '').includes('student');
              let commentGamiPill = '';
              if (isStudentCommenter) {
                const studentObj = students().find((s) => fullName(s) === comment.authorName) || currentStudent();
                const g = studentAcademicGamification(studentObj);
                commentGamiPill = `<span class="community-author-level-pill ${g.pillClass}">${g.levelIcon} Lv.${g.level}</span>`;
              }
              return `<div class="comment-thread-item" id="comment-${escapeHTML(comment.id)}">
                <div class="comment-main-row">
                  ${comment.authorAvatar ? `<img class="composer-avatar" style="width: 36px; height: 36px;" src="${escapeHTML(comment.authorAvatar)}" alt="${escapeHTML(comment.authorName)}" />` : `<div class="composer-avatar" style="width: 36px; height: 36px; font-size: 0.82rem;">${escapeHTML((comment.authorName || 'U')[0])}</div>`}
                  <div class="comment-bubble">
                    <div class="comment-bubble-head">
                      <div>
                        <span class="comment-author-name">${escapeHTML(comment.authorName)}</span>
                        ${commentGamiPill}
                        <span class="comment-author-role">• ${escapeHTML(comment.authorTitle || roleLabels[comment.authorRole] || comment.role || 'Staff')}</span>
                      </div>
                      <small style="color: #94a3b8; font-size: 0.7rem;">${escapeHTML(comment.createdAt || '')}</small>
                    </div>
                    <p class="comment-text">${escapeHTML(comment.text)}</p>
                  </div>
                </div>

                <!-- Comment Action Line: Like & Reply -->
                <div class="comment-actions-line">
                  <button type="button" class="comment-action-link ${comment.userLiked ? 'liked' : ''}" data-action="like-comment" data-post-id="${escapeHTML(post.id)}" data-comment-id="${escapeHTML(comment.id)}">
                    👍 Like (${comment.likes || 0})
                  </button>
                  •
                  <button type="button" class="comment-action-link" data-action="toggle-comment-reply-box" data-comment-id="${escapeHTML(comment.id)}">
                    ↩️ Reply
                  </button>
                </div>

                <!-- Threaded Nested Replies (Re-comments) -->
                ${(replies.length || isReplying) ? `<div class="comment-replies-indented">
                  ${replies.map((reply) => `<div class="comment-main-row">
                    ${reply.authorAvatar ? `<img class="composer-avatar" style="width: 30px; height: 30px;" src="${escapeHTML(reply.authorAvatar)}" alt="${escapeHTML(reply.authorName)}" />` : `<div class="composer-avatar" style="width: 30px; height: 30px; font-size: 0.74rem;">${escapeHTML((reply.authorName || 'U')[0])}</div>`}
                    <div class="comment-bubble" style="background: #f8fafc; border: 1px solid #e2e8f0;">
                      <div class="comment-bubble-head">
                        <div>
                          <span class="comment-author-name">${escapeHTML(reply.authorName)}</span>
                          <span class="comment-author-role">• ${escapeHTML(reply.authorTitle || roleLabels[reply.authorRole] || 'Member')}</span>
                        </div>
                        <small style="color: #94a3b8; font-size: 0.68rem;">${escapeHTML(reply.createdAt || '')}</small>
                      </div>
                      <p class="comment-text">${escapeHTML(reply.text)}</p>
                    </div>
                  </div>`).join('')}

                  <!-- Inline Nested Reply Input Box (when Reply is clicked) -->
                  ${isReplying ? `<form class="nested-reply-form" data-post-id="${escapeHTML(post.id)}" data-comment-id="${escapeHTML(comment.id)}">
                    <div class="nested-reply-box">
                      <div class="composer-avatar" style="width: 28px; height: 28px; font-size: 0.72rem;">${escapeHTML((user.name || user.firstName || 'U')[0])}</div>
                      <div class="comment-input-wrap" style="padding: 0.25rem 0.4rem 0.25rem 0.75rem;">
                        <input name="replyText" placeholder="Reply to ${escapeHTML(comment.authorName)}..." required />
                      </div>
                      <button type="submit" class="comment-send-btn" style="padding: 0.3rem 0.7rem; font-size: 0.72rem;">Reply</button>
                      <button type="button" class="comment-action-link" data-action="cancel-reply" style="font-size: 0.72rem;">Cancel</button>
                    </div>
                  </form>` : ''}
                </div>` : ''}
              </div>`;
            }).join('')}
          </div>
        </div>
      </article>`;
    };

    const spotlights = tenantCampusSpotlights();
    const currentSpotlightIdx = Math.abs(Number(state.activeSpotlightIndex || 0)) % spotlights.length;
    const currentSpotlight = spotlights[currentSpotlightIdx] || spotlights[0];
    const spotlightStudent = students().find((s) => s.id === currentSpotlight.id || fullName(s) === currentSpotlight.name) || currentStudent();
    const spotlightGami = studentAcademicGamification(spotlightStudent);
    const poll = tenantCampusPoll();
    const totalPollVotes = poll.totalVotes || 0;

    const searchBar = `<div class="community-search-header-bar">
      <span class="community-search-icon">🔍</span>
      <input type="text" class="community-search-input" id="community-search-box" placeholder="Search posts, official notices, hashtags (#ScienceFair), or staff names..." value="${escapeHTML(state.communitySearchQuery || '')}" />
      ${state.communitySearchQuery ? `<button type="button" class="community-search-clear-btn" data-action="clear-community-search" title="Clear search">✕</button>` : ''}
    </div>`;

    const pollCard = `<article class="community-linkedin-card" id="campus-poll-card" style="border-left: 4px solid #2563eb;">
      <div class="post-card-header">
        <div class="post-author-block">
          <div class="post-author-avatar" style="background: #2563eb; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 800;">📊</div>
          <div class="post-author-meta">
            <b>${escapeHTML(tenant()?.school?.name || 'School Operations')} <span class="post-role-badge admin">Campus Survey</span></b>
            <span class="post-author-title">Student & Faculty Council • Meezan Kids School</span>
            <div class="post-timestamp-row"><span>Active Poll</span> • <span>🌐 Campus-Wide</span></div>
          </div>
        </div>
      </div>
      <h4 class="post-headline" style="margin-top: 0.5rem;">${escapeHTML(poll.question)}</h4>
      <div class="community-poll-box">
        <div class="poll-options-list">
          ${poll.options.map((opt) => {
            const hasVoted = poll.userVotedOptionId === opt.id;
            const pct = totalPollVotes > 0 ? Math.round((Number(opt.votes || 0) / totalPollVotes) * 100) : 0;
            return `<div class="poll-option-row ${hasVoted ? 'voted' : ''}" data-action="vote-campus-poll" data-poll-id="${escapeHTML(poll.id)}" data-option-id="${escapeHTML(opt.id)}">
              <div class="poll-option-progress" style="width: ${pct}%;"></div>
              <div class="poll-option-content">
                <span>${hasVoted ? '✓ ' : ''}${escapeHTML(opt.text)}</span>
                <span>${pct}% (${opt.votes || 0})</span>
              </div>
            </div>`;
          }).join('')}
        </div>
        <div class="poll-meta-footer">
          <span>${totalPollVotes} votes total • Instant Results</span>
          <span>${poll.userVotedOptionId ? '★ You voted • Click to change' : 'Click any option to vote'}</span>
        </div>
      </div>
    </article>`;

    const sidebarWidgets = `<aside class="community-sidebar-widgets">
      <!-- Multi-Student Toppers & Spotlights Carousel -->
      <div class="community-widget-card spotlight-card-interactive">
        <div class="widget-title-row">
          <h3>🌟 Campus Spotlights</h3>
          <div class="spotlight-carousel-controls">
            <button type="button" class="spotlight-nav-btn" data-action="prev-spotlight" title="Previous topper">◀</button>
            <span class="spotlight-index-pill">${currentSpotlightIdx + 1} / ${spotlights.length}</span>
            <button type="button" class="spotlight-nav-btn" data-action="next-spotlight" title="Next topper">▶</button>
          </div>
        </div>

        <div class="spotlight-carousel-slide">
          <div class="spotlight-badge-tag">${escapeHTML(currentSpotlight.tag)}</div>
          <div class="widget-spotlight-box">
            <div class="avatar-gamified-wrapper">
              <span class="medal-halo-ring ${spotlightGami.haloClass}"></span>
              <img class="spotlight-avatar" src="${escapeHTML(currentSpotlight.avatar)}" alt="${escapeHTML(currentSpotlight.name)}" />
              <span class="avatar-level-tag ${spotlightGami.tagClass}">
                ${spotlightGami.levelIcon} Lv.${spotlightGami.level} ${spotlightGami.tier !== 'standard' ? spotlightGami.tier.toUpperCase() : ''}
              </span>
            </div>
            <div class="spotlight-info">
              <b class="spotlight-name">${escapeHTML(currentSpotlight.name)}</b>
              <span class="spotlight-badge-label">${escapeHTML(currentSpotlight.badge)}</span>
              <small class="spotlight-class">${escapeHTML(currentSpotlight.class)} • ${escapeHTML(currentSpotlight.score)}</small>
              <p class="spotlight-desc">${escapeHTML(currentSpotlight.achievement)}</p>
              <div class="spotlight-school-tag">🏫 ${escapeHTML(currentSpotlight.school)}</div>
            </div>
          </div>
          <div class="spotlight-actions-row">
            <button type="button" class="btn btn-secondary" data-action="open-student" data-id="${escapeHTML(currentSpotlight.id)}">
              👤 View Student Profile
            </button>
          </div>
        </div>

        <div class="spotlight-dots-row">
          ${spotlights.map((s, idx) => `
            <button type="button" class="spotlight-dot ${idx === currentSpotlightIdx ? 'active' : ''}" data-action="set-spotlight-index" data-index="${idx}" title="${escapeHTML(s.name)} (${escapeHTML(s.tag)})"></button>
          `).join('')}
        </div>
      </div>

      <!-- Pinned Notice Board -->
      <div class="community-widget-card">
        <div class="widget-title-row">
          <h3>📌 Official Notice Board</h3>
          <span style="font-size: 0.7rem; color: #2563eb; font-weight: 700;">Live Feed</span>
        </div>
        <div class="widget-notice-list">
          <div class="widget-notice-item">
            <span class="widget-notice-pin">📢</span>
            <div class="widget-notice-content">
              <b>CBSE Practical Exam Schedule Released</b>
              <small>Published 4h ago • Mandatory for Grades 10 & 12</small>
            </div>
          </div>
          <div class="widget-notice-item">
            <span class="widget-notice-pin">🏆</span>
            <div class="widget-notice-content">
              <b>Science & AI Innovation Expo this Friday</b>
              <small>Main Auditorium • 10:00 AM onwards</small>
            </div>
          </div>
          <div class="widget-notice-item">
            <span class="widget-notice-pin">🗓️</span>
            <div class="widget-notice-content">
              <b>Parent-Teacher Meeting Slots Open</b>
              <small>Academic Term 1 Evaluation Review</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Trending Hashtags -->
      <div class="community-widget-card">
        <div class="widget-title-row">
          <h3>🏷️ Trending Topics</h3>
        </div>
        <div class="widget-hashtags-cloud">
          <a class="widget-hashtag-chip" data-action="filter-hashtag" data-tag="ScienceFair">#ScienceFair</a>
          <a class="widget-hashtag-chip" data-action="filter-hashtag" data-tag="AIInEducation">#AIInEducation</a>
          <a class="widget-hashtag-chip" data-action="filter-hashtag" data-tag="CBSEExams">#CBSEExams</a>
          <a class="widget-hashtag-chip" data-action="filter-hashtag" data-tag="TeacherAppreciation">#TeacherAppreciation</a>
          <a class="widget-hashtag-chip" data-action="filter-hashtag" data-tag="RoboticsClub">#RoboticsClub</a>
          <a class="widget-hashtag-chip" data-action="filter-hashtag" data-tag="SchoolPulse">#SchoolPulse</a>
        </div>
      </div>
    </aside>`;

    return `<div class="community-page">
      ${sectionHead('Campus Network', 'School Community Feed', 'LinkedIn-style school social hub. Share updates, watch video demos, react with emojis, and join threaded discussions.', badge('🌐 Active Network', 'success'))}
      ${filterTabs}
      ${searchBar}
      <div class="community-linkedin-wrapper">
        <main class="community-main-feed">
          ${composerCard}
          ${pollCard}
          ${posts.length ? posts.map(renderPostCard).join('') : `<article class="community-linkedin-card" style="text-align: center; padding: 2.5rem 1rem;"><div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div><h4>No posts found matching your search.</h4><p class="muted">Try clearing the search or switching filter tabs.</p><button class="btn btn-secondary" data-action="clear-community-search" style="margin-top: 0.75rem;">Clear search filter</button></article>`}
        </main>
        ${sidebarWidgets}
      </div>
    </div>`;
  }
  function renderCalendar() {
    return `${sectionHead('School operations', 'Calendar', 'Holidays, exams, assignments, events and academic deadlines in one place.')}<section class="dashboard-grid dashboard-bottom-grid"><article class="card"><div class="card-heading"><div><h3>This week</h3><p>Key school events</p></div></div><div class="activity-log">${['Thu 13 Aug · Class 8 Unit Test review meeting', 'Fri 14 Aug · Independence Day rehearsal', 'Sat 15 Aug · Public holiday', 'Mon 17 Aug · Assignment deadline · Grade 7A Science'].map((item) => `<div><span class="activity-dot"></span><span><b>${item}</b></span></div>`).join('')}</div></article><article class="card"><div class="card-heading"><div><h3>Upcoming exams</h3><p>Operational readiness checkpoints</p></div></div><div class="exam-stack">${['Unit Test 2 · Grade 8', 'Quarterly · Grade 9', 'Half-Yearly planning · Grades 6–10'].map((name, index) => `<div class="exam-row"><time><b>${[18, 22, 30][index]}</b><span>AUG</span></time><span><b>${name}</b><small>${['Marks submission starts in 2 days', 'Schedule locked', 'Configuration pending'][index]}</small></span></div>`).join('')}</div></article></section>`;
  }
  function renderAnalytics() {
    const classRows = classAttendanceRows();
    const subjectRows = subjectHealthRows();
    return `${sectionHead('Insights', 'Analytics', 'Attendance, academics and operational trends.', '')}<section class="dashboard-grid dashboard-bottom-grid">${chart('Attendance trend', [91.1, 92.4, 91.8, 93.3, 92.6, 93.1, dashboardMetrics().attendance], '#1768e5')}${chart('Academic trend', [73.4, 74.1, 75.8, 75.2, 76.8, 77.4, dashboardMetrics().academic], '#7559d9')}</section><section class="card"><div class="card-heading"><div><h3>Class comparison</h3><p>Attendance and academic health by class</p></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Class</th><th>Attendance</th><th>Academic average</th><th>Students</th><th></th></tr></thead><tbody>${classRows.map((row) => `<tr><td><b>Class ${row.grade}</b></td><td>${row.attendance}%</td><td>${row.academic}%</td><td>${row.students}</td><td><button class="text-button" data-action="open-class" data-grade="${row.grade}" data-section="A" data-subject="Mathematics">View class</button></td></tr>`).join('')}</tbody></table></div></section><section class="card"><div class="card-heading"><div><h3>Subject health</h3><p>Average, pass rate and trend</p></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Subject</th><th>Average</th><th>Pass rate</th><th>Trend</th><th>Coverage</th></tr></thead><tbody>${subjectRows.map((row) => `<tr><td><b>${escapeHTML(row.subject)}</b></td><td>${row.avg}%</td><td>${row.passRate}%</td><td>${badge(`${row.change > 0 ? '+' : ''}${row.change.toFixed(1)}%`, row.change < 0 ? 'warning' : 'success')}</td><td>${escapeHTML(row.coverage)} · ${row.teachersCount} teachers</td></tr>`).join('')}</tbody></table></div></section>`;
  }
  function renderNotifications() {
    const systemItems = recentSchoolActivity().map((item) => ({ time: item.time, category: item.category, text: item.text }));
    const communityItems = communityNotificationItems(8).map((item) => ({ time: item.time, category: 'Community', text: item.text }));
    const allItems = [...communityItems, ...systemItems].slice(0, 12);
    return `${sectionHead('Updates', 'Notifications', 'Role-aware updates from operations and community posts.', '')}<section class="card activity-log">${allItems.map((item) => `<div><span class="activity-dot"></span><span><b>${escapeHTML(item.time)}</b><small>${escapeHTML(item.category)}</small><p>${escapeHTML(item.text)}</p></span></div>`).join('')}</section>`;
  }
  function renderAuditLogs() {
    return `${sectionHead('Governance', 'Audit logs', 'Track important administrative and academic actions.', '')}<section class="card"><div class="table-wrap"><table class="data-table"><thead><tr><th>Time</th><th>User</th><th>Action</th><th>Entity</th><th>Details</th></tr></thead><tbody>${[
      ['10:48 AM', 'Farah Ahmed', 'attendance.edit', 'Class 8B', 'Updated 2 attendance entries'],
      ['10:32 AM', 'Rahman Khan', 'marks.submit', 'Class 9A Physics', 'Submitted marks sheet'],
      ['09:55 AM', 'Farah Ahmed', 'exam.update', 'Half-Yearly', 'Updated date and publication state'],
      ['09:31 AM', 'Admissions Desk', 'student.enroll', 'Ahmed Khan', 'Enrolled into Class 6A']
    ].map((row) => `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${badge(row[2], 'info')}</td><td>${row[3]}</td><td>${row[4]}</td></tr>`).join('')}</tbody></table></div></section>`;
  }
  function renderAiraManagement() {
    const ops = managementOpsSummary();
    return `${sectionHead('Erum AI', 'Management Erum AI', 'Ask school-level operational and academic questions in a permission-aware way.', '')}<section class="dashboard-grid dashboard-bottom-grid"><article class="card"><div class="card-heading"><div><h3>Suggested prompts</h3><p>Management-ready intelligence prompts</p></div></div><div class="aira-suggestions">${[
      'What requires attention today?',
      'Which students have attendance below 75%?',
      'Which class has the lowest attendance?',
      'Which teachers still need to submit marks?',
      'Give me today\'s school summary.'
    ].map((prompt) => `<button data-action="aira-prompt" data-prompt="${escapeHTML(prompt)}">${escapeHTML(prompt)}</button>`).join('')}</div></article><article class="card"><div class="card-heading"><div><h3>Daily brief</h3><p>Validated structured summary</p></div></div><div class="activity-log"><div><span class="activity-dot"></span><span><b>Student attendance today: ${ops.students.attendanceToday.toFixed(1)}%</b><small>${ops.students.present} present · ${ops.students.absent} absent · ${ops.students.late} late · ${ops.students.leave} leave</small></span></div><div><span class="activity-dot"></span><span><b>Teacher attendance today: ${ops.teachers.attendanceToday.toFixed(1)}%</b><small>${ops.teachers.absent} absent · ${ops.classes.substituteRequired} substitute required</small></span></div><div><span class="activity-dot"></span><span><b>Pending marks: ${ops.pendingMarks}</b><small>Review assessments for pending submission</small></span></div><div><span class="activity-dot"></span><span><b>Overdue tasks: ${ops.overdueTasks}</b><small>Follow up with assigned staff</small></span></div></div></article></section>`;
  }
  function renderSettings() {
    return `${sectionHead('School settings', 'School settings', 'Manage the operational foundation of your school.')}<section class="settings-grid"><button data-action="open-school-profile"><span>${icon('settings')}</span><div><b>School profile</b><p>Name, branding, address and contact details.</p></div>${icon('arrow')}</button><button data-action="nav" data-page="academic-years"><span>${icon('calendar')}</span><div><b>Academic settings</b><p>Academic years, grades, sections and subjects.</p></div>${icon('arrow')}</button><button data-action="open-users"><span>${icon('people')}</span><div><b>Users & roles</b><p>Role-based access for every school user.</p></div>${icon('arrow')}</button><button data-action="open-audit"><span>${icon('task')}</span><div><b>Audit logs</b><p>Review important school operations.</p></div>${icon('arrow')}</button><button data-action="open-subscription"><span>${icon('chart')}</span><div><b>Subscription</b><p>Workspace plan and billing details.</p></div>${icon('arrow')}</button><button data-action="open-security"><span>${icon('check')}</span><div><b>Security</b><p>Authentication, sessions and data controls.</p></div>${icon('arrow')}</button></section>`;
  }
  function renderMyClasses() {
    const teacher = state.role === 'TEACHER' ? currentTeacher() : null;
    const student = state.role === 'STUDENT' ? currentStudent() : null;
    if (state.role === 'STUDENT') return `${sectionHead('My learning', 'My classes', `${displayGrade(student)} · ${tenant()?.academicYear || '2026–27'}`)}<section class="class-chip-grid large-chips">${(getArray(student, 'subjects').length ? getArray(student, 'subjects') : ['Mathematics','Science','English','Social Science']).map((subject, index) => `<button class="class-chip" data-action="open-class" data-grade="${studentGrade(student)}" data-section="${student.section}" data-subject="${escapeHTML(typeof subject === 'string' ? subject : subject.name)}"><span>Grade ${escapeHTML(studentGrade(student))}${escapeHTML(student.section || 'A')}</span><b>${escapeHTML(typeof subject === 'string' ? subject : subject.name)}</b><small>${['Ms. Priya Sharma','Mr. Arjun Rao','Ms. Ayesha Khan','Mr. Naveen Kumar'][index]}</small></button>`).join('')}</section>`;
    const classes = teacherAssignments(teacher);
    return `${sectionHead('Teaching', 'My classes', `${classes.length} active teaching assignments this academic year.`)}<section class="class-chip-grid large-chips">${classes.map((entry) => `<button class="class-chip" data-action="open-class" data-grade="${entry.grade}" data-section="${entry.section}" data-subject="${escapeHTML(entry.subject)}"><span>Grade ${escapeHTML(entry.grade)}${escapeHTML(entry.section)}</span><b>${escapeHTML(entry.subject)}</b><small>${entry.students || countStudentsFor(entry.grade, entry.section)} students · ${94 - Math.floor(Math.random() * 3)}% attendance</small></button>`).join('')}</section>`;
  }
  function renderClassView() {
    const scope = state.classScope || { grade: '8', section: 'A', subject: 'Mathematics' };
    const list = students().filter((student) => studentGrade(student) === String(scope.grade) && student.section === scope.section).slice(0, 42);
    const avg = list.length ? list.reduce((sum, student) => sum + studentAverage(student), 0) / list.length : 81;
    return `<div class="class-view"><button class="back-button" data-action="close-class">← Back to my classes</button>${sectionHead('Class workspace', `Grade ${scope.grade}${scope.section} — ${scope.subject}`, `${list.length || 42} students · Academic Year ${tenant()?.academicYear || '2026–27'}`, state.role === 'TEACHER' ? button(`${icon('check')} Take attendance`, 'open-take-attendance', 'primary') : '')}<section class="metric-grid profile-metrics">${metric('Students', list.length || 42, 'Currently enrolled', 'blue', 'people')}${metric('Average attendance', `${(list.length ? list.reduce((sum, student) => sum + studentAttendance(student), 0) / list.length : 94).toFixed(1)}%`, 'Academic year to date', 'green', 'check')}${metric('Class average', `${avg.toFixed(1)}%`, 'Latest published results', 'purple', 'chart')}${metric('Assignments', '24 complete', '8 pending · 3 late', 'amber', 'task')}</section><section class="dashboard-grid dashboard-bottom-grid"><article class="card"><div class="card-heading"><div><h3>Students</h3><p>Click to see permitted academic details.</p></div><label class="compact-search">${icon('search')}<input placeholder="Search students" /></label></div><div class="people-list">${list.map((student) => `<button class="person-row" data-action="open-student" data-id="${escapeHTML(student.id)}">${avatar(student)}<span><b>${escapeHTML(fullName(student))}</b><small>Roll no. ${escapeHTML(student.rollNumber || '—')}</small></span><span class="person-stat"><b>${decimal(studentAverage(student))}</b><small>average</small></span>${icon('arrow')}</button>`).join('')}</div></article><article class="card"><div class="card-heading"><div><h3>Upcoming assessment</h3><p>Next assessment for this class</p></div></div><div class="assessment-focus"><span class="assessment-date"><b>18</b><small>AUG</small></span><div><b>${escapeHTML(assessments()[0]?.name || `${scope.subject} Unit Test`)}</b><p>${scope.subject} · Unit Test · 30 marks</p>${badge('Scheduled')}</div></div><button class="btn btn-secondary btn-full" data-action="nav" data-page="assessments">Manage assessment</button><hr/><h4>Class signal</h4><p class="muted">${scope.grade === '8' && scope.section === 'C' ? 'Attendance has declined this month. Consider checking in with students.' : 'Class attendance and performance are progressing steadily.'}</p></article></section></div>`;
  }
  function renderAIExamStudio() {
    const activeExamLevel = state.aiExamLevel || 'MID_TERM';
    const activeSubject = state.aiExamSubject || 'Mathematics';
    const activeGrade = state.aiExamGrade || '8';
    const totalMarks = state.aiExamTotalMarks || 50;

    return `
      ${sectionHead(
        'Teacher AI Assessment Studio', 
        '📝 Dynamic AI Exam Paper & Question Bank Generator', 
        'Paste lesson text, set section difficulty levels, generate objective & descriptive question papers, and publish to Student Dashboards.',
        button(`${icon('sparkle')} Generate Exam Paper`, 'trigger-ai-exam-gen', 'primary')
      )}

      <!-- 1. EXAM LEVEL & SUBJECT CONFIGURATION CARD -->
      <div class="card" style="margin-bottom:1.5rem; background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:1.25rem; box-shadow:0 6px 20px rgba(15,23,42,0.06);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; border-bottom:1px solid #f1f5f9; padding-bottom:1rem; margin-bottom:1rem;">
          <div>
            <span style="background:#e0e7ff; color:#3730a3; padding:0.25rem 0.65rem; border-radius:12px; font-size:0.75rem; font-weight:700;">⚙️ STEP 1: ASSESSMENT LEVEL & SUBJECT SELECTION</span>
            <h3 style="margin:0.3rem 0 0.1rem 0; font-size:1.15rem; color:#0f172a;">Select Exam Difficulty Level & Scope</h3>
            <p style="color:#64748b; font-size:0.82rem; margin:0;">Choose the assessment level. Question difficulty and question counts adapt dynamically.</p>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            ${[['UNIT_TEST', '📝 Unit Test (25 Marks)'], ['MID_TERM', '🏆 Mid-Term Exam (50 Marks)'], ['FINAL', '🎓 Final Board Exam (80 Marks)']].map(([lvl, label]) => `
              <button class="btn ${activeExamLevel === lvl ? 'btn-primary' : 'btn-secondary'}" style="font-size:0.8rem; padding:0.45rem 0.85rem;" data-action="set-ai-exam-level" data-level="${lvl}">
                ${label}
              </button>
            `).join('')}
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem;">
          <label style="font-weight:700; font-size:0.84rem; color:#1e293b;">
            Subject
            <select data-action="change-ai-exam-subject" style="margin-top:0.35rem; width:100%; min-height:42px; border-radius:10px; border:1px solid #cbd5e1; padding:0.5rem 0.75rem; font-size:0.88rem; background:#ffffff;">
              ${['Mathematics', 'Science', 'English Language', 'Social Science', 'Environmental Studies'].map(sub => `<option value="${sub}" ${sub === activeSubject ? 'selected' : ''}>${sub}</option>`).join('')}
            </select>
          </label>

          <label style="font-weight:700; font-size:0.84rem; color:#1e293b;">
            Grade Level
            <select data-action="change-ai-exam-grade" style="margin-top:0.35rem; width:100%; min-height:42px; border-radius:10px; border:1px solid #cbd5e1; padding:0.5rem 0.75rem; font-size:0.88rem; background:#ffffff;">
              ${[6, 7, 8, 9, 10].map(g => `<option value="${g}" ${String(g) === activeGrade ? 'selected' : ''}>Grade ${g}</option>`).join('')}
            </select>
          </label>

          <label style="font-weight:700; font-size:0.84rem; color:#1e293b;">
            Difficulty Weightage Ratio
            <select style="margin-top:0.35rem; width:100%; min-height:42px; border-radius:10px; border:1px solid #cbd5e1; padding:0.5rem 0.75rem; font-size:0.88rem; background:#ffffff;">
              <option>Balanced (30% Easy, 50% Medium, 20% Hard)</option>
              <option>Challenging (20% Easy, 40% Medium, 40% Hard)</option>
              <option>Foundational (50% Easy, 40% Medium, 10% Hard)</option>
            </select>
          </label>
        </div>
      </div>

      <!-- 2. RAW LESSON CONTENT / SYLLABUS PASTE CARD -->
      <div class="card" style="margin-bottom:1.5rem; background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:1.25rem; box-shadow:0 6px 20px rgba(15,23,42,0.06);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <div>
            <span style="background:#fef3c7; color:#92400e; padding:0.25rem 0.65rem; border-radius:12px; font-size:0.75rem; font-weight:700;">📖 STEP 2: LESSON / SYLLABUS TEXT CHUNK PASTE</span>
            <h3 style="margin:0.2rem 0 0 0; font-size:1.1rem; color:#0f172a;">Paste Textbook Chapter / Lesson Notes</h3>
          </div>
          <button class="btn btn-secondary" data-action="load-sample-lesson-text" style="font-size:0.78rem; padding:0.35rem 0.75rem;">📋 Load Sample Lesson Chunk</button>
        </div>

        <textarea id="ai-lesson-text-input" placeholder="Paste entire textbook chapter or lesson notes here (e.g. Photosynthesis, Quadratic Equations, Indus Valley Civilization)... AI will analyze key concepts and generate section-wise questions automatically." style="width:100%; min-height:130px; border-radius:12px; border:1px solid #cbd5e1; padding:0.85rem; font-size:0.86rem; font-family:Inter,sans-serif; line-height:1.5; resize:vertical; background:#f8fafc;">${escapeHTML(state.aiLessonTextSample || 'Chapter 4: Quadratic Equations. Standard form ax^2 + bx + c = 0 where a ≠ 0. The roots of quadratic equation can be found using factorization method or discriminant formula x = (-b ± √(b^2 - 4ac)) / (2a). Discriminant D = b^2 - 4ac dictates root nature: if D > 0 two distinct real roots exist; if D = 0 equal real roots exist.')}</textarea>
      </div>

      <!-- 3. GENERATED DYNAMIC QUESTION PAPER PREVIEW CARD -->
      <div class="card" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:1.25rem; box-shadow:0 6px 20px rgba(15,23,42,0.06);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; border-bottom:2px double #0f172a; padding-bottom:0.85rem; margin-bottom:1.2rem;">
          <div>
            <span style="background:#dcfce7; color:#166534; padding:0.25rem 0.65rem; border-radius:12px; font-size:0.75rem; font-weight:700;">📑 LIVE EXAM PAPER & OFFICIAL FORMAT PREVIEW</span>
            <h2 style="margin:0.3rem 0 0 0; font-size:1.25rem; color:#0f172a; text-transform:uppercase;">${escapeHTML(tenant()?.school?.name || 'Meezan Kids School')}</h2>
            <p style="margin:0.15rem 0 0 0; font-size:0.82rem; font-weight:700; color:#475569;">${activeExamLevel.replace('_',' ')} EXAMINATION (2026–2027) • ${escapeHTML(activeSubject).toUpperCase()}</p>
          </div>
          <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
            <button class="btn btn-secondary" data-action="generate-exam-pdf" style="font-size:0.82rem; padding:0.5rem 0.9rem;">🖨️ Export PDF (Front & Back)</button>
            <button class="btn btn-primary" data-action="publish-exam-to-students" style="font-size:0.82rem; padding:0.5rem 1rem; background:#16a34a; border-color:#16a34a; font-weight:700;">🚀 Publish to Student Dashboards</button>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:0.82rem; font-weight:700; background:#f8fafc; padding:0.6rem 0.9rem; border-radius:8px; margin-bottom:1.2rem; border:1px solid #e2e8f0;">
          <span>GRADE: ${activeGrade} (SECTION A & B)</span>
          <span>TIME ALLOWED: ${activeExamLevel === 'UNIT_TEST' ? '45 MINS' : activeExamLevel === 'MID_TERM' ? '1.5 HOURS' : '3.0 HOURS'}</span>
          <span>MAXIMUM MARKS: ${activeExamLevel === 'UNIT_TEST' ? 25 : activeExamLevel === 'MID_TERM' ? 50 : 80}</span>
        </div>

        <!-- SECTION A: OBJECTIVE TYPE QUESTIONS -->
        <div style="margin-bottom:1.5rem; background:#fafafa; border:1px solid #e2e8f0; border-radius:12px; padding:1rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #cbd5e1; padding-bottom:0.5rem; margin-bottom:0.75rem;">
            <b style="color:#0f172a; font-size:0.9rem;">SECTION A: OBJECTIVE TYPE QUESTIONS (MCQs, Fill-Blanks & True/False)</b>
            <span style="font-size:0.8rem; font-weight:700; color:#2563eb;">[15 Marks]</span>
          </div>
          <ol style="margin:0 0 0 1.2rem; padding:0; font-size:0.86rem; line-height:1.6; color:#334155;">
            <li style="margin-bottom:0.75rem;">
              What is the discriminant formula for quadratic equation <i>ax² + bx + c = 0</i>? <span style="color:#64748b; font-size:0.78rem;">[Easy • 2 Marks]</span><br>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.3rem; margin-top:0.25rem; font-weight:600; color:#475569;">
                <span>(A) D = b² - 4ac</span>
                <span>(B) D = b² + 4ac</span>
                <span>(C) D = 2a / (-b)</span>
                <span>(D) D = a² + b²</span>
              </div>
            </li>
            <li style="margin-bottom:0.75rem;">
              If discriminant D = 0, the nature of the roots is: <span style="color:#64748b; font-size:0.78rem;">[Easy • 2 Marks]</span><br>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.3rem; margin-top:0.25rem; font-weight:600; color:#475569;">
                <span>(A) Real & Distinct</span>
                <span>(B) Real & Equal</span>
                <span>(C) No Real Roots</span>
                <span>(D) Imaginary</span>
              </div>
            </li>
            <li style="margin-bottom:0.75rem;">
              The roots of equation <i>x² - 9 = 0</i> are: <span style="color:#64748b; font-size:0.78rem;">[Medium • 2 Marks]</span><br>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.3rem; margin-top:0.25rem; font-weight:600; color:#475569;">
                <span>(A) ± 3</span>
                <span>(B) ± 9</span>
                <span>(C) +3 only</span>
                <span>(D) 0 and 9</span>
              </div>
            </li>
            <li style="margin-bottom:0.75rem;">
              <b>Fill in the Blank:</b> Standard form of a quadratic equation is ________________________ where a ≠ 0. <span style="color:#64748b; font-size:0.78rem;">[Easy • 2 Marks]</span>
            </li>
            <li style="margin-bottom:0.75rem;">
              <b>Fill in the Blank:</b> The sum of roots of <i>ax² + bx + c = 0</i> is equal to ________________________. <span style="color:#64748b; font-size:0.78rem;">[Medium • 2 Marks]</span>
            </li>
            <li style="margin-bottom:0.4rem;">
              <b>True or False:</b> A quadratic equation can have at most three distinct real roots. <span style="color:#64748b; font-size:0.78rem;">[Easy • 5 Marks total section]</span>
            </li>
          </ol>
        </div>

        <!-- SECTION B: SHORT DESCRIPTIVE QUESTIONS -->
        <div style="margin-bottom:1.5rem; background:#fafafa; border:1px solid #e2e8f0; border-radius:12px; padding:1rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #cbd5e1; padding-bottom:0.5rem; margin-bottom:0.75rem;">
            <b style="color:#0f172a; font-size:0.9rem;">SECTION B: SHORT ANSWER & CONCEPTUAL NUMERICALS</b>
            <span style="font-size:0.8rem; font-weight:700; color:#2563eb;">[15 Marks]</span>
          </div>
          <ol start="7" style="margin:0 0 0 1.2rem; padding:0; font-size:0.86rem; line-height:1.6; color:#334155;">
            <li style="margin-bottom:0.75rem;">
              Find the discriminant of equation <b>3x² - 5x + 2 = 0</b> and state the nature of its roots. <span style="color:#64748b; font-size:0.78rem;">[Medium • 5 Marks]</span>
            </li>
            <li style="margin-bottom:0.75rem;">
              Solve for x by factorisation method: <b>x² - 7x + 12 = 0</b>. <span style="color:#64748b; font-size:0.78rem;">[Medium • 5 Marks]</span>
            </li>
            <li style="margin-bottom:0.4rem;">
              Find the value of <i>k</i> for which quadratic equation <b>2x² + kx + 3 = 0</b> has two equal real roots. <span style="color:#64748b; font-size:0.78rem;">[Hard • 5 Marks]</span>
            </li>
          </ol>
        </div>

        <!-- SECTION C: LONG DESCRIPTIVE & HOTS PROBLEMS -->
        <div style="margin-bottom:1.5rem; background:#fafafa; border:1px solid #e2e8f0; border-radius:12px; padding:1rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #cbd5e1; padding-bottom:0.5rem; margin-bottom:0.75rem;">
            <b style="color:#0f172a; font-size:0.9rem;">SECTION C: LONG DESCRIPTIVE & HIGH ORDER THINKING SKILLS (HOTS)</b>
            <span style="font-size:0.8rem; font-weight:700; color:#2563eb;">[20 Marks]</span>
          </div>
          <ol start="10" style="margin:0 0 0 1.2rem; padding:0; font-size:0.86rem; line-height:1.6; color:#334155;">
            <li style="margin-bottom:0.75rem;">
              Derive the quadratic formula starting from standard equation <i>ax² + bx + c = 0</i> by completing the square method. <span style="color:#64748b; font-size:0.78rem;">[Hard / HOTS • 10 Marks]</span>
            </li>
            <li style="margin-bottom:0.4rem;">
              <b>Real-World Application Word Problem:</b> The altitude of a right triangle is 7 cm less than its base. If the hypotenuse is 13 cm, find the lengths of the other two sides. Set up quadratic equation and solve. <span style="color:#64748b; font-size:0.78rem;">[Hard / HOTS • 10 Marks]</span>
            </li>
          </ol>
        </div>

        <!-- CONFIDENTIAL TEACHER ANSWER KEY -->
        <div style="background:#f0fdf4; border:1px dashed #16a34a; border-radius:12px; padding:0.85rem;">
          <b style="color:#15803d; font-size:0.85rem;">🔑 CONFIDENTIAL TEACHER ANSWER KEY & MARKING SCHEME (FULL 50 MARKS):</b>
          <div style="font-size:0.8rem; color:#166534; margin-top:0.35rem; line-height:1.65;">
            • <b>Q1:</b> (A) D = b² - 4ac [2M]<br>
            • <b>Q2:</b> (B) Real & Equal roots [2M]<br>
            • <b>Q3:</b> (A) ± 3 [2M]<br>
            • <b>Q4:</b> ax² + bx + c = 0 [2M]<br>
            • <b>Q5:</b> -b/a [2M]<br>
            • <b>Q6:</b> False (at most 2 real roots) [5M]<br>
            • <b>Q7 Solution:</b> D = (-5)² - 4(3)(2) = 25 - 24 = 1 &gt; 0 &rarr; <b>Real & Distinct Roots</b> [5M]<br>
            • <b>Q8 Solution:</b> (x - 3)(x - 4) = 0 &rarr; <b>x = 3 or x = 4</b> [5M]<br>
            • <b>Q9 Solution:</b> D = k² - 4(2)(3) = 0 &rarr; k² = 24 &rarr; <b>k = ± 2√6</b> [5M]<br>
            • <b>Q10 Solution:</b> Full derivation steps leading to x = (-b ± √(b²-4ac))/(2a) [10M]<br>
            • <b>Q11 Solution:</b> Base = x, Altitude = x-7. x² + (x-7)² = 13² &rarr; 2x² - 14x - 120 = 0 &rarr; x² - 7x - 60 = 0 &rarr; (x-12)(x+5) = 0 &rarr; <b>Base = 12 cm, Altitude = 5 cm</b> [10M]
          </div>
        </div>
      </div>
    `;
  }

  function renderStudentResults() { return renderStudentProfileContent(currentStudent(), 'assessments'); }
  function renderStudentPerformance() { return renderStudentProfileContent(currentStudent(), 'performance'); }
  function renderStudentHistory() { return renderStudentProfileContent(currentStudent(), 'history'); }
  function renderAchievements() { return `${sectionHead('My learning', 'Achievements', 'Recognition and milestones from your school journey.')}<section class="achievement-grid"><article><span>✦</span><b>Consistent learner</b><p>Maintained 90%+ assignment completion this term.</p></article><article><span>✓</span><b>Attendance champion</b><p>Attended 20 consecutive school days.</p></article><article><span>⌁</span><b>Science explorer</b><p>Recognised for your project work in Science.</p></article></section>`; }
  function renderLessonPlans() { 
    return `${sectionHead('Teaching & learning', 'Lesson plans & AI Question Paper Generator', 'Prepare classroom plans, generate exam papers with answer sheets, and export printable PDFs.', button(`${icon('plus')} Create lesson plan`, 'open-lesson-plan', 'primary'))}
    
    <div class="card" style="margin-bottom:1.5rem; background:linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); color:#ffffff; padding:1.25rem; border-radius:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
        <div>
          <span style="background:rgba(255,255,255,0.2); color:#ffffff; padding:0.25rem 0.65rem; border-radius:12px; font-size:0.75rem; font-weight:700;">📝 1-CLICK EXAM PAPER GENERATOR</span>
          <h3 style="color:#ffffff; margin:0.4rem 0 0.2rem 0; font-size:1.2rem;">Generate Printable Question Paper & Answer Sheet</h3>
          <p style="color:#c7d2fe; font-size:0.84rem; margin:0;">Create board-ready MCQs, Fill-in-blanks, and Short Answer papers formatted with official school header.</p>
        </div>
        <button class="btn" data-action="generate-exam-pdf" style="background:#22c55e; color:#ffffff; border:none; padding:0.6rem 1.1rem; border-radius:10px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:0.4rem;">
          🖨️ Export Exam Paper (PDF)
        </button>
      </div>
    </div>

    <section class="lesson-plan-grid">${['Fractions and decimals','Algebraic expressions','Linear equations','Data handling','Revision and practice'].map((title, index) => `<article><div><span class="lesson-number">${index + 1}</span>${badge(index < 3 ? 'Ready' : 'Draft', index < 3 ? 'success' : 'warning')}</div><h3>${title}</h3><p>Grade ${index < 3 ? 8 : 7} · Mathematics · ${['14 Aug','18 Aug','20 Aug','22 Aug','25 Aug'][index]}</p><div><span>45 minutes</span><button class="text-button" data-action="generate-exam-pdf">🖨️ Print Exam Paper</button></div></article>`).join('')}</section>`; 
  }

  function renderSchoolInquiries() {
    const list = state.schoolInquiries || [];
    const filter = state.inquiryFilter || 'all';
    const filtered = list.filter((item) => {
      if (filter === 'demo') return item.type === 'DEMO_REQUEST';
      if (filter === 'inquiry') return item.type === 'GENERAL_INQUIRY';
      if (filter === 'new') return item.status === 'NEW_LEAD';
      return true;
    });

    const totalCount = list.length;
    const demoCount = list.filter((i) => i.type === 'DEMO_REQUEST').length;
    const newCount = list.filter((i) => i.status === 'NEW_LEAD').length;
    const convertedCount = list.filter((i) => i.status === 'CONVERTED' || i.status === 'DEMO_SCHEDULED').length;

    return `<div class="inquiries-view">
      ${sectionHead('Institutional CRM', 'Inbound Inquiries & Demo Leads', 'Manage prospective school requests, schedule product demos, and follow up with school leadership.')}
      
      <section class="inquiries-kpi-row">
        <div class="inquiry-kpi-card">
          <small>Total Inquiries</small>
          <strong>${totalCount}</strong>
        </div>
        <div class="inquiry-kpi-card">
          <small>Demo Requests</small>
          <strong style="color: #2563eb;">${demoCount}</strong>
        </div>
        <div class="inquiry-kpi-card">
          <small>New Uncontacted Leads</small>
          <strong style="color: #d97706;">${newCount}</strong>
        </div>
        <div class="inquiry-kpi-card">
          <small>Active Engagements</small>
          <strong style="color: #16a34a;">${convertedCount}</strong>
        </div>
      </section>

      <div class="inquiries-filter-bar">
        <button type="button" class="inquiries-filter-btn ${filter === 'all' ? 'active' : ''}" data-action="filter-inquiries" data-filter="all">All Leads (${totalCount})</button>
        <button type="button" class="inquiries-filter-btn ${filter === 'demo' ? 'active' : ''}" data-action="filter-inquiries" data-filter="demo">Demo Requests (${demoCount})</button>
        <button type="button" class="inquiries-filter-btn ${filter === 'inquiry' ? 'active' : ''}" data-action="filter-inquiries" data-filter="inquiry">General Inquiries (${totalCount - demoCount})</button>
        <button type="button" class="inquiries-filter-btn ${filter === 'new' ? 'active' : ''}" data-action="filter-inquiries" data-filter="new">New Leads Only (${newCount})</button>
      </div>

      <div class="inquiries-table-card">
        <table class="inquiries-table">
          <thead>
            <tr>
              <th>Lead Ref</th>
              <th>Date & Time</th>
              <th>School & Location</th>
              <th>Contact Person</th>
              <th>Board & Strength</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length === 0 ? `
              <tr>
                <td colspan="7" style="text-align: center; padding: 2.5rem; color: #64748b;">
                  No inquiries found matching this filter.
                </td>
              </tr>
            ` : filtered.map((item) => {
              const statusClass = item.status === 'NEW_LEAD' ? 'new' : item.status === 'CONTACTED' ? 'contacted' : item.status === 'DEMO_SCHEDULED' ? 'demo' : 'converted';
              const statusLabel = item.status === 'NEW_LEAD' ? '● New Lead' : item.status === 'CONTACTED' ? '✓ Contacted' : item.status === 'DEMO_SCHEDULED' ? '📅 Demo Scheduled' : '★ Converted';
              return `
              <tr>
                <td><span class="inquiry-id-badge">#${escapeHTML(item.id)}</span></td>
                <td>
                  <strong>${escapeHTML(item.formattedDate || 'Recent')}</strong><br/>
                  <small style="color: #64748b;">${item.type === 'DEMO_REQUEST' ? '🎥 Demo Request' : '✉️ Contact Us'}</small>
                </td>
                <td>
                  <strong>${escapeHTML(item.school)}</strong><br/>
                  <small style="color: #64748b;">📍 ${escapeHTML(item.location)}</small>
                </td>
                <td>
                  <strong>${escapeHTML(item.name)}</strong><br/>
                  <small style="color: #64748b;">${escapeHTML(item.designation || 'Leader')}</small>
                </td>
                <td>
                  <span style="font-weight: 700; color: #0f172a;">${escapeHTML(item.board || 'CBSE')}</span><br/>
                  <small style="color: #64748b;">${escapeHTML(item.strength || '200-400')}</small>
                </td>
                <td>
                  <button type="button" class="inquiry-status-pill ${statusClass}" data-action="toggle-inquiry-status" data-id="${item.id}" title="Click to cycle lead status">
            ${statusLabel} ⟳
                  </button>
                </td>
                <td>
                  <div class="inquiry-action-row">
                    <a href="https://wa.me/91${escapeHTML(item.mobile)}?text=Hi%20${encodeURIComponent(item.name)}%2C%20this%20is%20from%20NotebookXL%20School%20OS%20team%20regarding%20${encodeURIComponent(item.school)}." target="_blank" rel="noopener noreferrer" class="inquiry-wa-btn" title="Chat on WhatsApp">
                      <span>💬 WhatsApp</span>
                    </a>
                    <a href="tel:+91${escapeHTML(item.mobile)}" class="inquiry-call-btn" title="Call">
                      <span>📞 Call</span>
                    </a>
                  </div>
                </td>
              </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  function renderLeaderboard() {
    return renderLeaderboardModule(state, students, currentStudent, studentGrade, studentAcademicGamification, studentAverage, fullName, studentAttendance, decimal, renderGamifiedAvatar, sectionHead, escapeHTML, lower, tenant, icon);
  }

  function renderAIStudyCoach() {
    const stud = currentStudent() || students()[0];
    const studName = fullName(stud);
    const studGrade = studentGrade(stud);
    const studSec = stud.section || 'A';
    const activeSubject = state.aiPrepSubject || 'math';
    const studentXP = state.aiPrepXP || 1450;
    const streakDays = state.aiPrepStreak || 7;

    const subjectsMap = {
      math: {
        title: '📐 Grade 8 Mathematics (Algebra & Geometry)',
        topics: [
          { name: 'Linear Equations in One Variable', mastery: 92, status: 'Mastered' },
          { name: 'Understanding Quadrilaterals', mastery: 85, status: 'Strong' },
          { name: 'Algebraic Expressions & Identities', mastery: 78, status: 'Needs Practice' },
          { name: 'Mensuration & Area of Polygons', mastery: 64, status: 'Focus Area' }
        ],
        quiz: [
          {
            q: 'Solve for x: 3x - 5 = 2x + 7',
            options: ['x = 10', 'x = 12', 'x = 2', 'x = -12'],
            correct: 1,
            explanation: 'Subtract 2x from both sides: x - 5 = 7. Add 5 to both sides: x = 12.'
          },
          {
            q: 'What is the sum of interior angles of a pentagon (5 sides)?',
            options: ['360°', '540°', '720°', '180°'],
            correct: 1,
            explanation: 'Formula = (n - 2) × 180° = (5 - 2) × 180° = 3 × 180° = 540°.'
          },
          {
            q: 'Expand: (2x + 3y)²',
            options: ['4x² + 9y²', '4x² + 12xy + 9y²', '2x² + 6xy + 3y²', '4x² + 6xy + 9y²'],
            correct: 1,
            explanation: '(a + b)² = a² + 2ab + b² = (2x)² + 2(2x)(3y) + (3y)² = 4x² + 12xy + 9y².'
          }
        ]
      },
      science: {
        title: '🔬 Grade 8 Science (Physics & Chemistry)',
        topics: [
          { name: 'Crop Production & Management', mastery: 95, status: 'Mastered' },
          { name: 'Microorganisms: Friend & Foe', mastery: 88, status: 'Strong' },
          { name: 'Coal & Petroleum (Fossil Fuels)', mastery: 82, status: 'Strong' },
          { name: 'Force & Pressure (Newton’s Laws)', mastery: 70, status: 'Focus Area' }
        ],
        quiz: [
          {
            q: 'Which organelle is known as the powerhouse of the cell?',
            options: ['Ribosome', 'Mitochondria', 'Golgi Apparatus', 'Nucleus'],
            correct: 1,
            explanation: 'Mitochondria generate most of the cell’s chemical energy stored in ATP.'
          },
          {
            q: 'What is the SI unit of pressure?',
            options: ['Joule (J)', 'Pascal (Pa)', 'Newton (N)', 'Watt (W)'],
            correct: 1,
            explanation: 'Pressure is Force / Area, measured in Pascals (Pa = N/m²).'
          }
        ]
      },
      english: {
        title: '📖 Grade 8 English Literature & Grammar',
        topics: [
          { name: 'Active & Passive Voice Transformation', mastery: 90, status: 'Mastered' },
          { name: 'Shakespeare’s Julius Caesar Analysis', mastery: 84, status: 'Strong' },
          { name: 'Direct & Indirect Reported Speech', mastery: 76, status: 'Needs Practice' }
        ],
        quiz: [
          {
            q: 'Change to Passive Voice: "The teacher answered the question."',
            options: [
              'The question was answered by the teacher.',
              'The question is answered by the teacher.',
              'The teacher was answering the question.',
              'The question has been answered.'
            ],
            correct: 0,
            explanation: 'Past simple tense ("answered") transforms to "was answered" in passive voice.'
          }
        ]
      },
      tech: {
        title: '🤖 Grade 8 AI, Robotics & Coding',
        topics: [
          { name: 'Python Control Flow & Loops', mastery: 94, status: 'Mastered' },
          { name: 'Machine Learning Classification Concepts', mastery: 86, status: 'Strong' },
          { name: 'Ethics in AI & Algorithmic Bias', mastery: 80, status: 'Strong' }
        ],
        quiz: [
          {
            q: 'In Python, which keyword is used to define a function?',
            options: ['function', 'def', 'create', 'func'],
            correct: 1,
            explanation: 'The "def" keyword defines a function block in Python (e.g. def calculate_sum():).'
          }
        ]
      }
    };

    const currentSubData = subjectsMap[activeSubject] || subjectsMap.math;
    if (!state.aiPrepQuizState) state.aiPrepQuizState = {};
    const quizState = state.aiPrepQuizState[activeSubject] || { selected: {}, submitted: false, score: 0 };

    const ptmSummary = `🤖 AI Coach Analysis for ${studName} (Grade ${studGrade}${studSec}): ${studName} has achieved an impressive 88% overall topic mastery in Grade 8 CBSE subjects this week, completing 14 practice modules with a 🔥 ${streakDays}-Day Revision Streak! Strongest area: ${currentSubData.topics[0].name} (Mastery: ${currentSubData.topics[0].mastery}%). Recommended focus for upcoming Term 2 Exams: ${currentSubData.topics[currentSubData.topics.length - 1].name}.`;

    const waText = encodeURIComponent(`Dear Parent, here is the official AI PTM Progress Summary for ${studName} (Grade ${studGrade}${studSec} · Roll #${stud.rollNumber || '17'}):\n\n${ptmSummary}\n\nSchool: Meezan Kids School`);
    const waLink = `https://wa.me/${(stud.parentMobile || '919845098765').replace(/\D/g,'')}?text=${waText}`;

    return `
      ${sectionHead('AI Learning Companion', '🤖 AI Personal Study Coach & Exam Prep', `Tailored revision and exam practice for ${escapeHTML(studName)} (Grade ${escapeHTML(studGrade)}${escapeHTML(studSec)})`, `
        <div style="display:flex; gap:0.5rem;">
          <a class="btn btn-secondary" href="${waLink}" target="_blank" rel="noopener noreferrer" style="background:#25D366; color:#ffffff; border:none; text-decoration:none; font-weight:800; font-size:0.85rem; display:inline-flex; align-items:center;">
            💬 WhatsApp PTM Summary
          </a>
          <button class="btn btn-primary" data-action="print-ai-study-plan">
            🖨️ Print AI Study Plan
          </button>
        </div>
      `)}

      <!-- Top Metrics & Gamified XP Strip -->
      <section class="card" style="margin-bottom:1.5rem; background:linear-gradient(135deg, #311b92, #4527a0); color:#ffffff; padding:1.25rem 1.5rem; border-radius:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1.25rem;">
          <div style="display:flex; align-items:center; gap:1.25rem;">
            <div class="id-card-avatar-ring">
              ${renderGamifiedAvatar(stud, 'avatar-large')}
            </div>
            <div>
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
                <span class="badge" style="background:#ffd700; color:#0f172a; font-weight:900; font-size:0.7rem;">🏆 LEVEL 8 SCHOLAR</span>
                <span class="badge" style="background:rgba(255,255,255,0.2); color:#ffffff; font-weight:800; font-size:0.7rem;">🔥 ${streakDays}-DAY STREAK</span>
              </div>
              <h3 style="margin:0; font-size:1.3rem; color:#ffffff; font-weight:900;">
                ${escapeHTML(studName)}’s Revision Dashboard
              </h3>
              <p style="margin:0.2rem 0 0; font-size:0.82rem; color:#e0e7ff;">
                Grade ${escapeHTML(studGrade)} · Term 2 Target Goal: <b>95% Mastery Target</b>
              </p>
            </div>
          </div>

          <div style="display:flex; gap:1rem; background:rgba(255,255,255,0.12); padding:0.75rem 1.25rem; border-radius:12px; border:1px solid rgba(255,255,255,0.18);">
            <div style="text-align:center;">
              <div style="font-size:0.65rem; color:#c7d2fe; text-transform:uppercase; font-weight:800;">Total Earned XP</div>
              <div style="font-size:1.35rem; color:#ffd700; font-weight:900;">⚡ ${studentXP.toLocaleString()} XP</div>
            </div>
            <div style="border-left:1px solid rgba(255,255,255,0.2); padding-left:1rem; text-align:center;">
              <div style="font-size:0.65rem; color:#c7d2fe; text-transform:uppercase; font-weight:800;">Average Mastery</div>
              <div style="font-size:1.35rem; color:#4ade80; font-weight:900;">88%</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Subject Switcher -->
      <div style="display:flex; gap:0.5rem; margin-bottom:1.25rem; overflow-x:auto; border-bottom:2px solid #e2e8f0; padding-bottom:0.4rem;">
        <button class="filter-chip ${activeSubject === 'math' ? 'active' : ''}" data-action="set-ai-subject" data-subject="math" style="font-size:0.88rem; font-weight:800;">📐 Mathematics</button>
        <button class="filter-chip ${activeSubject === 'science' ? 'active' : ''}" data-action="set-ai-subject" data-subject="science" style="font-size:0.88rem; font-weight:800;">🔬 Science & Physics</button>
        <button class="filter-chip ${activeSubject === 'english' ? 'active' : ''}" data-action="set-ai-subject" data-subject="english" style="font-size:0.88rem; font-weight:800;">📖 English Literature</button>
        <button class="filter-chip ${activeSubject === 'tech' ? 'active' : ''}" data-action="set-ai-subject" data-subject="tech" style="font-size:0.88rem; font-weight:800;">🤖 AI & Coding</button>
      </div>

      <!-- Main Grid: Interactive Quiz + Topic Mastery Cards -->
      <div style="display:grid; grid-template-columns:1.5fr 1fr; gap:1.5rem;" class="responsive-ai-grid">
        
        <!-- Left: Interactive AI Mock Practice Quiz -->
        <section class="card" style="border:2px solid #7c3aed;">
          <div class="card-heading">
            <div>
              <h3>📝 ${escapeHTML(currentSubData.title)}</h3>
              <p>AI-Generated Practice Questions with Instant Explanations</p>
            </div>
            <span class="badge badge-info">+100 XP per Quiz</span>
          </div>

          <div style="margin-bottom:1rem;">
            ${currentSubData.quiz.map((item, qIdx) => {
              const selectedOpt = quizState.selected[qIdx];
              const isSubmitted = quizState.submitted;
              const isCorrect = selectedOpt === item.correct;

              return `
                <div style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:10px; padding:1.1rem; margin-bottom:1rem;">
                  <h4 style="margin:0 0 0.65rem; font-size:0.98rem; color:#0f172a; font-weight:800;">
                    Q${qIdx + 1}. ${escapeHTML(item.q)}
                  </h4>

                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin-bottom:0.65rem;">
                    ${item.options.map((optText, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      let btnBg = '#ffffff';
                      let btnBorder = '#cbd5e1';
                      let textColor = '#0f172a';

                      if (isSelected) {
                        btnBg = '#e0e7ff';
                        btnBorder = '#4338ca';
                      }

                      if (isSubmitted) {
                        if (optIdx === item.correct) {
                          btnBg = '#dcfce7';
                          btnBorder = '#16a34a';
                          textColor = '#166534';
                        } else if (isSelected && !isCorrect) {
                          btnBg = '#fee2e2';
                          btnBorder = '#dc2626';
                          textColor = '#991b1b';
                        }
                      }

                      return `
                        <button class="btn" style="background:${btnBg}; border:1.5px solid ${btnBorder}; color:${textColor}; text-align:left; font-size:0.82rem; padding:0.55rem 0.85rem; border-radius:8px; font-weight:700;" data-action="select-quiz-option" data-subject="${activeSubject}" data-qindex="${qIdx}" data-option="${optIdx}">
                          ${String.fromCharCode(65 + optIdx)}. ${escapeHTML(optText)}
                        </button>
                      `;
                    }).join('')}
                  </div>

                  ${isSubmitted ? `
                    <div style="background:${isCorrect ? '#f0fdf4' : '#fff1f2'}; border-left:4px solid ${isCorrect ? '#22c55e' : '#e11d48'}; padding:0.65rem 0.85rem; border-radius:4px; font-size:0.78rem; margin-top:0.5rem;">
                      <b style="color:${isCorrect ? '#166534' : '#9f1239'}; display:block; margin-bottom:0.15rem;">
                        ${isCorrect ? '✓ Correct Answer!' : '❌ Incorrect Solution'}
                      </b>
                      <span style="color:#334155;">${escapeHTML(item.explanation)}</span>
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}

            <div style="display:flex; gap:0.75rem; justify-content:flex-end;">
              ${quizState.submitted ? `
                <button class="btn btn-secondary" style="font-size:0.85rem;" data-action="reset-ai-quiz" data-subject="${activeSubject}">
                  🔄 Re-Take Practice Quiz
                </button>
              ` : `
                <button class="btn btn-primary" style="font-size:0.85rem; padding:0.55rem 1.25rem;" data-action="submit-ai-quiz" data-subject="${activeSubject}">
                  ⚡ Submit & Claim +100 XP
                </button>
              `}
            </div>
          </div>
        </section>

        <!-- Right: Topic Mastery Breakdown + AI PTM Summary -->
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          
          <!-- Topic Mastery Card -->
          <section class="card">
            <div class="card-heading">
              <div>
                <h3>📊 Topic Mastery Proficiency</h3>
                <p>Real-time syllabus strength analysis</p>
              </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:0.85rem;">
              ${currentSubData.topics.map(t => `
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.82rem; margin-bottom:0.25rem;">
                    <b style="color:#0f172a;">${escapeHTML(t.name)}</b>
                    <span class="badge ${t.mastery >= 90 ? 'badge-success' : t.mastery >= 75 ? 'badge-info' : 'badge-warning'}" style="font-size:0.68rem;">${t.mastery}% · ${escapeHTML(t.status)}</span>
                  </div>
                  <div style="background:#e2e8f0; height:8px; border-radius:4px; overflow:hidden;">
                    <div style="background:${t.mastery >= 90 ? '#22c55e' : t.mastery >= 75 ? '#3b82f6' : '#f59e0b'}; height:100%; width:${t.mastery}%;"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- AI Parent PTM Summary Box -->
          <section class="card" style="background:#f8fafc; border:1.5px solid #a855f7;">
            <div class="card-heading" style="margin-bottom:0.5rem;">
              <div>
                <h3 style="color:#7e22ce;">🤖 AI Parent PTM Progress Insight</h3>
                <p style="margin:0;">Auto-generated summary for Parent-Teacher Meetings</p>
              </div>
            </div>
            <p style="font-size:0.82rem; color:#334155; line-height:1.5; background:#ffffff; border:1px solid #e9d5ff; padding:0.85rem; border-radius:8px; margin-bottom:0.75rem;">
              ${escapeHTML(ptmSummary)}
            </p>
            <a class="btn btn-secondary" href="${waLink}" target="_blank" rel="noopener noreferrer" style="background:#25D366; color:#ffffff; border:none; text-decoration:none; font-weight:800; font-size:0.8rem; width:100%; justify-content:center;">
              💬 Send PTM Summary to Parent WhatsApp
            </a>
          </section>

        </div>
      </div>
    `;
  }

  function renderParentStudentPortal() {
    const activeTab = state.pocketPortalTab || 'homework';
    const stud = currentStudent() || students()[0];
    const studName = fullName(stud);
    const studGrade = studentGrade(stud);
    const studSec = stud.section || 'A';
    const walletBal = state.canteenPrepaidBalance || 1250;
    const libQuery = (state.librarySearchQuery || '').toLowerCase();

    const tabs = [
      ['homework', '📚 Homework & Tasks'],
      ['library', '📖 Digital Library'],
      ['canteen', '🍱 Canteen & Menu'],
      ['events', '📸 Campus Gallery']
    ];

    const books = [
      { id: 'b1', title: 'CBSE Class 8 Mathematics Exemplar', author: 'NCERT Board', category: 'Academics', status: 'Available', shelf: 'Shelf A-4' },
      { id: 'b2', title: 'Concepts of Physics (Vol 1)', author: 'Dr. H.C. Verma', category: 'Science & STEM', status: 'Borrowed', returnDue: '20 Aug 2026', shelf: 'Shelf B-2' },
      { id: 'b3', title: 'The Diary of a Young Girl', author: 'Anne Frank', category: 'Literature', status: 'Available', shelf: 'Shelf C-1' },
      { id: 'b4', title: 'AI & Machine Learning for School Students', author: 'DeepMind Education', category: 'Technology', status: 'Available', shelf: 'Shelf D-3' },
      { id: 'b5', title: 'NCERT Science & Experiments Guide', author: 'CBSE Press', category: 'Academics', status: 'Available', shelf: 'Shelf A-2' }
    ];

    const filteredBooks = books.filter(b => b.title.toLowerCase().includes(libQuery) || b.author.toLowerCase().includes(libQuery) || b.category.toLowerCase().includes(libQuery));

    const canteenMenu = [
      { day: 'Monday', main: '🌱 Vegetable Biryani + Cucumber Raita', side: 'Fresh Orange Juice & Fruit Bowl', diet: 'Vegetarian · Halal' },
      { day: 'Tuesday', main: '🍗 Baked Chicken Cutlet & Whole Wheat Pasta', side: 'Steamed Broccoli & Apple Slices', diet: 'High Protein · Halal' },
      { day: 'Wednesday', main: '🌱 Paneer Butter Masala + Soft Rotis', side: 'Sweet Corn Salad & Milkshake', diet: 'Vegetarian · Calcium Rich' },
      { day: 'Thursday', main: '🌱 Multigrain Veg Frankie & Roasted Makhana', side: 'Watermelon Cubes & Lemonade', diet: 'Fiber Rich · Nut-Free' },
      { day: 'Friday', main: '🍗 Grilled Chicken Sandwich & Potato Wedges', side: 'Banana Smoothie & Choco Cookie', diet: 'Energy Boost · Halal' }
    ];

    const galleryEvents = [
      { title: 'Annual Science & AI Expo 2026', date: '10 Aug 2026', tag: 'Science & Robotics', desc: 'Over 45 interactive AI projects and robotics working models presented by Grade 6–10 students.', bg: 'linear-gradient(135deg, #1e3a8a, #3b82f6)' },
      { title: 'Inter-School Sports & Athletics Meet', date: '04 Aug 2026', tag: 'Sports', desc: 'Meezan Kids School won 14 Gold Medals in 100m sprint, relay race, and football tournament.', bg: 'linear-gradient(135deg, #15803d, #22c55e)' },
      { title: 'Independence Day Cultural Gala', date: '15 Aug 2026 (Upcoming)', tag: 'School Event', desc: 'Patriotic song performances, drama skits, and traditional dance recitals scheduled at the main auditorium.', bg: 'linear-gradient(135deg, #b45309, #f59e0b)' }
    ];

    const waText = encodeURIComponent(`Dear Parent, here is the Daily Student Pocket Summary for ${studName} (Grade ${studGrade}${studSec} · Roll #${stud.rollNumber || '17'}):\n- Pending Tasks: 2 Active Homeworks\n- Canteen Balance: ₹${walletBal}\n- Library Book Issued: Concepts of Physics (Due: 20 Aug)\n- School: Meezan Kids School`);
    const waLink = `https://wa.me/${(stud.parentMobile || '919845098765').replace(/\D/g,'')}?text=${waText}`;

    return `
      ${sectionHead('Student & Parent Portal', '📱 Parent & Student Pocket Assistant', `Live daily companion for ${escapeHTML(studName)} (Grade ${escapeHTML(studGrade)}${escapeHTML(studSec)})`, `
        <div style="display:flex; gap:0.5rem;">
          <a class="btn btn-secondary" href="${waLink}" target="_blank" rel="noopener noreferrer" style="background:#25D366; color:#ffffff; border:none; text-decoration:none; font-weight:800; font-size:0.85rem; display:inline-flex; align-items:center;">
            💬 Send WhatsApp Summary
          </a>
          <button class="btn btn-primary" data-action="print-pocket-summary">
            🖨️ Print Pocket Summary
          </button>
        </div>
      `)}

      <!-- Student Overview Card Strip -->
      <section class="card" style="margin-bottom:1.5rem; background:linear-gradient(135deg, #0f172a, #1e293b); color:#ffffff; padding:1.25rem 1.5rem; border-radius:14px;">
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
          <div style="display:flex; align-items:center; gap:1rem;">
            <div class="id-card-avatar-ring">
              ${renderGamifiedAvatar(stud, 'avatar-large')}
            </div>
            <div>
              <h3 style="margin:0 0 0.15rem; font-size:1.25rem; color:#ffffff; font-weight:900;">
                ${escapeHTML(studName)}
              </h3>
              <p style="margin:0; font-size:0.82rem; color:#94a3b8;">
                Grade <b>${escapeHTML(studGrade)}-${escapeHTML(studSec)}</b> · Roll <b>#${escapeHTML(stud.rollNumber || '17')}</b> · Student ID: <b>${escapeHTML(stud.studentId || 'NXL-MKS-STU-000421')}</b>
              </p>
            </div>
          </div>
          <div style="display:flex; gap:1.25rem; background:rgba(255,255,255,0.08); padding:0.65rem 1rem; border-radius:10px; border:1px solid rgba(255,255,255,0.12);">
            <div>
              <div style="font-size:0.65rem; color:#94a3b8; text-transform:uppercase; font-weight:800;">Canteen Wallet</div>
              <div style="font-size:1.1rem; color:#4ade80; font-weight:900;">₹${walletBal.toLocaleString('en-IN')}</div>
            </div>
            <div style="border-left:1px solid rgba(255,255,255,0.2); padding-left:1.25rem;">
              <div style="font-size:0.65rem; color:#94a3b8; text-transform:uppercase; font-weight:800;">Attendance Rate</div>
              <div style="font-size:1.1rem; color:#38bdf8; font-weight:900;">${decimal(studentAttendance(stud))}%</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Portal Tabs -->
      <div style="display:flex; gap:0.5rem; margin-bottom:1.25rem; border-bottom:2px solid #e2e8f0; padding-bottom:0.4rem; overflow-x:auto;">
        ${tabs.map(([id, label]) => `
          <button class="filter-chip ${activeTab === id ? 'active' : ''}" data-action="set-portal-tab" data-tab="${id}" style="font-size:0.88rem; padding:0.5rem 1rem; font-weight:800;">
            ${label}
          </button>
        `).join('')}
      </div>

      <!-- Tab Content 1: Homework & Tasks -->
      ${activeTab === 'homework' ? `
        <section class="card">
          <div class="card-heading">
            <div>
              <h3>📚 Daily Classroom Homework & Tasks</h3>
              <p>Active homework assignments for Grade ${escapeHTML(studGrade)}${escapeHTML(studSec)}</p>
            </div>
            <span class="badge badge-info">2 Pending Tasks</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:0.75rem; padding:0.5rem 0;">
            <div style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:10px; padding:1rem; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span class="badge badge-warning" style="margin-bottom:0.25rem;">Due Tomorrow (18 Aug)</span>
                <h4 style="margin:0.2rem 0; font-size:1.02rem; color:#0f172a;">📐 Linear Equations Word Problems Practice</h4>
                <p style="margin:0; font-size:0.8rem; color:#64748b;">Subject: <b>Mathematics</b> · Teacher: Dr. Tariq Ahmad</p>
              </div>
              <button class="btn btn-secondary" style="font-size:0.8rem;" data-action="toggle-task-demo">✓ Mark Submitted</button>
            </div>

            <div style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:10px; padding:1rem; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span class="badge badge-info" style="margin-bottom:0.25rem;">Due Friday (21 Aug)</span>
                <h4 style="margin:0.2rem 0; font-size:1.02rem; color:#0f172a;">🔬 Photosynthesis & Plant Cell Structure Chart</h4>
                <p style="margin:0; font-size:0.8rem; color:#64748b;">Subject: <b>Science & Biology</b> · Teacher: Mrs. Nazia Parveen</p>
              </div>
              <button class="btn btn-secondary" style="font-size:0.8rem;" data-action="toggle-task-demo">✓ Mark Submitted</button>
            </div>

            <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:10px; padding:1rem; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span class="badge badge-success" style="margin-bottom:0.25rem;">Completed</span>
                <h4 style="margin:0.2rem 0; font-size:1.02rem; color:#0f172a;">📖 Shakespeare Essay: Character Study of Brutus</h4>
                <p style="margin:0; font-size:0.8rem; color:#166534;">Submitted 12 Aug · Score: 18/20 (Grade A)</p>
              </div>
              <span style="color:#166534; font-weight:800; font-size:0.85rem;">✓ Verified</span>
            </div>
          </div>
        </section>
      ` : ''}

      <!-- Tab Content 2: Digital Library -->
      ${activeTab === 'library' ? `
        <section class="card">
          <div class="card-heading">
            <div>
              <h3>📖 Digital School Library Catalog</h3>
              <p>Search books, check availability, and view borrowed items</p>
            </div>
            <label class="filter-search" style="max-width:260px;">
              ${icon('search')}
              <input id="lib-search-input" value="${escapeHTML(state.librarySearchQuery || '')}" placeholder="Search title or author…" data-action="search-library-catalog" />
            </label>
          </div>

          <!-- Currently Borrowed Strip -->
          <div style="background:#eff6ff; border:1.5px solid #3b82f6; border-radius:10px; padding:1rem; margin-bottom:1.25rem; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <span class="badge badge-info" style="font-size:0.68rem;">ACTIVE BORROWED BOOK</span>
              <h4 style="margin:0.25rem 0 0.1rem; font-size:1rem; color:#1e3a8a;">📚 Concepts of Physics (Vol 1)</h4>
              <p style="margin:0; font-size:0.8rem; color:#3b82f6;">Author: Dr. H.C. Verma · Return Due Date: <b>20 Aug 2026 (3 Days Left)</b></p>
            </div>
            <button class="btn btn-secondary" style="font-size:0.8rem;" data-action="renew-library-book">
              🔄 Renew Book
            </button>
          </div>

          <!-- Library Books Grid -->
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:1rem;">
            ${filteredBooks.map(b => `
              <div style="background:#ffffff; border:1.5px solid #cbd5e1; border-radius:10px; padding:1rem; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:0.35rem;">
                    <span class="badge badge-secondary" style="font-size:0.65rem;">${escapeHTML(b.category)}</span>
                    <span class="badge ${b.status === 'Available' ? 'badge-success' : 'badge-warning'}" style="font-size:0.65rem;">${escapeHTML(b.status)}</span>
                  </div>
                  <h4 style="margin:0 0 0.2rem; font-size:0.95rem; color:#0f172a; font-weight:800;">${escapeHTML(b.title)}</h4>
                  <p style="margin:0; font-size:0.78rem; color:#64748b;">Author: ${escapeHTML(b.author)}</p>
                  <p style="margin:0.2rem 0 0; font-size:0.72rem; color:#94a3b8;">Location: ${escapeHTML(b.shelf)}</p>
                </div>
                <div style="margin-top:0.85rem; border-top:1px dashed #e2e8f0; padding-top:0.65rem;">
                  <button class="btn btn-secondary" style="width:100%; font-size:0.78rem;" data-action="reserve-library-book" data-title="${escapeHTML(b.title)}">
                    ${b.status === 'Available' ? '📌 Reserve Book' : '⏳ Join Waitlist'}
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Tab Content 3: Canteen & Menu -->
      ${activeTab === 'canteen' ? `
        <section class="card">
          <div class="card-heading">
            <div>
              <h3>🍱 School Canteen & Weekly Nutrition Menu</h3>
              <p>Prepaid canteen wallet and daily nutritious lunch menu</p>
            </div>
            <button class="btn btn-primary" style="font-size:0.82rem;" data-action="topup-canteen-wallet">
              💳 Top Up Wallet (+ ₹500)
            </button>
          </div>

          <!-- Wallet Balance Banner -->
          <div style="background:linear-gradient(135deg, #166534, #22c55e); color:#ffffff; border-radius:12px; padding:1.25rem; margin-bottom:1.25rem; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:0.75rem; text-transform:uppercase; font-weight:800; color:#bbf7d0;">PREPAID CANTEEN SMART WALLET</div>
              <h2 style="margin:0.25rem 0 0; font-size:1.6rem; color:#ffffff; font-weight:900;">₹${walletBal.toLocaleString('en-IN')}.00</h2>
              <p style="margin:0.2rem 0 0; font-size:0.78rem; color:#dcfce7;">Linked to Student ID: ${escapeHTML(stud.studentId || 'NXL-MKS-STU-000421')}</p>
            </div>
            <button class="btn" style="background:#ffffff; color:#166534; font-weight:900; border:none; font-size:0.85rem;" data-action="topup-canteen-wallet">
              + Add Funds
            </button>
          </div>

          <!-- Weekly Menu Table -->
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Main Course</th>
                  <th>Side & Refreshment</th>
                  <th>Dietary Indicator</th>
                </tr>
              </thead>
              <tbody>
                ${canteenMenu.map(m => `
                  <tr>
                    <td><b>${escapeHTML(m.day)}</b></td>
                    <td><b>${escapeHTML(m.main)}</b></td>
                    <td>${escapeHTML(m.side)}</td>
                    <td><span class="badge badge-success" style="font-size:0.72rem;">${escapeHTML(m.diet)}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </section>
      ` : ''}

      <!-- Tab Content 4: Campus Gallery -->
      ${activeTab === 'events' ? `
        <section class="card">
          <div class="card-heading">
            <div>
              <h3>📸 Campus Event Highlights & Photo Gallery</h3>
              <p>Recent school achievements, sports, and cultural events</p>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:1.25rem;">
            ${galleryEvents.map(e => `
              <div style="border-radius:12px; overflow:hidden; border:1px solid #cbd5e1; background:#ffffff; box-shadow:0 8px 20px rgba(0,0,0,0.06);">
                <div style="background:${e.bg}; color:#ffffff; padding:1.5rem 1.25rem; text-align:center;">
                  <span class="badge" style="background:rgba(255,255,255,0.25); color:#ffffff; font-size:0.68rem; margin-bottom:0.5rem;">${escapeHTML(e.tag)}</span>
                  <h3 style="margin:0; font-size:1.15rem; color:#ffffff; font-weight:900;">${escapeHTML(e.title)}</h3>
                  <p style="margin:0.25rem 0 0; font-size:0.78rem; color:rgba(255,255,255,0.85);">${escapeHTML(e.date)}</p>
                </div>
                <div style="padding:1rem;">
                  <p style="margin:0; font-size:0.85rem; color:#475569; line-height:1.5;">${escapeHTML(e.desc)}</p>
                  <div style="margin-top:1rem; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:0.75rem; color:#2563eb; font-weight:800;">📸 24 Photos Available</span>
                    <button class="btn btn-secondary" style="font-size:0.78rem;" data-action="view-event-gallery">View Gallery</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}
    `;
  }

  function getTenantFeeRecords() {
    if (!state.feeRecordsByTenant) state.feeRecordsByTenant = {};
    const key = state.tenantId || 'default';
    if (!state.feeRecordsByTenant[key] || state.feeRecordsByTenant[key].length === 0) {
      const studs = students();
      if (studs && studs.length > 0) {
        state.feeRecordsByTenant[key] = studs.map((s, idx) => {
          const gradeNum = parseInt(studentGrade(s), 10) || 8;
          const totalFee = gradeNum >= 9 ? 80000 : gradeNum >= 6 ? 65000 : 50000;
          const paidAmount = idx % 4 === 0 ? totalFee : idx % 4 === 1 ? Math.round(totalFee * 0.65) : idx % 4 === 2 ? Math.round(totalFee * 0.4) : Math.round(totalFee * 0.85);
          const balanceDue = totalFee - paidAmount;
          const status = balanceDue === 0 ? 'Paid' : balanceDue > totalFee * 0.5 ? 'Overdue' : 'Partial';
          
          return {
            id: s.id,
            student: s,
            studentName: fullName(s),
            studentId: s.studentId || `NXL-MKS-${String(idx + 1).padStart(6, '0')}`,
            grade: studentGrade(s),
            section: s.section || 'A',
            parentName: s.parentName || s.guardianName || 'Dr. Tariq Khan',
            parentMobile: s.parentMobile || s.phone || s.mobile || '+91 98450 98765',
            totalFee,
            paidAmount,
            balanceDue,
            status,
            nextDueDate: '10 Jan 2027',
            history: [
              { receiptNo: `REC-2026-${1000 + idx}`, date: '05 Jun 2026', amount: paidAmount > 30000 ? 30000 : paidAmount, mode: 'UPI (GPay)', collectedBy: 'Accounts Office' },
              ...(paidAmount > 30000 ? [{ receiptNo: `REC-2026-${2000 + idx}`, date: '08 Oct 2026', amount: paidAmount - 30000, mode: 'NetBanking', collectedBy: 'Online Portal' }] : [])
            ]
          };
        });
      } else {
        state.feeRecordsByTenant[key] = [
          {
            id: 'student-1',
            student: { id: 'student-1', firstName: 'Amaan', lastName: 'Khan', grade: '8', section: 'A' },
            studentName: 'Amaan Khan',
            studentId: 'NXL-MKS-000421',
            grade: '8',
            section: 'A',
            parentName: 'Dr. Tariq Khan',
            parentMobile: '+91 98450 98765',
            totalFee: 80000,
            paidAmount: 55000,
            balanceDue: 25000,
            status: 'Partial',
            nextDueDate: '10 Jan 2027',
            history: [
              { receiptNo: 'REC-2026-0129', date: '05 Jun 2026', amount: 30000, mode: 'NetBanking', collectedBy: 'Online Portal' },
              { receiptNo: 'REC-2026-0842', date: '08 Oct 2026', amount: 25000, mode: 'UPI (GPay)', collectedBy: 'Accounts Office' }
            ]
          }
        ];
      }
    }
    return state.feeRecordsByTenant[key];
  }

  function renderDigitalReceiptHTML(rec) {
    const sch = tenant();
    const schName = sch?.school?.name || sch?.name || 'Meezan Kids School';
    const lastPayment = (rec.history && rec.history.length) ? rec.history[rec.history.length - 1] : { receiptNo: 'REC-2026-0842', date: '08 Oct 2026', amount: 25000, mode: 'UPI (GPay)' };

    return `
      <div style="display:flex; justify-content:center; margin-bottom:1.5rem;">
        <div class="digital-receipt-container" id="printable-receipt">
          <div class="receipt-header-branding">
            <h2>🏫 ${escapeHTML(schName)}</h2>
            <p>Affiliated to CBSE (Affiliation No: 830421) | School Code: 45210<br/>
            Richmond Town Campus, Bangalore - 560025 | Phone: +91 80 2234 5678 | Email: accounts@meezankids.school.edu</p>
            <div style="border-top:1.5px solid #0f172a; margin-top:0.6rem; padding-top:0.4rem;">
              <h3 style="margin:0; font-size:1.15rem; font-weight:900; letter-spacing:0.04em; color:#0f172a;">
                OFFICIAL FEE RECEIPT / INVOICE
              </h3>
            </div>
          </div>

          <div class="receipt-meta-banner">
            <div>
              <b>Receipt No:</b> <span style="font-family:monospace; color:#2563eb;">${escapeHTML(lastPayment.receiptNo)}</span><br/>
              <b>Date of Payment:</b> ${escapeHTML(lastPayment.date)}, 11:42 AM
            </div>
            <div style="text-align:right;">
              <b>Academic Year:</b> 2026–2027<br/>
              <b>Term / Month:</b> Term 2 (Oct–Dec)
            </div>
          </div>

          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; padding:0.75rem 1rem; margin-bottom:1rem; font-size:0.8rem;">
            <div style="font-weight:800; color:#0f172a; margin-bottom:0.4rem; text-transform:uppercase; letter-spacing:0.03em; border-bottom:1px solid #e2e8f0; padding-bottom:0.25rem;">
              STUDENT PARTICULARS:
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.35rem 1.5rem;">
              <div>• <b>Student Name:</b> ${escapeHTML(rec.studentName)}</div>
              <div>• <b>Student ID:</b> ${escapeHTML(rec.studentId)}</div>
              <div>• <b>Grade & Sec:</b> Grade ${escapeHTML(rec.grade)} - Section ${escapeHTML(rec.section)}</div>
              <div>• <b>Admission No:</b> MKS-2024-${Math.abs(parseInt(String(rec.id).replace(/\D/g,''),10))||421}</div>
              <div>• <b>Roll Number:</b> ${escapeHTML(rec.student?.rollNumber || '17')}</div>
              <div>• <b>Parent Name:</b> ${escapeHTML(rec.parentName)}</div>
              <div>• <b>Mobile:</b> ${escapeHTML(rec.parentMobile)}</div>
              <div>• <b>Parent Email:</b> tariq@gmail.com</div>
            </div>
          </div>

          <div style="font-weight:800; color:#0f172a; font-size:0.82rem; text-transform:uppercase; margin-bottom:0.25rem;">
            FEE PARTICULARS (BREAKDOWN):
          </div>
          <table class="receipt-particulars-table" style="margin:0 0 1rem;">
            <thead>
              <tr>
                <th>#</th>
                <th>Fee Component</th>
                <th>Period</th>
                <th style="text-align:right;">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1.</td>
                <td>Tuition & Academic Term Fee</td>
                <td>Term 2 (Quarter)</td>
                <td style="text-align:right;">₹18,000.00</td>
              </tr>
              <tr>
                <td>2.</td>
                <td>Science Lab & AI Robotics Access</td>
                <td>Term 2</td>
                <td style="text-align:right;">₹3,000.00</td>
              </tr>
              <tr>
                <td>3.</td>
                <td>School Bus Transport (Route 4)</td>
                <td>Term 2</td>
                <td style="text-align:right;">₹4,000.00</td>
              </tr>
              <tr style="background:#f8fafc; font-size:0.8rem;">
                <td colspan="3" style="text-align:right;"><b>Subtotal:</b></td>
                <td style="text-align:right;"><b>₹25,000.00</b></td>
              </tr>
              <tr style="background:#f8fafc; font-size:0.8rem;">
                <td colspan="3" style="text-align:right;"><b>Concession / Discount:</b></td>
                <td style="text-align:right; color:#64748b;">- ₹0.00</td>
              </tr>
              <tr class="receipt-total-row" style="background:#f1f5f9; border-top:2px solid #0f172a;">
                <td colspan="3" style="text-align:right;">
                  TOTAL PAID:<br/>
                  <small style="font-size:0.75rem; font-weight:600; color:#475569;">(Rupees Twenty-Five Thousand Only)</small>
                </td>
                <td style="text-align:right; color:#16a34a; font-size:1.1rem; vertical-align:middle;">
                  ₹${lastPayment.amount.toLocaleString()}.00
                </td>
              </tr>
              <tr style="background:#ffffff; font-size:0.78rem;">
                <td colspan="3" style="text-align:right; color:#64748b;">
                  Previous Dues: ₹0.00 | Payment Mode: ${escapeHTML(lastPayment.mode || 'UPI (GPay)')}
                </td>
                <td style="text-align:right; font-weight:800; color:${rec.balanceDue > 0 ? '#dc2626' : '#16a34a'};">
                  Current Balance Due: ₹${rec.balanceDue.toLocaleString()}.00
                </td>
              </tr>
            </tbody>
          </table>

          <div class="receipt-footer-signatures">
            <div style="font-size:0.72rem; color:#64748b; max-width:280px;">
              <b>[ QR Code for Verification ]</b><br/>
              <span style="font-family:monospace; background:#f1f5f9; padding:0.25rem 0.45rem; border-radius:4px; display:inline-block; margin:0.3rem 0;">
                [QR-NXL-AUTH-${lastPayment.receiptNo}]
              </span><br/>
              Scan to verify authenticity<br/>
              Generated via NotebookXL School OS
            </div>
            <div style="text-align:center; width:200px;">
              <div style="font-size:0.72rem; color:#b45309; font-weight:800; margin-bottom:0.2rem;">
                [ Seal: ${escapeHTML(schName)} ]
              </div>
              <div style="border-top:1.5px solid #0f172a; padding-top:0.3rem; font-weight:800; font-size:0.78rem;">
                Authorized Signatory (Accounts)
              </div>
              <small style="font-size:0.68rem; color:#64748b;">* Computer generated receipt</small>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function generateQRCodeSVG(payloadText) {
    const text = String(payloadText || 'ROLL-17');
    const seed = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const size = 21;
    const modules = Array.from({ length: size }, () => Array(size).fill(false));

    const addFinder = (row, col) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
            if (row + r < size && col + c < size) modules[row + r][col + c] = true;
          }
        }
      }
    };
    addFinder(0, 0);
    addFinder(0, 14);
    addFinder(14, 0);

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if ((r < 8 && c < 8) || (r < 8 && c >= 13) || (r >= 13 && c < 8)) continue;
        const val = (seed * (r + 1) + c * 7 + r * c) % 5;
        if (val === 0 || val === 2) modules[r][c] = true;
      }
    }

    const rects = [];
    const cellSize = 2.1;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (modules[r][c]) {
          rects.push(`<rect x="${(c + 1) * cellSize}" y="${(r + 1) * cellSize}" width="${cellSize}" height="${cellSize}" fill="#0f172a" />`);
        }
      }
    }

    return `
      <svg viewBox="0 0 49 49" style="width:42px; height:42px; display:block; background:#ffffff; border:1.5px solid #0f172a; border-radius:4px; padding:2px;" xmlns="http://www.w3.org/2000/svg">
        <rect width="49" height="49" fill="#ffffff" rx="3" />
        ${rects.join('')}
      </svg>
    `;
  }

  function generateBarcodeSVG(codeText, displayLabel) {
    const text = String(codeText || 'STU-ROLL-17-NXL-MKS-000421').toUpperCase();
    const label = String(displayLabel || text).toUpperCase();
    const seed = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const pattern = [2, 1, 3, 1, 2, 2, 1, 4, 1, 2, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 2, 1, 4, 2, 1, 3, 1];
    
    let x = 8;
    const bars = [];
    for (let i = 0; i < 48; i++) {
      const w = pattern[(seed + i * 2) % pattern.length];
      const isBlack = i % 2 === 0;
      if (isBlack) {
        bars.push(`<rect x="${x}" y="4" width="${w * 2.8}" height="32" fill="#0f172a" />`);
      }
      x += w * 2.8 + (isBlack ? 2.1 : 2.5);
    }

    return `
      <svg viewBox="0 0 380 48" style="width:100%; max-width:100%; height:auto; display:block;" xmlns="http://www.w3.org/2000/svg">
        <rect width="380" height="48" fill="#ffffff" rx="4" />
        ${bars.join('')}
        <text x="190" y="44" font-family="monospace" font-size="10.5" font-weight="900" fill="#0f172a" text-anchor="middle" letter-spacing="1.2">${escapeHTML(label)}</text>
      </svg>
    `;
  }

  function renderIDCardHTML(person, segment) {
    const sch = tenant();
    const schName = sch?.school?.name || sch?.name || 'Meezan Kids School';
    const isStudent = segment === 'STUDENT';
    const isTeacher = segment === 'TEACHER';
    const isAdmin = segment === 'ADMIN';

    const pName = isStudent ? fullName(person) : (person.name || person.fullName || fullName(person) || 'Sister Agnes');
    const uniqueId = isStudent ? (person.studentId || `NXL-MKS-STU-${String(Math.abs(parseInt(String(person.id||'421').replace(/\D/g,''),10))).padStart(6, '0')}`)
                   : isTeacher ? (person.teacherId || `NXL-MKS-TCH-${String(Math.abs(parseInt(String(person.id||'108').replace(/\D/g,''),10))).padStart(6, '0')}`)
                   : (person.adminId || `NXL-MKS-ADM-${String(Math.abs(parseInt(String(person.id||'001').replace(/\D/g,''),10))).padStart(6, '0')}`);

    const rollNum = isStudent ? (person.rollNumber || '17') : '';
    const barcodeScannableText = isStudent ? `STU-ROLL-${rollNum}-${uniqueId}` : isTeacher ? `TCH-${uniqueId}` : `ADM-${uniqueId}`;
    const barcodeLabel = isStudent ? `ROLL #${rollNum} · ${uniqueId}` : isTeacher ? `FACULTY · ${uniqueId}` : `EXECUTIVE · ${uniqueId}`;

    const cameraPayload = isStudent
      ? `STUDENT ROLL NO: ${rollNum} | NAME: ${pName} | GRADE: Grade ${studentGrade(person)}${person.section||'A'} | STUDENT ID: ${uniqueId} | SCHOOL: ${schName}`
      : isTeacher
      ? `FACULTY: ${pName} | DEPT: ${person.department||'Academics'} | TEACHER ID: ${uniqueId} | SCHOOL: ${schName}`
      : `EXECUTIVE ADMIN: ${pName} | DESIGNATION: ${person.designation||'Principal'} | ADMIN ID: ${uniqueId} | SCHOOL: ${schName}`;

    const badgeTitle = isStudent ? 'STUDENT ID CARD' : isTeacher ? 'FACULTY & STAFF ID' : 'EXECUTIVE ADMIN ID';
    const headerBg = isStudent ? 'linear-gradient(135deg, #1e3a8a, #2563eb)' : isTeacher ? 'linear-gradient(135deg, #581c87, #7c3aed)' : 'linear-gradient(135deg, #78350f, #d97706)';

    return `
      <div style="display:flex; justify-content:center; margin-bottom:1.5rem;">
        <div class="school-id-card-frame" id="printable-id-card">
          <!-- Card Top Brand Banner -->
          <div class="id-card-top-brand" style="background:${headerBg};">
            <div style="font-size:0.65rem; text-transform:uppercase; letter-spacing:0.1em; color:rgba(255,255,255,0.85); font-weight:800;">
              SCHOOL OF EXCELLENCE
            </div>
            <h2 style="margin:0.1rem 0; font-size:1.1rem; color:#ffffff; font-weight:900;">🏫 ${escapeHTML(schName)}</h2>
            <p style="margin:0; font-size:0.65rem; color:rgba(255,255,255,0.88);">
              Indiranagar, Rajendranagar, Hyderabad - 500052, Telangana
            </p>
            <div class="id-card-segment-pill">
              ${badgeTitle}
            </div>
          </div>

          <!-- Card Body: Avatar & Details -->
          <div class="id-card-body-content">
            <div style="display:flex; flex-direction:column; align-items:center; text-align:center; margin-bottom:0.4rem;">
              <div class="id-card-avatar-ring id-card-avatar-frame-large" style="width:96px; height:108px; border-radius:10px; border:2.5px solid #1e3a8a; background:#ffffff; box-shadow:0 4px 12px rgba(0,0,0,0.12); display:flex; align-items:center; justify-content:center; overflow:hidden; padding:2px; margin:0.15rem auto 0.35rem;">
                <span class="avatar avatar-id-card-large" style="width:100%; height:100%; border-radius:8px; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                  ${(person?.avatar || person?.photo || person?.avatarUrl) ? `<img src="${escapeHTML(person.avatar || person.photo || person.avatarUrl)}" alt="${escapeHTML(pName)}" style="width:100%; height:100%; object-fit:cover; border-radius:8px; display:block;" />` : `<span style="font-size:2.2rem; font-weight:800;">${escapeHTML(initials(pName))}</span>`}
                </span>
              </div>
              <h3 style="margin:0.25rem 0 0.05rem; font-size:1.12rem; color:#0f172a; font-weight:900;">
                ${escapeHTML(pName)}
              </h3>
              <div style="font-family:monospace; font-weight:800; color:#2563eb; font-size:0.8rem; letter-spacing:0.03em;">
                ${isStudent ? `ROLL #${escapeHTML(rollNum)} · ${escapeHTML(uniqueId)}` : escapeHTML(uniqueId)}
              </div>
            </div>

            <!-- Particulars Table -->
            <div class="id-card-details-table">
              ${isStudent ? `
                <div class="id-card-detail-row"><span>Grade & Sec:</span> <b>Grade ${escapeHTML(studentGrade(person))} - Section ${escapeHTML(person.section || 'A')}</b></div>
                <div class="id-card-detail-row"><span>Roll Number:</span> <b>#${escapeHTML(rollNum)}</b></div>
                <div class="id-card-detail-row"><span>Date of Birth:</span> <b>${escapeHTML(person.dateOfBirth || person.dob || '17 May 2012')}</b></div>
                <div class="id-card-detail-row"><span>Parent Name:</span> <b>${escapeHTML(person.parentName || person.guardianName || 'Dr. Tariq Khan')}</b></div>
                <div class="id-card-detail-row"><span>Emergency Mobile:</span> <b>${escapeHTML(person.parentMobile || person.phone || '+91 98450 98765')}</b></div>
                <div class="id-card-detail-row"><span>Blood Group:</span> <b>${escapeHTML(person.bloodGroup || 'O +ve')}</b></div>
              ` : isTeacher ? `
                <div class="id-card-detail-row"><span>Designation:</span> <b>Senior PGT ${escapeHTML(person.subject || 'Mathematics')}</b></div>
                <div class="id-card-detail-row"><span>Department:</span> <b>Dept. of ${escapeHTML(person.department || person.subject || 'Academics & STEM')}</b></div>
                <div class="id-card-detail-row"><span>Teaching Scope:</span> <b>Grades 8, 9, 10</b></div>
                <div class="id-card-detail-row"><span>Date of Joining:</span> <b>12 Aug 2021 (5th Year)</b></div>
                <div class="id-card-detail-row"><span>Emergency Mobile:</span> <b>${escapeHTML(person.phone || person.mobile || '+91 98765 43210')}</b></div>
                <div class="id-card-detail-row"><span>Blood Group:</span> <b>${escapeHTML(person.bloodGroup || 'B +ve')}</b></div>
              ` : `
                <div class="id-card-detail-row"><span>Designation:</span> <b>${escapeHTML(person.designation || 'Head of Institution / Principal')}</b></div>
                <div class="id-card-detail-row"><span>Access Level:</span> <b>Executive System Administrator</b></div>
                <div class="id-card-detail-row"><span>Office Ext:</span> <b>Ext #101 · Principal's Desk</b></div>
                <div class="id-card-detail-row"><span>Tenure:</span> <b>Permanent Faculty Board</b></div>
                <div class="id-card-detail-row"><span>Emergency Mobile:</span> <b>${escapeHTML(person.mobile || person.phone || '+91 98490 12345')}</b></div>
                <div class="id-card-detail-row"><span>Blood Group:</span> <b>${escapeHTML(person.bloodGroup || 'AB +ve')}</b></div>
              `}
            </div>

            <!-- Full-Length Barcode Verification Block -->
            <div class="id-card-barcode-wrap" style="margin:0.4rem 0; width:100%; background:#ffffff; padding:0.4rem 0.5rem; border:1.5px solid #0f172a; border-radius:6px; box-shadow:0 2px 6px rgba(0,0,0,0.06);">
              ${generateBarcodeSVG(barcodeScannableText, barcodeLabel)}
              <div style="font-size:0.62rem; color:#0f172a; text-align:center; margin-top:0.2rem; font-weight:800; letter-spacing:0.04em;">
                █║▌│█│║▌║││█║▌ OFFICIAL HIGH-DENSITY SCANNER BARCODE █║▌│█│║▌║││█║▌
              </div>
            </div>

            <!-- Footer Stamps & Hologram Seal -->
            <div class="id-card-footer-strip">
              <div class="id-card-hologram">
                <span>🛡️ VERIFIED</span>
              </div>
              <div style="text-align:right;">
                <div style="font-size:0.65rem; color:#b45309; font-weight:800;">[ SEAL & SIGNED ]</div>
                <div style="border-top:1px solid #0f172a; padding-top:0.15rem; font-weight:800; font-size:0.68rem;">
                  Principal / Head of Institution
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderIDCards() {
    let allStuds = students();
    if (!allStuds || allStuds.length === 0) {
      allStuds = [{ id: 'student-1', firstName: 'Amaan', lastName: 'Khan', grade: '8', section: 'A', studentId: 'NXL-MKS-STU-000421', parentName: 'Dr. Tariq Khan', parentMobile: '+91 98450 98765', bloodGroup: 'O +ve' }];
    }
    let allTchs = teachers();
    if (!allTchs || allTchs.length === 0) {
      allTchs = [{ id: 'teacher-1', firstName: 'Dr. Sarah', lastName: 'Rahman', subject: 'Mathematics', department: 'Science & AI', teacherId: 'NXL-MKS-TCH-000108', phone: '+91 98765 43210', bloodGroup: 'B +ve' }];
    }
    const adminUser = { id: 'admin-1', firstName: 'Sister', lastName: 'Agnes', designation: 'Head of Institution / Principal', mobile: '9849012345', phone: '9849012345', bloodGroup: 'AB +ve', department: 'Executive Management', adminId: 'NXL-MKS-ADM-000001' };

    const segFilter = state.idCardSegmentFilter || 'ALL';

    let peopleOptions = [];
    if (segFilter === 'ALL' || segFilter === 'STUDENT') {
      (allStuds || []).forEach(s => peopleOptions.push({ id: s.id, name: fullName(s), segment: 'STUDENT', person: s, label: `👨‍🎓 ${fullName(s)} (Student · Grade ${studentGrade(s)}${s.section||'A'})` }));
    }
    if (segFilter === 'ALL' || segFilter === 'TEACHER') {
      (allTchs || []).forEach(t => peopleOptions.push({ id: t.id, name: fullName(t) || t.name, segment: 'TEACHER', person: t, label: `👩‍🏫 ${fullName(t) || t.name} (Faculty · ${t.subject||'Academics'})` }));
    }
    if (segFilter === 'ALL' || segFilter === 'ADMIN') {
      peopleOptions.push({ id: adminUser.id, name: `${adminUser.firstName} ${adminUser.lastName}`, segment: 'ADMIN', person: adminUser, label: `👑 ${adminUser.firstName} ${adminUser.lastName} (Principal / Executive Admin)` });
    }

    if (peopleOptions.length === 0) {
      peopleOptions = [
        { id: 'student-1', name: 'Amaan Khan', segment: 'STUDENT', person: { id: 'student-1', firstName: 'Amaan', lastName: 'Khan', grade: '8', section: 'A', studentId: 'NXL-MKS-STU-000421' }, label: '👨‍🎓 Amaan Khan (Student · Grade 8A)' }
      ];
    }

    const activeId = state.selectedIDCardPersonId || (state.role === 'STUDENT' ? currentStudent()?.id : peopleOptions[0]?.id);
    const activeItem = peopleOptions.find(p => p.id === activeId) || peopleOptions[0];
    const personObj = activeItem.person;
    const segmentKind = activeItem.segment;

    const targetMobile = (personObj.parentMobile || personObj.phone || personObj.mobile || '9845098765').replace(/\D/g, '');
    const schName = tenant()?.school?.name || tenant()?.name || 'Meezan Kids School';
    const waIDMessage = encodeURIComponent(`Dear ${personObj.parentName || activeItem.name}, the official digital CR80 School ID Card for ${activeItem.name} (${segmentKind}) is issued by ${schName}. Please retain for campus verification.`);

    return `
      <!-- Segment Filter Pills & Person Picker -->
      <section class="card" style="margin-bottom:1.5rem; border:2px solid #7c3aed; background:#f8fafc; padding:1rem 1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.85rem;">
          <div>
            <div style="font-size:0.75rem; font-weight:800; color:#64748b; text-transform:uppercase; margin-bottom:0.4rem; letter-spacing:0.04em;">
              Filter Segment & Select Member:
            </div>
            <div style="display:flex; gap:0.4rem; flex-wrap:wrap; align-items:center; margin-bottom:0.65rem;">
              <button class="btn ${segFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}" style="font-size:0.75rem; padding:0.3rem 0.65rem;" data-action="filter-id-card-segment" data-segment="ALL">
                🌟 All Members
              </button>
              <button class="btn ${segFilter === 'STUDENT' ? 'btn-primary' : 'btn-secondary'}" style="font-size:0.75rem; padding:0.3rem 0.65rem;" data-action="filter-id-card-segment" data-segment="STUDENT">
                👨‍🎓 Students
              </button>
              <button class="btn ${segFilter === 'TEACHER' ? 'btn-primary' : 'btn-secondary'}" style="font-size:0.75rem; padding:0.3rem 0.65rem;" data-action="filter-id-card-segment" data-segment="TEACHER">
                👩‍🏫 Teachers / Faculty
              </button>
              <button class="btn ${segFilter === 'ADMIN' ? 'btn-primary' : 'btn-secondary'}" style="font-size:0.75rem; padding:0.3rem 0.65rem;" data-action="filter-id-card-segment" data-segment="ADMIN">
                👑 Executive Admin
              </button>
            </div>

            <select id="id-card-person-picker" style="padding:0.45rem 0.85rem; border:1.5px solid #7c3aed; border-radius:6px; font-weight:800; background:#ffffff; color:#581c87; font-size:0.88rem; cursor:pointer; min-width:320px;">
              ${peopleOptions.map(p => `
                <option value="${p.id}" ${p.id === activeItem.id ? 'selected' : ''}>
                  ${escapeHTML(p.label)}
                </option>
              `).join('')}
            </select>
          </div>

          <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
            <button class="btn ${state.showIDCardDocument ? 'btn-primary' : 'btn-secondary'}" style="font-size:0.85rem;" data-action="toggle-id-card">
              ${state.showIDCardDocument ? '👁️ Hide ID Card' : '👁️ View / Download ID Card'}
            </button>
            <a href="https://wa.me/91${targetMobile}?text=${waIDMessage}" target="_blank" class="wa-reminder-btn" style="font-size:0.85rem; padding:0.45rem 0.95rem;">
              💬 Send WhatsApp
            </a>
            <button class="btn btn-primary" style="font-size:0.85rem;" data-action="print-id-card">
              🖨️ Print / Save as PDF
            </button>
          </div>
        </div>
      </section>

      <!-- Live Official CR80 ID Card Display -->
      ${renderIDCardHTML(personObj, segmentKind)}
    `;
  }

  function renderFeesFinance() {
    const records = getTenantFeeRecords();
    const statusFilter = state.feeStatusFilter || 'ALL';
    const searchQuery = lower(state.feeSearchQuery || '');
    const activeStudentId = state.selectedFeeStudentId || (state.role === 'STUDENT' ? currentStudent()?.id : records[0]?.id);
    const activeRec = records.find(r => r.id === activeStudentId) || records[0] || {
      id: 'student-1',
      studentName: 'Amaan Khan',
      studentId: 'NXL-MKS-000421',
      grade: '8',
      section: 'A',
      parentName: 'Dr. Tariq Khan',
      parentMobile: '+91 98450 98765',
      totalFee: 80000,
      paidAmount: 55000,
      balanceDue: 25000,
      status: 'Partial',
      nextDueDate: '10 Jan 2027',
      history: []
    };
    const percentPaid = Math.round(((activeRec.paidAmount || 0) / (activeRec.totalFee || 80000)) * 100);
    const percentPending = 100 - percentPaid;
    const activeParentPhone = (activeRec.parentMobile || '+91 98450 98765').replace(/\D/g, '');
    const schName = tenant()?.school?.name || tenant()?.name || 'Meezan Kids School';
    const activeWaMessage = encodeURIComponent(`Dear ${activeRec.parentName}, this is a friendly reminder from ${schName}. The Term 3 fee balance of ₹${activeRec.balanceDue.toLocaleString()} for ${activeRec.studentName} (Grade ${activeRec.grade}${activeRec.section}) is due on ${activeRec.nextDueDate}. You can pay online via UPI/NetBanking or visit the school accounts office. Thank you!`);

    const filtered = records.filter(r => {
      const matchStatus = statusFilter === 'ALL' || r.status.toUpperCase() === statusFilter.toUpperCase();
      const matchSearch = !searchQuery || lower(r.studentName).includes(searchQuery) || lower(r.studentId).includes(searchQuery) || lower(r.parentMobile).includes(searchQuery);
      return matchStatus && matchSearch;
    });

    const totalTarget = records.reduce((acc, r) => acc + r.totalFee, 0);
    const totalCollected = records.reduce((acc, r) => acc + r.paidAmount, 0);
    const totalPending = totalTarget - totalCollected;
    const defaultersCount = records.filter(r => r.status === 'Overdue').length;

    return `
      ${sectionHead('Finance & Billing', '💳 School Fees & Finance Portal', 'Manage individual student fee ledgers, installment schedules, school-wide targets, printable PDF bills, and 1-click WhatsApp reminders.', button(`${icon('plus')} Record payment`, 'open-record-payment', 'primary'))}

      <!-- Top Student Account Inspector Bar (Just like Report Cards!) -->
      <section class="card" style="margin-bottom:1.5rem; border:2px solid #2563eb; background:#f8fafc; padding:1rem 1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.85rem;">
          <div style="display:flex; align-items:center; gap:0.85rem; flex-wrap:wrap;">
            <span style="font-size:1.4rem;">👤</span>
            <div>
              <label style="font-size:0.85rem; font-weight:800; color:#0f172a; display:block; margin-bottom:0.2rem;">
                Select Student Fee Account:
              </label>
              <select id="fee-student-picker" style="padding:0.45rem 0.85rem; border:1.5px solid #2563eb; border-radius:6px; font-weight:800; background:#ffffff; color:#1e40af; font-size:0.88rem; cursor:pointer;">
                ${records.map(r => `
                  <option value="${r.id}" ${r.id === activeRec.id ? 'selected' : ''}>
                    ${escapeHTML(r.studentName)} (Grade ${r.grade}${r.section} · ${r.balanceDue > 0 ? `Balance: ₹${r.balanceDue.toLocaleString()}` : '🟢 Paid In Full'})
                  </option>
                `).join('')}
              </select>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
            <button class="btn ${state.showFeeReceiptDocument ? 'btn-primary' : 'btn-secondary'}" style="font-size:0.85rem;" data-action="toggle-fee-document">
              ${state.showFeeReceiptDocument ? '👁️ Hide Fee Receipt' : '👁️ View / Download Fee Receipt'}
            </button>
            <a href="https://wa.me/91${activeParentPhone}?text=${activeWaMessage}" target="_blank" class="wa-reminder-btn" style="font-size:0.85rem; padding:0.45rem 0.95rem;">
              💬 Send WhatsApp to Parent
            </a>
            <button class="btn btn-primary" style="font-size:0.85rem;" data-action="print-receipt">
              🖨️ Print / Save as PDF
            </button>
            <button class="btn btn-secondary" style="font-size:0.85rem;" data-action="open-record-payment" data-id="${activeRec.id}">
              ➕ Record Payment
            </button>
          </div>
        </div>
      </section>

      <!-- Digital Fee Receipt / Bill Card (Opened Only on User Click!) -->
      ${state.showFeeReceiptDocument ? renderDigitalReceiptHTML(activeRec) : `
        <div style="background:#f8fafc; border:2px dashed #cbd5e1; border-radius:12px; padding:2rem 1.5rem; text-align:center; margin-bottom:1.5rem;">
          <div style="font-size:2.2rem; margin-bottom:0.4rem;">🧾</div>
          <h3 style="margin:0 0 0.3rem; color:#0f172a; font-size:1.1rem;">Official Digital Fee Receipt / Bill</h3>
          <p style="margin:0 0 1rem; color:#64748b; font-size:0.85rem; max-width:550px; margin-left:auto; margin-right:auto;">
            Verified payment receipt for <b>${escapeHTML(activeRec.studentName)}</b> (Grade ${escapeHTML(activeRec.grade)}${escapeHTML(activeRec.section)}) is ready. Click below to view and inspect.
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

      <!-- Active Student Summary Cards (4 KPI Cards) -->
      <section class="finance-metrics-grid" style="margin-bottom:1.5rem;">
        <div class="finance-stat-card">
          <div class="stat-label">Total Fee (${escapeHTML(activeRec.studentName)})</div>
          <div class="stat-value">₹${activeRec.totalFee.toLocaleString()}</div>
          <small style="color:#64748b; font-weight:700;">100% Comprehensive Annual</small>
        </div>
        <div class="finance-stat-card stat-success">
          <div class="stat-label">Amount Paid</div>
          <div class="stat-value">₹${activeRec.paidAmount.toLocaleString()}</div>
          <small style="color:#16a34a; font-weight:700;">${percentPaid}% Paid to Date</small>
        </div>
        <div class="finance-stat-card ${activeRec.balanceDue > 0 ? 'stat-danger' : 'stat-success'}">
          <div class="stat-label">Balance Left</div>
          <div class="stat-value">₹${activeRec.balanceDue.toLocaleString()}</div>
          <small style="color:${activeRec.balanceDue > 0 ? '#dc2626' : '#16a34a'}; font-weight:700;">${percentPending}% Pending Dues</small>
        </div>
        <div class="finance-stat-card stat-warning">
          <div class="stat-label">Next Due Date</div>
          <div class="stat-value" style="font-size:1.3rem;">${activeRec.nextDueDate}</div>
          <small style="color:#d97706; font-weight:700;">Term 3 Final Installment</small>
        </div>
      </section>

      <!-- 2 Column Section: Active Student Installments Schedule & Fee Breakdown -->
      <div class="dashboard-grid dashboard-bottom-grid" style="margin-bottom:1.5rem;">
        
        <!-- Installment Due Dates & Schedule -->
        <article class="card">
          <div class="card-heading">
            <div>
              <h3>📅 Installment Due Dates & Schedule (${escapeHTML(activeRec.studentName)})</h3>
              <p>Term milestones and live payment status</p>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap:0.85rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:0.85rem 1rem;">
              <div>
                <b style="color:#0f172a; font-size:0.92rem;">Term 1 (At Admission)</b><br/>
                <small style="color:#64748b;">Milestone Date: 10 June 2026</small>
              </div>
              <div style="text-align:right;">
                <b style="color:#0f172a;">₹30,000</b><br/>
                <span class="fee-status-pill status-paid">🟢 PAID (05 Jun 2026)</span>
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:0.85rem 1rem;">
              <div>
                <b style="color:#0f172a; font-size:0.92rem;">Term 2 (Mid-Year)</b><br/>
                <small style="color:#64748b;">Milestone Date: 10 October 2026</small>
              </div>
              <div style="text-align:right;">
                <b style="color:#0f172a;">₹25,000</b><br/>
                <span class="fee-status-pill status-paid">🟢 PAID (08 Oct 2026)</span>
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; background:${activeRec.balanceDue > 0 ? '#fef2f2' : '#f8fafc'}; border:1px solid ${activeRec.balanceDue > 0 ? '#fecaca' : '#cbd5e1'}; border-radius:8px; padding:0.85rem 1rem;">
              <div>
                <b style="color:#0f172a; font-size:0.92rem;">Term 3 (Final Term)</b><br/>
                <small style="color:#64748b;">Milestone Date: 10 January 2027</small>
              </div>
              <div style="text-align:right;">
                <b style="color:#0f172a;">₹25,000</b><br/>
                <span class="fee-status-pill ${activeRec.balanceDue > 0 ? 'status-overdue' : 'status-paid'}">
                  ${activeRec.balanceDue > 0 ? '🔴 PENDING (Due in 24 Days)' : '🟢 PAID'}
                </span>
              </div>
            </div>
          </div>
        </article>

        <!-- Fee Structure Breakdown -->
        <article class="card">
          <div class="card-heading">
            <div>
              <h3>📊 Fee Structure Breakdown (Grade ${escapeHTML(activeRec.grade)})</h3>
              <p>Institutional fee particulars configuration</p>
            </div>
          </div>
          <table class="receipt-particulars-table" style="margin:0;">
            <thead>
              <tr>
                <th>Fee Component</th>
                <th>Frequency</th>
                <th style="text-align:right;">Amount (₹)</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Tuition Fee</b></td>
                <td>Quarterly / 3 Terms</td>
                <td style="text-align:right; font-weight:700;">₹36,000</td>
                <td><small style="color:#64748b;">Core classroom academics & smart lab</small></td>
              </tr>
              <tr>
                <td><b>Annual Tech Fee</b></td>
                <td>Once per year</td>
                <td style="text-align:right; font-weight:700;">₹12,000</td>
                <td><small style="color:#64748b;">Smart classrooms, NotebookXL OS, library</small></td>
              </tr>
              <tr>
                <td><b>Lab & STEM Fee</b></td>
                <td>Once per year</td>
                <td style="text-align:right; font-weight:700;">₹6,000</td>
                <td><small style="color:#64748b;">Robotics, Science Expo kits</small></td>
              </tr>
              <tr>
                <td><b>Transport / Bus</b></td>
                <td>Term-wise</td>
                <td style="text-align:right; font-weight:700;">₹18,000</td>
                <td><small style="color:#64748b;">Route 4 (Pickup & Drop)</small></td>
              </tr>
              <tr>
                <td><b>Uniform & Books</b></td>
                <td>One-time</td>
                <td style="text-align:right; font-weight:700;">₹8,000</td>
                <td><small style="color:#64748b;">School books, bag, uniforms</small></td>
              </tr>
              <tr class="receipt-total-row">
                <td colspan="2">TOTAL ANNUAL FEE</td>
                <td style="text-align:right; color:#2563eb;">₹${activeRec.totalFee.toLocaleString()}</td>
                <td>Comprehensive Annual Fee</td>
              </tr>
            </tbody>
          </table>
        </article>
      </div>

      <!-- Active Student Payment History Table -->
      <section class="card" style="margin-bottom:2rem;">
        <div class="card-heading" style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h3>🧾 Payment History & Transaction Audit Log (${escapeHTML(activeRec.studentName)})</h3>
            <p>Verified receipts and payment audit history</p>
          </div>
          <button class="btn btn-secondary" style="font-size:0.78rem;" data-action="view-digital-receipt" data-id="${activeRec.id}">
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
              ${(activeRec.history || []).map(h => `
                <tr>
                  <td><b style="font-family:monospace; color:#2563eb;">${escapeHTML(h.receiptNo)}</b></td>
                  <td>${escapeHTML(h.date)}</td>
                  <td><b style="color:#16a34a; font-size:0.95rem;">₹${Number(h.amount).toLocaleString()}.00</b></td>
                  <td><span style="background:#f1f5f9; padding:0.2rem 0.5rem; border-radius:4px; font-weight:700; font-size:0.78rem;">${escapeHTML(h.mode || 'UPI / NetBanking')}</span></td>
                  <td><small style="color:#475569; font-weight:600;">${escapeHTML(h.collectedBy || 'Accounts Desk')}</small></td>
                  <td><span class="fee-status-pill status-paid">🟢 PAID & VERIFIED</span></td>
                  <td>
                    <button class="btn btn-secondary" style="font-size:0.75rem; padding:0.25rem 0.55rem;" data-action="view-digital-receipt" data-id="${escapeHTML(activeRec.id)}">
                      📥 Print Receipt (PDF)
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- Executive Financial Metrics (School-Wide) -->
      <h3 style="margin:2rem 0 1rem; font-size:1.15rem; color:#0f172a;">🏫 School-Wide Fee Targets & Overview</h3>
      <section class="finance-metrics-grid">
        <div class="finance-stat-card">
          <div class="stat-label">Total School Fee Target</div>
          <div class="stat-value">₹${(totalTarget / 100000).toFixed(2)} L</div>
          <small style="color:#64748b; font-weight:700;">Annual target (2026–27)</small>
        </div>
        <div class="finance-stat-card stat-success">
          <div class="stat-label">Total Collected to Date</div>
          <div class="stat-value">₹${(totalCollected / 100000).toFixed(2)} L</div>
          <small style="color:#16a34a; font-weight:700;">${((totalCollected / totalTarget) * 100).toFixed(1)}% collection rate</small>
        </div>
        <div class="finance-stat-card stat-warning">
          <div class="stat-label">Pending Dues Balance</div>
          <div class="stat-value">₹${(totalPending / 100000).toFixed(2)} L</div>
          <small style="color:#d97706; font-weight:700;">Term 2 & 3 pending</small>
        </div>
        <div class="finance-stat-card stat-danger">
          <div class="stat-label">Overdue Defaulters List</div>
          <div class="stat-value">${defaultersCount} Students</div>
          <small style="color:#dc2626; font-weight:700;">Older than 30 days dues</small>
        </div>
      </section>

      <!-- Collection Mode Breakdown Mini Banner -->
      <section class="card" style="margin-bottom:1.5rem; padding:1rem 1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem; flex-wrap:wrap; gap:0.5rem;">
          <div>
            <h4 style="margin:0; font-size:0.88rem; color:#0f172a;">💳 Collection Mode Breakdown</h4>
            <p style="margin:0; font-size:0.75rem; color:#64748b;">Live distribution of fee payment methods across school</p>
          </div>
          <div style="font-size:0.78rem; font-weight:700; color:#2563eb;">Total Transactions: ₹${(totalCollected / 100000).toFixed(2)} L</div>
        </div>
        <div style="display:flex; height:12px; border-radius:6px; overflow:hidden; margin-bottom:0.6rem;">
          <div style="width:52%; background:#2563eb;" title="UPI / QR: 52%"></div>
          <div style="width:28%; background:#7c3aed;" title="NetBanking: 28%"></div>
          <div style="width:12%; background:#16a34a;" title="Cash: 12%"></div>
          <div style="width:8%; background:#f59e0b;" title="Cheque / DD: 8%"></div>
        </div>
        <div style="display:flex; gap:1.25rem; font-size:0.75rem; color:#475569; font-weight:700; flex-wrap:wrap;">
          <span><i style="display:inline-block; width:8px; height:8px; background:#2563eb; border-radius:50%; margin-right:4px;"></i> UPI / GPay (52%)</span>
          <span><i style="display:inline-block; width:8px; height:8px; background:#7c3aed; border-radius:50%; margin-right:4px;"></i> NetBanking (28%)</span>
          <span><i style="display:inline-block; width:8px; height:8px; background:#16a34a; border-radius:50%; margin-right:4px;"></i> Cash at Counter (12%)</span>
          <span><i style="display:inline-block; width:8px; height:8px; background:#f59e0b; border-radius:50%; margin-right:4px;"></i> Cheque / DD (8%)</span>
        </div>
      </section>

      <!-- 3. Student Fee Ledger Card -->
      <section class="card">
        <div class="card-heading" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
          <div>
            <h3>3. 👤 School-Wide Student Fee Ledger & Live Audit Trail</h3>
            <p>Real-time status, digital invoice downloads, and WhatsApp fee reminders</p>
          </div>
        </div>

        <div class="filters" style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:0.75rem; margin-top:0.5rem;">
          <label class="filter-search">
            ${icon('search')}
            <input id="fee-search-input" value="${escapeHTML(state.feeSearchQuery || '')}" placeholder="Search student name, ID, parent mobile…" />
          </label>
          <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
            ${['ALL', 'Paid', 'Partial', 'Overdue'].map(st => `
              <button class="btn ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}" style="font-size:0.78rem; padding:0.35rem 0.65rem;" data-action="filter-fee-status" data-status="${st}">
                ${st === 'ALL' ? 'All Accounts' : st}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Grade</th>
                <th>Total Fee</th>
                <th>Paid Amount</th>
                <th>Balance Left</th>
                <th>Status</th>
                <th>Next Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(r => {
                const statusClass = r.status === 'Paid' ? 'status-paid' : r.status === 'Overdue' ? 'status-overdue' : 'status-partial';
                const parentPhone = r.parentMobile.replace(/\D/g, '');
                const waText = encodeURIComponent(`Dear ${r.parentName}, this is a friendly reminder from ${tenant()?.school?.name || tenant()?.name || 'Meezan Kids School'}. The Term 3 fee balance of ₹${r.balanceDue.toLocaleString()} for ${r.studentName} (Grade ${r.grade}${r.section}) is due on ${r.nextDueDate}. You can pay online via UPI/NetBanking or visit the school accounts office. Thank you!`);
                return `
                  <tr>
                    <td>
                      <div style="display:flex; align-items:center; gap:0.65rem;">
                        ${avatar(r.student, 'avatar-small')}
                        <div>
                          <a class="table-link" data-action="open-student" data-id="${escapeHTML(r.id)}"><b>${escapeHTML(r.studentName)}</b></a><br/>
                          <small style="color:#64748b;">${escapeHTML(r.studentId)}</small>
                        </div>
                      </div>
                    </td>
                    <td><b>Grade ${escapeHTML(r.grade)}${escapeHTML(r.section)}</b></td>
                    <td>₹${r.totalFee.toLocaleString()}</td>
                    <td><b style="color:#16a34a;">₹${r.paidAmount.toLocaleString()}</b></td>
                    <td><b style="color:${r.balanceDue > 0 ? '#dc2626' : '#16a34a'};">₹${r.balanceDue.toLocaleString()}</b></td>
                    <td>
                      <span class="fee-status-pill ${statusClass}">
                        ${r.status === 'Paid' ? '🟢 Paid' : r.status === 'Overdue' ? '🔴 Overdue' : '🟡 Partial'}
                      </span>
                    </td>
                    <td><small style="font-weight:700; color:#475569;">${r.nextDueDate}</small></td>
                    <td>
                      <div style="display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap;">
                        <button class="btn btn-secondary" style="font-size:0.72rem; padding:0.25rem 0.5rem;" data-action="view-digital-receipt" data-id="${escapeHTML(r.id)}">
                          🧾 Digital Bill (PDF)
                        </button>
                        ${r.balanceDue > 0 ? `
                          <button class="btn" style="font-size:0.72rem; padding:0.25rem 0.6rem; background:#16a34a; color:#ffffff; border:none; border-radius:6px; font-weight:700; cursor:pointer;" data-action="open-razorpay-online" data-id="${escapeHTML(r.id)}">
                            💳 Pay Online (UPI)
                          </button>
                          <a href="https://wa.me/91${parentPhone}?text=${waText}" target="_blank" class="wa-reminder-btn" title="Send WhatsApp Fee Reminder">
                            💬 WhatsApp
                          </a>
                        ` : ''}
                        <button class="btn btn-primary" style="font-size:0.72rem; padding:0.25rem 0.5rem;" data-action="open-record-payment" data-id="${escapeHTML(r.id)}">
                          ➕ Manual Entry
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  function renderReportCards() {
    return renderReportCardsModule(state, students, currentStudent, studentAverage, studentAttendance, tenant, subjects, displayGrade, sectionHead, escapeHTML, fullName);
  }

  function renderPage() {
    if (state.profile) return renderProfile();
    if (state.page === 'class-view') return renderClassView();
    if (state.page === 'dashboard') return state.role === 'TEACHER' ? renderTeacherDashboard() : state.role === 'STUDENT' ? renderStudentDashboard() : renderManagementDashboard();
    if (state.page === 'leaderboard') return renderLeaderboard();
    if (state.page === 'exam-studio') return renderAIExamStudio();
    if (state.page === 'ai-prep') return renderAIStudyCoach();
    if (state.page === 'pocket-portal') return renderParentStudentPortal();
    if (state.page === 'fees') return renderFeesFinance();
    if (state.page === 'report-cards') return renderReportCards();
    if (state.page === 'id-cards') return renderIDCards();
    if (state.page === 'inquiries') return renderSchoolInquiries();
    if (state.page === 'students' || state.page === 'my-students') return renderPeople('students');
    if (state.page === 'teachers') return renderPeople('teachers');
    if (state.page === 'subjects' || state.page === 'my-subjects') return renderSubjects();
    if (state.page === 'academic-years') return renderAcademicYears();
    if (state.page === 'timetable') return renderTimetable();
    if (state.page === 'attendance') return renderAttendance();
    if (state.page === 'assignments') return renderAssignments();
    if (state.page === 'assessments') return renderAssessments();
    if (state.page === 'tasks') return renderTasks();
    if (state.page === 'workload') return renderWorkload();
    if (state.page === 'announcements') return renderAnnouncements();
    if (state.page === 'calendar') return renderCalendar();
    if (state.page === 'reports') return renderReports();
    if (state.page === 'analytics') return renderAnalytics();
    if (state.page === 'aira') return renderAiraManagement();
    if (state.page === 'notifications') return renderNotifications();
    if (state.page === 'audit-logs') return renderAuditLogs();
    if (state.page === 'settings') return renderSettings();
    if (state.page === 'my-classes') return renderMyClasses();
    if (state.page === 'lesson-plans') return renderLessonPlans();
    if (state.page === 'results') return renderStudentResults();
    if (state.page === 'performance') return renderStudentPerformance();
    if (state.page === 'history') return renderStudentHistory();
    if (state.page === 'achievements') return renderAchievements();
    return renderManagementDashboard();
  }

  function suggestedPrompts() {
    if (state.role === 'STUDENT') return ['☀️ Morning Briefing', 'Show my progress', 'What assignments are pending?', 'Help me practice Mathematics'];
    if (state.role === 'TEACHER') return ['☀️ Morning Briefing', '📝 Generate Quiz (MCQ & Fill-Blanks)', '📄 Create Lesson Plan', 'Find students needing attention'];
    return ['☀️ Morning Briefing', "Give me today's school pulse", 'Analyze attendance', 'Show teacher workload & risks'];
  }

  function generateMorningBriefing() {
    const role = state.role || 'SCHOOL_ADMIN';
    const student = currentStudent();
    const teacher = currentTeacher();
    const metrics = dashboardMetrics();
    const today = 'Monday, 17 August 2026';

    if (role === 'STUDENT') {
      return `☀️ <b>Good Morning, ${escapeHTML((student?.firstName || 'Student'))}!</b><br><br>` +
             `📅 <b>Date:</b> ${today}<br>` +
             `📊 <b>Your Academic Status:</b> Overall average is <b>${decimal(studentAverage(student))}%</b> with <b>${decimal(studentAttendance(student))}%</b> attendance.<br>` +
             `📝 <b>Pending Deadlines:</b><br>` +
             `• <i>Mathematics Practice Worksheet</i> (Due tomorrow, 18 Aug)<br>` +
             `• <i>Science Lab Report</i> (Due Friday, 22 Aug)<br><br>` +
             `💡 <i>Tip from Erum AI:</i> Practice 15 minutes of Algebra today to maintain your top grade rank!`;
    }
    if (role === 'TEACHER') {
      const classes = teacherAssignments(teacher);
      const workload = teacherWorkload(teacher);
      return `☀️ <b>Good Morning, ${escapeHTML((teacher?.firstName || 'Teacher'))}!</b><br><br>` +
             `📅 <b>Date:</b> ${today}<br>` +
             `🏫 <b>Schedule Today:</b> You have <b>${classes.length} active classes</b> scheduled.<br>` +
             `• <b>08:30 AM:</b> Grade ${classes[0]?.grade || 8}${classes[0]?.section || 'A'} ${classes[0]?.subject || 'Mathematics'}<br>` +
             `• <b>10:15 AM:</b> Grade ${classes[1]?.grade || 8}${classes[1]?.section || 'B'} ${classes[1]?.subject || 'Mathematics'}<br>` +
             `📌 <b>Action Items:</b><br>` +
             `• <b>${workload.pendingReviews || 7} assignment submissions</b> pending your review.<br>` +
             `• <b>Attendance check:</b> 3 students had consecutive absences last week.<br><br>` +
             `✨ <i>Need quick lesson tools? Ask me to generate MCQs or Lesson Plans!</i>`;
    }
    return `☀️ <b>Good Morning, Administrator!</b><br><br>` +
           `📅 <b>Date:</b> ${today}<br>` +
           `🏛️ <b>School Operations Overview:</b><br>` +
           `• 👥 <b>Student Attendance:</b> <b>${decimal(metrics.attendance)}%</b> today across ${compact(metrics.students)} enrolled students.<br>` +
           `• 👩‍🏫 <b>Staff Attendance:</b> <b>${decimal(metrics.teacherAttendance)}%</b> (19 of 20 faculty present).<br>` +
           `• 📈 <b>Academic Average:</b> <b>${decimal(metrics.academic)}%</b> across published assessments.<br>` +
           `⚠️ <b>Key Attention Signals:</b><br>` +
           `• Grade 8C attendance dropped 4.1% this week.<br>` +
           `• 42 overdue assignments across 8 class sections.<br>` +
           `• Fee collections: 88.4% target reached for Term 1.`;
  }

  function airaResponse(prompt) {
    const input = lower(prompt);
    const role = state.role || 'SCHOOL_ADMIN';

    // Morning Briefing request
    if (input.includes('morning briefing') || input.includes('briefing') || input.includes('morning')) {
      return generateMorningBriefing();
    }

    const metrics = dashboardMetrics();
    const weakest = [...students()].sort((a, b) => studentAttendance(a) - studentAttendance(b)).slice(0, 3);
    const mostLoaded = [...teachers()].sort((a, b) => (teacherWorkload(b).weeklyPeriods || 0) - (teacherWorkload(a).weeklyPeriods || 0)).slice(0, 2);

    // ==========================================
    // 🔒 ROLE: STUDENT (Self data only)
    // ==========================================
    if (role === 'STUDENT') {
      const student = currentStudent();
      // Block admin or teacher data exposure
      if (input.includes('teacher') || input.includes('salary') || input.includes('fee collection') || input.includes('admin') || input.includes('other student')) {
        return `🔒 <b>Security Restriction:</b> As a Student, you can only query your own academic records, homework assignments, and timetable. Private administrative and faculty details are protected.`;
      }
      if (input.includes('attendance')) return `Your current attendance rate is <b>${decimal(studentAttendance(student))}%</b>. You have been present for 171 of 181 school days this academic year.`;
      if (input.includes('assignment') || input.includes('pending') || input.includes('homework')) return `You have <b>2 pending assignments</b>:<br>1. <i>Mathematics Practice</i> (Due 18 Aug)<br>2. <i>Science Chapter 4 Lab</i> (Due 22 Aug).`;
      if (input.includes('practice') || input.includes('math') || input.includes('help')) return `<b>Math Practice Question (Fractions):</b><br>What is <b>3/4 + 1/8</b>?<br><br><details><summary>Click for Answer & Hint</summary>Convert to common denominator 8: 6/8 + 1/8 = <b>7/8</b>.</details>`;
      return `Your current academic average is <b>${decimal(studentAverage(student))}%</b> with <b>${decimal(studentAttendance(student))}%</b> attendance. Mathematics is one of your top scoring subjects!`;
    }

    // ==========================================
    // 🔒 ROLE: TEACHER (Class context & Generator tools)
    // ==========================================
    if (role === 'TEACHER') {
      const teacher = currentTeacher();
      const classes = teacherAssignments(teacher);
      
      // Block administrative financial exposure
      if (input.includes('school budget') || input.includes('total revenue') || input.includes('admin salary') || input.includes('bank account')) {
        return `🔒 <b>Security Restriction:</b> Faculty access is scoped to class gradebooks, teaching schedules, and student academic performance. Financial admin data is restricted.`;
      }

      // Quiz Generator Tool (MCQs + Fill in the Blanks)
      if (input.includes('quiz') || input.includes('mcq') || input.includes('fill') || input.includes('question paper') || input.includes('worksheet')) {
        return `📝 <b>Generated Quiz & Answer Key: Grade 8 Science / Math</b><br><br>` +
               `<b>PART A: Multiple Choice Questions (MCQs)</b><br>` +
               `1. What is the chemical symbol for Photosynthesis reactant water?<br>` +
               `   A) CO2 &nbsp;&nbsp; B) H2O &nbsp;&nbsp; C) O2 &nbsp;&nbsp; D) NaCl<br><br>` +
               `2. Solve for x: 2x + 6 = 14.<br>` +
               `   A) 3 &nbsp;&nbsp; B) 4 &nbsp;&nbsp; C) 5 &nbsp;&nbsp; D) 6<br><br>` +
               `<b>PART B: Fill in the Blanks</b><br>` +
               `3. The organelle responsible for cellular respiration is the ____________.<br>` +
               `4. The perimeter of a square with side length 7cm is ____________ cm.<br><br>` +
               `🔑 <b>ANSWER SHEET & KEY:</b><br>` +
               `1: B (H2O) | 2: B (x=4) | 3: Mitochondria | 4: 28 cm`;
      }

      // Lesson Plan Generator Tool
      if (input.includes('lesson plan') || input.includes('lesson') || input.includes('prepare')) {
        return `📄 <b>Structured 45-Minute Lesson Plan:</b><br><br>` +
               `🎯 <b>Topic:</b> Introduction to Quadratic Equations & Graphs<br>` +
               `⏱️ <b>00–05m (Hook):</b> Quick recap on linear equations.<br>` +
               `⏱️ <b>05–20m (Direct Instruction):</b> Explain standard form <i>ax² + bx + c = 0</i> with board examples.<br>` +
               `⏱️ <b>20–35m (Guided Practice):</b> Students solve worksheet problems in pairs.<br>` +
               `⏱️ <b>35–45m (Exit Ticket):</b> 2 quick check-for-understanding questions.`;
      }

      if (input.includes('attention') || input.includes('student') || input.includes('weak')) {
        return `In Grade ${classes[0]?.grade || 8}${classes[0]?.section || 'A'}, focus first on <b>${weakest.map(fullName).join(', ')}</b>. Their recent attendance and completion metrics show they may benefit from a 1-on-1 check-in.`;
      }

      return `You have <b>${teacherWorkload(teacher).pendingReviews || 7} pending reviews</b> and <b>${classes.length} active class sections</b>. Next class: <i>${classes[0]?.subject || 'Mathematics'}</i> for Grade ${classes[0]?.grade || 8}${classes[0]?.section || 'A'}.`;
    }

    // ==========================================
    // 🔓 ROLE: ADMIN / SUPER ADMIN (Full exposure)
    // ==========================================
    if (input.includes('attendance')) return `Overall school attendance is <b>${decimal(metrics.attendance)}%</b>. Grade 8C has dropped by 4.1% this month. Students needing follow-up: ${weakest.map((student) => `<b>${fullName(student)}</b> (${decimal(studentAttendance(student))}%)`).join(', ')}.`;
    if (input.includes('workload') || input.includes('teacher') || input.includes('risk')) return `Highest teaching workloads: ${mostLoaded.map((teacher) => `<b>${fullName(teacher)}</b> (${teacherWorkload(teacher).weeklyPeriods || 28} periods/wk)`).join(' and ')}. 4 faculty members have elevated pending reviews.`;
    if (input.includes('grade') || input.includes('section') || input.includes('pulse')) return `School Pulse Summary: <b>${compact(metrics.students)}</b> students, <b>${metrics.teachers}</b> teachers, <b>${decimal(metrics.attendance)}%</b> student attendance, and <b>${decimal(metrics.academic)}%</b> academic average.`;
    if (input.includes('assignment') || input.includes('overdue')) return `Assignment completion across school is <b>${decimal(metrics.completion)}%</b>. 42 submissions are overdue across 8 sections.`;
    
    return `Today's School Pulse: <b>${compact(metrics.students)}</b> students, <b>${metrics.teachers}</b> faculty members, <b>${decimal(metrics.attendance)}%</b> student attendance, <b>${decimal(metrics.academic)}%</b> academic average. Ask me about attendance, teacher workloads, student performance, or morning briefings!`;
  }

  function renderAira() {
    const prompts = suggestedPrompts();
    const userFirstName = escapeHTML(fullName(currentUser()).split(' ')[0] || 'User');
    const roleTitle = escapeHTML(roleLabels[state.role] || 'User');

    return `
      <button class="aira-fab ${state.airaOpen ? 'hidden' : ''}" data-action="toggle-aira" aria-label="Open Erum AI Assistant">
        <span style="font-size:1.25rem;">🤖</span>
        <span style="font-weight:800; font-size:0.85rem; letter-spacing:0.3px;">Erum AI</span>
      </button>
      ${state.airaOpen ? `
        <aside class="aira-panel" aria-label="Erum AI Assistant" style="position:fixed; bottom:20px; right:20px; width:380px; max-width:calc(100vw - 30px); height:560px; max-height:calc(100vh - 40px); background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; box-shadow:0 20px 48px rgba(15,23,42,0.22); z-index:99999; display:flex; flex-direction:column; overflow:hidden; font-family:Inter,sans-serif;">
          <header style="background:linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%); color:#ffffff; padding:0.9rem 1.1rem; display:flex; align-items:center; justify-content:space-between;">
            <div style="display:flex; align-items:center; gap:0.65rem;">
              <div style="width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,0.18); display:flex; align-items:center; justify-content:center; font-size:1.2rem; border:1px solid rgba(255,255,255,0.3);">🤖</div>
              <div>
                <b style="font-size:1.05rem; display:block; line-height:1.2;">Erum AI Assistant</b>
                <small style="color:#c7d2fe; font-size:0.75rem;">Instant Briefings & School Intelligence</small>
              </div>
            </div>
            <button class="icon-button" data-action="toggle-aira" aria-label="Close Erum AI" style="color:#ffffff; background:rgba(255,255,255,0.15); border:none; border-radius:50%; width:30px; height:30px; cursor:pointer; display:flex; align-items:center; justify-content:center;">${icon('close')}</button>
          </header>

          <div class="aira-conversation" id="aira-conversation" style="flex:1; overflow-y:auto; padding:1rem; display:flex; flex-direction:column; gap:0.85rem; background:#f8fafc;">
            <div class="aira-welcome" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:0.9rem; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.4rem; color:#4338ca; font-weight:700; font-size:0.9rem;">
                <span>🤖</span> <span>Hi ${userFirstName}!</span>
              </div>
              <p style="margin:0; font-size:0.84rem; color:#334155; line-height:1.45;">
                I am <b>Erum AI</b>, your intelligent school copilot for <b>NotebookXL</b>. I can generate lesson plans, quizzes, analyze attendance anomalies, or provide instant executive morning briefings!
              </p>
              <div style="margin-top:0.5rem; font-size:0.73rem; color:#64748b; background:#f1f5f9; padding:0.35rem 0.6rem; border-radius:6px; display:inline-block;">
                🔒 Scoped to <b>${roleTitle}</b> security boundaries
              </div>
            </div>

            ${state.lastAiraPrompt ? `
              <div class="aira-user-message" style="align-self:flex-end; background:#4338ca; color:#ffffff; padding:0.65rem 0.9rem; border-radius:14px 14px 2px 14px; font-size:0.85rem; max-width:85%; word-break:break-word;">
                ${escapeHTML(state.lastAiraPrompt)}
              </div>
              <div class="aira-answer" style="align-self:flex-start; background:#ffffff; border:1px solid #e2e8f0; color:#1e293b; padding:0.85rem 1rem; border-radius:14px 14px 14px 2px; font-size:0.84rem; max-width:92%; line-height:1.5; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                ${state.lastAiraAnswer || ''}
              </div>
            ` : `
              <div style="background:#eef2ff; border:1px dashed #6366f1; border-radius:12px; padding:0.8rem; text-align:center;">
                <p style="margin:0 0 0.4rem 0; font-size:0.82rem; font-weight:600; color:#3730a3;">☀️ Start your day with Erum AI</p>
                <button data-action="aira-prompt" data-prompt="☀️ Morning Briefing" style="background:#4338ca; color:#ffffff; border:none; padding:0.4rem 0.85rem; border-radius:8px; font-size:0.78rem; font-weight:600; cursor:pointer;">Click for Morning Briefing</button>
              </div>
            `}
          </div>

          <div class="aira-suggestions" style="padding:0.6rem 0.8rem; background:#ffffff; border-top:1px solid #e2e8f0; display:flex; flex-wrap:wrap; gap:0.4rem;">
            ${prompts.map((prompt) => `
              <button data-action="aira-prompt" data-prompt="${escapeHTML(prompt)}" style="background:#f1f5f9; color:#334155; border:1px solid #cbd5e1; border-radius:16px; padding:0.3rem 0.65rem; font-size:0.75rem; font-weight:500; cursor:pointer; transition:all 0.15s ease;">
                ${escapeHTML(prompt)}
              </button>
            `).join('')}
          </div>

          <form class="aira-input" id="aira-form" style="padding:0.65rem 0.8rem; background:#ffffff; border-top:1px solid #e2e8f0; display:flex; gap:0.5rem; align-items:center;">
            <input name="airaPrompt" placeholder="Ask Erum AI anything..." autocomplete="off" style="flex:1; border:1px solid #cbd5e1; border-radius:10px; padding:0.5rem 0.75rem; font-size:0.84rem; outline:none;" />
            <button aria-label="Send question" style="background:#4338ca; color:#ffffff; border:none; border-radius:10px; width:36px; height:36px; display:flex; align-items:center; justify-content:center; cursor:pointer;">
              ${icon('arrow')}
            </button>
          </form>
        </aside>
      ` : ''}
    `;
  }

  function modalShell(title, content, footer = '') {
    return `<div class="modal-backdrop" data-action="close-modal"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onclick="event.stopPropagation()"><header><div><p class="eyebrow">NotebookXL</p><h2 id="modal-title">${escapeHTML(title)}</h2></div><button class="icon-button" data-action="close-modal" aria-label="Close">${icon('close')}</button></header><div class="modal-content">${content}</div>${footer ? `<footer class="modal-footer">${footer}</footer>` : ''}</section></div>`;
  }
  function field(label, name, type = 'text', placeholder = '') { return `<label>${escapeHTML(label)}<input name="${escapeHTML(name)}" type="${type}" placeholder="${escapeHTML(placeholder)}" required /></label>`; }
  function selectField(label, name, options) { return `<label>${escapeHTML(label)}<select name="${escapeHTML(name)}">${options.map(([value,text]) => `<option value="${escapeHTML(value)}">${escapeHTML(text)}</option>`).join('')}</select></label>`; }
  function renderModal() {
    if (!state.modal) return '';
    if (state.modal === 'pulse') { const metrics = dashboardMetrics(); return modalShell('School Pulse', `<div class="pulse-modal"><p>Your school’s live operational summary for Thursday, 13 August 2026.</p><div class="metric-grid">${metric('Attendance', decimal(metrics.attendance), 'Student attendance today', 'green', 'check')}${metric('Academic performance', decimal(metrics.academic), 'Published assessment average', 'purple', 'chart')}${metric('Assignments', decimal(metrics.completion), 'Completed this term', 'blue', 'task')}${metric('Teacher attendance', decimal(metrics.teacherAttendance), '19 of 20 present', 'amber', 'people')}</div><h3>Areas requiring attention</h3><ul class="modal-insights"><li><b>Grade 8C attendance</b> declined this month.</li><li><b>Mathematics performance</b> dropped in Grade 7B.</li><li><b>6 teachers</b> have high pending workload.</li><li><b>42 student assignments</b> are overdue.</li></ul></div>`, `<button class="btn btn-secondary" data-action="close-modal">Close</button><button class="btn btn-primary" data-action="nav-and-close" data-page="reports">View reports</button>`); }
    if (state.modal === 'add-subject') return modalShell('Add subject', `<form id="subject-form" class="form-grid">${field('Subject name', 'name', 'text', 'e.g. Environmental Science')}${field('Subject code', 'code', 'text', 'e.g. EVS')}${selectField('Assign to grades', 'grades', [['1,2,3,4,5','Grades 1–5'],['6,7,8','Grades 6–8'],['9,10','Grades 9–10'],['1,2,3,4,5,6,7,8,9,10','All grades']])}${selectField('Status', 'status', [['Active','Active'],['Disabled','Disabled']])}<p class="form-note">Once saved, assign this subject to sections and teachers from its management page.</p></form>`, `<button class="btn btn-secondary" data-action="close-modal">Cancel</button><button class="btn btn-primary" form="subject-form" type="submit">Save subject</button>`);
    if (state.modal === 'exam-paper') {
      const schName = tenant()?.school?.name || tenant()?.name || 'Meezan Kids School';
      return modalShell(
        'Printable Examination Paper & Answer Key',
        `<div style="font-family:Inter,sans-serif; color:#1e293b; padding:0.5rem;">
          <div style="border:2px solid #0f172a; padding:1rem; border-radius:8px; background:#ffffff; margin-bottom:1rem;">
            <div style="text-align:center; border-bottom:2px double #0f172a; padding-bottom:0.75rem; margin-bottom:0.75rem;">
              <h2 style="margin:0; font-size:1.3rem; text-transform:uppercase; letter-spacing:0.5px; color:#0f172a;">${escapeHTML(schName)}</h2>
              <p style="margin:0.2rem 0 0 0; font-size:0.85rem; font-weight:700; color:#475569;">MID-TERM EXAMINATION (2026–2027) • MATHEMATICS & SCIENCE</p>
              <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:700; margin-top:0.6rem; color:#1e293b;">
                <span>GRADE: 8 (SECTION A & B)</span>
                <span>TIME ALLOWED: 1.5 HOURS</span>
                <span>MAXIMUM MARKS: 50</span>
              </div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; border-bottom:1px solid #cbd5e1; padding-bottom:0.5rem; margin-bottom:0.8rem;">
              <span>Student Name: __________________________</span>
              <span>Roll No: _______</span>
              <span>Date: 17 Aug 2026</span>
            </div>
            <div style="font-size:0.85rem; line-height:1.6;">
              <p style="font-weight:700; margin:0.5rem 0 0.25rem 0; color:#0f172a;">SECTION A: MULTIPLE CHOICE QUESTIONS (MCQs) [10 MARKS]</p>
              <ol style="margin:0 0 0.8rem 1.2rem; padding:0;">
                <li style="margin-bottom:0.4rem;">What is the solution for the equation 3x + 15 = 45?<br><span style="color:#475569;">(A) x = 5 &nbsp;&nbsp; (B) x = 10 &nbsp;&nbsp; (C) x = 15 &nbsp;&nbsp; (D) x = 20</span></li>
                <li style="margin-bottom:0.4rem;">Which organelle is responsible for photosynthesis in plant cells?<br><span style="color:#475569;">(A) Mitochondria &nbsp;&nbsp; (B) Chloroplast &nbsp;&nbsp; (C) Nucleus &nbsp;&nbsp; (D) Ribosome</span></li>
              </ol>

              <p style="font-weight:700; margin:0.5rem 0 0.25rem 0; color:#0f172a;">SECTION B: FILL IN THE BLANKS [10 MARKS]</p>
              <ol start="3" style="margin:0 0 0.8rem 1.2rem; padding:0;">
                <li style="margin-bottom:0.4rem;">The product of (x + 4)(x - 4) is ______________________.</li>
                <li style="margin-bottom:0.4rem;">The gas released during photosynthesis is ______________________.</li>
              </ol>

              <div style="background:#f8fafc; border:1px dashed #94a3b8; border-radius:8px; padding:0.75rem; margin-top:1rem;">
                <b style="color:#16a34a; font-size:0.85rem;">🔑 CONFIDENTIAL TEACHER ANSWER KEY & MARKING SCHEME:</b>
                <p style="margin:0.3rem 0 0 0; font-size:0.8rem; color:#334155;">
                  Q1: <b>(B) x = 10</b> | Q2: <b>(B) Chloroplast</b> | Q3: <b>x² - 16</b> | Q4: <b>Oxygen (O₂)</b>
                </p>
              </div>
            </div>
          </div>
        </div>`,
        `<button class="btn btn-secondary" data-action="close-modal">Close</button><button class="btn btn-primary" onclick="window.print()">🖨️ Print Exam Paper (PDF)</button>`
      );
    }
    if (state.modal === 'razorpay-checkout') {
      const records = getTenantFeeRecords();
      const rec = records.find(r => r.id === state.selectedOnlinePayStudentId) || records[0];
      const schName = tenant()?.school?.name || tenant()?.name || 'Meezan Kids School';
      return modalShell(
        'Razorpay Instant Online Payment Gateway',
        `<div style="font-family:Inter,sans-serif; text-align:center; padding:0.5rem;">
          <div style="background:linear-gradient(135deg, #0c2340 0%, #1a365d 100%); color:#ffffff; padding:1.25rem; border-radius:14px; margin-bottom:1rem;">
            <span style="font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; color:#93c5fd;">SECURE CHECKOUT • ${escapeHTML(schName)}</span>
            <h2 style="color:#ffffff; margin:0.4rem 0 0.2rem 0; font-size:1.5rem;">₹${(rec?.balanceDue || 0).toLocaleString()}</h2>
            <p style="color:#cbd5e1; font-size:0.82rem; margin:0;">Term 3 Tuition & Activity Fee Balance for <b>${escapeHTML(rec?.studentName)}</b> (${escapeHTML(rec?.studentId)})</p>
          </div>

          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1rem; text-align:left; margin-bottom:1rem; font-size:0.85rem;">
            <div style="font-weight:700; color:#1e293b; margin-bottom:0.6rem;">Select Instant Payment Method:</div>
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
              <label style="display:flex; align-items:center; gap:0.65rem; background:#ffffff; border:2px solid #2563eb; padding:0.6rem 0.8rem; border-radius:8px; cursor:pointer;">
                <input type="radio" name="payOption" checked style="accent-color:#2563eb;" />
                <div>
                  <b style="color:#0f172a; display:block;">📱 UPI / QR (GPay, PhonePe, Paytm, BHIM)</b>
                  <small style="color:#64748b;">Instant 0% fee transaction</small>
                </div>
              </label>
              <label style="display:flex; align-items:center; gap:0.65rem; background:#ffffff; border:1px solid #cbd5e1; padding:0.6rem 0.8rem; border-radius:8px; cursor:pointer;">
                <input type="radio" name="payOption" style="accent-color:#2563eb;" />
                <div>
                  <b style="color:#0f172a; display:block;">🏛️ NetBanking (SBI, HDFC, ICICI, Axis)</b>
                  <small style="color:#64748b;">All Indian major banks supported</small>
                </div>
              </label>
              <label style="display:flex; align-items:center; gap:0.65rem; background:#ffffff; border:1px solid #cbd5e1; padding:0.6rem 0.8rem; border-radius:8px; cursor:pointer;">
                <input type="radio" name="payOption" style="accent-color:#2563eb;" />
                <div>
                  <b style="color:#0f172a; display:block;">💳 Debit / Credit Card (Visa, Mastercard, RuPay)</b>
                  <small style="color:#64748b;">256-bit SSL Encrypted</small>
                </div>
              </label>
            </div>
          </div>
          
          <div style="font-size:0.75rem; color:#64748b;">
            🔒 Powered by <b>Razorpay PG</b> • 256-bit Bank Grade Security
          </div>
        </div>`,
        `<button class="btn btn-secondary" data-action="close-modal">Cancel</button><button class="btn btn-primary" data-action="process-razorpay-pay" style="background:#16a34a; border-color:#16a34a;">⚡ Complete ₹${(rec?.balanceDue || 0).toLocaleString()} Payment Now</button>`
      );
    }
    if (state.modal === 'add-teacher') return modalShell('Add teacher', `<form id="teacher-form" class="form-grid two-col">${field('First name', 'firstName', 'text', 'e.g. Ayesha')}${field('Last name', 'lastName', 'text', 'e.g. Khan')}${selectField('Gender', 'gender', [['Female','Female'],['Male','Male']])}${field('Department', 'department', 'text', 'e.g. Mathematics')}${field('Employee ID', 'employeeId', 'text', 'e.g. MKS-T-021')}${selectField('Primary subject', 'subject', subjects().map((subject) => [subject.name, subject.name]))}</form>`, `<button class="btn btn-secondary" data-action="close-modal">Cancel</button><button class="btn btn-primary" form="teacher-form" type="submit">Create teacher</button>`);
    if (state.modal === 'add-assignment') return modalShell('Create assignment', `<form id="assignment-form" class="form-grid">${field('Assignment title', 'title', 'text', 'e.g. Fractions practice worksheet')}${selectField('Subject', 'subject', subjects().map((subject) => [subject.name, subject.name]))}<div class="form-split">${selectField('Grade', 'grade', [6,7,8,9,10].map((grade) => [String(grade), `Grade ${grade}`]))}${selectField('Section', 'section', ['A','B','C','D'].map((section) => [section, `Section ${section}`]))}</div>${field('Due date', 'dueDate', 'date')}<label>Instructions<textarea name="instructions" placeholder="What should students complete?"></textarea></label></form>`, `<button class="btn btn-secondary" data-action="close-modal">Save draft</button><button class="btn btn-primary" form="assignment-form" type="submit">Publish assignment</button>`);
    if (state.modal === 'add-assessment') return modalShell('Create assessment', `<form id="assessment-form" class="form-grid">${field('Assessment name', 'name', 'text', 'e.g. Mathematics Unit Test')}${selectField('Assessment type', 'type', ['Unit Test','Class Test','Mid Term','Quarterly','Half Yearly','Pre-Final','Final','Assignment','Project','Practical'].map((item) => [item,item]))}${selectField('Subject', 'subject', subjects().map((subject) => [subject.name, subject.name]))}<div class="form-split">${selectField('Grade', 'grade', [6,7,8,9,10].map((grade) => [String(grade), `Grade ${grade}`]))}${selectField('Section', 'section', ['A','B','C','D'].map((section) => [section, `Section ${section}`]))}</div>${field('Assessment date', 'date', 'date')}</form>`, `<button class="btn btn-secondary" data-action="close-modal">Cancel</button><button class="btn btn-primary" form="assessment-form" type="submit">Create assessment</button>`);
    if (state.modal === 'add-task') return modalShell('Create task', `<form id="task-form" class="form-grid">${field('Task title', 'title', 'text', 'e.g. Prepare Grade 8 Mathematics Unit Test')}${selectField('Assigned to', 'assignedTo', teachers().map((teacher) => [teacher.id, fullName(teacher)]))}${field('Due date', 'dueDate', 'date')}${selectField('Priority', 'priority', [['High','High'],['Medium','Medium'],['Low','Low']])}<label>Description<textarea name="description" placeholder="Add context or instructions"></textarea></label></form>`, `<button class="btn btn-secondary" data-action="close-modal">Cancel</button><button class="btn btn-primary" form="task-form" type="submit">Create task</button>`);
    if (state.modal === 'take-attendance') { 
      const scope = state.classScope || { grade:'8', section:'A' }; 
      const people = students().filter((student) => studentGrade(student) === String(scope.grade) && student.section === scope.section).slice(0, 42); 
      return modalShell(
        `Take attendance · Grade ${scope.grade}${scope.section}`, 
        `<form id="attendance-form">
          <div class="attendance-editor-head" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; background:#f8fafc; padding:0.75rem 1rem; border-radius:10px; margin-bottom:0.75rem;">
            <span>📅 <b>Thursday, 13 August 2026</b></span>
            <div>${['Present','Absent','Late','Excused'].map((item) => badge(item)).join(' ')}</div>
          </div>
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:0.65rem 0.85rem; margin-bottom:0.75rem; display:flex; align-items:center; justify-content:space-between; font-size:0.82rem; color:#166534;">
            <span>💬 <b>Automated Parent Alert Engine:</b> Send instant WhatsApp absentee notices to parents upon save.</span>
            <label style="display:flex; align-items:center; gap:0.35rem; font-weight:700; cursor:pointer;">
              <input type="checkbox" name="sendAbsenteeAlerts" checked style="width:16px; height:16px; accent-color:#16a34a;" />
              Auto-send WhatsApp Alerts
            </label>
          </div>
          <div class="attendance-editor">${people.map((person, index) => `<label class="attendance-edit-row">${avatar(person)}<span><b>${escapeHTML(fullName(person))}</b><small>Roll no. ${escapeHTML(person.rollNumber || '—')} • Parent: ${escapeHTML(person.parentMobile || '+91 98450 12345')}</small></span><select name="attendance-${escapeHTML(person.id)}"><option ${index % 7 ? 'selected' : ''}>Present</option><option ${index % 7 === 0 ? 'selected' : ''}>Absent</option><option>Late</option><option>Excused</option></select></label>`).join('')}</div>
        </form>`, 
        `<button class="btn btn-secondary" data-action="close-modal">Cancel</button><button class="btn btn-primary" form="attendance-form" type="submit">Save & Dispatch Parent WhatsApp Alerts</button>`
      ); 
    }
    if (state.modal === 'record-mark') return modalShell('Record mark', `<form id="mark-form" class="form-grid">${selectField('Assessment', 'assessment', assessments().slice(0,8).map((assessment) => [assessment.id, assessment.name || assessment.title || 'Unit Test']))}${field('Score (%)', 'score', 'number', '0–100')}<p class="form-note">Changes to marks are saved to the active academic year and logged in the audit trail.</p></form>`, `<button class="btn btn-secondary" data-action="close-modal">Cancel</button><button class="btn btn-primary" form="mark-form" type="submit">Save mark</button>`);
    if (state.modal === 'add-year') return modalShell('Create academic year', `<form id="year-form" class="form-grid">${field('Academic year label', 'name', 'text', 'e.g. 2027–28')}<div class="form-split">${field('Start date', 'startDate', 'date')}${field('End date', 'endDate', 'date')}</div><p class="form-note">New years start with their own enrolments, timetables, attendance and results. Historical records are not overwritten.</p></form>`, `<button class="btn btn-secondary" data-action="close-modal">Cancel</button><button class="btn btn-primary" form="year-form" type="submit">Create academic year</button>`);
    if (state.modal === 'workspace') {
      const allTenants = seed.tenants || [];
      return modalShell('🏫 Switch School Workspace', `
        <p class="modal-intro" style="margin-bottom:1rem; color:#64748b; font-size:0.88rem;">
          Select a school workspace to view isolated institutional data, students, teachers, grades, and report cards.
        </p>
        <div class="workspace-list">
          ${allTenants.map((school) => {
            const isCurrent = school.id === state.tenantId;
            const schName = school.school?.name || school.name || 'School';
            const schAddr = school.address || school.location || 'Hyderabad, Telangana';
            const studentCount = Array.isArray(school.students) ? school.students.length : 0;
            const teacherCount = Array.isArray(school.teachers) ? school.teachers.length : 0;
            return `
              <div class="workspace-choice ${isCurrent ? 'selected' : ''}" data-action="switch-tenant" data-id="${escapeHTML(school.id)}" style="display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:1rem 1.15rem; background:${isCurrent ? '#eff6ff' : '#ffffff'}; border:2px solid ${isCurrent ? '#2563eb' : '#cbd5e1'}; border-radius:12px; cursor:pointer; margin-bottom:0.75rem; transition:all 0.2s ease;">
                <div style="display:flex; align-items:center; gap:0.85rem;">
                  <span class="workspace-avatar" style="width:46px; height:46px; border-radius:10px; background:linear-gradient(135deg, ${isCurrent ? '#1e3a8a, #2563eb' : '#475569, #64748b'}); color:#ffffff; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:1.1rem; flex-shrink:0;">
                    ${escapeHTML(initials(schName))}
                  </span>
                  <div>
                    <b style="font-size:0.98rem; color:#0f172a; display:block; line-height:1.2;">${escapeHTML(schName)}</b>
                    <small style="color:#64748b; font-size:0.75rem; display:block; margin-top:0.15rem;">📍 ${escapeHTML(schAddr)}</small>
                    <div style="margin-top:0.25rem; display:flex; gap:0.5rem; font-size:0.72rem; color:#475569; font-weight:700;">
                      <span>👨‍🎓 ${studentCount} Students</span>
                      <span>•</span>
                      <span>👩‍🏫 ${teacherCount} Faculty</span>
                    </div>
                  </div>
                </div>
                <div>
                  ${isCurrent 
                    ? `<span style="background:#2563eb; color:#ffffff; font-size:0.75rem; font-weight:900; padding:0.35rem 0.75rem; border-radius:20px; display:inline-flex; align-items:center; gap:0.3rem;">✓ Active School</span>`
                    : `<button type="button" class="btn btn-secondary" style="font-size:0.78rem; font-weight:800; padding:0.4rem 0.85rem;" data-action="switch-tenant" data-id="${escapeHTML(school.id)}">Switch →</button>`}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `, `<button class="btn btn-secondary" data-action="close-modal">Close</button>`);
    }
    if (state.modal === 'assignment-detail') return modalShell('Assignment', `<div class="detail-modal"><span class="assignment-icon purple">${icon('book')}</span><h3>${escapeHTML(state.selectedAssignment?.title || 'Mathematics practice assignment')}</h3><p>${escapeHTML(state.selectedAssignment?.instructions || 'Complete the assigned practice work and submit before the due date.')}</p><dl><div><dt>Subject</dt><dd>${escapeHTML(state.selectedAssignment?.subject || subjectName(state.selectedAssignment?.subjectId) || 'Mathematics')}</dd></div><div><dt>Due</dt><dd>${escapeHTML(state.selectedAssignment?.dueDate || '18 Aug 2026')}</dd></div><div><dt>Status</dt><dd>${badge(state.selectedAssignment?.status || 'Pending')}</dd></div></dl></div>`, `<button class="btn btn-secondary" data-action="close-modal">Close</button>${state.role === 'STUDENT' ? '<button class="btn btn-primary" data-action="submit-assignment">Mark ready to submit</button>' : ''}`);
    if (state.modal === 'user-menu') {
      const u = currentUser();
      return modalShell('User Account & Settings', `<div class="user-menu-modal-list">
        <div style="display:flex; align-items:center; gap:0.75rem; padding:0.75rem; background:#f8fafc; border-radius:10px; margin-bottom:0.5rem;">
          ${avatar(u, 'avatar-large')}
          <div>
            <b style="font-size:1rem; color:#0f172a;">${escapeHTML(fullName(u))}</b><br/>
            <small style="color:#64748b;">${escapeHTML(state.role)} • ${escapeHTML(tenant()?.school?.name || tenant()?.name || 'Meezan Kids School')}</small>
          </div>
        </div>
        <button type="button" class="user-menu-item-btn" data-action="open-edit-profile" data-id="${escapeHTML(u.id)}">
          ✏️ <span>Edit My Profile & Details</span>
        </button>
        <button type="button" class="user-menu-item-btn" data-action="open-workspace">
          🏫 <span>Switch School / Workspace</span>
        </button>
        <button type="button" class="user-menu-item-btn logout-item" data-action="logout">
          🚪 <span>Sign Out of NotebookXL</span>
        </button>
      </div>`, `<button class="btn btn-secondary" data-action="close-modal">Close</button>`);
    }
    if (state.modal === 'edit-profile') {
      const targetId = state.editingProfileId || state.profile?.id || currentUser()?.id;
      const isStudent = state.profile?.type === 'student' || students().some(s => s.id === targetId) || state.role === 'STUDENT';
      const isTeacher = state.profile?.type === 'teacher' || teachers().some(t => t.id === targetId) || state.role === 'TEACHER';
      const person = (isStudent ? students() : teachers()).find(p => p.id === targetId) || (isStudent ? currentStudent() : isTeacher ? currentTeacher() : currentUser());

      const personName = fullName(person);
      const nameParts = personName.split(' ');
      const firstName = person.firstName || nameParts[0] || '';
      const lastName = person.lastName || nameParts.slice(1).join(' ') || '';
      const avatarSrc = person.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`;

      return modalShell(`Edit Profile · ${escapeHTML(personName)}`, `
        <form id="edit-profile-form" class="edit-profile-modal-container">
          <input type="hidden" name="personId" value="${escapeHTML(person.id || targetId)}" />
          <input type="hidden" name="personType" value="${isStudent ? 'student' : isTeacher ? 'teacher' : 'user'}" />
          
          <div class="edit-profile-scroll-body">
            <!-- 📸 Avatar Upload & Preview Box -->
            <div class="edit-avatar-box">
              <div class="edit-avatar-preview-wrap">
                <img id="edit-avatar-live-img" class="edit-avatar-preview-img" src="${escapeHTML(avatarSrc)}" alt="Avatar Preview" />
              </div>
              <div class="edit-avatar-upload-cta">
                <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                  <label class="edit-avatar-file-btn">
                    📁 Choose Photo File
                    <input type="file" id="edit-avatar-file-input" accept="image/*" />
                  </label>
                  <small style="color:#64748b; font-size:0.74rem;">JPG, PNG, GIF, WebP (Instant Live Preview)</small>
                </div>
                <input type="text" id="edit-avatar-url-input" name="avatarUrl" value="${escapeHTML(person.avatar || '')}" placeholder="Or paste image URL (e.g. https://...)" style="width:100%; box-sizing:border-box; padding:0.4rem 0.65rem; border:1.5px solid #cbd5e1; border-radius:6px; font-size:0.78rem; margin-top:0.35rem;" />
                <div class="edit-preset-avatars-row">
                  <span style="font-size:0.72rem; color:#64748b; font-weight:700;">Presets:</span>
                  ${[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
                  ].map((presetUrl) => `
                    <button type="button" class="edit-preset-avatar-btn" data-action="pick-preset-avatar" data-url="${presetUrl}" title="Choose preset avatar">
                      <img src="${presetUrl}" alt="Preset" />
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- 👤 Personal Details & Academic Identity -->
            <div class="edit-form-section-title">
              <span>👤</span> Personal Details & Identity
            </div>
            <div class="edit-form-grid-2col">
              <div class="edit-form-field-group">
                <label>First Name *</label>
                <input type="text" name="firstName" value="${escapeHTML(firstName)}" required placeholder="e.g. Amaan" />
              </div>
              <div class="edit-form-field-group">
                <label>Last Name *</label>
                <input type="text" name="lastName" value="${escapeHTML(lastName)}" required placeholder="e.g. Khan" />
              </div>
              <div class="edit-form-field-group">
                <label>Date of Birth (DOB)</label>
                <input type="date" name="dateOfBirth" value="${escapeHTML(person.dateOfBirth || person.dob || '2012-05-17')}" />
              </div>
              <div class="edit-form-field-group">
                <label>Gender</label>
                <select name="gender">
                  <option value="Male" ${person.gender === 'Male' ? 'selected' : ''}>Male</option>
                  <option value="Female" ${person.gender === 'Female' ? 'selected' : ''}>Female</option>
                  <option value="Other" ${person.gender === 'Other' ? 'selected' : ''}>Other</option>
                </select>
              </div>
              <div class="edit-form-field-group">
                <label>Blood Group</label>
                <select name="bloodGroup">
                  <option value="O+" ${(person.bloodGroup || 'O+') === 'O+' ? 'selected' : ''}>O+ (Positive)</option>
                  <option value="A+" ${person.bloodGroup === 'A+' ? 'selected' : ''}>A+ (Positive)</option>
                  <option value="B+" ${person.bloodGroup === 'B+' ? 'selected' : ''}>B+ (Positive)</option>
                  <option value="AB+" ${person.bloodGroup === 'AB+' ? 'selected' : ''}>AB+ (Positive)</option>
                  <option value="O-" ${person.bloodGroup === 'O-' ? 'selected' : ''}>O- (Negative)</option>
                  <option value="A-" ${person.bloodGroup === 'A-' ? 'selected' : ''}>A- (Negative)</option>
                  <option value="B-" ${person.bloodGroup === 'B-' ? 'selected' : ''}>B- (Negative)</option>
                  <option value="AB-" ${person.bloodGroup === 'AB-' ? 'selected' : ''}>AB- (Negative)</option>
                </select>
              </div>
              <div class="edit-form-field-group">
                <label>Enrollment / Profile Status</label>
                <select name="status">
                  <option value="Active" ${(person.status || 'Active') === 'Active' ? 'selected' : ''}>Active</option>
                  <option value="On Leave" ${person.status === 'On Leave' ? 'selected' : ''}>On Leave</option>
                  <option value="Transferred" ${person.status === 'Transferred' ? 'selected' : ''}>Transferred</option>
                </select>
              </div>
            </div>

            ${isStudent ? `
              <!-- 🎓 Student Academic Record -->
              <div class="edit-form-section-title">
                <span>🎓</span> Student Academic Information
              </div>
              <div class="edit-form-grid-2col">
                <div class="edit-form-field-group">
                  <label>Student ID (Official)</label>
                  <input type="text" name="studentId" value="${escapeHTML(person.studentId || 'NXL-MKS-000421')}" required />
                </div>
                <div class="edit-form-field-group">
                  <label>Admission Number</label>
                  <input type="text" name="admissionNumber" value="${escapeHTML(person.admissionNumber || person.admissionNo || 'MKS-2024-421')}" required />
                </div>
                <div class="edit-form-field-group">
                  <label>Grade / Class</label>
                  <select name="grade">
                    ${[1,2,3,4,5,6,7,8,9,10,11,12].map((g) => `<option value="${g}" ${String(studentGrade(person)) === String(g) ? 'selected' : ''}>Grade ${g}</option>`).join('')}
                  </select>
                </div>
                <div class="edit-form-field-group">
                  <label>Section</label>
                  <select name="section">
                    ${['A','B','C','D'].map((sec) => `<option value="${sec}" ${(person.section || 'A') === sec ? 'selected' : ''}>Section ${sec}</option>`).join('')}
                  </select>
                </div>
                <div class="edit-form-field-group">
                  <label>Roll Number</label>
                  <input type="text" name="rollNumber" value="${escapeHTML(person.rollNumber || '17')}" placeholder="e.g. 17" />
                </div>
                <div class="edit-form-field-group">
                  <label>Academic Year</label>
                  <input type="text" name="academicYear" value="${escapeHTML(person.academicYear || tenant()?.academicYear || '2026–27')}" />
                </div>
              </div>
            ` : isTeacher ? `
              <!-- 🏫 Teacher / Faculty Record -->
              <div class="edit-form-section-title">
                <span>🏫</span> Faculty & Department Information
              </div>
              <div class="edit-form-grid-2col">
                <div class="edit-form-field-group">
                  <label>Employee ID</label>
                  <input type="text" name="employeeId" value="${escapeHTML(person.employeeId || 'MKS-T-001')}" required />
                </div>
                <div class="edit-form-field-group">
                  <label>Department</label>
                  <input type="text" name="department" value="${escapeHTML(person.department || 'Mathematics')}" placeholder="e.g. Mathematics, Science" />
                </div>
                <div class="edit-form-field-group">
                  <label>Primary Teaching Subject</label>
                  <input type="text" name="subject" value="${escapeHTML(person.subject || 'Mathematics')}" />
                </div>
                <div class="edit-form-field-group">
                  <label>Designation / Role</label>
                  <input type="text" name="designation" value="${escapeHTML(person.designation || 'Senior Faculty & Class Teacher')}" />
                </div>
                <div class="edit-form-field-group">
                  <label>Joining Date</label>
                  <input type="date" name="joinedOn" value="${escapeHTML(person.joinedOn || '2020-06-10')}" />
                </div>
              </div>
            ` : ''}

            <!-- 📞 Contact & Parent / Guardian Details -->
            <div class="edit-form-section-title">
              <span>📞</span> Contact & Parent/Guardian Details
            </div>
            <div class="edit-form-grid-2col">
              <div class="edit-form-field-group">
                <label>Email Address</label>
                <input type="email" name="email" value="${escapeHTML(person.email || `${lower(firstName)}@${tenant()?.subdomain || 'meezan'}.school.edu`)}" placeholder="student@school.edu" />
              </div>
              <div class="edit-form-field-group">
                <label>Mobile / Contact Number</label>
                <input type="tel" name="mobile" value="${escapeHTML(person.mobile || person.phone || '+91 98451 23456')}" placeholder="+91 98451 23456" />
              </div>
              <div class="edit-form-field-group">
                <label>Parent / Guardian Name</label>
                <input type="text" name="parentName" value="${escapeHTML(person.parentName || person.guardianName || 'Dr. Tariq Khan')}" placeholder="Father / Mother / Guardian name" />
              </div>
              <div class="edit-form-field-group">
                <label>Parent Contact Mobile</label>
                <input type="tel" name="parentMobile" value="${escapeHTML(person.parentMobile || person.guardianPhone || '+91 98450 98765')}" placeholder="+91 98450 98765" />
              </div>
              <div class="edit-form-field-group">
                <label>Parent Email ID</label>
                <input type="email" name="parentEmail" value="${escapeHTML(person.parentEmail || 'parents.tariq@gmail.com')}" placeholder="parent@gmail.com" />
              </div>
              <div class="edit-form-field-group">
                <label>Emergency Contact</label>
                <input type="text" name="emergencyContact" value="${escapeHTML(person.emergencyContact || '+91 98860 11223 (Uncle)')}" placeholder="Name & Phone number" />
              </div>
            </div>
            <div class="edit-form-field-group" style="margin-top:0.75rem;">
              <label>Residential Address</label>
              <textarea name="address" rows="2" placeholder="Street address, locality, city, postal code">${escapeHTML(person.address || '42, Crescent Park Avenue, Richmond Town, Bangalore - 560025')}</textarea>
            </div>

            <!-- 🔒 Portal Login Credentials & Security -->
            <div class="edit-form-section-title">
              <span>🔒</span> Login Credentials & Portal Security
            </div>
            <div class="edit-form-grid-2col">
              <div class="edit-form-field-group">
                <label>Login User ID / Username</label>
                <input type="text" name="username" value="${escapeHTML(person.username || person.studentId || person.employeeId || lower(firstName))}" required />
              </div>
              <div class="edit-form-field-group">
                <label>Portal Password</label>
                <div class="password-input-wrap">
                  <input type="password" id="edit-profile-password-field" name="password" value="${escapeHTML(person.password || 'NotebookXL@2026')}" required />
                  <button type="button" class="password-toggle-eye-btn" data-action="toggle-edit-password" title="Show / hide password">👁️</button>
                </div>
              </div>
            </div>
          </div>
        </form>
      `, `
        <button type="button" class="btn btn-secondary" data-action="close-modal">Cancel</button>
        <button type="submit" form="edit-profile-form" class="btn btn-primary">💾 Save Changes</button>
      `);
    }
    if (state.modal === 'student-certificate') {
      const studId = state.selectedCertificateStudentId || (students()[0] ? students()[0].id : 'student-1');
      const stud = students().find(s => s.id === studId) || students()[0] || {
        id: 'student-1',
        firstName: 'Amaan',
        lastName: 'Khan',
        grade: '8',
        section: 'A',
        studentId: 'NXL-MKS-000421',
        parentName: 'Dr. Tariq Khan',
        parentMobile: '+91 98450 98765'
      };
      const gamify = studentAcademicGamification(stud);
      const sch = tenant();
      const schName = sch?.school?.name || sch?.name || 'Meezan Kids School';
      const baseAvg = studentAverage(stud);
      const seedNum = Math.abs(parseInt(String(stud.id).replace(/\D/g,''), 10)) || 7;
      const mathMark = Math.min(100, Math.max(50, Math.round(baseAvg + ((seedNum * 3) % 7) - 2)));
      const scienceMark = Math.min(100, Math.max(50, Math.round(baseAvg + ((seedNum * 5) % 6) - 1)));
      const englishMark = Math.min(100, Math.max(50, Math.round(baseAvg + ((seedNum * 2) % 5) - 2)));
      const socialMark = Math.min(100, Math.max(50, Math.round(baseAvg + ((seedNum * 4) % 6) - 2)));
      const langMark = Math.min(100, Math.max(50, Math.round(baseAvg + ((seedNum * 7) % 5) - 1)));
      const aiMark = Math.min(100, Math.max(55, Math.round(baseAvg + ((seedNum * 1) % 6))));
      const totalMarks = mathMark + scienceMark + englishMark + socialMark + langMark + aiMark;
      const percentage = Number(((totalMarks / 600) * 100).toFixed(1));
      const letterGrade = percentage >= 90 ? 'A1 (Outstanding)' : percentage >= 80 ? 'A2 (Excellent)' : 'B1 (Very Good)';

      const parentPhone = (stud.parentMobile || stud.mobile || '+91 98450 98765').replace(/\D/g, '');
      const waCertText = encodeURIComponent(`Dear Parent, Congratulations! ${fullName(stud)} has been awarded the official Certificate of Scholastic Distinction by ${schName} for scoring ${totalMarks}/600 (${percentage}%) with Grade ${letterGrade} and Level ${gamify.currentTier.level} Honors!`);

      return modalShell('Academic Certificate of Scholastic Distinction', `
        <div style="display:flex; justify-content:center; padding:1rem 0;">
          <div class="certificate-modal-frame" id="printable-certificate">
            <div class="certificate-header-brand">
              <h2>🏫 ${escapeHTML(schName)}</h2>
              <p>Affiliated to CBSE (Affiliation No: 830421) · Academic Excellence Board · Session 2026–2027</p>
            </div>
            <div class="certificate-body-content">
              <div class="certificate-title-ribbon">
                🌟 CERTIFICATE OF SCHOLASTIC DISTINCTION 🌟
              </div>
              <p style="font-size:1rem; color:#475569; margin:0.4rem 0 0.2rem;">This prestigious academic honor is proudly conferred upon</p>
              <div class="certificate-student-name">${escapeHTML(fullName(stud))}</div>
              <div style="display:inline-flex; gap:0.5rem; justify-content:center; margin-bottom:0.75rem;">
                <span class="fee-status-pill status-paid">Grade ${escapeHTML(studentGrade(stud))} - Section ${escapeHTML(stud.section || 'A')}</span>
                <span class="fee-status-pill status-paid">ID: ${escapeHTML(stud.studentId || 'NXL-MKS-000421')}</span>
                <span class="fee-status-pill status-paid">Score: ${totalMarks} / 600 (${percentage}%)</span>
              </div>
              <p style="font-size:0.95rem; color:#334155; line-height:1.6; max-width:560px; margin:0 auto 0.75rem;">
                In recognition of outstanding scholastic performance, securing Grade <b>${letterGrade}</b>, achieving <b>Level ${gamify.currentTier.level} · ${gamify.currentTier.name}</b> honors with <b>${gamify.totalXP.toLocaleString()} Academic XP</b>, and demonstrating exceptional diligence, leadership, and intellectual curiosity.
              </p>
            </div>
            <div class="certificate-footer-row">
              <div class="certificate-signature-block">
                <div class="certificate-signature-line"></div>
                <small><b>Class Teacher</b><br/>Faculty Advisor</small>
              </div>
              <div class="certificate-seal-badge">
                <span class="certificate-seal-icon">🎖️</span>
                <small style="color:#b45309; font-weight:800; text-transform:uppercase;">Official Seal</small>
              </div>
              <div class="certificate-signature-block">
                <div class="certificate-signature-line"></div>
                <small><b>Head of Institution</b><br/>Principal</small>
              </div>
            </div>
          </div>
        </div>
      `, `
        <button class="btn btn-secondary" data-action="close-modal">Close</button>
        <a href="https://wa.me/91${parentPhone}?text=${waCertText}" target="_blank" class="wa-reminder-btn" style="padding:0.45rem 0.85rem;">
          💬 Send to Parent WhatsApp
        </a>
        <button class="btn btn-primary" data-action="print-certificate">🖨️ Print / Save as PDF</button>
      `);
    }
    if (state.modal === 'digital-receipt') {
      const records = getTenantFeeRecords();
      const recId = state.selectedReceiptStudentId || students()[0]?.id;
      const rec = records.find(r => r.id === recId) || records[0];
      const sch = tenant();
      const schName = sch?.school?.name || sch?.name || 'Meezan Kids School';
      const lastPayment = rec.history[rec.history.length - 1] || { receiptNo: 'REC-2026-0842', date: '08 Oct 2026', amount: 25000, mode: 'UPI (GPay)' };
      const parentPhone = (rec.parentMobile || '+91 98450 98765').replace(/\D/g, '');
      const waReceiptText = encodeURIComponent(`Dear ${rec.parentName}, here is the official Fee Receipt (${lastPayment.receiptNo}) from ${schName}. Amount Paid: ₹${lastPayment.amount.toLocaleString()} for ${rec.studentName} (Grade ${rec.grade}${rec.section}) on ${lastPayment.date}. Status: PAID & VERIFIED. Retain this digital receipt for your records.`);

      return modalShell('Official Digital Fee Receipt / Bill (PDF)', `
        <div style="display:flex; justify-content:center; padding:0.5rem 0;">
          <div class="digital-receipt-container" id="printable-receipt">
            <div class="receipt-header-branding">
              <h2>🏫 ${escapeHTML(schName)}</h2>
              <p>Affiliated to CBSE (Affiliation No: 830421) | School Code: 45210<br/>
              Richmond Town Campus, Bangalore - 560025 | Phone: +91 80 2234 5678 | Email: accounts@meezankids.school.edu</p>
              <div style="border-top:1.5px solid #0f172a; margin-top:0.6rem; padding-top:0.4rem;">
                <h3 style="margin:0; font-size:1.15rem; font-weight:900; letter-spacing:0.04em; color:#0f172a;">
                  OFFICIAL FEE RECEIPT / INVOICE
                </h3>
              </div>
            </div>

            <div class="receipt-meta-banner">
              <div>
                <b>Receipt No:</b> <span style="font-family:monospace; color:#2563eb;">${escapeHTML(lastPayment.receiptNo)}</span><br/>
                <b>Date of Payment:</b> ${escapeHTML(lastPayment.date)}, 11:42 AM
              </div>
              <div style="text-align:right;">
                <b>Academic Year:</b> 2026–2027<br/>
                <b>Term / Month:</b> Term 2 (Oct–Dec)
              </div>
            </div>

            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; padding:0.75rem 1rem; margin-bottom:1rem; font-size:0.8rem;">
              <div style="font-weight:800; color:#0f172a; margin-bottom:0.4rem; text-transform:uppercase; letter-spacing:0.03em; border-bottom:1px solid #e2e8f0; padding-bottom:0.25rem;">
                STUDENT PARTICULARS:
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.35rem 1.5rem;">
                <div>• <b>Student Name:</b> ${escapeHTML(rec.studentName)}</div>
                <div>• <b>Student ID:</b> ${escapeHTML(rec.studentId)}</div>
                <div>• <b>Grade & Sec:</b> Grade ${escapeHTML(rec.grade)} - Section ${escapeHTML(rec.section)}</div>
                <div>• <b>Admission No:</b> MKS-2024-${Math.abs(parseInt(String(rec.id).replace(/\D/g,''),10))||421}</div>
                <div>• <b>Roll Number:</b> ${escapeHTML(rec.student?.rollNumber || '17')}</div>
                <div>• <b>Parent Name:</b> ${escapeHTML(rec.parentName)}</div>
                <div>• <b>Mobile:</b> ${escapeHTML(rec.parentMobile)}</div>
                <div>• <b>Parent Email:</b> tariq@gmail.com</div>
              </div>
            </div>

            <div style="font-weight:800; color:#0f172a; font-size:0.82rem; text-transform:uppercase; margin-bottom:0.25rem;">
              FEE PARTICULARS (BREAKDOWN):
            </div>
            <table class="receipt-particulars-table" style="margin:0 0 1rem;">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fee Component</th>
                  <th>Period</th>
                  <th style="text-align:right;">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1.</td>
                  <td>Tuition & Academic Term Fee</td>
                  <td>Term 2 (Quarter)</td>
                  <td style="text-align:right;">₹18,000.00</td>
                </tr>
                <tr>
                  <td>2.</td>
                  <td>Science Lab & AI Robotics Access</td>
                  <td>Term 2</td>
                  <td style="text-align:right;">₹3,000.00</td>
                </tr>
                <tr>
                  <td>3.</td>
                  <td>School Bus Transport (Route 4)</td>
                  <td>Term 2</td>
                  <td style="text-align:right;">₹4,000.00</td>
                </tr>
                <tr style="background:#f8fafc; font-size:0.8rem;">
                  <td colspan="3" style="text-align:right;"><b>Subtotal:</b></td>
                  <td style="text-align:right;"><b>₹25,000.00</b></td>
                </tr>
                <tr style="background:#f8fafc; font-size:0.8rem;">
                  <td colspan="3" style="text-align:right;"><b>Concession / Discount:</b></td>
                  <td style="text-align:right; color:#64748b;">- ₹0.00</td>
                </tr>
                <tr class="receipt-total-row" style="background:#f1f5f9; border-top:2px solid #0f172a;">
                  <td colspan="3" style="text-align:right;">
                    TOTAL PAID:<br/>
                    <small style="font-size:0.75rem; font-weight:600; color:#475569;">(Rupees Twenty-Five Thousand Only)</small>
                  </td>
                  <td style="text-align:right; color:#16a34a; font-size:1.1rem; vertical-align:middle;">
                    ₹${lastPayment.amount.toLocaleString()}.00
                  </td>
                </tr>
                <tr style="background:#ffffff; font-size:0.78rem;">
                  <td colspan="3" style="text-align:right; color:#64748b;">
                    Previous Dues: ₹0.00 | Payment Mode: ${escapeHTML(lastPayment.mode || 'UPI (GPay)')}
                  </td>
                  <td style="text-align:right; font-weight:800; color:${rec.balanceDue > 0 ? '#dc2626' : '#16a34a'};">
                    Current Balance Due: ₹${rec.balanceDue.toLocaleString()}.00
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="receipt-footer-signatures">
              <div style="font-size:0.72rem; color:#64748b; max-width:280px;">
                <b>[ QR Code for Verification ]</b><br/>
                <span style="font-family:monospace; background:#f1f5f9; padding:0.25rem 0.45rem; border-radius:4px; display:inline-block; margin:0.3rem 0;">
                  [QR-NXL-AUTH-${lastPayment.receiptNo}]
                </span><br/>
                Scan to verify authenticity<br/>
                Generated via NotebookXL School OS
              </div>
              <div style="text-align:center; width:200px;">
                <div style="font-size:0.72rem; color:#b45309; font-weight:800; margin-bottom:0.2rem;">
                  [ Seal: ${escapeHTML(schName)} ]
                </div>
                <div style="border-top:1.5px solid #0f172a; padding-top:0.3rem; font-weight:800; font-size:0.78rem;">
                  Authorized Signatory (Accounts)
                </div>
                <small style="font-size:0.68rem; color:#64748b;">* Computer generated receipt</small>
              </div>
            </div>
          </div>
        </div>
      `, `
        <button class="btn btn-secondary" data-action="close-modal">Close</button>
        <a href="https://wa.me/91${parentPhone}?text=${waReceiptText}" target="_blank" class="wa-reminder-btn" style="padding:0.45rem 0.85rem;">
          💬 Send to Parent WhatsApp
        </a>
        <button class="btn btn-primary" data-action="print-receipt">🖨️ Print / Save as PDF</button>
      `);
    }
    if (state.modal === 'record-payment') {
      const records = getTenantFeeRecords();
      const targetId = state.selectedReceiptStudentId || students()[0]?.id;
      const rec = records.find(r => r.id === targetId) || records[0];

      return modalShell('Record Student Fee Payment', `
        <form id="record-payment-form" class="form-grid" style="gap:1.1rem; padding:0.25rem;">
          <div style="background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color:#ffffff; padding:1rem 1.25rem; border-radius:14px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem; box-shadow:0 8px 24px rgba(15,23,42,0.12);">
            <div>
              <small style="color:#94a3b8; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">ACTIVE ACCOUNTS LEDGER</small>
              <h3 style="color:#ffffff; margin:0.2rem 0 0 0; font-size:1.15rem;">${escapeHTML(rec.studentName)}</h3>
              <p style="color:#cbd5e1; font-size:0.8rem; margin:0.15rem 0 0 0;">${escapeHTML(rec.studentId)} • Grade ${rec.grade}${rec.section}</p>
            </div>
            <div style="text-align:right; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); padding:0.5rem 0.9rem; border-radius:10px;">
              <small style="color:#cbd5e1; font-size:0.72rem; display:block; font-weight:600;">CURRENT BALANCE DUE</small>
              <b style="font-size:1.25rem; color:${rec.balanceDue > 0 ? '#ef4444' : '#22c55e'}; font-weight:800;">₹${rec.balanceDue.toLocaleString()}</b>
            </div>
          </div>

          <label style="font-weight:700; font-size:0.85rem; color:#1e293b;">
            Select Student Record
            <select name="studentId" id="record-payment-student-picker" style="margin-top:0.35rem; min-height:46px; border-radius:10px; border:1px solid #cbd5e1; padding:0.6rem 0.8rem; font-size:0.9rem; background:#ffffff; font-weight:600;">
              ${records.map(r => `
                <option value="${r.id}" ${r.id === rec.id ? 'selected' : ''}>
                  ${escapeHTML(r.studentName)} (Grade ${r.grade}${r.section} · ${r.balanceDue > 0 ? `Balance: ₹${r.balanceDue.toLocaleString()}` : 'Fully Paid ₹0'})
                </option>
              `).join('')}
            </select>
          </label>

          <div class="form-split" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <label style="font-weight:700; font-size:0.85rem; color:#1e293b;">
              Payment Amount (₹)
              <input type="number" name="amount" value="${rec.balanceDue > 0 ? rec.balanceDue : 5000}" min="1" max="500000" style="margin-top:0.35rem; min-height:46px; border-radius:10px; border:1px solid #cbd5e1; padding:0.6rem 0.8rem; font-size:1rem; font-weight:800; color:#2563eb;" required />
            </label>
            <label style="font-weight:700; font-size:0.85rem; color:#1e293b;">
              Term / Installment
              <select name="term" style="margin-top:0.35rem; min-height:46px; border-radius:10px; border:1px solid #cbd5e1; padding:0.6rem 0.8rem; font-size:0.88rem;">
                <option value="Term 2 (Oct–Dec)">Term 2 (Oct–Dec)</option>
                <option value="Term 3 (Jan–Mar)">Term 3 (Jan–Mar)</option>
                <option value="Term 1 (Jun–Aug)">Term 1 (Jun–Aug)</option>
                <option value="Annual Full Payment">Annual Full Payment</option>
              </select>
            </label>
          </div>

          <div class="form-split" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <label style="font-weight:700; font-size:0.85rem; color:#1e293b;">
              Payment Mode
              <select name="mode" style="margin-top:0.35rem; min-height:46px; border-radius:10px; border:1px solid #cbd5e1; padding:0.6rem 0.8rem; font-size:0.88rem;">
                <option value="UPI (GPay / PhonePe / Paytm)">📱 UPI (GPay / PhonePe / Paytm)</option>
                <option value="NetBanking / IMPS Transfer">🏛️ NetBanking / IMPS Transfer</option>
                <option value="Debit / Credit Card">💳 Debit / Credit Card</option>
                <option value="Cash at Accounts Counter">💵 Cash at Accounts Counter</option>
                <option value="Cheque / Demand Draft">📄 Cheque / Demand Draft</option>
              </select>
            </label>
            <label style="font-weight:700; font-size:0.85rem; color:#1e293b;">
              Transaction / Reference ID
              <input type="text" name="reference" placeholder="e.g. UPI-98321045" value="UPI-${Math.floor(10000000 + Math.random()*90000000)}" style="margin-top:0.35rem; min-height:46px; border-radius:10px; border:1px solid #cbd5e1; padding:0.6rem 0.8rem; font-size:0.88rem;" />
            </label>
          </div>

          <label style="font-weight:700; font-size:0.85rem; color:#1e293b;">
            Payment Remarks / Notes
            <input type="text" name="remarks" placeholder="e.g. Paid in full by father via GPay" style="margin-top:0.35rem; min-height:44px; border-radius:10px; border:1px solid #cbd5e1; padding:0.6rem 0.8rem; font-size:0.88rem;" />
          </label>

          <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:0.75rem; padding-top:0.75rem; border-top:1px solid #e2e8f0;">
            <button class="btn btn-secondary" type="button" data-action="close-modal" style="min-height:44px; padding:0.6rem 1.25rem; border-radius:10px; font-weight:600;">Cancel (✕)</button>
            <button class="btn btn-primary" type="submit" style="min-height:44px; padding:0.65rem 1.6rem; border-radius:10px; font-weight:700; background:#16a34a; border-color:#16a34a; color:#ffffff;">💾 Submit Fee Payment & Generate Receipt</button>
          </div>
        </form>
      `, `
        <button class="btn btn-secondary" data-action="close-modal" style="min-height:44px; padding:0.6rem 1.25rem; border-radius:10px; font-weight:600;">Cancel (✕)</button>
        <button class="btn btn-primary" form="record-payment-form" type="submit" style="min-height:44px; padding:0.6rem 1.4rem; border-radius:10px; font-weight:700; background:#16a34a; border-color:#16a34a;">💾 Submit Fee Payment</button>
      `);
    }
    if (state.modal === 'emergency-broadcast') {
      return modalShell('📢 Dispatch Emergency School Broadcast', `
        <form id="emergency-broadcast-form" class="form-grid" style="gap:1.1rem; padding:0.25rem;">
          <div style="background:linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%); color:#ffffff; padding:1rem 1.25rem; border-radius:14px; box-shadow:0 8px 24px rgba(153,27,27,0.25); display:flex; align-items:center; gap:0.85rem;">
            <div style="font-size:2rem;">⚡</div>
            <div>
              <small style="color:#fca5a5; font-size:0.72rem; font-weight:800; text-transform:uppercase; letter-spacing:0.8px;">CRITICAL SYSTEM BROADCAST ENGINE</small>
              <h3 style="color:#ffffff; margin:0.15rem 0 0 0; font-size:1.1rem;">Instant Multi-Channel Emergency Dispatch</h3>
              <p style="color:#fecaca; font-size:0.78rem; margin:0.15rem 0 0 0;">Notifies all Parents, Teachers, and Students across WhatsApp, SMS & Live System Feed.</p>
            </div>
          </div>

          <label style="font-weight:700; font-size:0.85rem; color:#0f172a;">
            Select Target Audience
            <select name="audience" style="margin-top:0.35rem; width:100%; min-height:46px; border-radius:10px; border:1px solid #cbd5e1; padding:0.6rem 0.8rem; font-size:0.9rem; font-weight:700; background:#ffffff; color:#0f172a;">
              <option value="ALL">🏫 Entire School Community (All Parents + Teachers + Students)</option>
              <option value="PARENTS">👨‍👩‍👧 All Parents & Guardians</option>
              <option value="STAFF">👩‍🏫 Teaching Faculty & Administrative Staff</option>
              <option value="PRIMARY">👶 Primary School Only (Grades 1 to 5)</option>
              <option value="HIGH_SCHOOL">🎓 High School Only (Grades 6 to 10)</option>
            </select>
          </label>

          <label style="font-weight:700; font-size:0.85rem; color:#0f172a;">
            Broadcast Headline / Subject
            <input type="text" name="title" value="Heavy Rain Alert - Early School Dismissal at 1:00 PM" placeholder="e.g. Heavy Rain Alert - Early School Dismissal" style="margin-top:0.35rem; width:100%; min-height:46px; border-radius:10px; border:1px solid #cbd5e1; padding:0.6rem 0.8rem; font-size:0.9rem; font-weight:700; color:#991b1b;" required />
          </label>

          <label style="font-weight:700; font-size:0.85rem; color:#0f172a;">
            Broadcast Notice Content & Instructions
            <textarea name="message" placeholder="Provide full context, bus pickup timings, or administrative instructions..." style="margin-top:0.35rem; width:100%; min-height:100px; border-radius:10px; border:1px solid #cbd5e1; padding:0.75rem; font-size:0.88rem; font-family:Inter,sans-serif; line-height:1.5; background:#f8fafc;" required>Dear Parents & Staff, due to heavy rainfall forecast by weather authorities, school will dismiss early today at 1:00 PM. School buses will depart at 1:15 PM. Please stay safe.</textarea>
          </label>

          <!-- PROMINENT FORM BUTTONS INSIDE FORM -->
          <div style="display:flex; justify-content:flex-end; align-items:center; gap:0.75rem; margin-top:0.75rem; padding-top:0.85rem; border-top:1px solid #e2e8f0;">
            <button class="btn btn-secondary" type="button" data-action="close-modal" style="min-height:44px; padding:0.6rem 1.25rem; border-radius:10px; font-weight:600;">Cancel (✕)</button>
            <button class="btn btn-primary" type="submit" style="min-height:44px; padding:0.65rem 1.6rem; border-radius:10px; font-weight:800; background:#dc2626; border-color:#dc2626; color:#ffffff; box-shadow:0 4px 12px rgba(220,38,38,0.3);">🚀 Broadcast Now to All Parents & Staff</button>
          </div>
        </form>
      `, `
        <button class="btn btn-secondary" data-action="close-modal" style="min-height:44px; padding:0.6rem 1.25rem; border-radius:10px; font-weight:600;">Cancel (✕)</button>
        <button class="btn btn-primary" form="emergency-broadcast-form" type="submit" style="min-height:44px; padding:0.65rem 1.5rem; border-radius:10px; font-weight:800; background:#dc2626; border-color:#dc2626;">🚀 Broadcast Now</button>
      `);
    }

    if (state.modal === 'discord-voice') {
      const channelKind = state.selectedDiscordChannel || 'management';
      const channelTitle = channelKind === 'student' ? 'Grade 8A Mathematics Live Voice Room' : channelKind === 'teacher' ? 'Faculty Staff Lounge Voice Channel' : 'Executive Principal Office Hours Voice Room';
      const discordLink = channelKind === 'student' ? 'https://discord.gg/meezan-grade8a-voice' : channelKind === 'teacher' ? 'https://discord.gg/meezan-faculty-voice' : 'https://discord.gg/meezan-principal-voice';

      return modalShell('🎧 Connect Discord Channel Voice Call', `
        <div style="padding:0.5rem 0.25rem;">
          <div style="background:linear-gradient(135deg, #5865f2 0%, #4752c4 100%); color:#ffffff; padding:1.25rem; border-radius:14px; box-shadow:0 8px 24px rgba(88,101,242,0.25); text-align:center; margin-bottom:1.2rem;">
            <div style="font-size:2.5rem; margin-bottom:0.3rem;">🎧</div>
            <span style="background:rgba(255,255,255,0.2); color:#ffffff; padding:0.2rem 0.65rem; border-radius:12px; font-size:0.72rem; font-weight:800; letter-spacing:0.5px; text-transform:uppercase;">SCHEDULED VOICE CALL CONNECT</span>
            <h3 style="color:#ffffff; margin:0.35rem 0 0.15rem 0; font-size:1.2rem;">${escapeHTML(channelTitle)}</h3>
            <p style="color:#e0e7ff; font-size:0.82rem; margin:0;">Low-Latency HD Audio Powered by Discord Voice Channels</p>
          </div>

          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:1rem; margin-bottom:1.2rem;">
            <div style="font-weight:700; font-size:0.85rem; color:#0f172a; margin-bottom:0.4rem;">📅 SCHEDULE & VOICE STATUS:</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; font-size:0.8rem; color:#475569;">
              <div>• <b>Schedule Slot:</b> 09:00 AM – 01:00 PM</div>
              <div>• <b>Voice Status:</b> <span style="color:#16a34a; font-weight:700;">🟢 ACTIVE NOW</span></div>
              <div>• <b>Audio Mode:</b> Noise-Suppressed HD</div>
              <div>• <b>Access:</b> Verified School Members</div>
            </div>
          </div>

          <div style="text-align:center;">
            <a href="${discordLink}" target="_blank" class="btn btn-primary" style="background:#5865f2; border-color:#5865f2; font-weight:800; font-size:0.95rem; padding:0.75rem 1.8rem; border-radius:10px; text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem; box-shadow:0 6px 18px rgba(88,101,242,0.35);">
              🎙️ Launch & Connect Discord Voice Call Now
            </a>
            <p style="font-size:0.75rem; color:#64748b; margin-top:0.6rem;">* Opens Discord App or Web Voice Channel directly in a new tab.</p>
          </div>
        </div>
      `, `
        <button class="btn btn-secondary" data-action="close-modal" style="min-height:44px; padding:0.6rem 1.25rem; border-radius:10px; font-weight:600;">Close (✕)</button>
      `);
    }

    if (state.modal === 'add-student') {
      const currentYear = tenant()?.academicYear || '2026–27';
      const autoStudentId = `NXL-MKS-STU-000${(students().length + 1).toString().padStart(3, '0')}`;
      const autoAdmissionNo = `MKS-2026-${(420 + students().length + 1)}`;

      return modalShell('➕ Enroll New Student to School Workspace', `
        <form id="add-student-form" class="form-grid" style="gap:1.1rem; padding:0.25rem;">
          <div style="background:linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); color:#ffffff; padding:1rem 1.25rem; border-radius:14px; box-shadow:0 8px 24px rgba(30,27,75,0.2); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem;">
            <div>
              <small style="color:#a5b4fc; font-size:0.72rem; font-weight:800; text-transform:uppercase; letter-spacing:0.8px;">OFFICIAL ADMISSION REGISTRATION</small>
              <h3 style="color:#ffffff; margin:0.15rem 0 0 0; font-size:1.1rem;">New Student Profile & Ledger Setup</h3>
              <p style="color:#c7d2fe; font-size:0.78rem; margin:0.15rem 0 0 0;">Enrolls student into ${escapeHTML(tenant()?.name || 'Meezan Kids School')} active database.</p>
            </div>
            <div style="text-align:right; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); padding:0.4rem 0.85rem; border-radius:10px;">
              <small style="color:#c7d2fe; font-size:0.7rem; font-weight:700; display:block;">AUTO GENERATED ID</small>
              <b style="font-size:0.95rem; color:#ffffff; font-family:monospace;">${autoStudentId}</b>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <label style="font-weight:700; font-size:0.85rem; color:#0f172a;">
              First Name *
              <input type="text" name="firstName" placeholder="e.g. Zaid" style="margin-top:0.35rem; width:100%; min-height:44px; border-radius:10px; border:1px solid #cbd5e1; padding:0.6rem 0.8rem; font-size:0.9rem;" required />
            </label>
            <label style="font-weight:700; font-size:0.85rem; color:#0f172a;">
              Last Name *
              <input type="text" name="lastName" placeholder="e.g. Khan" style="margin-top:0.35rem; width:100%; min-height:44px; border-radius:10px; border:1px solid #cbd5e1; padding:0.6rem 0.8rem; font-size:0.9rem;" required />
            </label>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.85rem;">
            <label style="font-weight:700; font-size:0.85rem; color:#0f172a;">
              Grade Level *
              <select name="grade" style="margin-top:0.35rem; width:100%; min-height:44px; border-radius:10px; border:1px solid #cbd5e1; padding:0.5rem 0.7rem; font-size:0.88rem; font-weight:700; background:#ffffff;" required>
                ${[1,2,3,4,5,6,7,8,9,10].map(g => `<option value="${g}" ${g === 8 ? 'selected' : ''}>Grade ${g}</option>`).join('')}
              </select>
            </label>
            <label style="font-weight:700; font-size:0.85rem; color:#0f172a;">
              Section *
              <select name="section" style="margin-top:0.35rem; width:100%; min-height:44px; border-radius:10px; border:1px solid #cbd5e1; padding:0.5rem 0.7rem; font-size:0.88rem; font-weight:700; background:#ffffff;" required>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
              </select>
            </label>
            <label style="font-weight:700; font-size:0.85rem; color:#0f172a;">
              Roll Number *
              <input type="text" name="rollNumber" value="${(students().length + 1)}" placeholder="e.g. 18" style="margin-top:0.35rem; width:100%; min-height:44px; border-radius:10px; border:1px solid #cbd5e1; padding:0.6rem 0.8rem; font-size:0.9rem; font-weight:800;" required />
            </label>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <label style="font-weight:700; font-size:0.85rem; color:#0f172a;">
              Parent / Guardian Name *
              <input type="text" name="parentName" placeholder="e.g. Tariq Khan" style="margin-top:0.35rem; width:100%; min-height:44px; border-radius:10px; border:1px solid #cbd5e1; padding:0.6rem 0.8rem; font-size:0.9rem;" required />
            </label>
            <label style="font-weight:700; font-size:0.85rem; color:#0f172a;">
              Parent WhatsApp / Mobile *
              <input type="tel" name="parentMobile" placeholder="e.g. +91 98450 12345" style="margin-top:0.35rem; width:100%; min-height:44px; border-radius:10px; border:1px solid #cbd5e1; padding:0.6rem 0.8rem; font-size:0.9rem; font-weight:700;" required />
            </label>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.85rem;">
            <label style="font-weight:700; font-size:0.85rem; color:#0f172a;">
              Gender *
              <select name="gender" style="margin-top:0.35rem; width:100%; min-height:44px; border-radius:10px; border:1px solid #cbd5e1; padding:0.5rem 0.7rem; font-size:0.88rem; background:#ffffff;">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label>
            <label style="font-weight:700; font-size:0.85rem; color:#0f172a;">
              Date of Birth
              <input type="date" name="dob" value="2012-05-17" style="margin-top:0.35rem; width:100%; min-height:44px; border-radius:10px; border:1px solid #cbd5e1; padding:0.5rem 0.7rem; font-size:0.85rem;" />
            </label>
            <label style="font-weight:700; font-size:0.85rem; color:#0f172a;">
              Blood Group
              <select name="bloodGroup" style="margin-top:0.35rem; width:100%; min-height:44px; border-radius:10px; border:1px solid #cbd5e1; padding:0.5rem 0.7rem; font-size:0.88rem; background:#ffffff;">
                <option value="O+">O+</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
                <option value="O-">O-</option>
              </select>
            </label>
          </div>

          <!-- PROMINENT FORM BUTTONS INSIDE FORM -->
          <div style="display:flex; justify-content:flex-end; align-items:center; gap:0.75rem; margin-top:0.75rem; padding-top:0.85rem; border-top:1px solid #e2e8f0;">
            <button class="btn btn-secondary" type="button" data-action="close-modal" style="min-height:44px; padding:0.6rem 1.25rem; border-radius:10px; font-weight:600;">Cancel (✕)</button>
            <button class="btn btn-primary" type="submit" style="min-height:44px; padding:0.65rem 1.6rem; border-radius:10px; font-weight:800; background:#2563eb; border-color:#2563eb; color:#ffffff; box-shadow:0 4px 12px rgba(37,99,235,0.3);">💾 Save & Enroll Student</button>
          </div>
        </form>
      `, `
        <button class="btn btn-secondary" data-action="close-modal" style="min-height:44px; padding:0.6rem 1.25rem; border-radius:10px; font-weight:600;">Cancel (✕)</button>
        <button class="btn btn-primary" form="add-student-form" type="submit" style="min-height:44px; padding:0.65rem 1.5rem; border-radius:10px; font-weight:800; background:#2563eb; border-color:#2563eb;">💾 Save & Enroll Student</button>
      `);
    }

    if (state.modal === 'smart-substitute') {
      const freeTeachers = [
        { name: 'Ms. Ayesha Khan', dept: 'Mathematics', freePeriod: 'Period 2 (09:20 - 10:05 AM)', status: 'Free' },
        { name: 'Mr. Arjun Rao', dept: 'Science & Physics', freePeriod: 'Period 2 (09:20 - 10:05 AM)', status: 'Free' },
        { name: 'Dr. Sarah Rahman', dept: 'English', freePeriod: 'Period 3 (10:30 - 11:15 AM)', status: 'Free' }
      ];
      return modalShell('⚡ Smart Auto-Assign Teacher Substitute', `
        <div class="form-grid" style="gap:1rem; padding:0.25rem;">
          <div style="background:#e0e7ff; border:1px solid #c7d2fe; border-radius:10px; padding:0.75rem 1rem; color:#3730a3; font-size:0.85rem;">
            <b>🤖 AI Timetable Scanner:</b> Found 3 qualified faculty members with free periods matching the absent teacher schedule.
          </div>
          <div style="font-size:0.85rem; font-weight:700; color:#0f172a;">Available Free Teachers for Period 2 & 3:</div>
          <div style="display:flex; flex-direction:column; gap:0.6rem;">
            ${freeTeachers.map((t, idx) => `
              <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #cbd5e1; padding:0.75rem 1rem; border-radius:10px;">
                <div>
                  <b style="color:#0f172a; display:block;">${escapeHTML(t.name)}</b>
                  <small style="color:#64748b;">${escapeHTML(t.dept)} • ${escapeHTML(t.freePeriod)}</small>
                </div>
                <button class="btn btn-primary" style="font-size:0.75rem; padding:0.35rem 0.75rem; background:#16a34a; border-color:#16a34a;" data-action="confirm-substitute" data-sub-name="${escapeHTML(t.name)}">
                  ✓ Assign ${t.name.split(' ')[1]}
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `, `
        <button class="btn btn-secondary" data-action="close-modal">Close (✕)</button>
      `);
    }

    if (state.modal === 'school-timing') {
      const config = getSchoolTimingConfig();
      return modalShell('School timing settings', `<form id="school-timing-form" class="form-grid"><label>Schedule label<input name="label" value="${escapeHTML(config.label)}" placeholder="Regular School Day" required /></label><div class="form-split"><label>Start time<input type="time" name="startTime" value="${escapeHTML(config.startTime)}" required /></label><label>End time<input type="time" name="endTime" value="${escapeHTML(config.endTime)}" required /></label></div><p class="form-note">This countdown setting is saved per school workspace and shown on all dashboards.</p></form>`, `<button class="btn btn-secondary" data-action="close-modal">Cancel</button><button class="btn btn-primary" form="school-timing-form" type="submit">Save timing</button>`);
    }
    return modalShell('NotebookXL', `<p class="modal-intro">This workspace action is ready for the production backend integration. The prototype preserves the appropriate navigation and confirmation state.</p>`, `<button class="btn btn-primary" data-action="close-modal">Done</button>`);
  }

  function render() {
    const mainContent = state.view === 'landing'
      ? renderLanding()
      : state.view === 'about'
        ? renderAbout()
        : state.view === 'contact'
          ? renderContact()
        : state.view === 'demo'
          ? renderDemo()
        : state.view === 'login'
          ? renderLogin()
          : state.isAuthenticated
            ? renderShell()
            : renderLogin();

    app.innerHTML = mainContent + (state.view === 'app' ? '' : renderAira());
  }
  function notify(message, tone = 'success') {
    const region = document.getElementById('toast-region');
    if (!region) return;
    const item = document.createElement('div');
    item.className = `toast ${tone}`;
    item.innerHTML = `<span>${tone === 'success' ? '✓' : '!'}</span><p>${escapeHTML(message)}</p><button aria-label="Dismiss">×</button>`;
    region.appendChild(item);
    item.querySelector?.('button')?.addEventListener?.('click', () => item.remove?.());
    if (typeof window.setTimeout === 'function') {
      window.setTimeout(() => item.remove?.(), 4200);
    }
  }
  function nav(page) {
    state.view = 'app';
    state.isAuthenticated = true;
    state.page = page;
    state.profile = null;
    state.classScope = null;
    state.mobileNav = false;
    if (page === 'dashboard') loadRoleDashboardData(true);
    if (page === 'announcements' || page === 'notifications') loadCommunityPosts();
    render();
    if (typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  function openStudent(id) {
    state.view = 'app';
    state.isAuthenticated = true;
    state.profile = { type: 'student', id };
    state.profileTab = 'overview';
    state.mobileNav = false;
    render();
    if (typeof window.scrollTo === 'function') {
      window.scrollTo({top:0, behavior:'smooth'});
    }
  }
  function openTeacher(id) {
    state.view = 'app';
    state.isAuthenticated = true;
    state.profile = { type: 'teacher', id };
    state.profileTab = 'overview';
    state.mobileNav = false;
    render();
    if (typeof window.scrollTo === 'function') {
      window.scrollTo({top:0, behavior:'smooth'});
    }
  }
  function openClass(data) {
    state.view = 'app';
    state.isAuthenticated = true;
    state.profile = null;
    state.classScope = { grade: data.grade || '8', section: data.section || 'A', subject: data.subject || 'Mathematics' };
    state.page = 'class-view';
    render();
    if (typeof window.scrollTo === 'function') {
      window.scrollTo({top:0,behavior:'smooth'});
    }
  }
  function openDocumentInNewTab(htmlContent, title) {
    const isIDCard = title.toLowerCase().includes('id card') || htmlContent.includes('school-id-card-frame') || htmlContent.includes('printable-id-card');
    const isReportCard = title.toLowerCase().includes('report card') || htmlContent.includes('cbse-report-card-container') || htmlContent.includes('printable-report-card');
    const pageCss = isIDCard
      ? `@page { size: 54mm 85.6mm; margin: 0; } body { background: #ffffff !important; padding: 0 !important; } .pdf-preview-header { display: none !important; } .pdf-canvas-page { box-shadow: none !important; max-width: 54mm !important; height: 85.6mm !important; padding: 0 !important; margin: 0 auto !important; }`
      : `@page { size: A4 portrait; margin: 6mm 8mm; } body { background: #ffffff !important; padding: 0 !important; } .pdf-preview-header { display: none !important; } .pdf-canvas-page { box-shadow: none !important; max-width: 100% !important; padding: 0 !important; margin: 0 !important; }`;

    const subTitleText = isIDCard
      ? 'Official CR80 PVC ID Card (54mm × 85.6mm) · Ready for PVC Card Printer'
      : isReportCard
      ? 'Official Single-Page A4 Marksheet · Guaranteed 1 Single Page Print'
      : 'Document Preview · High Resolution Print Ready';

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        window.print();
        return;
      }
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>${title} · NotebookXL PDF Viewer</title>
          <link rel="stylesheet" href="styles.css?v=20260818-1132">
          <link rel="stylesheet" href="styles-modern.css?v=20260818-1132">
          <style>
            * { box-sizing: border-box; }
            body {
              background: #1e293b;
              margin: 0;
              padding: 1.5rem 1rem;
              min-height: 100vh;
              display: flex;
              flex-direction: column;
              align-items: center;
              font-family: system-ui, -apple-system, sans-serif;
            }
            .pdf-preview-header {
              position: sticky;
              top: 10px;
              z-index: 1000;
              background: #0f172a;
              color: #ffffff;
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 8px;
              padding: 0.6rem 1.25rem;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 1.5rem;
              width: 100%;
              max-width: ${isIDCard ? '420px' : '820px'};
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
              margin-bottom: 1.5rem;
            }
            .pdf-preview-btn {
              background: #2563eb;
              color: #ffffff;
              border: none;
              border-radius: 6px;
              padding: 0.45rem 0.9rem;
              font-weight: 800;
              font-size: 0.82rem;
              cursor: pointer;
              display: inline-flex;
              align-items: center;
              gap: 0.35rem;
            }
            .pdf-preview-btn:hover { background: #1d4ed8; }
            .pdf-preview-btn.secondary { background: #475569; }
            .pdf-preview-btn.secondary:hover { background: #1e293b; }
            .pdf-canvas-page {
              background: #ffffff;
              box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
              border-radius: 4px;
              max-width: ${isIDCard ? '320px' : '820px'};
              width: 100%;
              padding: ${isIDCard ? '0' : '0.5rem'};
              display: flex;
              justify-content: center;
            }
            @media print {
              ${pageCss}
            }
          </style>
        </head>
        <body>
          <div class="pdf-preview-header">
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span style="font-size:1.1rem;">${isIDCard ? '🪪' : '📄'}</span>
              <div>
                <b style="font-size:0.88rem;">${title}</b>
                <div style="font-size:0.72rem; color:#94a3b8;">${subTitleText}</div>
              </div>
            </div>
            <div style="display:flex; gap:0.5rem; align-items:center;">
              <button class="pdf-preview-btn" onclick="window.print()">🖨️ Print / Save PDF</button>
              <button class="pdf-preview-btn secondary" onclick="window.close()">✕ Close</button>
            </div>
          </div>
          <div class="pdf-canvas-page">
            ${htmlContent}
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
    } catch (_) {
      window.print();
    }
  }

  async function actionHandler(event) {
    const trigger = event.target.closest('[data-action]');
    if (!trigger) return;
    const action = trigger.dataset.action;
    if (trigger.tagName === 'A') event.preventDefault();
    if (action === 'open-discord-voice') {
      const channel = trigger.dataset.channel || 'management';
      state.modal = 'discord-voice';
      state.selectedDiscordChannel = channel;
      render();
    }
    else if (action === 'go-landing') {
      state.view = 'landing';
      state.mobileNav = false;
      state.airaOpen = false;
      window.history.pushState({}, '', '/');
      render();
    }
    else if (action === 'open-emergency-broadcast') {
      state.modal = 'emergency-broadcast';
      render();
    }
    else if (action === 'open-smart-substitute') {
      state.modal = 'smart-substitute';
      render();
    }
    else if (action === 'confirm-substitute') {
      const subName = trigger.dataset.subName || 'Faculty Member';
      state.modal = null;
      render();
      notify(`⚡ Smart Substitute Assigned: ${subName} successfully notified for Period 2 & 3! Timetable synced.`, 'success');
    }
    else if (action === 'go-login') {
      state.view = 'login';
      state.authMode = 'signin';
      state.mobileNav = false;
      window.history.pushState({}, '', '/login');
      render();
    }
    else if (action === 'go-signup') {
      state.view = 'login';
      state.authMode = 'signup';
      state.mobileNav = false;
      window.history.pushState({}, '', '/login');
      render();
    }
    else if (action === 'go-demo') {
      state.view = 'demo';
      state.mobileNav = false;
      state.modal = null;
      window.history.pushState({}, '', '/demo');
      render();
    }
    else if (action === 'reset-demo-submission') {
      state.lastSubmissionSuccess = null;
      render();
    }
    else if (action === 'filter-inquiries') {
      state.inquiryFilter = trigger.dataset.filter || 'all';
      render();
    }
    else if (action === 'set-ai-exam-level') {
      state.aiExamLevel = trigger.dataset.level || 'MID_TERM';
      render();
      notify(`Assessment level changed to: ${state.aiExamLevel.replace('_', ' ')}. Section questions & marks re-calibrated.`, 'info');
    }
    else if (action === 'trigger-ai-exam-gen') {
      notify('🤖 AI analyzing pasted lesson text... Section-wise questions, mark distribution & answer key updated!', 'success');
      render();
    }
    else if (action === 'load-sample-lesson-text') {
      state.aiLessonTextSample = 'Chapter 5: Photosynthesis & Plant Physiology. Light reaction takes place in thylakoid membranes where water molecules split into H+ ions, oxygen, and ATP. Dark reaction (Calvin cycle) occurs in stroma using ATP and CO2 to produce Glucose (C6H12O6). Key factors: light intensity, CO2 concentration, and temperature.';
      render();
      notify('Sample textbook chapter loaded into AI Exam Studio.', 'info');
    }
    else if (action === 'publish-exam-to-students') {
      notify('🚀 Question Paper & Answer Key published live to Student Dashboards! Available in both Online & Physical PDF modes.', 'success');
    }
    else if (action === 'toggle-inquiry-status') {
      const id = trigger.dataset.id;
      const lead = (state.schoolInquiries || []).find((i) => i.id === id);
      if (lead) {
        const order = ['NEW_LEAD', 'CONTACTED', 'DEMO_SCHEDULED', 'CONVERTED'];
        const nextIdx = (order.indexOf(lead.status) + 1) % order.length;
        lead.status = order[nextIdx];
        try {
          localStorage.setItem('notebookxl_school_inquiries', JSON.stringify(state.schoolInquiries));
        } catch (e) {}
        render();
        notify(`Lead #${id} status updated to: ${lead.status.replace('_', ' ')}`, 'info');
      }
    }
    else if (action === 'switch-solution-tab') {
      state.activeSolutionTab = trigger.dataset.tab || 'management';
      render();
    }
    else if (action === 'switch-tour-tab') {
      state.activeTourTab = trigger.dataset.tab || 'pulse';
      render();
    }
    else if (action === 'logout') {
      state.isAuthenticated = false;
      state.authSession = null;
      state.view = 'landing';
      state.authMode = 'signin';
      state.page = 'dashboard';
      state.profile = null;
      state.modal = null;
      state.mobileNav = false;
      state.authDraft = {
        workspace: state.authSession?.tenant?.slug || state.authDraft?.workspace || 'meezankids',
        userId: '',
        password: ''
      };
      state.remoteDashboards = {
        management: null,
        teacher: null,
        student: null,
        loading: false,
        error: ''
      };
      writeStoredAuthSession(null);
      window.history.pushState({}, '', '/');
      render();
      notify('You have been logged out successfully.', 'success');
    }
    else if (action === 'go-login-role') {
      const role = trigger.dataset.role || 'SCHOOL_ADMIN';
      const t = tenant() || (seed.tenants && seed.tenants[0]) || { id: 'tenant-meezankids', name: 'Meezan Kids School', slug: 'meezankids' };
      const demoUser = role === 'STUDENT' ? (students()[0] || { id: 'student-1', name: 'Amaan Khan' }) : role === 'TEACHER' ? (teachers()[0] || { id: 'teacher-1', name: 'Zahra Patel' }) : { id: 'admin-1', name: 'Farah Khan', email: 'farah@meezan.school.edu', role: 'SCHOOL_ADMIN' };
      const session = {
        token: 'demo-token-' + Date.now(),
        user: {
          id: demoUser.id,
          name: fullName(demoUser),
          email: demoUser.email || `${lower(firstName(demoUser))}@meezan.school.edu`,
          role: role,
          tenantId: t.id
        },
        tenant: {
          id: t.id,
          slug: t.slug || 'meezankids',
          schoolName: t.school?.name || t.name || 'Meezan Kids School'
        }
      };
      applyAuthenticatedSession(session, `✓ Signed in as ${roleLabels[role] || role}.`);
    }
    else if (action === 'open-demo-dashboard') {
      const role = 'SCHOOL_ADMIN';
      const t = tenant() || (seed.tenants && seed.tenants[0]) || { id: 'tenant-meezankids', name: 'Meezan Kids School', slug: 'meezankids' };
      const session = {
        token: 'demo-token-' + Date.now(),
        user: { id: 'admin-1', name: 'Farah Khan', email: 'farah@meezan.school.edu', role, tenantId: t.id },
        tenant: { id: t.id, slug: t.slug || 'meezankids', schoolName: t.school?.name || t.name || 'Meezan Kids School' }
      };
      applyAuthenticatedSession(session, `✓ Welcome to ${t.school?.name || t.name || 'NotebookXL'}.`);
    }
    else if (action === 'dashboard') nav('dashboard');
    else if (action === 'nav') nav(trigger.dataset.page);
    else if (action === 'nav-and-close') { state.modal = null; nav(trigger.dataset.page); }
    else if (action === 'toggle-mobile-nav') { state.mobileNav = !state.mobileNav; render(); }
    else if (action === 'toggle-sidebar-collapse') { state.sidebarCollapsed = !state.sidebarCollapsed; render(); }
    else if (action === 'toggle-aira') { state.airaOpen = !state.airaOpen; render(); }
    else if (action === 'aira-prompt') { state.lastAiraPrompt = trigger.dataset.prompt; state.lastAiraAnswer = airaResponse(state.lastAiraPrompt); render(); }
    else if (action === 'open-razorpay-online') {
      state.selectedOnlinePayStudentId = trigger.dataset.id;
      state.modal = 'razorpay-checkout';
      render();
    }
    else if (action === 'process-razorpay-pay') {
      const studentId = state.selectedOnlinePayStudentId;
      const records = getTenantFeeRecords();
      const rec = records.find(r => r.id === studentId);
      if (rec && rec.balanceDue > 0) {
        const paid = rec.balanceDue;
        rec.paidAmount += paid;
        rec.balanceDue = 0;
        rec.status = 'Paid';
        rec.history.push({
          receiptNo: `REC-RZP-${Math.floor(100000 + Math.random()*900000)}`,
          date: '17 Aug 2026',
          amount: paid,
          mode: 'Razorpay UPI (Live)',
          collectedBy: 'Razorpay Gateway'
        });
        state.modal = null;
        render();
        notify(`🎉 Payment of ₹${paid.toLocaleString()} via Razorpay UPI successful for ${rec.studentName}! Digital receipt sent to parent's WhatsApp.`, 'success');
      }
    }
    else if (action === 'open-student') openStudent(trigger.dataset.id)
    else if (action === 'open-teacher') openTeacher(trigger.dataset.id)
    else if (action === 'close-profile') { state.profile = null; state.page = state.role === 'TEACHER' ? 'my-students' : 'students'; render(); }
    else if (action === 'set-profile-tab') { state.profileTab = trigger.dataset.tab; render(); }
    else if (action === 'open-class') openClass(trigger.dataset)
    else if (action === 'close-class') { state.classScope = null; state.page = 'my-classes'; render(); }
  else if (action === 'open-pulse') { state.pulseExpanded = !state.pulseExpanded; state.page = 'dashboard'; render(); }
  else if (action === 'set-period') { state.attendancePeriod = trigger.dataset.period || 'today'; render(); }
  else if (action === 'set-timetable-view') { state.timetableView = trigger.dataset.view || 'month'; render(); }
  else if (action === 'change-timetable-date') { shiftTimetableDate(trigger.dataset.direction || 'today'); render(); }
  else if (action === 'set-timetable-date') {
    const base = parseTimetableDate();
    const selectedDay = Number(trigger.dataset.day || base.getDate());
    setTimetableDate(new Date(base.getFullYear(), base.getMonth(), selectedDay));
    state.timetableView = 'day';
    render();
  }
  else if (action === 'generate-exam-pdf') {
    state.modal = 'exam-paper';
    render();
  }
  else if (action === 'set-timetable-month') {
    const base = parseTimetableDate();
    const selectedMonth = Number(trigger.dataset.month || base.getMonth());
    setTimetableDate(new Date(base.getFullYear(), selectedMonth, 1));
    state.timetableView = 'month';
    render();
  }
    else if (action === 'filter-community') {
      state.communityPostFilter = trigger.dataset.filter || 'ALL';
      render();
    }
    else if (action === 'filter-hashtag') {
      const tag = trigger.dataset.tag || '';
      state.communitySearchQuery = `#${tag}`;
      state.communityPostFilter = 'ALL';
      notify(`Filtering feed by #${tag}`, 'info');
      render();
    }
    else if (action === 'prev-spotlight') {
      const spotlights = tenantCampusSpotlights();
      state.activeSpotlightIndex = ((state.activeSpotlightIndex || 0) - 1 + spotlights.length) % spotlights.length;
      render();
    }
    else if (action === 'next-spotlight') {
      const spotlights = tenantCampusSpotlights();
      state.activeSpotlightIndex = ((state.activeSpotlightIndex || 0) + 1) % spotlights.length;
      render();
    }
    else if (action === 'set-spotlight-index') {
      state.activeSpotlightIndex = Number(trigger.dataset.index || 0);
      render();
    }
    else if (action === 'vote-campus-poll') {
      const optionId = trigger.dataset.optionId;
      const poll = tenantCampusPoll();
      if (poll) {
        if (poll.userVotedOptionId === optionId) {
          const opt = poll.options.find((o) => o.id === optionId);
          if (opt) opt.votes = Math.max(0, opt.votes - 1);
          poll.totalVotes = Math.max(0, poll.totalVotes - 1);
          poll.userVotedOptionId = null;
          notify('Vote removed.', 'info');
        } else {
          if (poll.userVotedOptionId) {
            const prevOpt = poll.options.find((o) => o.id === poll.userVotedOptionId);
            if (prevOpt) prevOpt.votes = Math.max(0, prevOpt.votes - 1);
          } else {
            poll.totalVotes = (poll.totalVotes || 0) + 1;
          }
          const opt = poll.options.find((o) => o.id === optionId);
          if (opt) opt.votes = (opt.votes || 0) + 1;
          poll.userVotedOptionId = optionId;
          notify('✓ Your vote has been recorded on the school survey.', 'success');
        }
        render();
      }
    }
    else if (action === 'clear-community-search') {
      state.communitySearchQuery = '';
      render();
    }
    else if (action === 'set-composer-media') {
      state.composerMediaKind = trigger.dataset.kind || 'text';
      render();
    }
    else if (action === 'set-ai-subject') {
      state.aiPrepSubject = trigger.dataset.subject || 'math';
      render();
    }
    else if (action === 'select-quiz-option') {
      const sub = trigger.dataset.subject || 'math';
      const qIdx = parseInt(trigger.dataset.qindex, 10);
      const optIdx = parseInt(trigger.dataset.option, 10);
      if (!state.aiPrepQuizState) state.aiPrepQuizState = {};
      if (!state.aiPrepQuizState[sub]) state.aiPrepQuizState[sub] = { selected: {}, submitted: false, score: 0 };
      if (!state.aiPrepQuizState[sub].submitted) {
        state.aiPrepQuizState[sub].selected[qIdx] = optIdx;
        render();
      }
    }
    else if (action === 'submit-ai-quiz') {
      const sub = trigger.dataset.subject || 'math';
      if (!state.aiPrepQuizState) state.aiPrepQuizState = {};
      if (!state.aiPrepQuizState[sub]) state.aiPrepQuizState[sub] = { selected: {}, submitted: false, score: 0 };
      state.aiPrepQuizState[sub].submitted = true;
      state.aiPrepXP = (state.aiPrepXP || 1450) + 100;
      render();
      notify('🎉 Practice Quiz submitted! You earned +100 XP & updated your topic mastery!', 'success');
    }
    else if (action === 'reset-ai-quiz') {
      const sub = trigger.dataset.subject || 'math';
      if (!state.aiPrepQuizState) state.aiPrepQuizState = {};
      state.aiPrepQuizState[sub] = { selected: {}, submitted: false, score: 0 };
      render();
    }
    else if (action === 'print-ai-study-plan') {
      window.print();
    }
    else if (action === 'set-portal-tab') {
      state.pocketPortalTab = trigger.dataset.tab || 'homework';
      render();
    }
    else if (action === 'topup-canteen-wallet') {
      state.canteenPrepaidBalance = (state.canteenPrepaidBalance || 1250) + 500;
      render();
      notify('💳 ₹500 added to Canteen Smart Wallet!', 'success');
    }
    else if (action === 'reserve-library-book') {
      const bTitle = trigger.dataset.title || 'Selected Book';
      notify(`📌 Book "${bTitle}" reserved! Collect from Library Shelf.`, 'success');
    }
    else if (action === 'renew-library-book') {
      notify('🔄 Book renewed for 14 additional days!', 'success');
    }
    else if (action === 'print-pocket-summary') {
      window.print();
    }
    else if (action === 'toggle-task-demo') {
      notify('✓ Task marked as completed & submitted!', 'success');
    }
    else if (action === 'view-event-gallery') {
      notify('📸 Gallery loaded with 24 high-resolution photo highlights.', 'info');
    }
    else if (action === 'open-reaction-picker') {
      const postId = trigger.dataset.postId;
      state.activeReactionPickerPostId = state.activeReactionPickerPostId === postId ? null : postId;
      render();
    }
    else if (action === 'react-post-emoji') {
      const postId = trigger.dataset.postId;
      const emoji = trigger.dataset.emoji || 'like';
      const post = visibleCommunityPosts().find((p) => p.id === postId);
      if (post) {
        if (!post.reactions) post.reactions = { like: 0, love: 0, celebrate: 0, insightful: 0, support: 0, awesome: 0 };
        if (post.userReaction === emoji) {
          post.reactions[emoji] = Math.max(0, (post.reactions[emoji] || 1) - 1);
          post.userReaction = null;
        } else {
          if (post.userReaction && post.reactions[post.userReaction]) {
            post.reactions[post.userReaction] = Math.max(0, post.reactions[post.userReaction] - 1);
          }
          post.reactions[emoji] = (post.reactions[emoji] || 0) + 1;
          post.userReaction = emoji;
        }
        state.activeReactionPickerPostId = null;
        render();
        notify(`Reacted with ${emoji === 'like' ? '👍' : emoji === 'love' ? '❤️' : emoji === 'celebrate' ? '👏' : emoji === 'insightful' ? '💡' : emoji === 'support' ? '🎯' : '🔥'}`, 'info');
      }
    }
    else if (action === 'focus-comment-input') {
      const postId = trigger.dataset.postId;
      const form = document.querySelector(`.community-comment-form[data-post-id="${postId}"]`);
      if (form) {
        const input = form.querySelector('input');
        if (input) input.focus();
      }
    }
    else if (action === 'repost-community-post') {
      const postId = trigger.dataset.postId;
      const post = visibleCommunityPosts().find((p) => p.id === postId);
      if (post) {
        post.repostsCount = (post.repostsCount || 0) + 1;
        render();
        notify('✓ Post reposted to your school community network.', 'success');
      }
    }
    else if (action === 'share-community-post') {
      notify('🔗 Post link copied to clipboard.', 'info');
    }
    else if (action === 'toggle-comment-reply-box') {
      const commentId = trigger.dataset.commentId;
      state.replyingToCommentId = state.replyingToCommentId === commentId ? null : commentId;
      render();
    }
    else if (action === 'cancel-reply') {
      state.replyingToCommentId = null;
      render();
    }
    else if (action === 'like-comment') {
      const postId = trigger.dataset.postId;
      const commentId = trigger.dataset.commentId;
      const post = visibleCommunityPosts().find((p) => p.id === postId);
      if (post) {
        const comment = (post.comments || []).find((c) => c.id === commentId);
        if (comment) {
          comment.userLiked = !comment.userLiked;
          comment.likes = (comment.likes || 0) + (comment.userLiked ? 1 : -1);
          render();
        }
      }
    }
    else if (action === 'download-circular') {
      const title = trigger.dataset.title || 'Official_Circular.pdf';
      notify(`📥 Downloading ${title}...`, 'success');
    }
    else if (action === 'delete-community-post') {
      if (state.role !== 'SCHOOL_ADMIN') return;
      const postId = String(trigger.dataset.postId || '');
      if (!window.confirm('Delete this post?')) return;
      const store = tenantCommunityStore();
      store.posts = store.posts.filter((p) => p.id !== postId);
      render();
      notify('Post deleted.', 'success');
    }
    else if (action === 'edit-community-post') {
      if (state.role !== 'SCHOOL_ADMIN') return;
      const postId = String(trigger.dataset.postId || '');
      const post = visibleCommunityPosts().find((item) => item.id === postId);
      if (!post) return;
      const updatedMessage = window.prompt('Edit post message', post.message || '');
      if (updatedMessage == null) return;
      const trimmed = String(updatedMessage).trim();
      if (!trimmed) return notify('Message cannot be empty.', 'danger');
      post.message = trimmed;
      render();
      notify('Post updated.', 'success');
    }
  else if (action === 'teacher-reason-filter') { state.selectedTeacherReason = trigger.dataset.reason || ''; render(); }
  else if (action === 'clear-teacher-reason') { state.selectedTeacherReason = ''; render(); }
    else if (action === 'change-calendar-year') { state.calendarYear += trigger.dataset.direction === 'prev' ? -1 : 1; render(); }
    else if (action === 'open-school-timing') { state.modal = 'school-timing'; render(); }
    else if (action === 'open-add-subject') { state.modal = 'add-subject'; render(); }
    else if (action === 'open-add-student') { state.modal = 'add-student'; render(); }
    else if (action === 'open-add-teacher') { state.modal = 'add-teacher'; render(); }
    else if (action === 'open-add-assignment') { state.modal = 'add-assignment'; render(); }
    else if (action === 'open-add-assessment') { state.modal = 'add-assessment'; render(); }
    else if (action === 'open-add-task') { state.modal = 'add-task'; render(); }
    else if (action === 'open-take-attendance') { state.modal = 'take-attendance'; render(); }
    else if (action === 'open-record-mark') { state.modal = 'record-mark'; render(); }
    else if (action === 'open-add-year') { state.modal = 'add-year'; render(); }
    else if (action === 'open-workspace') { state.modal = 'workspace'; render(); }
    else if (action === 'switch-tenant') {
      const targetId = trigger.dataset.id || trigger.closest('[data-id]')?.dataset?.id || trigger.getAttribute('data-id');
      const targetTenant = (seed.tenants || []).find((t) => t.id === targetId || t.slug === targetId || (t.id && targetId && t.id.includes(targetId)) || (t.slug && targetId && t.slug.includes(targetId))) || (seed.tenants || [])[0];
      if (targetTenant) {
        state.tenantId = targetTenant.id;
        state.authRole = state.authRole || 'SCHOOL_ADMIN';
        state.role = state.role || 'SCHOOL_ADMIN';
        state.authDraft = {
          workspace: targetTenant.slug || 'iams',
          userId: `management@${targetTenant.slug || 'iams'}.school.edu`,
          password: 'IAMS@123'
        };
        const role = state.role || 'SCHOOL_ADMIN';
        const updatedSession = {
          token: state.authSession?.token || `demo-token-${role.toLowerCase()}`,
          user: {
            id: state.authSession?.user?.id || `user-${role.toLowerCase()}`,
            name: role === 'SCHOOL_ADMIN' ? `${targetTenant.shortName || 'IAMS'} Management Admin` : role === 'TEACHER' ? `${targetTenant.shortName || 'IAMS'} Faculty Teacher` : `${targetTenant.shortName || 'IAMS'} Student`,
            email: state.authSession?.user?.email || `admin@${targetTenant.slug || 'iams'}.school.edu`,
            role: role,
            tenantId: targetTenant.id
          },
          tenant: {
            id: targetTenant.id,
            slug: targetTenant.slug || 'iams',
            schoolName: targetTenant.school?.name || targetTenant.name,
            name: targetTenant.school?.name || targetTenant.name
          }
        };
        state.authSession = updatedSession;
        state.isAuthenticated = true;
        state.view = 'app';
        writeStoredAuthSession(updatedSession);
        
        state.modal = null;
        state.profile = null;
        state.activeStudentId = null;
        state.selectedReportCardStudentId = null;
        state.selectedFeeStudentId = null;
        state.selectedAttendanceClassId = null;
        state.classScope = null;
        state.studentDetailId = null;
        state.teacherDetailId = null;
        state.remoteDashboards.management = null;
        state.remoteDashboards.teacher = null;
        state.remoteDashboards.student = null;
        loadRoleDashboardData(true);
        loadCommunityPosts(true);
        render();
        notify(`✓ Active Workspace: ${targetTenant.school?.name || targetTenant.name}`, 'success');
      }
    }
    else if (action === 'close-modal') { state.modal = null; render(); }
    else if (action === 'open-assignment') { state.selectedAssignment = assignments().find((item) => item.id === trigger.dataset.id) || assignments()[0]; state.modal = 'assignment-detail'; render(); }
    else if (action === 'submit-assignment') { state.modal = null; render(); notify('Assignment marked ready for submission.'); }
    else if (action === 'toggle-task') { const task = tasks().find((item) => item.id === trigger.dataset.id); if (task) { task.status = lower(task.status).includes('completed') ? 'In Progress' : 'Completed'; render(); notify(`Task marked ${task.status.toLowerCase()}.`); } }
    else if (action === 'toggle-notifications') { state.notificationOpen = !state.notificationOpen; render(); }
    else if (action === 'close-notifications') { state.notificationOpen = false; render(); notify('All notifications marked as read.'); }
    else if (action === 'set-auth-role') { state.authRole = trigger.dataset.role; render(); }
    else if (action === 'set-auth-mode') { state.authMode = trigger.dataset.mode || 'signin'; render(); }
    else if (action === 'use-default-user') {
      const workspace = trigger.dataset.workspace || 'iams';
      const userId = trigger.dataset.user || '';
      const password = trigger.dataset.password || '';
      const role = trigger.dataset.role || 'SCHOOL_ADMIN';
      state.authRole = role;
      state.authMode = 'signin';
      state.authDraft = {
        workspace,
        userId,
        password
      };
      try {
        const payload = {
          workspace,
          user_id: userId,
          password,
          role
        };
        const result = await postJSON(`${AUTH_API_BASE}/api/v1/auth/login`, payload);
        const session = toClientAuthSession(result);
        if (session) {
          applyAuthenticatedSession(session, `✓ Welcome to ${roleLabels[role] || 'Dashboard'}.`);
          return;
        }
      } catch (err) {}
      
      const targetTenant = (seed.tenants || []).find(t => t.slug === workspace || t.id === workspace) || (seed.tenants || [])[0];
      const fallbackSession = {
        token: `demo-token-${role.toLowerCase()}`,
        user: {
          id: userId || `user-${role.toLowerCase()}`,
          name: role === 'SCHOOL_ADMIN' ? 'IAMS Management Admin' : role === 'TEACHER' ? 'IAMS Faculty Teacher' : 'IAMS Student',
          email: userId || `admin@iams.school.edu`,
          role: role,
          tenantId: targetTenant.id
        },
        tenant: {
          id: targetTenant.id,
          slug: targetTenant.slug,
          schoolName: targetTenant.school?.name || targetTenant.name
        }
      };
      applyAuthenticatedSession(fallbackSession, `✓ Welcome to ${roleLabels[role] || 'Dashboard'} · ${targetTenant.school?.name || targetTenant.name}.`);
    }
    else if (action === 'social-auth') {
      const provider = String(trigger.dataset.provider || '').trim().toLowerCase();
      if (!provider) {
        notify('Social provider not found. Please try again.', 'danger');
        return;
      }
      const signupForm = document.getElementById('signup-form');
      const loginForm = document.getElementById('login-form');
      const signupData = signupForm ? Object.fromEntries(new FormData(signupForm).entries()) : {};
      const loginData = loginForm ? Object.fromEntries(new FormData(loginForm).entries()) : {};
      const role = state.authRole || 'SCHOOL_ADMIN';
      const roleSlug = lower(role).replace(/[^a-z]+/g, '-');
      const fallbackName = `${provider[0].toUpperCase()}${provider.slice(1)} ${roleLabels[role] || 'User'}`;
      const fallbackEmail = `${provider}.${roleSlug}@meezankids.com`;
      const name = (signupData.name || '').trim() || state.authSession?.user?.name || fallbackName;
      const school = (signupData.school || '').trim() || (loginData.workspace || '').trim() || state.authDraft?.workspace || state.authSession?.tenant?.slug || 'meezankids';
      const email = (signupData.email || '').trim() || (loginData.userId || '').trim() || state.authDraft?.userId || fallbackEmail;
      if (!isValidEmail(email)) {
        notify('Please enter a valid email address.', 'danger');
        return;
      }
      try {
        const result = await postJSON(`${AUTH_API_BASE}/api/v1/auth/social-signup`, {
          provider,
          name,
          school,
          email,
          role
        });
        const session = toClientAuthSession(result);
        if (!session) throw new Error('Invalid social signup response from server.');
        applyAuthenticatedSession(session, `✓ ${trigger.dataset.provider || 'Social'} login successful. Welcome to ${session.tenant.schoolName}.`);
      } catch (error) {
        notify(error.message || 'Unable to complete social signup right now.', 'danger');
      }
    }
    else if (action === 'forgot-password') { state.authMode = 'reset'; render(); }
    else if (action === 'scroll-how') document.getElementById('features')?.scrollIntoView({behavior:'smooth'});
    else if (action === 'watch-landing-demo') notify('NotebookXL product demo preview will be available soon. You can still book a live demo today.', 'info');
  else if (action === 'set-landing-role') { state.landingRoleTab = trigger.dataset.role || 'management'; render(); }
  else if (action === 'set-landing-feature') { state.landingFeatureTab = trigger.dataset.feature || 'students'; render(); }
    else if (action === 'open-user-menu') { state.modal = 'user-menu'; render(); }
    else if (action === 'open-edit-profile') {
      state.editingProfileId = trigger.dataset.id || state.profile?.id || currentUser()?.id;
      state.modal = 'edit-profile';
      render();
    }
    else if (action === 'pick-preset-avatar') {
      const url = trigger.dataset.url;
      const previewImg = document.getElementById('edit-avatar-live-img');
      const urlInput = document.getElementById('edit-avatar-url-input');
      if (previewImg) previewImg.src = url;
      if (urlInput) urlInput.value = url;
    }
    else if (action === 'toggle-edit-password') {
      const pwdField = document.getElementById('edit-profile-password-field');
      if (pwdField) {
        pwdField.type = pwdField.type === 'password' ? 'text' : 'password';
      }
    }
    else if (action === 'filter-leaderboard-grade') {
      state.leaderboardGradeFilter = trigger.dataset.grade || 'ALL';
      state.leaderboardClassFilter = 'ALL';
      render();
    }
    else if (action === 'filter-leaderboard-sort') {
      state.leaderboardSortBy = trigger.dataset.sort || 'marks';
      render();
    }
    else if (action === 'view-certificate') {
      state.selectedCertificateStudentId = trigger.dataset.id;
      state.modal = 'student-certificate';
      render();
    }
    else if (action === 'toggle-fee-document') {
      state.showFeeReceiptDocument = !state.showFeeReceiptDocument;
      render();
    }
    else if (action === 'toggle-report-card-document') {
      state.showReportCardDocument = !state.showReportCardDocument;
      render();
    }
    else if (action === 'filter-id-card-segment') {
      state.idCardSegmentFilter = trigger.dataset.segment || 'ALL';
      state.selectedIDCardPersonId = null;
      render();
    }
    else if (action === 'toggle-id-card') {
      state.showIDCardDocument = !state.showIDCardDocument;
      render();
    }
    else if (action === 'print-id-card') {
      state.showIDCardDocument = true;
      render();
      setTimeout(() => window.print(), 100);
    }
    else if (action === 'quick-view-id-card') {
      state.idCardSegmentFilter = trigger.dataset.segment || 'ALL';
      state.selectedIDCardPersonId = trigger.dataset.id;
      state.showIDCardDocument = true;
      state.page = 'id-cards';
      render();
    }
    else if (action === 'open-scanner-modal') {
      state.activeScannerModal = true;
      render();
    }
    else if (action === 'close-scanner-modal') {
      state.activeScannerModal = false;
      render();
    }
    else if (action === 'open-universal-attendance-gateway') {
      state.activeUniversalAttendanceGateway = true;
      state.activeDeviceProvider = state.activeDeviceProvider || 'BARCODE';
      render();
    }
    else if (action === 'close-universal-attendance-gateway') {
      state.activeUniversalAttendanceGateway = false;
      render();
    }
    else if (action === 'set-device-provider') {
      state.activeDeviceProvider = trigger.dataset.provider || 'BARCODE';
      render();
    }
    else if (action === 'simulate-scan-submit') {
      const select = document.getElementById('scanner-sim-student');
      if (select && select.value) {
        recordStudentBarcodeScan(select.value);
      }
    }
    else if (action === 'print-receipt') {
      state.showFeeReceiptDocument = true;
      render();
      setTimeout(() => window.print(), 100);
    }
    else if (action === 'print-report-card') {
      state.showReportCardDocument = true;
      render();
      setTimeout(() => window.print(), 100);
    }
    else if (action === 'print-certificate') {
      window.print();
    }
    else if (action === 'preview-pdf-receipt') {
      const receiptEl = document.getElementById('printable-receipt');
      if (receiptEl) {
        openDocumentInNewTab(receiptEl.outerHTML, 'Official Fee Receipt');
      } else {
        window.print();
      }
    }
    else if (action === 'preview-pdf-report-card') {
      const reportEl = document.getElementById('printable-report-card');
      if (reportEl) {
        openDocumentInNewTab(reportEl.outerHTML, 'Student Academic Progress Report');
      } else {
        window.print();
      }
    }
    else if (action === 'preview-pdf-certificate') {
      const certEl = document.getElementById('printable-certificate');
      if (certEl) {
        openDocumentInNewTab(certEl.outerHTML, 'Certificate of Scholastic Distinction');
      } else {
        window.print();
      }
    }
    else if (action === 'filter-fee-status') {
      state.feeStatusFilter = trigger.dataset.status || 'ALL';
      render();
    }
    else if (action === 'view-digital-receipt') {
      state.selectedReceiptStudentId = trigger.dataset.id;
      state.modal = 'digital-receipt';
      render();
    }
    else if (action === 'open-record-payment') {
      state.selectedReceiptStudentId = trigger.dataset.id || students()[0]?.id;
      state.modal = 'record-payment';
      render();
    }
    else if (action === 'view-year') notify('Academic record opened in read-only historical mode.', 'info');
    else if (action === 'change-class-scope') { state.modal = 'change-class'; render(); }
    else if (action === 'export-timetable' || action === 'export-workload' || action === 'export-report') { notify('Your report export is being prepared.', 'success'); }
  else if (action === 'open-subject' || action === 'open-assessment' || action === 'open-timetable-entry' || action === 'open-report' || action === 'open-lesson-plan' || action === 'open-school-profile' || action === 'open-users' || action === 'open-audit' || action === 'open-subscription' || action === 'open-security' || action === 'open-announcement') { state.modal = 'general'; render(); }
  }
  async function submitHandler(event) {
    const form = event.target;
    if (!form.matches('form')) return;
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    if (form.id === 'login-form') {
      state.authDraft = {
        workspace: (data.workspace || '').trim(),
        userId: (data.userId || '').trim(),
        password: String(data.password || '')
      };
      try {
        const payload = {
          workspace: (data.workspace || '').trim(),
          user_id: (data.userId || '').trim(),
          password: String(data.password || ''),
          role: state.authRole
        };
        if (!payload.workspace) {
          return notify('Workspace is required.', 'danger');
        }
        if (!payload.user_id) {
          return notify('Please enter your User ID or Email.', 'danger');
        }
        let session = null;
        try {
          const result = await postJSON(`${AUTH_API_BASE}/api/v1/auth/login`, payload);
          session = toClientAuthSession(result);
        } catch (apiErr) {
          const role = state.authRole || 'SCHOOL_ADMIN';
          const t = tenant() || (seed.tenants && seed.tenants[0]) || { id: 'tenant-meezankids', name: 'Meezan Kids School', slug: 'meezankids' };
          const demoUser = role === 'STUDENT' ? (students()[0] || { id: 'student-1', name: 'Amaan Khan' }) : role === 'TEACHER' ? (teachers()[0] || { id: 'teacher-1', name: 'Zahra Patel' }) : { id: 'admin-1', name: 'Farah Khan', email: payload.user_id, role: 'SCHOOL_ADMIN' };
          session = {
            token: 'demo-token-' + Date.now(),
            user: {
              id: demoUser.id,
              name: fullName(demoUser),
              email: payload.user_id,
              role: role,
              tenantId: t.id
            },
            tenant: {
              id: t.id,
              slug: t.slug || 'meezankids',
              schoolName: t.school?.name || t.name || 'Meezan Kids School'
            }
          };
        }
        if (!session) throw new Error('Invalid auth response.');
        state.authDraft.password = '';
        state.authMode = 'signin';
        applyAuthenticatedSession(session, `✓ Welcome to ${session.tenant.schoolName}.`);
      } catch (error) {
        notify(error.message || 'Unable to sign in. Please check your credentials.', 'danger');
      }
    } else if (form.id === 'signup-form') {
      const name = (data.name || '').trim();
      const school = (data.school || '').trim();
      const email = (data.email || '').trim();
      const mobile = (data.mobile || '').trim();
      const password = (data.password || '').trim();
      const confirmPassword = (data.confirmPassword || '').trim();
      if (!name || !school || !email || !mobile || !password || !confirmPassword) {
        return notify('Please complete all required signup fields.', 'danger');
      }
      if (!isValidEmail(email)) {
        return notify('Please enter a valid email address.', 'danger');
      }
      if (!isStrongPassword(password)) {
        return notify('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.', 'danger');
      }
      if (password !== confirmPassword) {
        return notify('Password and confirm password do not match.', 'danger');
      }
      try {
  const result = await postJSON(`${AUTH_API_BASE}/api/v1/auth/signup`, {
          name,
          school,
          email,
          mobile,
          password,
          role: state.authRole
        });
        const session = toClientAuthSession(result);
        if (!session) throw new Error('Invalid signup response from server.');
        state.authDraft = {
          workspace: session.tenant?.slug || school,
          userId: email,
          password: ''
        };
        state.authMode = 'signin';
        applyAuthenticatedSession(session, `✓ Account created successfully. Welcome to ${session.tenant.schoolName}.`);
      } catch (error) {
        notify(error.message || 'Unable to create account right now.', 'danger');
      }
    } else if (form.id === 'reset-password-form') {
      const email = (data.email || '').trim();
      const newPassword = (data.newPassword || '').trim();
      const confirmPassword = (data.confirmPassword || '').trim();
      if (!email || !newPassword || !confirmPassword) {
        return notify('Please complete all reset password fields.', 'danger');
      }
      if (!isValidEmail(email)) {
        return notify('Please enter a valid email address.', 'danger');
      }
      if (!isStrongPassword(newPassword)) {
        return notify('New password must be at least 8 characters and include uppercase, lowercase, number, and special character.', 'danger');
      }
      if (newPassword !== confirmPassword) {
        return notify('New password and confirm password do not match.', 'danger');
      }
      try {
  await postJSON(`${AUTH_API_BASE}/api/v1/auth/reset-password`, {
          email,
          new_password: newPassword
        });
        state.authDraft = {
          workspace: state.authDraft?.workspace || 'meezankids',
          userId: email,
          password: ''
        };
        state.authMode = 'signin';
        render();
        notify('Password reset complete. You can sign in with your new password.', 'success');
      } catch (error) {
        notify(error.message || 'Unable to reset password right now.', 'danger');
      }
    } else if (form.id === 'home-demo-form') {
      const name = (data.name || '').trim();
      const school = (data.school || '').trim();
      if (!name || !school || !(data.email || '').trim() || !(data.mobile || '').trim() || !(data.requirements || '').trim()) {
        return notify('Please complete all required fields to book your demo.', 'danger');
      }
      form.reset();
      notify(`Thanks ${name}. Your NotebookXL demo request for ${school} has been received.`, 'success');
    } else if (form.id === 'contact-us-form') {
      const name = (data.name || '').trim();
      const school = (data.school || '').trim();
      const email = (data.email || '').trim();
      const mobile = (data.mobile || '').trim();
      const message = (data.message || '').trim();
      if (!name || !school || !email || !mobile || !message) {
        return notify('Please complete all required fields (Name, School, Email, Mobile, Message).', 'danger');
      }
      if (!isValidEmail(email)) {
        return notify('Please enter a valid email address.', 'danger');
      }
      const newInquiry = {
        id: 'INQ-' + Math.floor(10000 + Math.random() * 90000),
        type: 'GENERAL_INQUIRY',
        submittedAt: new Date().toISOString(),
        formattedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        name,
        designation: data.role || data.designation || 'School Leader',
        school,
        location: data.location || 'India',
        board: data.board || 'CBSE',
        strength: data.strength || '200-400 Students',
        email,
        mobile,
        timeslot: 'Morning (10:00 AM - 01:00 PM)',
        category: data.category || 'General School Inquiry',
        requirements: message,
        status: 'NEW_LEAD'
      };
      state.schoolInquiries = [newInquiry, ...(state.schoolInquiries || [])];
      try {
        localStorage.setItem('notebookxl_school_inquiries', JSON.stringify(state.schoolInquiries));
      } catch (e) {}
      state.lastSubmissionSuccess = newInquiry;
      render();
      notify(`✓ Thank you ${name}. Your inquiry for ${school} has been received. Our team will get in touch within 2 hours.`, 'success');
    } else if (form.id === 'demo-booking-form') {
      const name = (data.name || '').trim();
      const school = (data.school || '').trim();
      const email = (data.email || '').trim();
      const mobile = (data.mobile || '').trim();
      if (!name || !school || !email || !mobile) {
        return notify('Please complete all required fields (Name, School, Email, Mobile).', 'danger');
      }
      if (!email.includes('@') || !email.includes('.')) {
        return notify('Please enter a valid official email address.', 'danger');
      }
      const newDemo = {
        id: 'INQ-' + Math.floor(10000 + Math.random() * 90000),
        type: 'DEMO_REQUEST',
        submittedAt: new Date().toISOString(),
        formattedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        name,
        designation: data.designation || 'School Leader',
        school,
        location: data.location || 'India',
        board: data.board || 'CBSE',
        strength: data.strength || '200-400 Students',
        email,
        mobile,
        timeslot: data.timeslot || 'Morning (10:00 AM - 01:00 PM)',
        category: 'Product Demo',
        requirements: data.requirements || 'Requested a guided product demonstration.',
        status: 'NEW_LEAD'
      };
      state.schoolInquiries = [newDemo, ...(state.schoolInquiries || [])];
      try {
        localStorage.setItem('notebookxl_school_inquiries', JSON.stringify(state.schoolInquiries));
      } catch (e) {}
      state.lastSubmissionSuccess = newDemo;
      render();
      notify(`✓ Thank you ${name}! Your 20-minute guided demo for ${school} has been scheduled.`, 'success');
    } else if (form.id === 'add-student-form') {
      const firstName = (data.firstName || '').trim();
      const lastName = (data.lastName || '').trim();
      const grade = String(data.grade || '8');
      const section = String(data.section || 'A');
      const rollNumber = String(data.rollNumber || '18');
      const parentName = (data.parentName || '').trim();
      const parentMobile = (data.parentMobile || '').trim();
      const gender = data.gender || 'Male';
      const bloodGroup = data.bloodGroup || 'O+';
      const dob = data.dob || '2012-05-17';

      if (!firstName || !lastName || !parentName || !parentMobile) {
        return notify('Please fill in all mandatory fields (First Name, Last Name, Parent Name, Parent Mobile).', 'danger');
      }

      const sName = `${firstName} ${lastName}`;
      const newId = `stu-${Date.now()}`;
      const autoStudentId = `NXL-MKS-STU-000${(students().length + 1).toString().padStart(3, '0')}`;
      const autoAdmissionNo = `MKS-2026-${(420 + students().length + 1)}`;

      const newStudentObj = {
        id: newId,
        studentId: autoStudentId,
        admissionNumber: autoAdmissionNo,
        firstName,
        lastName,
        name: sName,
        grade,
        section,
        rollNumber,
        gender,
        bloodGroup,
        dob,
        parentName,
        parentMobile,
        phone: parentMobile,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@meezan.school.edu`,
        academicAverage: 88.5,
        attendanceRate: 96.0,
        status: 'Active',
        joinedOn: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      };

      // 1. Add to active students list
      if (!state.tenantData) state.tenantData = {};
      if (!state.tenantData.students) state.tenantData.students = [...students()];
      state.tenantData.students.unshift(newStudentObj);

      // 2. Initialize student fee account ledger
      const feeLedger = getTenantFeeRecords();
      feeLedger.unshift({
        id: newId,
        studentName: sName,
        studentId: autoStudentId,
        grade,
        section,
        parentName,
        parentMobile,
        totalFee: 80000,
        paidAmount: 30000,
        balanceDue: 50000,
        nextDueDate: '10 Oct 2026',
        history: [{
          receiptNo: `REC-MKS-${Date.now().toString().slice(-6)}`,
          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          amount: 30000,
          mode: 'Admission Desk Cash/UPI',
          collectedBy: 'School Management'
        }]
      });

      try {
        localStorage.setItem('notebookxl_students', JSON.stringify(state.tenantData.students));
        localStorage.setItem('notebookxl_fee_records', JSON.stringify(feeLedger));
      } catch (e) {}

      state.modal = null;
      render();
      notify(`🎉 SUCCESS! ${sName} (Grade ${grade}${section}, Roll #${rollNumber}) enrolled successfully! ID Badge & Fee Ledger created.`, 'success');
    } else if (form.dataset.submit === 'submit-universal-punch-event') {
      const credId = data.credentialId || 'NXL-MKS-STU-000002';
      const provider = state.activeDeviceProvider || 'BARCODE';
      
      try {
        const payload = {
          credential_id: credId,
          tenant_id: 'tenant-meezankids',
          device_id: `GATE_${provider}_SCANNER_01`,
          source_type: provider,
          person_type: credId.includes('T-') ? 'Teacher' : 'Student'
        };

        const res = await postJSON(`${AUTH_API_BASE}/api/v1/attendance/punch`, payload);
        state.universalAttendanceLastPunchResult = res;
        
        if (res.success) {
          notify(`🌐 ${provider} GATEWAY: ${res.message}`, 'success');
          // Also sync to frontend punch log table
          recordStudentBarcodeScan(credId);
        } else {
          notify(`⚠️ COOLDOWN: ${res.message}`, 'warning');
        }
      } catch (err) {
        notify(err.message || 'Universal attendance punch failed.', 'danger');
      }
      render();
    } else if (form.id === 'emergency-broadcast-form') {
      const title = data.title || 'Heavy Rain Alert - Early Dismissal';
      const message = data.message || 'Emergency notice released by School Management.';
      const audience = data.audience || 'ALL';

      // Live dispatch: Add directly to community posts feed so parents & staff see it live!
      const broadcastPost = {
        id: `broadcast-${Date.now()}`,
        author: {
          name: currentUser()?.name || 'School Principal & Management',
          role: 'SCHOOL_ADMIN',
          avatar: '👑'
        },
        time: 'Just now',
        headline: `🚨 EMERGENCY BROADCAST: ${title}`,
        content: message,
        audience: audience,
        isEmergency: true,
        reactions: { like: 12, love: 5, celebrate: 0, insightful: 18, support: 24, awesome: 2 },
        userReaction: null,
        comments: []
      };

      state.communityPosts = [broadcastPost, ...(state.communityPosts || [])];
      try {
        localStorage.setItem('notebookxl_community_posts', JSON.stringify(state.communityPosts));
      } catch (e) {}

      state.modal = null;
      render();
      notify(`🎉 SUCCESS! Emergency Broadcast "${title}" successfully dispatched to all Parents, Teachers & Students via WhatsApp, SMS & Live Portal Feed!`, 'success');
    } else if (form.id === 'community-post-form') {
      if (state.role !== 'SCHOOL_ADMIN') {
        return notify('Only school admin can post community updates.', 'danger');
      }
      const message = (data.message || '').trim();
      const audience = String(data.audience || 'ALL');
      const selectedFiles = Array.from(form.querySelector('input[name="attachments"]')?.files || []);
      if (!message && !selectedFiles.length) {
        return notify('Please add text or upload an image/video before posting.', 'danger');
      }
      if (selectedFiles.length > 3) {
        return notify('You can upload up to 3 files per post.', 'danger');
      }
      const maxBytes = 15 * 1024 * 1024;
      const invalid = selectedFiles.find((file) => !(String(file.type || '').startsWith('image/') || String(file.type || '').startsWith('video/')) || file.size > maxBytes);
    } else if (form.id === 'community-post-form') {
      const message = String(data.message || '').trim();
      const headline = String(data.headline || '').trim();
      const audience = String(data.audience || 'ALL');
      const mediaKind = String(data.mediaKind || state.composerMediaKind || 'text');
      const mediaSrc = String(data.mediaSrc || '').trim();
      if (!message && !headline) {
        return notify('Please enter a message or announcement headline.', 'danger');
      }
      const user = currentUser();
      const userRole = state.role || 'SCHOOL_ADMIN';
      const key = state.tenantId || 'default';
      let media = null;
      if (mediaKind === 'video') {
        media = {
          kind: 'video',
          src: mediaSrc || 'https://assets.mixkit.co/videos/preview/mixkit-students-working-on-a-science-project-41710-large.mp4',
          poster: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
          title: headline || 'Video Demonstration',
          duration: '1:30 min'
        };
      } else if (mediaKind === 'image') {
        media = {
          kind: 'image',
          src: mediaSrc || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
          caption: headline || 'Campus Activity'
        };
      } else if (mediaKind === 'circular') {
        media = {
          kind: 'circular',
          title: mediaSrc || (headline ? `${headline.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf` : 'Official_Notice.pdf'),
          size: '1.6 MB',
          pages: '2 Pages • Official School Memo'
        };
      }
      const newPost = {
        id: `post-${Date.now()}`,
        authorRole: userRole,
        authorName: fullName(user),
        authorTitle: `${roleLabels[userRole] || userRole} • Meezan Kids School`,
        authorAvatar: userRole === 'SCHOOL_ADMIN'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80'
          : userRole === 'TEACHER'
            ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100&q=80'
            : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80',
        audience,
        category: mediaKind === 'circular' ? 'Circulars' : mediaKind === 'video' ? 'Events' : 'Academic',
        headline: headline || '',
        message,
        createdAt: 'Just now',
        media,
        reactions: { like: 1, love: 0, celebrate: 0, insightful: 0, support: 0, awesome: 0 },
        userReaction: 'like',
        repostsCount: 0,
        comments: []
      };
      const store = tenantCommunityStore();
      store.posts.unshift(newPost);
      form.reset();
      state.composerMediaKind = 'text';
      render();
      notify('✓ Post published to School Community feed.', 'success');
    } else if (form.classList.contains('community-comment-form')) {
      const commentText = String(data.commentText || '').trim();
      const postId = form.dataset.postId;
      if (!commentText) return notify('Please enter a comment.', 'danger');
      const user = currentUser();
      const store = tenantCommunityStore();
      const post = store.posts.find((p) => p.id === postId);
      if (post) {
        if (!post.comments) post.comments = [];
        post.comments.push({
          id: `c-${Date.now()}`,
          authorName: fullName(user),
          authorRole: state.role || 'STUDENT',
          authorTitle: roleLabels[state.role] || state.role,
          authorAvatar: '',
          createdAt: 'Just now',
          text: commentText,
          likes: 0,
          userLiked: false,
          replies: []
        });
        form.reset();
        render();
        notify('✓ Comment added.', 'success');
      }
    } else if (form.classList.contains('nested-reply-form')) {
      const replyText = String(data.replyText || '').trim();
      const postId = form.dataset.postId;
      const commentId = form.dataset.commentId;
      if (!replyText) return notify('Please enter a reply.', 'danger');
      const user = currentUser();
      const store = tenantCommunityStore();
      const post = store.posts.find((p) => p.id === postId);
      if (post) {
        const comment = (post.comments || []).find((c) => c.id === commentId);
        if (comment) {
          if (!comment.replies) comment.replies = [];
          comment.replies.push({
            id: `r-${Date.now()}`,
            authorName: fullName(user),
            authorRole: state.role || 'STUDENT',
            authorTitle: roleLabels[state.role] || state.role,
            authorAvatar: '',
            createdAt: 'Just now',
            text: replyText,
            likes: 0,
            userLiked: false
          });
          state.replyingToCommentId = null;
          form.reset();
          render();
          notify('✓ Reply posted.', 'success');
        }
      }
    } else if (form.id === 'subject-form') {
      if (!data.name.trim() || !data.code.trim()) return notify('Enter a subject name and code.', 'danger');
      subjects().push({ id: uid(), name: data.name.trim(), code: data.code.trim().toUpperCase(), gradeLevels: data.grades.split(',').map(Number), status: data.status, active: data.status === 'Active' });
      state.modal = null; state.page = 'subjects'; render(); notify(`${data.name.trim()} has been added and is ready for assignment.`);
    } else if (form.id === 'student-form' || form.id === 'add-student-form') {
      const firstName = (data.firstName || '').trim();
      const lastName = (data.lastName || '').trim();
      const grade = String(data.grade || '8');
      const section = String(data.section || 'A');
      const rollNumber = String(data.rollNumber || (students().length + 1));
      const parentName = (data.parentName || 'Parent / Guardian').trim();
      const parentMobile = (data.parentMobile || data.phone || '9845098765').trim();
      const gender = data.gender || 'Male';
      const dob = data.dob || data.dateOfBirth || '2012-05-17';

      if (!firstName || !lastName) {
        return notify('Please enter First Name and Last Name.', 'danger');
      }

      const sName = `${firstName} ${lastName}`;
      const newId = `stu-${Date.now()}`;
      const autoStudentId = `NXL-MKS-STU-000${(students().length + 1).toString().padStart(3, '0')}`;
      const autoAdmissionNo = data.admissionNumber || `MKS-2026-${(420 + students().length + 1)}`;

      const newStudentObj = {
        id: newId,
        studentId: autoStudentId,
        admissionNumber: autoAdmissionNo,
        firstName,
        lastName,
        name: sName,
        grade,
        section,
        rollNumber,
        gender,
        bloodGroup: data.bloodGroup || 'O+',
        dob,
        parentName,
        parentMobile,
        phone: parentMobile,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@meezan.school.edu`,
        academicAverage: 88.5,
        attendanceRate: 96.0,
        status: 'Active',
        joinedOn: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      };

      // Push to students array
      students().unshift(newStudentObj);

      state.modal = null;
      state.page = 'students';
      render();
      notify(`🎉 SUCCESS! Student ${sName} (${autoStudentId}, Grade ${grade}${section}) enrolled successfully!`, 'success');
    } else if (form.id === 'teacher-form') {
      const teacher = { id: uid(), firstName: data.firstName.trim(), lastName: data.lastName.trim(), name: `${data.firstName.trim()} ${data.lastName.trim()}`, gender:data.gender, employeeId:data.employeeId, department:data.department, status:'Active', attendanceRate:100, assignments:[{grade:'8',section:'A',subject:data.subject,students:countStudentsFor('8','A')}], workload:{classes:1,subjects:1,students:countStudentsFor('8','A'),weeklyPeriods:6,lessonPlanCompletion:0,pendingReviews:0} };
      teachers().push(teacher); state.modal=null; state.page='teachers'; render(); notify(`${teacher.name} was added to the school team.`);
    } else if (form.id === 'assignment-form') {
      assignments().unshift({ id:uid(), title:data.title, subject:data.subject, grade:data.grade, section:data.section, dueDate:data.dueDate || '18 Aug 2026', instructions:data.instructions, status:'In Progress', completionRate:0 }); state.modal=null; state.page='assignments'; render(); notify('Assignment published to the selected class.');
    } else if (form.id === 'assessment-form') {
      assessments().unshift({ id:uid(), name:data.name, type:data.type, subject:data.subject, grade:data.grade, section:data.section, date:data.date || '18 Aug 2026', status:'Scheduled' }); state.modal=null; state.page='assessments'; render(); notify('Assessment created and scheduled.');
    } else if (form.id === 'task-form') {
      const assigned = teachers().find((teacher) => teacher.id === data.assignedTo); tasks().unshift({ id:uid(), title:data.title, assignedTo:data.assignedTo, assigneeName:fullName(assigned), dueDate:data.dueDate || '18 Aug 2026', priority:data.priority, description:data.description, status:'Not Started' }); state.modal=null; state.page='tasks'; render(); notify('Task created and assigned.');
    } else if (form.id === 'attendance-form') { 
      state.modal = null; 
      render(); 
      notify('✓ Class attendance saved & automated WhatsApp absentee alerts dispatched to parents!', 'success'); 
    }
    else if (form.id === 'mark-form') { state.modal=null; render(); notify('Mark saved to the active academic-year record.'); }
    else if (form.id === 'year-form') { const years = getArray(tenant(), 'academicYears'); years.push({id:uid(),name:data.name,startDate:data.startDate,endDate:data.endDate,status:'Planned'}); state.modal=null;state.page='academic-years';render();notify(`${data.name} was created without changing historical records.`); }
    else if (form.id === 'school-timing-form') {
      if (toMinutes(data.endTime) <= toMinutes(data.startTime)) return notify('End time must be after start time.', 'danger');
      const key = state.tenantId || 'default';
      state.schoolTimingByTenant[key] = {
        startTime: data.startTime,
        endTime: data.endTime,
        label: data.label || 'Regular School Day'
      };
      state.modal = null;
      render();
      notify('School timing countdown updated for this workspace.');
    }
    else if (form.id === 'edit-profile-form') {
      const personId = data.personId;
      const isStudent = data.personType === 'student';
      const isTeacher = data.personType === 'teacher';
      const person = (isStudent ? students() : teachers()).find((p) => p.id === personId) || (isStudent ? currentStudent() : isTeacher ? currentTeacher() : currentUser());

      if (person) {
        const first = (data.firstName || '').trim();
        const last = (data.lastName || '').trim();
        person.firstName = first;
        person.lastName = last;
        person.name = `${first} ${last}`.trim();
        if (data.dateOfBirth) { person.dateOfBirth = data.dateOfBirth; person.dob = data.dateOfBirth; }
        if (data.gender) person.gender = data.gender;
        if (data.bloodGroup) person.bloodGroup = data.bloodGroup;
        if (data.status) person.status = data.status;
        if (data.email) person.email = data.email.trim();
        if (data.mobile) { person.mobile = data.mobile.trim(); person.phone = data.mobile.trim(); }
        if (data.parentName) { person.parentName = data.parentName.trim(); person.guardianName = data.parentName.trim(); }
        if (data.parentMobile) { person.parentMobile = data.parentMobile.trim(); person.guardianPhone = data.parentMobile.trim(); }
        if (data.parentEmail) person.parentEmail = data.parentEmail.trim();
        if (data.emergencyContact) person.emergencyContact = data.emergencyContact.trim();
        if (data.address) person.address = data.address.trim();
        if (data.username) person.username = data.username.trim();
        if (!state.customAvatars) state.customAvatars = {};
        if (data.avatarUrl && data.avatarUrl.trim()) {
          person.avatar = data.avatarUrl.trim();
          person.photo = data.avatarUrl.trim();
          person.avatarUrl = data.avatarUrl.trim();
          state.customAvatars[person.id] = data.avatarUrl.trim();
        }

        if (isStudent) {
          if (data.studentId) person.studentId = data.studentId.trim();
          if (data.admissionNumber) { person.admissionNumber = data.admissionNumber.trim(); person.admissionNo = data.admissionNumber.trim(); }
          if (data.grade) { person.grade = data.grade; person.gradeLevel = Number(data.grade) || 8; }
          if (data.section) person.section = data.section;
          if (data.rollNumber) person.rollNumber = data.rollNumber.trim();
          if (data.academicYear) person.academicYear = data.academicYear.trim();
        }

        if (isTeacher) {
          if (data.employeeId) person.employeeId = data.employeeId.trim();
          if (data.department) person.department = data.department.trim();
          if (data.subject) person.subject = data.subject.trim();
          if (data.designation) person.designation = data.designation.trim();
          if (data.joinedOn) person.joinedOn = data.joinedOn;
        }

        if (state.authSession?.user?.id === person.id) {
          state.authSession.user.firstName = person.firstName;
          state.authSession.user.lastName = person.lastName;
          state.authSession.user.name = person.name;
          state.authSession.user.email = person.email;
          if (person.avatar) state.authSession.user.avatar = person.avatar;
        }

        state.modal = null;
        render();
        notify(`✓ Profile for ${person.name || person.firstName} updated successfully! All details and credentials saved.`, 'success');
      } else {
        notify('Unable to find profile record to update.', 'danger');
      }
    }
    else if (form.id === 'record-payment-form') {
      const studentId = data.studentId;
      const amount = Number(data.amount) || 0;
      const mode = data.mode || 'UPI';
      const reference = data.reference || `UPI-${Math.floor(10000000 + Math.random()*90000000)}`;
      const records = getTenantFeeRecords();
      const rec = records.find(r => r.id === studentId);

      if (rec && amount > 0) {
        rec.paidAmount += amount;
        rec.balanceDue = Math.max(0, rec.totalFee - rec.paidAmount);
        rec.status = rec.balanceDue === 0 ? 'Paid' : 'Partial';
        const newReceiptNo = `REC-2026-${Math.floor(1000 + Math.random()*9000)}`;
        rec.history.push({
          receiptNo: newReceiptNo,
          date: '17 Aug 2026',
          amount: amount,
          mode: mode,
          collectedBy: 'Accounts Counter'
        });
        state.selectedReceiptStudentId = studentId;
        state.modal = 'digital-receipt';
        render();
        notify(`🎉 Payment of ₹${amount.toLocaleString()} received successfully for ${rec.studentName}! Digital PDF receipt #${newReceiptNo} generated and dispatched.`, 'success');
      } else {
        notify('Please enter a valid payment amount.', 'danger');
      }
    }
    else if (form.id === 'aira-form') { state.lastAiraPrompt = data.airaPrompt; state.lastAiraAnswer = airaResponse(data.airaPrompt); render(); }
  }
  function inputHandler(event) {
    const input = event.target;
    if (input.id === 'edit-avatar-file-input') {
      const file = input.files && input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target.result;
          const previewImg = document.getElementById('edit-avatar-live-img');
          const urlInput = document.getElementById('edit-avatar-url-input');
          if (previewImg) previewImg.src = dataUrl;
          if (urlInput) urlInput.value = dataUrl;
        };
        reader.readAsDataURL(file);
      }
    }
    if (input.id === 'edit-avatar-url-input') {
      const previewImg = document.getElementById('edit-avatar-live-img');
      if (previewImg && input.value.trim()) {
        previewImg.src = input.value.trim();
      }
    }
    if (input.id === 'record-payment-student-picker') {
      state.selectedReceiptStudentId = input.value;
      render();
    }
    if (input.id === 'fee-search-input') {
      state.feeSearchQuery = input.value;
      render();
    }
    if (input.id === 'fee-student-picker') {
      state.selectedFeeStudentId = input.value;
      state.selectedReceiptStudentId = input.value;
      render();
    }
    if (input.id === 'leaderboard-class-picker') {
      state.leaderboardClassFilter = input.value;
      if (input.value !== 'ALL') {
        state.leaderboardGradeFilter = input.value.slice(0, -1);
      }
      render();
    }
    if (input.id === 'leaderboard-search-input') {
      state.leaderboardSearchQuery = input.value;
      render();
    }
    if (input.id === 'report-card-student-picker') {
      state.reportCardStudentId = input.value;
      render();
    }
    if (input.id === 'report-card-term-picker') {
      state.reportCardTerm = input.value;
      render();
    }
    if (input.id === 'id-card-person-picker') {
      state.selectedIDCardPersonId = input.value;
      render();
    }
    if (input.id === 'lib-search-input') {
      state.librarySearchQuery = input.value;
      render();
    }
    if (input.id === 'global-search') {
      state.query = input.value;
      const query = lower(input.value);
      if (query.length >= 3) {
        const foundStudent = students().find((student) => lower(fullName(student)).includes(query) || lower(student.studentId).includes(query));
        const foundTeacher = teachers().find((teacher) => lower(fullName(teacher)).includes(query) || lower(teacher.employeeId).includes(query));
        if (foundStudent || foundTeacher) { state.profile = foundStudent ? {type:'student',id:foundStudent.id} : {type:'teacher',id:foundTeacher.id}; state.profileTab='overview'; render(); }
      }
    }
    if (input.id === 'community-search-box') {
      state.communitySearchQuery = input.value;
      render();
    }
    if (input.dataset.filter) { state.filters[input.dataset.filter] = input.value; render(); }
  }
  document.addEventListener('click', actionHandler);
  document.addEventListener('submit', submitHandler);
  document.addEventListener('input', inputHandler);
  document.addEventListener('change', inputHandler);
  window.addEventListener('popstate', () => {
    state.view = isAboutPath(window.location.pathname)
      ? 'about'
      : isContactPath(window.location.pathname)
        ? 'contact'
        : isDemoPath(window.location.pathname)
          ? 'demo'
        : 'landing';
    state.mobileNav = false;
    state.modal = null;
    render();
  });
  window.setInterval(() => {
    if (state.view === 'app') render();
  }, 30000);
  render();
}());
