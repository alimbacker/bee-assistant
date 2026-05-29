-- Bee Assistant — database schema (SQLite-compatible; maps 1:1 to Firebase/Supabase)
-- Applied automatically on server start by src/db/index.js

CREATE TABLE IF NOT EXISTS users (
  id                 TEXT PRIMARY KEY,
  name               TEXT,
  email              TEXT UNIQUE,
  role               TEXT NOT NULL DEFAULT 'student'
                       CHECK (role IN ('student','job_seeker','business','admin')),
  preferred_language TEXT NOT NULL DEFAULT 'en',
  created_at         INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS conversations (
  id         TEXT PRIMARY KEY,
  user_id    TEXT,
  transcript TEXT,                 -- JSON: [{role:'user'|'bee', text, audio_url}]
  summary    TEXT,
  intent     TEXT,
  sentiment  TEXT,                 -- positive | neutral | negative
  language   TEXT DEFAULT 'en',
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS leads (
  id            TEXT PRIMARY KEY,
  name          TEXT,
  mobile        TEXT,
  email         TEXT,
  business_type TEXT,
  requirement   TEXT,
  source        TEXT DEFAULT 'web',  -- web | voice | call | whatsapp | telegram
  status        TEXT NOT NULL DEFAULT 'new'
                  CHECK (status IN ('new','contacted','converted')),
  created_at    INTEGER NOT NULL
);

-- jobs and courses share a table via `type`
CREATE TABLE IF NOT EXISTS catalog (
  id        TEXT PRIMARY KEY,
  type      TEXT NOT NULL CHECK (type IN ('job','course')),
  title     TEXT NOT NULL,
  category  TEXT,
  details   TEXT,                  -- JSON
  fee_salary TEXT
);

CREATE TABLE IF NOT EXISTS audit_log (
  id         TEXT PRIMARY KEY,
  actor      TEXT,
  action     TEXT,
  meta       TEXT,                 -- JSON
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_status   ON leads(status);
CREATE INDEX IF NOT EXISTS idx_conv_intent    ON conversations(intent);
CREATE INDEX IF NOT EXISTS idx_catalog_type   ON catalog(type);
