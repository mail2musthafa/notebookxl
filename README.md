# 🏫 NotebookXL — The Intelligent School Operating System & ERP Platform

**NotebookXL** is an enterprise-grade, multi-tenant School Management System & AI-Powered Educational Operating System designed for modern K–12 institutions, CBSE / ICSE / State Board schools, and multi-campus academy networks.

Built with high performance, isolated multi-tenancy, and real-time responsiveness, NotebookXL provides a unified digital ecosystem connecting **Management, Principals, Faculty Teachers, Students, and Parents**.

---

## 📑 Table of Contents

1. [Architectural Overview](#-architectural-overview)
2. [Complete Feature Catalogue (19+ Enterprise Modules)](#-complete-feature-catalogue-19-enterprise-modules)
   - [1. Executive Dashboard & Real-Time Pulse](#1-executive-dashboard--real-time-pulse)
   - [2. Student Information System (SIS) & Directory](#2-student-information-system-sis--directory)
   - [3. Faculty & Teacher Directory & Workload Engine](#3-faculty--teacher-directory--workload-engine)
   - [4. Single-Page A4 CBSE / State Board Report Card & Marksheet](#4-single-page-a4-cbse--state-board-report-card--marksheet)
   - [5. Gamified Academic Leaderboard & 3D Metallic Podiums](#5-gamified-academic-leaderboard--3d-metallic-podiums)
   - [6. Standard CR80 PVC ID Card Generator & Barcode Scanner](#6-standard-cr80-pvc-id-card-generator--barcode-scanner)
   - [7. Smart Biometric & Barcode Live Attendance Gateway](#7-smart-biometric--barcode-live-attendance-gateway)
   - [8. Fee Management, Invoicing & WhatsApp Reminders](#8-fee-management-invoicing--whatsapp-reminders)
   - [9. AI Exam Studio & Automated Question Paper Generator](#9-ai-exam-studio--automated-question-paper-generator)
   - [10. AI Study Coach & Student Exam Prep](#10-ai-study-coach--student-exam-prep)
   - [11. Daily Parent-Student Pocket Portal](#11-daily-parent-student-pocket-portal)
   - [12. Class & Faculty Timetable Master Scheduler](#12-class--faculty-timetable-master-scheduler)
   - [13. Erum AI — Intelligent Copilot & Morning Executive Briefing](#13-erum-ai--intelligent-copilot--morning-executive-briefing)
   - [14. Admissions Inquiries & CRM Lead Pipeline](#14-admissions-inquiries--crm-lead-pipeline)
   - [15. Multi-Audience Campus Announcements & Circulars](#15-multi-audience-campus-announcements--circulars)
   - [16. Discord-Style Institutional Audio & Voice Channels](#16-discord-style-institutional-audio--voice-channels)
   - [17. Public Landing Page & Feature Showcase](#17-public-landing-page--feature-showcase)
   - [18. Interactive Demo Booking & Scheduling Hub](#18-interactive-demo-booking--scheduling-hub)
   - [19. Multi-Tenant School Workspace Switcher](#19-multi-tenant-school-workspace-switcher)
3. [Technology Stack](#-technology-stack)
4. [Project File & Directory Structure](#-project-file--directory-structure)
5. [Installation & Local Setup Guide](#-installation--local-setup-guide)
6. [API Endpoints Reference (FastAPI Backend)](#-api-endpoints-reference-fastapi-backend)
7. [Database Schema & Architecture](#-database-schema--architecture)
8. [Print & PDF Document Precision Specs](#-print--pdf-document-precision-specs)

---

## 🏛️ Architectural Overview

```
                        ┌──────────────────────────────────────────────┐
                        │             NotebookXL Web Shell             │
                        │ (Modular ES6+ · Vanilla CSS · Zero Bloat)    │
                        └──────────────────────┬───────────────────────┘
                                               │
               ┌───────────────────────────────┼───────────────────────────────┐
               ▼                               ▼                               ▼
  ┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
  │   Public Marketing &    │     │   App Workspace Engine  │     │   Erum AI Copilot       │
  │   Admissions Web Pages  │     │  (19 Core ERP Modules)  │     │  (Briefings, Exam Gen)  │
  │  Landing, Demo, About   │     │  SIS, Fees, Attendance  │     │  Study Coach, Guidance  │
  └─────────────────────────┘     └────────────┬────────────┘     └─────────────────────────┘
                                               │
                                  ┌────────────┴────────────┐
                                  ▼                         ▼
                     ┌─────────────────────────┐ ┌─────────────────────────┐
                     │   FastAPI Microservice  │ │   PostgreSQL Database   │
                     │  RBAC · Auth · REST API │ │ Multi-Tenant Schema RLS │
                     └─────────────────────────┘ └─────────────────────────┘
```

- **Strict Multi-Tenancy**: Complete logical and physical database isolation per school tenant (`tenant_id`, separate student registers, teacher assignments, and academic years).
- **Zero-Dependency Fast Frontend**: High-performance Vanilla JavaScript (ES Modules) and rich Glassmorphic Design System (`styles-modern.css`) delivering instantaneous sub-10ms UI renders.
- **Micro-Modular Architecture**: All 19+ views and components extracted into independent, decoupled JavaScript modules in `src/modules/` and `src/features/`.
- **Hybrid Storage & Offline Resilience**: In-memory state synchronized with `localStorage` and backend FastAPI REST endpoints.

---

## 🚀 Complete Feature Catalogue (19+ Enterprise Modules)

### 1. Executive Dashboard & Real-Time Pulse
- **KPI Metrics Ribbon**: Live student count, faculty headcount, campus collection efficiency (%), student attendance rate, and pending tasks.
- **Dynamic Academic Countdown**: Real-time timer counting down to school assembly, mid-day recess, or final bell.
- **Interactive School Calendar**: Full academic schedule displaying examinations, sports meets, parent-teacher conferences, and national holidays.
- **Role-Aware Views**: Dedicated dashboards for **School Management** (Executive analytics), **Teachers** (Today's classes & attendance), and **Students** (Homework & streak tracker).

### 2. Student Information System (SIS) & Directory
- **Comprehensive Student Records**: Full student profiles with admission numbers, roll numbers, date of birth, blood group, parent/guardian contact, and class/section allocations.
- **Direct WhatsApp Messaging**: Instant 1-click WhatsApp messaging button to notify parents about attendance or academic updates.
- **Enroll Student Modal**: Full multi-step admission form to enroll new students into classes LKG to 10 with automatic ID generation.
- **Real-Time Search & Filtering**: Instant filter by Grade, Section (A, B, C), Gender, or search by name / admission ID.

### 3. Faculty & Teacher Directory & Workload Engine
- **Teacher Profiles**: Designation (PGT, TGT, PRT), Department (STEM, Languages, Arts, Sports), teaching specialties, qualification, and joining date.
- **Weekly Workload Analytics**: Live calculation of weekly teaching periods, assigned classes, subject allocations, and lesson plan completion rate (%).
- **Substitution Suggestion Engine**: Automatic AI-assisted recommendation of available teachers during faculty leave.

### 4. Single-Page A4 CBSE / State Board Report Card & Marksheet
- **Strict 1-Page A4 Precision**: Formatted with `@page { size: A4 portrait; margin: 6mm 8mm; }` to guarantee complete marksheet fits on exactly **1 single A4 sheet** with zero page spill.
- **Part 1: Scholastic Evaluation Table**: Full 6-subject breakdown (*Mathematics, Science, English, Social Science, 2nd Language, Computer Science & AI*) with Periodic Assessment (20), Portfolio (10), Subject Enrichment (10), Term Exam (60), Total Score (100), Letter Grade (*A1, A2, B1*), and subject teacher remarks.
- **Part 2 & Part 3 (Horizontal Side-by-Side Grid)**:
  - **Part 2 (Co-Scholastic)**: Work Education, Art Education, Health & Physical Education, Discipline (3-Point Scale).
  - **Part 3 (Health & Metrics)**: Height (148 cm), Weight (42 kg), Blood Group, Vision (6/6), Dental Hygiene, and BMI Status (Healthy).
- **Remarks & Triple Signatures**: Class Teacher remarks, Promotion verdict (*🌟 Promoted with Distinction*), Class Teacher Signature, Parent Signature, and Official Institutional Hologram Seal.
- **Export Formats**: Instant 🖨️ **Print / Save as PDF** and 💬 **Send WhatsApp Report Card to Parent**.

### 5. Gamified Academic Leaderboard & 3D Metallic Podiums
- **3D Metallic Podiums**: Elevated 3D Gold (`pedestal-gold`), Silver (`pedestal-silver`), and Bronze (`pedestal-bronze`) pedestals displaying top rankers with crowns, medals, and avatars.
- **Pinned Student Merit Card**: Highlights active student's current rank, percentile, GPA, and points required to overtake next rank.
- **Class Merit Breakdown Table**: Full class ranking table with metallic badges (`rank-pill-gold`, `rank-pill-silver`, `rank-pill-bronze`), attendance %, and subject marks breakdown.
- **Live Class Switcher**: Toggle between `Grade 8A`, `Grade 8B`, `Grade 9A`, `Grade 10A`, etc. with instant dynamic recalculation.

### 6. Standard CR80 PVC ID Card Generator & Barcode Scanner
- **Fixed CR80 Physical Dimensions**: Calibrated strictly to international CR80 PVC dimensions (`54mm × 85.6mm` / `2.125in × 3.375in` with `3.18mm` corner radius).
- **Official Administrative Styling**: Crisp portrait frame (`96px × 108px`) with `2.5px solid #1e3a8a` border, eliminating non-standard gamification halos for official ID issuance.
- **High-Density Code-128 Barcode**: Embedded scannable vector barcode (`STU-ROLL-17-NXL-IAMS-000421`) readable by standard optical barcode guns and biometric turnstiles.
- **Multi-Role Badges**: Generates badges for **Students**, **Faculty Teachers**, and **Executive Admin Management**.

### 7. Smart Biometric & Barcode Live Attendance Gateway
- **Live Optical Barcode Scanner**: USB / Bluetooth barcode gun and webcam scanning interface with live audio beep confirmation.
- **Real-Time Attendance Audit Log**: Displays timestamped entry logs with roll numbers, class, status (*On-Time, Late, Excused*), and verification badges.
- **Class-Wise Batch Attendance Modal**: Interactive daily attendance register to mark Present, Absent, Late, or Excused with automatic WhatsApp parent dispatch.

### 8. Fee Management, Invoicing & WhatsApp Reminders
- **Fee Collection Tracker**: Summary cards for Total Invoiced, Amount Collected, Outstanding Dues, and Overdue Accounts.
- **Student Ledger & Receipts**: Itemized fee breakdown (Tuition, Computer Lab, Transportation, Library, Examination Fee) with downloadable PDF receipt generator.
- **Instant WhatsApp Dues Reminder**: Pre-formatted WhatsApp button with parent name, student name, balance amount, and due date.

### 9. AI Exam Studio & Automated Question Paper Generator
- **Multi-Format Question Generator**: Instant generation of CBSE/Board compliant question papers with Multiple Choice (MCQs), Short Answer (2 marks), Long Analytical (5 marks), and Case-Based questions.
- **Bloom's Taxonomy Alignment**: Questions calibrated across Knowledge, Understanding, Application, and Analytical thinking.
- **Marking Scheme & Answer Key**: Complete solutions guide and grading rubrics generated alongside question papers.

### 10. AI Study Coach & Student Exam Prep
- **Personalized AI Coach**: Adaptive practice quizzes with instant step-by-step mathematical derivations and scientific explanations.
- **Concept Flashcards**: Interactive digital flashcards for quick revision before terminal examinations.
- **Weak-Area Diagnostic**: Highlights specific subject topics requiring reinforcement based on past test scores.

### 11. Daily Parent-Student Pocket Portal
- **Daily Pocket Summary**: Quick mobile card showing active homework, canteen card balance, library book return dates, and tomorrow's timetable.
- **AI PTM Progress Summary**: Executive 1-paragraph academic briefing generated for parents ahead of Parent-Teacher Meetings.
- **Direct Teacher Chat / Voice Channels**: Instant messaging connection between guardians and class educators.

### 12. Class & Faculty Timetable Master Scheduler
- **Interactive Weekly Grid**: Complete Monday–Friday period scheduler (7 periods per day) with room allocations (Block A-101, Science Lab, Computer Lab).
- **Dual Perspective**: Toggle between **Class Schedule** (Grade 8A timetable) and **Teacher Schedule** (Individual faculty teaching periods).
- **Conflict Avoidance**: Automatically detects overlapping periods or double-booked classrooms.

### 13. Erum AI — Intelligent Copilot & Morning Executive Briefing
- **Robot AI Copilot**: Accessible via floating button (FAB), sidebar quick launcher (`🤖 Erum AI`), and full assistant overlay.
- **Executive Morning Briefing**: Daily dynamic briefing summarizing fee collections, absent staff, scheduled events, and academic reminders.
- **Natural Language Assistant**: Answers queries on school policy, timetable lookups, marksheet rules, and pedagogical tips.

### 14. Admissions Inquiries & CRM Lead Pipeline
- **Prospective Student Lead Board**: Tracks new admission inquiries, scheduled school campus tours, demo bookings, and enrolled conversions.
- **Board & Strength Filters**: Filter leads across CBSE, ICSE, Cambridge/IB, and State Board requests.
- **Action Triggers**: Direct Call, WhatsApp inquiry response, and status update workflow (*NEW_LEAD ➔ CONTACTED ➔ DEMO_SCHEDULED ➔ ENROLLED*).

### 15. Multi-Audience Campus Announcements & Circulars
- **Audience Segmentation**: Publish announcements targeted to **All Campus**, **Teachers Only**, or **Students Only**.
- **Categorization**: Events, Examination circulars, Holiday notices, Sports triumphs, and Academic awards.
- **Rich Media & Post Creation**: Management and teachers can publish rich circulars with banner media attachments.

### 16. Discord-Style Institutional Audio & Voice Channels
- **Real-Time Voice Channels**: Audio collaboration channels for **Management Boardroom**, **Faculty Staff Room**, **Parent-Teacher Discussion**, and **Student Study Group**.
- **Interactive Controls**: Mute/Unmute microphone, Deafen audio, Screen Share toggle, and participant speaking indicators.

### 17. Public Landing Page & Feature Showcase
- **Modern Hero Section**: High-converting headline, live KPI counters, product demo preview, and instant CTA buttons.
- **Feature Pillars**: Showcase of SIS, Biometric Attendance, AI Exam Studio, CBSE Marksheets, and WhatsApp Automation.
- **Interactive Testimonials & FAQ**: Parent, Teacher, and Principal endorsements with interactive FAQ accordion.

### 18. Interactive Demo Booking & Scheduling Hub
- **Self-Service Demo Booking**: Interactive calendar picker, time slot selection (Morning, Afternoon, Evening), school size selector, and curriculum choice.
- **Instant Confirmation**: Instant lead creation and WhatsApp booking confirmation.

### 19. Multi-Tenant School Workspace Switcher
- **Instant Institutional Switcher**: Modal interface to switch between different school databases with 1 click:
  - **`IAMS (ISRAR AHMED MISSION SCHOOL)`** — Indiranagar, Rajendranagar, Hyderabad - 500052, Telangana
  - **`Iqra International School`** — Madinaguda, Hyderabad, Telangana
- **Complete Isolation**: Instant switching of student rosters, teachers, fee ledgers, report cards, and timetables without data leakage.

---

## 💻 Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend Core** | ES6+ JavaScript (Native ES Modules), HTML5 Semantic Shell |
| **Styling & Design** | Pure Vanilla CSS, Modern Glassmorphism, CSS Custom Properties, Clean Typography |
| **Document & Print Engine** | CSS Paged Media (`@page`), Single-Page A4 Precision, Standard CR80 PVC Specs |
| **Backend API** | FastAPI (Python 3.11+), Pydantic v2 schemas, Starlette Middleware |
| **Authentication & RBAC** | JWT (JSON Web Tokens), Role-Based Access Control (`SCHOOL_ADMIN`, `TEACHER`, `STUDENT`) |
| **Database & Schema** | PostgreSQL 15+ / SQLite / MySQL compliant multi-tenant relational schema (`schema.sql`) |
| **Containerization** | Docker, Docker Compose |

---

## 📁 Project File & Directory Structure

```
notebookxl/
├── index.html                      # Main Platform Entry & Single Page Application Shell
├── demo.html                       # Public Interactive Demo Booking Portal
├── about.html                      # Public Institutional Story & Platform Overview
├── contact.html                    # Public Admissions & Support Contact Form
├── app.js                          # Core Application Controller & State Management (7000+ lines)
├── seed-data.js                    # Multi-Tenant Seed Generator (IAMS Hyderabad & Iqra)
├── styles.css                      # Base Layout & Component CSS Tokens
├── styles-modern.css               # Modern Glassmorphic Theme, A4 Print, & CR80 ID Card Rules
├── server.js                       # Lightweight Node.js Dev & Production Static Server
├── package.json                    # Project configuration & npm run dev scripts
├── schema.sql                      # Complete PostgreSQL / MySQL Multi-Tenant Schema
├── schema_attendance_addon.sql     # Biometric & Barcode Live Attendance SQL Tables
├── docker-compose.yml              # Multi-container orchestration (Backend + Postgres + Redis)
├── notebookxl-school-suite.zip     # Complete bundled zip distribution archive
│
├── src/                            # Modular Frontend Features & Components
│   ├── main.js                     # ES Module Main Entry
│   ├── features/                   # Public Web Pages & Feature Views
│   │   ├── landing/                # Public Landing Page Component
│   │   ├── auth/                   # Sign-in, Sign-up, & Role Picker Modals
│   │   ├── demo/                   # Demo Booking Interactive Wizard
│   │   ├── about/                  # About Platform & System Story
│   │   ├── contact/                # Contact & Lead Submission
│   │   └── shared/                 # Shared Dashboard Widgets & Components
│   │
│   └── modules/                    # Workspace ERP Feature Modules
│       ├── dashboard/              # Executive & Role Dashboard
│       ├── reports/                # Single-Page A4 CBSE Marksheet Generator
│       ├── leaderboard/            # 3D Metallic Podiums & Academic Merit Tracker
│       ├── attendance/             # Barcode Scanner & Biometric Attendance Gateway
│       ├── fees/                   # Fee Ledger, Invoices, & WhatsApp Reminders
│       ├── students/               # Student Directory & Enrollment Modal
│       └── timetable/              # Master Weekly Timetable Grid
│
├── backend/                        # FastAPI Backend Microservice
│   ├── Dockerfile                  # Production Container Specification
│   ├── requirements.txt            # Python Dependencies (FastAPI, Uvicorn, Pydantic)
│   ├── data/auth-db.json           # Local Auth Database Store
│   └── app/
│       ├── main.py                 # FastAPI Application Factory & CORS Config
│       ├── core/config.py          # Environment Variables & Security Settings
│       ├── api/                    # API Route Handlers
│       │   ├── router.py           # Master API Router v1
│       │   └── v1/                 # Endpoints: auth, dashboards, attendance, tenants
│       ├── models/schemas.py       # Pydantic Schemas & DTOs
│       ├── services/               # Business Logic Services
│       └── repositories/           # Database Access Layer
│
└── assets/                         # Graphic Assets, SVG Icons, & Architecture Diagrams
    └── about/images/               # School platform illustrations & dashboard previews
```

---

## 🛠️ Installation & Local Setup Guide

### Option 1: Quick Frontend Launch (Zero Dependencies)

```bash
# 1. Clone or navigate to the project directory
cd notebookxl

# 2. Run local static dev server
npx -y serve . -p 4173
```
👉 Open your browser at: **`http://localhost:4173`**

---

### Option 2: Full-Stack Launch with FastAPI Backend

#### Step 1: Start Backend API
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
👉 Interactive API Documentation: **`http://localhost:8000/docs`**

#### Step 2: Start Frontend
```bash
# In the root notebookxl folder
node server.js
```
👉 Open: **`http://localhost:3000`** or **`http://localhost:4173`**

---

### Option 3: Docker Compose (Production Stack)

```bash
docker compose up --build -d
```

---

## 🔑 Demo Access Credentials

| Role | Workspace | Email / Username | Password |
|---|---|---|---|
| **School Management / Admin** | `iams` / `meezankids` | `management@meezankids.com` | `Meezan@123` |
| **Faculty Teacher** | `iams` / `meezankids` | `teacher@meezankids.com` | `Meezan@123` |
| **Student** | `iams` / `meezankids` | `student@meezankids.com` | `Meezan@123` |

---

## 📡 API Endpoints Reference (FastAPI Backend)

| Method | Endpoint | Description | Role / Auth |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Authenticate user & issue JWT bearer token | Public |
| `POST` | `/api/v1/auth/signup` | Register new institutional tenant / user | Public |
| `GET` | `/api/v1/tenants` | List all available school workspaces | Public |
| `GET` | `/api/v1/dashboards/management` | Fetch real-time executive KPI metrics | `SCHOOL_ADMIN` |
| `GET` | `/api/v1/dashboards/teacher` | Fetch teacher classes & schedule | `TEACHER` |
| `GET` | `/api/v1/dashboards/student` | Fetch student homework, marks & streak | `STUDENT` |
| `GET` | `/api/v1/attendance/summary` | Fetch campus-wide attendance stats | Authenticated |
| `POST` | `/api/v1/attendance/record` | Record single barcode/biometric scan | Authenticated |
| `GET` | `/api/v1/community/posts` | Fetch tenant campus feed announcements | Authenticated |
| `POST` | `/api/v1/community/posts` | Publish new circular announcement | `SCHOOL_ADMIN`, `TEACHER` |

---

## 🖨️ Print & PDF Document Precision Specs

### 1. CBSE / State Board Marksheet (`src/modules/reports/index.js`)
- **Target Page**: Exactly 1 Single Page A4 (`210mm × 297mm`)
- **Print Rules**:
  ```css
  @page {
    size: A4 portrait;
    margin: 6mm 8mm;
  }
  .single-a4-page-frame {
    width: 100% !important;
    max-width: 190mm !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
  ```

### 2. Standard CR80 PVC ID Cards (`renderIDCardHTML`)
- **Target Card**: International CR80 PVC Standard (`54.0mm × 85.6mm` / `2.125in × 3.375in`)
- **Corner Radius**: `3.18mm` (1/8 inch)
- **Print Rules**:
  ```css
  @page {
    size: 54mm 85.6mm;
    margin: 0;
  }
  .school-id-card-frame {
    width: 54mm !important;
    height: 85.6mm !important;
    overflow: hidden !important;
    page-break-inside: avoid !important;
  }
  ```

---

## 📄 License & Intellectual Property

© 2026 **NotebookXL Technologies Inc.** All rights reserved.  
Designed and engineered for Indian K–12 schools, CBSE Affiliated Institutions, and Multi-Campus Educational Trusts.