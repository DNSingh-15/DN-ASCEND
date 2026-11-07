# DN ASCEND 🚀

**Learn Deeply. Engineer Boldly. Ascend Further.**

DN ASCEND is a personal technology learning hub focused on mastering the skills needed to become a great software engineer.

### 📚 Topics
- Full Stack Development
- Artificial Intelligence
- Cloud Computing
- Data Structures & Algorithms (DSA)
- System Design

### 🎯 Goal
Build strong technical foundations, prepare for FAANG-level interviews, and grow continuously as an engineer.

**Built by D N Singh.**

## Authentication

All pages require an account. Sign up at `/signup`, log in at `/login`.

- Users are stored in the `users` table of Netlify Database (Postgres), accessed through `@netlify/database`. The schema lives in `netlify/database/migrations/`, which Netlify applies automatically on every deploy. Passwords are hashed with scrypt, never stored in plain text. Emails are unique, case-insensitively.
- Sessions are signed, HttpOnly cookies valid for 7 days. The signing key is read only from the `SESSION_SECRET` environment variable (32+ chars), which is required.
- Code lives in `src/lib/auth` (hashing, validation, sessions, `UserRepository`), `src/app/api/auth` (routes) and `src/proxy.ts` (route protection).

### Local development

Requires Node 22.12+ and Netlify CLI 26+ (`npm install -g netlify-cli`), with the folder linked to the site (`netlify link`).

1. Create `.env.local` with `SESSION_SECRET=<32+ random characters>` (git-ignored).
2. `netlify dev` starts Next.js together with a local Postgres database and sets `NETLIFY_DB_URL`.
3. In a second terminal, the first time and after adding a migration: `netlify database migrations apply`.

Plain `npm run dev` also works if you set `NETLIFY_DB_URL` yourself to a Postgres connection string.
