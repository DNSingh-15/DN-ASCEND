-- Users for email + password auth (see src/lib/auth/user-repository.ts).
-- Applied automatically by Netlify on deploy; locally run `netlify database migrations apply`.
-- Never edit this file after it has been deployed: add a new migration instead.
CREATE TABLE IF NOT EXISTS users (
  id            UUID         PRIMARY KEY,
  full_name     VARCHAR(60)  NOT NULL,
  email         VARCHAR(254) NOT NULL,
  email_key     VARCHAR(254) NOT NULL UNIQUE, -- lower-cased email, enforces case-insensitive uniqueness
  password_hash TEXT         NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
