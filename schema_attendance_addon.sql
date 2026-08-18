
-- ---------------------------------------------------------------------------
-- Device-Independent Real-Time Attendance Engine Tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  user_id uuid NOT NULL,
  person_type varchar(30) NOT NULL DEFAULT 'Student', -- Student, Teacher, Employee, Staff, Guest
  credential_id varchar(128) NOT NULL, -- Secure unique credential identifier (e.g. hashed/anonymized token)
  credential_type varchar(30) NOT NULL DEFAULT 'BARCODE', -- BARCODE, QR_CODE, RFID, NFC, BIOMETRIC
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
  source_type varchar(30) NOT NULL DEFAULT 'BARCODE', -- BARCODE, QR_CODE, RFID, NFC, BIOMETRIC
  event_type varchar(10) NOT NULL, -- IN, OUT
  timestamp timestamptz NOT NULL DEFAULT now(),
  attendance_date date NOT NULL DEFAULT CURRENT_DATE,
  metadata_json jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_punch_events_tenant_date 
  ON attendance_punch_events (tenant_id, attendance_date, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_punch_events_user_history 
  ON attendance_punch_events (tenant_id, user_id, attendance_date, timestamp ASC);
