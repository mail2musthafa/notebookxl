-- NotebookXL initial PostgreSQL schema
-- Target: PostgreSQL 15+.
--
-- Runtime contract:
--   Every request must execute in a transaction and set, after authentication:
--     SET LOCAL app.tenant_id = '<verified tenant UUID>';
--     SET LOCAL app.user_id   = '<verified user UUID>';
--   The application role must be NOBYPASSRLS and must not own these tables.
--   A separate migration/provisioning role is used for cross-tenant operations.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;
CREATE SCHEMA IF NOT EXISTS app;

CREATE TYPE tenant_status AS ENUM ('trial', 'active', 'suspended', 'closed');
CREATE TYPE user_status AS ENUM ('invited', 'active', 'suspended', 'archived');
CREATE TYPE gender AS ENUM ('female', 'male', 'non_binary', 'prefer_not_to_say', 'not_specified');
CREATE TYPE academic_year_status AS ENUM ('draft', 'active', 'closed', 'archived');
CREATE TYPE subject_status AS ENUM ('active', 'disabled');
CREATE TYPE enrollment_status AS ENUM ('active', 'promoted', 'transferred', 'withdrawn', 'completed');
CREATE TYPE staff_status AS ENUM ('active', 'on_leave', 'inactive', 'separated');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
CREATE TYPE teacher_attendance_status AS ENUM ('present', 'absent', 'late', 'leave', 'half_day');
CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
CREATE TYPE assignment_status AS ENUM ('draft', 'published', 'closed', 'archived');
CREATE TYPE submission_status AS ENUM ('not_started', 'draft', 'submitted', 'late', 'returned', 'graded');
CREATE TYPE lesson_plan_status AS ENUM ('draft', 'submitted', 'approved', 'returned', 'archived');
CREATE TYPE assessment_status AS ENUM ('draft', 'scheduled', 'in_progress', 'published', 'archived');
CREATE TYPE mark_status AS ENUM ('draft', 'entered', 'moderated', 'published');
CREATE TYPE task_status AS ENUM ('not_started', 'in_progress', 'completed', 'overdue');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE notification_kind AS ENUM ('info', 'success', 'warning', 'alert', 'task', 'assignment', 'assessment');
CREATE TYPE audit_action AS ENUM ('created', 'updated', 'deleted', 'published', 'approved', 'mark_changed', 'attendance_changed', 'role_changed', 'permission_changed', 'login', 'logout');
CREATE TYPE ai_message_role AS ENUM ('user', 'assistant', 'system', 'tool');
CREATE TYPE subscription_status AS ENUM ('trial', 'active', 'past_due', 'cancelled', 'expired');

CREATE OR REPLACE FUNCTION app.current_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.tenant_id', true), '')::uuid;
$$;

CREATE OR REPLACE FUNCTION app.current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.user_id', true), '')::uuid;
$$;

CREATE OR REPLACE FUNCTION app.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- Tenant, school, and subscription boundary
-- ---------------------------------------------------------------------------

CREATE TABLE tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug citext NOT NULL UNIQUE,
  subdomain citext NOT NULL UNIQUE,
  display_name text NOT NULL,
  status tenant_status NOT NULL DEFAULT 'trial',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (slug ~ '^[a-z0-9][a-z0-9-]{1,62}$'),
  CHECK (subdomain ~ '^[a-z0-9][a-z0-9-]{1,62}$')
);

CREATE TABLE schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE RESTRICT,
  school_code text NOT NULL UNIQUE,
  legal_name text NOT NULL,
  display_name text NOT NULL,
  board_name text,
  address_line_1 text,
  address_line_2 text,
  city text NOT NULL,
  state text NOT NULL,
  country_code char(2) NOT NULL DEFAULT 'IN',
  postal_code text,
  timezone text NOT NULL DEFAULT 'Asia/Kolkata',
  phone text,
  email citext,
  website text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, id),
  CHECK (school_code ~ '^[A-Z0-9]{2,12}$')
);

CREATE TABLE school_settings (
  school_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  allow_teacher_subject_proposals boolean NOT NULL DEFAULT false,
  allow_student_self_service boolean NOT NULL DEFAULT true,
  attendance_cutoff_time time,
  academic_settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, school_id) REFERENCES schools(tenant_id, id) ON DELETE CASCADE,
  CHECK (jsonb_typeof(academic_settings) = 'object')
);

CREATE TABLE school_branding (
  school_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  logo_storage_key text,
  primary_color text,
  accent_color text,
  favicon_storage_key text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, school_id) REFERENCES schools(tenant_id, id) ON DELETE CASCADE
);

CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  provider_customer_id text,
  provider_subscription_id text,
  plan_code text NOT NULL,
  status subscription_status NOT NULL DEFAULT 'trial',
  seats_included integer NOT NULL DEFAULT 0 CHECK (seats_included >= 0),
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  cancelled_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  FOREIGN KEY (tenant_id, school_id) REFERENCES schools(tenant_id, id) ON DELETE RESTRICT,
  CHECK (ends_at IS NULL OR ends_at > starts_at),
  CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE UNIQUE INDEX subscriptions_one_current_per_school
  ON subscriptions (tenant_id, school_id)
  WHERE status IN ('trial', 'active', 'past_due');

-- ---------------------------------------------------------------------------
-- Authentication and application-level RBAC
-- ---------------------------------------------------------------------------

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email citext UNIQUE,
  username citext UNIQUE,
  password_hash text NOT NULL,
  status user_status NOT NULL DEFAULT 'invited',
  last_login_at timestamptz,
  password_changed_at timestamptz,
  mfa_enabled boolean NOT NULL DEFAULT false,
  mfa_secret_encrypted bytea,
  failed_login_count integer NOT NULL DEFAULT 0 CHECK (failed_login_count >= 0),
  locked_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (email IS NOT NULL OR username IS NOT NULL)
);

CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  is_system_role boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (code ~ '^[A-Z][A-Z0-9_]{2,63}$')
);

CREATE TABLE permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  resource text NOT NULL,
  action text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (code ~ '^[a-z][a-z0-9_.]{2,127}$')
);

CREATE TABLE role_permissions (
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid,
  school_id uuid,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  assigned_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, school_id) REFERENCES schools(tenant_id, id) ON DELETE CASCADE,
  CHECK ((tenant_id IS NULL AND school_id IS NULL) OR (tenant_id IS NOT NULL AND school_id IS NOT NULL)),
  CHECK (expires_at IS NULL OR expires_at > assigned_at)
);

CREATE UNIQUE INDEX user_roles_tenant_assignment_unique
  ON user_roles (tenant_id, school_id, user_id, role_id)
  WHERE tenant_id IS NOT NULL;

CREATE UNIQUE INDEX user_roles_platform_assignment_unique
  ON user_roles (user_id, role_id)
  WHERE tenant_id IS NULL;

INSERT INTO roles (code, name, description) VALUES
  ('SUPER_ADMIN', 'Super Admin', 'Platform-wide NotebookXL administrator'),
  ('SCHOOL_ADMIN', 'School Admin', 'School management administrator'),
  ('PRINCIPAL', 'Principal', 'School leader with broad academic oversight'),
  ('ACADEMIC_COORDINATOR', 'Academic Coordinator', 'Academic operations coordinator'),
  ('TEACHER', 'Teacher', 'Teaching staff member'),
  ('STUDENT', 'Student', 'Student self-service user')
ON CONFLICT (code) DO NOTHING;

INSERT INTO permissions (code, resource, action, description) VALUES
  ('tenants.manage', 'tenants', 'manage', 'Provision and manage tenants'),
  ('school.manage', 'school', 'manage', 'Manage school settings and structure'),
  ('people.manage', 'people', 'manage', 'Manage students, teachers, and staff'),
  ('students.read.all', 'students', 'read_all', 'Read all student records in a school'),
  ('students.read.assigned', 'students', 'read_assigned', 'Read students in assigned teaching scopes'),
  ('students.manage', 'students', 'manage', 'Create and update student records'),
  ('academics.manage', 'academics', 'manage', 'Manage academic years, subjects, and sections'),
  ('timetables.manage', 'timetables', 'manage', 'Create and manage timetables'),
  ('attendance.manage', 'attendance', 'manage', 'Manage all attendance'),
  ('attendance.manage.assigned', 'attendance', 'manage_assigned', 'Mark attendance for assigned classes'),
  ('assignments.manage', 'assignments', 'manage', 'Manage all assignments'),
  ('assignments.manage.assigned', 'assignments', 'manage_assigned', 'Manage assignments for teaching assignments'),
  ('assessments.manage', 'assessments', 'manage', 'Manage assessments and marks'),
  ('tasks.manage', 'tasks', 'manage', 'Create and assign school tasks'),
  ('reports.read', 'reports', 'read', 'Read school reports'),
  ('audit.read', 'audit_logs', 'read', 'Read audit logs'),
  ('users_roles.manage', 'users_roles', 'manage', 'Manage user access and role assignments'),
  ('student.self.read', 'student', 'self_read', 'Read own student record'),
  ('student.self.submit', 'assignment_submissions', 'self_submit', 'Submit own work'),
  ('ai.use', 'aira', 'use', 'Use Aira within role data boundaries')
ON CONFLICT (code) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'SUPER_ADMIN'
   OR (r.code = 'SCHOOL_ADMIN' AND p.code <> 'tenants.manage')
   OR (r.code = 'PRINCIPAL' AND p.code IN ('students.read.all', 'academics.manage', 'reports.read', 'attendance.manage', 'assignments.manage', 'assessments.manage', 'tasks.manage', 'ai.use'))
   OR (r.code = 'ACADEMIC_COORDINATOR' AND p.code IN ('students.read.all', 'academics.manage', 'timetables.manage', 'attendance.manage', 'assignments.manage', 'assessments.manage', 'reports.read', 'tasks.manage', 'ai.use'))
   OR (r.code = 'TEACHER' AND p.code IN ('students.read.assigned', 'attendance.manage.assigned', 'assignments.manage.assigned', 'student.self.read', 'ai.use'))
   OR (r.code = 'STUDENT' AND p.code IN ('student.self.read', 'student.self.submit', 'ai.use'))
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Academic catalogue. Grades are school-owned; sections are year-specific so
-- Grade 8A in 2026-27 remains immutable when the next year is created.
-- ---------------------------------------------------------------------------

CREATE TABLE academic_years (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  code text NOT NULL,
  name text NOT NULL,
  starts_on date NOT NULL,
  ends_on date NOT NULL,
  status academic_year_status NOT NULL DEFAULT 'draft',
  is_current boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  UNIQUE (tenant_id, school_id, code),
  FOREIGN KEY (tenant_id, school_id) REFERENCES schools(tenant_id, id) ON DELETE CASCADE,
  CHECK (ends_on > starts_on)
);

CREATE UNIQUE INDEX academic_years_one_current_per_school
  ON academic_years (tenant_id, school_id)
  WHERE is_current;

CREATE TABLE grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  code text NOT NULL,
  name text NOT NULL,
  sort_order smallint NOT NULL CHECK (sort_order >= 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  UNIQUE (tenant_id, school_id, code),
  UNIQUE (tenant_id, school_id, sort_order),
  FOREIGN KEY (tenant_id, school_id) REFERENCES schools(tenant_id, id) ON DELETE CASCADE
);

CREATE TABLE sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  academic_year_id uuid NOT NULL,
  grade_id uuid NOT NULL,
  code text NOT NULL,
  name text NOT NULL,
  capacity smallint CHECK (capacity IS NULL OR capacity > 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  UNIQUE (tenant_id, school_id, academic_year_id, id),
  UNIQUE (tenant_id, school_id, academic_year_id, grade_id, id),
  UNIQUE (tenant_id, school_id, academic_year_id, grade_id, code),
  FOREIGN KEY (tenant_id, school_id, academic_year_id) REFERENCES academic_years(tenant_id, school_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (tenant_id, school_id, grade_id) REFERENCES grades(tenant_id, school_id, id) ON DELETE RESTRICT
);

CREATE INDEX sections_school_year_grade_idx
  ON sections (tenant_id, school_id, academic_year_id, grade_id)
  WHERE is_active;

CREATE TABLE departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  code text NOT NULL,
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  UNIQUE (tenant_id, school_id, code),
  FOREIGN KEY (tenant_id, school_id) REFERENCES schools(tenant_id, id) ON DELETE CASCADE
);

CREATE TABLE subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  department_id uuid,
  code text NOT NULL,
  name text NOT NULL,
  description text,
  status subject_status NOT NULL DEFAULT 'active',
  is_elective boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  UNIQUE (tenant_id, school_id, code),
  FOREIGN KEY (tenant_id, school_id) REFERENCES schools(tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, school_id, department_id) REFERENCES departments(tenant_id, school_id, id) ON DELETE SET NULL
);

CREATE INDEX subjects_enabled_idx
  ON subjects (tenant_id, school_id, name)
  WHERE status = 'active';

CREATE TABLE grade_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  academic_year_id uuid NOT NULL,
  grade_id uuid NOT NULL,
  subject_id uuid NOT NULL,
  weekly_period_target smallint CHECK (weekly_period_target IS NULL OR weekly_period_target >= 0),
  is_required boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  UNIQUE (tenant_id, school_id, academic_year_id, grade_id, id),
  UNIQUE (tenant_id, school_id, academic_year_id, grade_id, subject_id),
  FOREIGN KEY (tenant_id, school_id, academic_year_id) REFERENCES academic_years(tenant_id, school_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (tenant_id, school_id, grade_id) REFERENCES grades(tenant_id, school_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (tenant_id, school_id, subject_id) REFERENCES subjects(tenant_id, school_id, id) ON DELETE RESTRICT
);

CREATE TABLE section_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  academic_year_id uuid NOT NULL,
  grade_id uuid NOT NULL,
  section_id uuid NOT NULL,
  grade_subject_id uuid NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  UNIQUE (tenant_id, school_id, academic_year_id, id),
  UNIQUE (tenant_id, school_id, academic_year_id, section_id, grade_subject_id),
  FOREIGN KEY (tenant_id, school_id, academic_year_id, grade_id, section_id)
    REFERENCES sections(tenant_id, school_id, academic_year_id, grade_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (tenant_id, school_id, academic_year_id, grade_id, grade_subject_id)
    REFERENCES grade_subjects(tenant_id, school_id, academic_year_id, grade_id, id) ON DELETE RESTRICT
);

CREATE INDEX section_subjects_class_idx
  ON section_subjects (tenant_id, school_id, academic_year_id, section_id)
  WHERE is_active;

CREATE TABLE rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  code text NOT NULL,
  name text NOT NULL,
  capacity smallint CHECK (capacity IS NULL OR capacity > 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  UNIQUE (tenant_id, school_id, code),
  FOREIGN KEY (tenant_id, school_id) REFERENCES schools(tenant_id, id) ON DELETE CASCADE
);

CREATE TABLE period_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  academic_year_id uuid NOT NULL,
  label text NOT NULL,
  ordinal smallint NOT NULL CHECK (ordinal > 0),
  starts_at time NOT NULL,
  ends_at time NOT NULL,
  is_break boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  UNIQUE (tenant_id, school_id, academic_year_id, id),
  UNIQUE (tenant_id, school_id, academic_year_id, ordinal),
  FOREIGN KEY (tenant_id, school_id, academic_year_id) REFERENCES academic_years(tenant_id, school_id, id) ON DELETE RESTRICT,
  CHECK (ends_at > starts_at)
);

-- ---------------------------------------------------------------------------
-- People, teaching scopes, enrollment, and timetable
-- ---------------------------------------------------------------------------

CREATE TABLE staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  department_id uuid,
  employee_id text NOT NULL,
  first_name text NOT NULL,
  last_name text,
  preferred_name text,
  gender gender NOT NULL DEFAULT 'not_specified',
  date_of_birth date,
  phone text,
  work_email citext,
  employment_type text,
  designation text,
  joined_on date,
  separated_on date,
  status staff_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  UNIQUE (tenant_id, school_id, employee_id),
  FOREIGN KEY (tenant_id, school_id) REFERENCES schools(tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, school_id, department_id) REFERENCES departments(tenant_id, school_id, id) ON DELETE SET NULL,
  CHECK (separated_on IS NULL OR joined_on IS NULL OR separated_on >= joined_on)
);

CREATE UNIQUE INDEX staff_one_login_per_school
  ON staff (tenant_id, school_id, user_id)
  WHERE user_id IS NOT NULL;

CREATE INDEX staff_school_status_idx
  ON staff (tenant_id, school_id, status, last_name, first_name);

CREATE TABLE teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  staff_id uuid NOT NULL,
  teacher_code text,
  qualification text,
  specialization text,
  is_academic_coordinator boolean NOT NULL DEFAULT false,
  is_exam_coordinator boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  UNIQUE (tenant_id, school_id, staff_id),
  UNIQUE NULLS NOT DISTINCT (tenant_id, school_id, teacher_code),
  FOREIGN KEY (tenant_id, school_id, staff_id) REFERENCES staff(tenant_id, school_id, id) ON DELETE RESTRICT
);

CREATE INDEX teachers_school_idx ON teachers (tenant_id, school_id);

CREATE TABLE students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  notebookxl_student_id citext NOT NULL UNIQUE,
  admission_number text NOT NULL,
  first_name text NOT NULL,
  last_name text,
  preferred_name text,
  gender gender NOT NULL DEFAULT 'not_specified',
  date_of_birth date,
  admission_date date,
  status enrollment_status NOT NULL DEFAULT 'active',
  photo_storage_key text,
  medical_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  UNIQUE (tenant_id, school_id, admission_number),
  FOREIGN KEY (tenant_id, school_id) REFERENCES schools(tenant_id, id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX students_one_login_per_school
  ON students (tenant_id, school_id, user_id)
  WHERE user_id IS NOT NULL;

CREATE INDEX students_school_name_idx
  ON students (tenant_id, school_id, last_name, first_name)
  WHERE status = 'active';

-- Teachers can propose a subject; management approval creates the canonical
-- subjects / grade_subjects rows instead of hardcoding a frontend subject list.
CREATE TABLE subject_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  proposed_by_teacher_id uuid NOT NULL,
  proposed_name text NOT NULL,
  proposed_code text,
  rationale text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn')),
  reviewed_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_subject_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  FOREIGN KEY (tenant_id, school_id) REFERENCES schools(tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, school_id, proposed_by_teacher_id) REFERENCES teachers(tenant_id, school_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (tenant_id, school_id, created_subject_id) REFERENCES subjects(tenant_id, school_id, id) ON DELETE SET NULL,
  CHECK ((status = 'approved') = (created_subject_id IS NOT NULL))
);

CREATE TABLE subject_proposal_grade_targets (
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  proposal_id uuid NOT NULL,
  grade_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (proposal_id, grade_id),
  FOREIGN KEY (tenant_id, school_id, proposal_id) REFERENCES subject_proposals(tenant_id, school_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, school_id, grade_id) REFERENCES grades(tenant_id, school_id, id) ON DELETE RESTRICT
);

CREATE TABLE teacher_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  academic_year_id uuid NOT NULL,
  teacher_id uuid NOT NULL,
  section_subject_id uuid NOT NULL,
  assignment_role text NOT NULL DEFAULT 'primary' CHECK (assignment_role IN ('primary', 'co_teacher', 'substitute')),
  weekly_period_target smallint CHECK (weekly_period_target IS NULL OR weekly_period_target >= 0),
  starts_on date,
  ends_on date,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  UNIQUE (tenant_id, school_id, academic_year_id, id),
  UNIQUE (tenant_id, school_id, academic_year_id, teacher_id, section_subject_id),
  FOREIGN KEY (tenant_id, school_id, teacher_id) REFERENCES teachers(tenant_id, school_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (tenant_id, school_id, academic_year_id, section_subject_id)
    REFERENCES section_subjects(tenant_id, school_id, academic_year_id, id) ON DELETE RESTRICT,
  CHECK (ends_on IS NULL OR starts_on IS NULL OR ends_on >= starts_on)
);

CREATE INDEX teacher_assignments_teacher_idx
  ON teacher_assignments (tenant_id, school_id, academic_year_id, teacher_id)
  WHERE is_active;

CREATE INDEX teacher_assignments_class_idx
  ON teacher_assignments (tenant_id, school_id, academic_year_id, section_subject_id)
  WHERE is_active;

CREATE TABLE class_teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  academic_year_id uuid NOT NULL,
  section_id uuid NOT NULL,
  teacher_id uuid NOT NULL,
  is_primary boolean NOT NULL DEFAULT true,
  starts_on date,
  ends_on date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  FOREIGN KEY (tenant_id, school_id, academic_year_id, section_id)
    REFERENCES sections(tenant_id, school_id, academic_year_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (tenant_id, school_id, teacher_id) REFERENCES teachers(tenant_id, school_id, id) ON DELETE RESTRICT,
  CHECK (ends_on IS NULL OR starts_on IS NULL OR ends_on >= starts_on)
);

CREATE UNIQUE INDEX class_teachers_one_primary_per_section
  ON class_teachers (tenant_id, school_id, academic_year_id, section_id)
  WHERE is_primary AND ends_on IS NULL;

CREATE INDEX class_teachers_teacher_idx
  ON class_teachers (tenant_id, school_id, academic_year_id, teacher_id)
  WHERE ends_on IS NULL;

CREATE TABLE student_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  student_id uuid NOT NULL,
  academic_year_id uuid NOT NULL,
  grade_id uuid NOT NULL,
  section_id uuid NOT NULL,
  roll_number text NOT NULL,
  status enrollment_status NOT NULL DEFAULT 'active',
  enrolled_on date NOT NULL DEFAULT current_date,
  exited_on date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  UNIQUE (tenant_id, school_id, academic_year_id, id),
  UNIQUE (tenant_id, school_id, student_id, academic_year_id),
  UNIQUE (tenant_id, school_id, academic_year_id, section_id, roll_number),
  FOREIGN KEY (tenant_id, school_id, student_id) REFERENCES students(tenant_id, school_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (tenant_id, school_id, academic_year_id, grade_id, section_id)
    REFERENCES sections(tenant_id, school_id, academic_year_id, grade_id, id) ON DELETE RESTRICT,
  CHECK (exited_on IS NULL OR exited_on >= enrolled_on)
);

CREATE INDEX student_enrollments_class_idx
  ON student_enrollments (tenant_id, school_id, academic_year_id, section_id, roll_number)
  WHERE status = 'active';

CREATE INDEX student_enrollments_student_history_idx
  ON student_enrollments (tenant_id, school_id, student_id, academic_year_id DESC);

CREATE TABLE timetables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  academic_year_id uuid NOT NULL,
  section_id uuid NOT NULL,
  teacher_id uuid NOT NULL,
  teacher_assignment_id uuid NOT NULL,
  period_slot_id uuid NOT NULL,
  day_of_week smallint NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
  room_id uuid,
  effective_from date,
  effective_to date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  UNIQUE (tenant_id, school_id, academic_year_id, section_id, day_of_week, period_slot_id),
  FOREIGN KEY (tenant_id, school_id, academic_year_id, section_id)
    REFERENCES sections(tenant_id, school_id, academic_year_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (tenant_id, school_id, teacher_id) REFERENCES teachers(tenant_id, school_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (tenant_id, school_id, academic_year_id, teacher_assignment_id)
    REFERENCES teacher_assignments(tenant_id, school_id, academic_year_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (tenant_id, school_id, academic_year_id, period_slot_id)
    REFERENCES period_slots(tenant_id, school_id, academic_year_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (tenant_id, school_id, room_id) REFERENCES rooms(tenant_id, school_id, id) ON DELETE SET NULL,
  CHECK (effective_to IS NULL OR effective_from IS NULL OR effective_to >= effective_from)
);

CREATE INDEX timetables_teacher_day_idx
  ON timetables (tenant_id, school_id, academic_year_id, teacher_id, day_of_week, period_slot_id);

-- ---------------------------------------------------------------------------
-- Attendance and leave. Attendance is recorded against an enrollment, never
-- directly against a mutable "current class" field on students.
-- ---------------------------------------------------------------------------

CREATE TABLE student_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  academic_year_id uuid NOT NULL,
  student_enrollment_id uuid NOT NULL,
  attendance_date date NOT NULL,
  status attendance_status NOT NULL,
  marked_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  marked_at timestamptz NOT NULL DEFAULT now(),
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  UNIQUE (tenant_id, school_id, student_enrollment_id, attendance_date),
  FOREIGN KEY (tenant_id, school_id, academic_year_id, student_enrollment_id)
    REFERENCES student_enrollments(tenant_id, school_id, academic_year_id, id) ON DELETE RESTRICT
);

CREATE INDEX student_attendance_date_idx
  ON student_attendance (tenant_id, school_id, attendance_date, status);

CREATE INDEX student_attendance_enrollment_history_idx
  ON student_attendance (tenant_id, school_id, student_enrollment_id, attendance_date DESC);

CREATE TABLE teacher_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  teacher_id uuid NOT NULL,
  attendance_date date NOT NULL,
  status teacher_attendance_status NOT NULL,
  check_in_at timestamptz,
  check_out_at timestamptz,
  marked_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  UNIQUE (tenant_id, school_id, teacher_id, attendance_date),
  FOREIGN KEY (tenant_id, school_id, teacher_id) REFERENCES teachers(tenant_id, school_id, id) ON DELETE RESTRICT,
  CHECK (check_out_at IS NULL OR check_in_at IS NULL OR check_out_at >= check_in_at)
);

CREATE INDEX teacher_attendance_date_idx
  ON teacher_attendance (tenant_id, school_id, attendance_date, status);

CREATE TABLE teacher_leave (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  teacher_id uuid NOT NULL,
  leave_type text NOT NULL,
  starts_on date NOT NULL,
  ends_on date NOT NULL,
  is_half_day boolean NOT NULL DEFAULT false,
  reason text,
  status leave_status NOT NULL DEFAULT 'pending',
  requested_at timestamptz NOT NULL DEFAULT now(),
  reviewed_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  FOREIGN KEY (tenant_id, school_id, teacher_id) REFERENCES teachers(tenant_id, school_id, id) ON DELETE RESTRICT,
  CHECK (ends_on >= starts_on)
);

CREATE INDEX teacher_leave_calendar_idx
  ON teacher_leave (tenant_id, school_id, teacher_id, starts_on, ends_on)
  WHERE status IN ('pending', 'approved');

-- ---------------------------------------------------------------------------
-- Learning content, assignments, and submissions. file_assets stores metadata
-- only; binary objects live in private object storage and are served by signed
-- URLs after an authorization check.
-- ---------------------------------------------------------------------------

CREATE TABLE file_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  uploaded_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  storage_key text NOT NULL UNIQUE,
  original_filename text NOT NULL,
  media_type text NOT NULL,
  byte_size bigint NOT NULL CHECK (byte_size >= 0),
  sha256 text,
  is_deleted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  FOREIGN KEY (tenant_id, school_id) REFERENCES schools(tenant_id, id) ON DELETE CASCADE
);

CREATE INDEX file_assets_school_created_idx
  ON file_assets (tenant_id, school_id, created_at DESC)
  WHERE NOT is_deleted;

CREATE TABLE assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  academic_year_id uuid NOT NULL,
  teacher_assignment_id uuid NOT NULL,
  created_by_user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  title text NOT NULL,
  instructions text,
  assignment_kind text NOT NULL DEFAULT 'assignment' CHECK (assignment_kind IN ('assignment', 'homework', 'project', 'practical')),
  status assignment_status NOT NULL DEFAULT 'draft',
  available_at timestamptz,
  due_at timestamptz NOT NULL,
  maximum_marks numeric(7,2) CHECK (maximum_marks IS NULL OR maximum_marks >= 0),
  published_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  FOREIGN KEY (tenant_id, school_id, academic_year_id, teacher_assignment_id)
    REFERENCES teacher_assignments(tenant_id, school_id, academic_year_id, id) ON DELETE RESTRICT,
  CHECK (available_at IS NULL OR available_at <= due_at),
  CHECK (closed_at IS NULL OR closed_at >= due_at),
  CHECK ((status = 'published') = (published_at IS NOT NULL) OR status IN ('draft', 'archived'))
);

CREATE INDEX assignments_class_due_idx
  ON assignments (tenant_id, school_id, academic_year_id, teacher_assignment_id, due_at)
  WHERE status = 'published';

CREATE INDEX assignments_school_open_idx
  ON assignments (tenant_id, school_id, due_at)
  WHERE status IN ('draft', 'published');

CREATE TABLE assignment_attachments (
  assignment_id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  file_asset_id uuid NOT NULL,
  display_order smallint NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (assignment_id, file_asset_id),
  FOREIGN KEY (tenant_id, school_id, assignment_id) REFERENCES assignments(tenant_id, school_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, school_id, file_asset_id) REFERENCES file_assets(tenant_id, school_id, id) ON DELETE RESTRICT
);

CREATE TABLE assignment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  assignment_id uuid NOT NULL,
  student_enrollment_id uuid NOT NULL,
  status submission_status NOT NULL DEFAULT 'not_started',
  response_text text,
  submitted_at timestamptz,
  returned_at timestamptz,
  score numeric(7,2) CHECK (score IS NULL OR score >= 0),
  feedback text,
  graded_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  graded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  UNIQUE (tenant_id, school_id, assignment_id, student_enrollment_id),
  FOREIGN KEY (tenant_id, school_id, assignment_id) REFERENCES assignments(tenant_id, school_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, school_id, student_enrollment_id) REFERENCES student_enrollments(tenant_id, school_id, id) ON DELETE RESTRICT,
  CHECK ((submitted_at IS NULL) OR status IN ('submitted', 'late', 'returned', 'graded')),
  CHECK ((graded_at IS NULL) OR status = 'graded')
);

CREATE INDEX assignment_submissions_student_idx
  ON assignment_submissions (tenant_id, school_id, student_enrollment_id, status, submitted_at DESC);

CREATE INDEX assignment_submissions_review_idx
  ON assignment_submissions (tenant_id, school_id, assignment_id, status)
  WHERE status IN ('submitted', 'late');

CREATE TABLE assignment_submission_files (
  submission_id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  file_asset_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (submission_id, file_asset_id),
  FOREIGN KEY (tenant_id, school_id, submission_id) REFERENCES assignment_submissions(tenant_id, school_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, school_id, file_asset_id) REFERENCES file_assets(tenant_id, school_id, id) ON DELETE RESTRICT
);

CREATE TABLE lesson_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  academic_year_id uuid NOT NULL,
  teacher_assignment_id uuid NOT NULL,
  prepared_by_teacher_id uuid NOT NULL,
  planned_for date NOT NULL,
  title text NOT NULL,
  learning_objectives text,
  lesson_content text,
  homework_text text,
  status lesson_plan_status NOT NULL DEFAULT 'draft',
  reviewed_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  FOREIGN KEY (tenant_id, school_id, academic_year_id, teacher_assignment_id)
    REFERENCES teacher_assignments(tenant_id, school_id, academic_year_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (tenant_id, school_id, prepared_by_teacher_id) REFERENCES teachers(tenant_id, school_id, id) ON DELETE RESTRICT
);

CREATE INDEX lesson_plans_teacher_date_idx
  ON lesson_plans (tenant_id, school_id, prepared_by_teacher_id, planned_for DESC);

CREATE TABLE worksheets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  created_by_teacher_id uuid NOT NULL,
  title text NOT NULL,
  instructions text,
  file_asset_id uuid,
  status assignment_status NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  FOREIGN KEY (tenant_id, school_id, created_by_teacher_id) REFERENCES teachers(tenant_id, school_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (tenant_id, school_id, file_asset_id) REFERENCES file_assets(tenant_id, school_id, id) ON DELETE SET NULL
);

CREATE TABLE worksheet_section_subjects (
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  academic_year_id uuid NOT NULL,
  worksheet_id uuid NOT NULL,
  section_subject_id uuid NOT NULL,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (worksheet_id, section_subject_id),
  FOREIGN KEY (tenant_id, school_id, worksheet_id) REFERENCES worksheets(tenant_id, school_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, school_id, academic_year_id, section_subject_id)
    REFERENCES section_subjects(tenant_id, school_id, academic_year_id, id) ON DELETE RESTRICT
);

CREATE INDEX worksheet_section_subjects_target_idx
  ON worksheet_section_subjects (tenant_id, school_id, academic_year_id, section_subject_id, published_at DESC);

CREATE TABLE study_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  created_by_teacher_id uuid,
  title text NOT NULL,
  description text,
  material_type text NOT NULL DEFAULT 'document' CHECK (material_type IN ('document', 'link', 'video', 'presentation', 'other')),
  external_url text,
  file_asset_id uuid,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, school_id, id),
  FOREIGN KEY (tenant_id, school_id) REFERENCES schools(tenant_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, school_id, created_by_teacher_id) REFERENCES teachers(tenant_id, school_id, id) ON DELETE SET NULL,
  FOREIGN KEY (tenant_id, school_id, file_asset_id) REFERENCES file_assets(tenant_id, school_id, id) ON DELETE SET NULL,
  CHECK (external_url IS NOT NULL OR file_asset_id IS NOT NULL),
  CHECK ((is_published = false) OR published_at IS NOT NULL)
);

CREATE TABLE study_material_section_subjects (
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  academic_year_id uuid NOT NULL,
  study_material_id uuid NOT NULL,
  section_subject_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (study_material_id, section_subject_id),
  FOREIGN KEY (tenant_id, school_id, study_material_id) REFERENCES study_materials(tenant_id, school_id, id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, school_id, academic_year_id, section_subject_id)
    REFERENCES section_subjects(tenant_id, school_id, academic_year_id, id) ON DELETE RESTRICT
);

CREATE INDEX study_material_targets_idx
  ON study_material_section_subjects (tenant_id, school_id, academic_year_id, section_subject_id);

-- ---------------------------------------------------------------------------
-- Device-Independent Real-Time Attendance Engine Tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  user_id uuid NOT NULL,
  person_type varchar(30) NOT NULL DEFAULT 'Student',
  credential_id varchar(128) NOT NULL,
  credential_type varchar(30) NOT NULL DEFAULT 'BARCODE',
  status varchar(20) NOT NULL DEFAULT 'ACTIVE',
  assigned_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, credential_id)
);

CREATE INDEX IF NOT EXISTS idx_user_credentials_lookup 
  ON user_credentials (tenant_id, credential_id, status);

CREATE TABLE IF NOT EXISTS attendance_punch_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  user_id uuid NOT NULL,
  credential_id varchar(128) NOT NULL,
  person_type varchar(30) NOT NULL DEFAULT 'Student',
  device_id varchar(64) NOT NULL DEFAULT 'GATE_SCANNER_01',
  source_type varchar(30) NOT NULL DEFAULT 'BARCODE',
  event_type varchar(10) NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  attendance_date date NOT NULL DEFAULT CURRENT_DATE,
  metadata_json jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_punch_events_tenant_date 
  ON attendance_punch_events (tenant_id, attendance_date, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_punch_events_user_history 
  ON attendance_punch_events (tenant_id, user_id, attendance_date, timestamp ASC);

