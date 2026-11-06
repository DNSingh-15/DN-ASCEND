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

- Users are stored in `data/users.json` (git-ignored, created on first signup). Passwords are hashed with scrypt, never stored in plain text. Emails are unique, case-insensitively.
- Sessions are signed, HttpOnly cookies valid for 7 days. The signing key comes from `SESSION_SECRET` (32+ chars) or is generated into `data/.session-secret`. Set `SESSION_SECRET` in production.
- `ASCEND_DATA_DIR` overrides the data folder.
- Code lives in `src/lib/auth` (hashing, validation, sessions, `UserRepository`), `src/app/api/auth` (routes) and `src/proxy.ts` (route protection). To move to MySQL, implement `UserRepository` against a table and swap it in `getUserRepository()`.
- The JSON store suits a single server process. It is not suitable for serverless or multi-instance deployments.
