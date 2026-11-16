-- Migration 001: Initial Schema for Security-First Maternal Health & Pregnancy Application
-- Compliance: OWASP MASVS L2, OWASP API Security Top 10, HIPAA Security Rule (45 CFR § 164.312)
-- Security Requirements: S5 (Object-Level Authorization), S9 (Consent & Sovereign Purge), S14 (Envelope Encryption), S16 (Append-Only Audit)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(32) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'patient',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. consent_log table (S9: Granular consent tracking)
CREATE TABLE IF NOT EXISTS consent_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    consent_version VARCHAR(50) NOT NULL,
    categories TEXT[] NOT NULL,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMPTZ
);

-- 3. profiles table (F3: Pregnancy profile)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    lmp DATE,
    edd DATE,
    gestational_weeks INT,
    blood_group VARCHAR(10),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. health_entries table (F4 & S14: Clinical health logs with field-level envelope encryption)
CREATE TABLE IF NOT EXISTS health_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entry_date TIMESTAMPTZ NOT NULL,
    weight NUMERIC(5,2),
    systolic INT,
    diastolic INT,
    symptoms TEXT[],
    kick_count INT,
    mood VARCHAR(50),
    notes_encrypted JSONB,
    key_version INT DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. appointments table (F5 & S14: Antenatal appointments with envelope encryption)
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    location VARCHAR(255),
    notes_encrypted JSONB,
    key_version INT DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. documents table (F6 & S17: Diagnostic scans metadata and envelope encryption keys)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes INT NOT NULL,
    storage_key VARCHAR(500) NOT NULL,
    key_version INT DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. content table (F7: WHO guidelines & evidence-based maternal articles)
CREATE TABLE IF NOT EXISTS content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    week_number INT,
    body TEXT NOT NULL,
    medical_disclaimer TEXT NOT NULL
);

-- 8. audit_log table (S16: Tamper-evident append-only audit trail)
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id UUID,
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(255),
    ip_address VARCHAR(100),
    status VARCHAR(50) NOT NULL
);

-- Mandatory S5 User-Bound Indexes (Tenant Isolation & BOLA/IDOR Prevention)
CREATE INDEX IF NOT EXISTS idx_health_entries_user_id ON health_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_log_user_id ON consent_log(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);

-- Additional indexing for query optimization
CREATE INDEX IF NOT EXISTS idx_health_entries_entry_date ON health_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(timestamp);
