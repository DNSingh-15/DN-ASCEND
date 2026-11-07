import { randomUUID } from "node:crypto";
import { getDatabase } from "@netlify/database";
import { emailKey } from "./validation";

// ---------------------------------------------------------------------------------------------
// Storage boundary. The rest of the app only talks to `UserRepository`; `getUserRepository()`
// decides which implementation backs it. The table is created by the migration in
// netlify/database/migrations/ (applied by Netlify on deploy).
// ---------------------------------------------------------------------------------------------

export type UserRecord = {
  id: string;
  fullName: string;
  /** As the user typed it (trimmed). */
  email: string;
  /** Lower-cased email, unique across all users. */
  emailKey: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
};

/** What may leave the server. Never includes the password hash. */
export type PublicUser = Pick<UserRecord, "id" | "fullName" | "email" | "createdAt">;

export function toPublicUser(u: UserRecord): PublicUser {
  return { id: u.id, fullName: u.fullName, email: u.email, createdAt: u.createdAt };
}

export type NewUser = { fullName: string; email: string; passwordHash: string };

export class DuplicateEmailError extends Error {
  constructor() {
    super("An account with this email already exists.");
    this.name = "DuplicateEmailError";
  }
}

export interface UserRepository {
  findByEmail(email: string): Promise<UserRecord | null>;
  findById(id: string): Promise<UserRecord | null>;
  /** Throws DuplicateEmailError if the email (case-insensitive) is taken. */
  create(user: NewUser): Promise<UserRecord>;
}

// ---------------------------------------------------------------------------------------------
// Netlify Database (Postgres) implementation: table `users`
// ---------------------------------------------------------------------------------------------

type UserRow = {
  id: string;
  full_name: string;
  email: string;
  email_key: string;
  password_hash: string;
  created_at: Date | string;
  updated_at: Date | string;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Timestamps come back as Date (pg) or string (HTTP driver); the app has always used ISO strings. */
const iso = (v: Date | string) => new Date(v).toISOString();

function toRecord(r: UserRow): UserRecord {
  return {
    id: r.id,
    fullName: r.full_name,
    email: r.email,
    emailKey: r.email_key,
    passwordHash: r.password_hash,
    createdAt: iso(r.created_at),
    updatedAt: iso(r.updated_at),
  };
}

type Db = ReturnType<typeof getDatabase>;

export class PostgresUserRepository implements UserRepository {
  private db: Db | null = null;

  /** Connect lazily, so a missing NETLIFY_DB_URL fails the request (logged by the route) rather than the import. */
  private get sql() {
    this.db ??= getDatabase();
    return this.db.sql;
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const rows = await this.sql<UserRow>`SELECT * FROM users WHERE email_key = ${emailKey(email)} LIMIT 1`;
    return rows[0] ? toRecord(rows[0]) : null;
  }

  async findById(id: string): Promise<UserRecord | null> {
    if (!UUID_RE.test(id)) return null; // Postgres would reject a non-UUID value with an error
    const rows = await this.sql<UserRow>`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
    return rows[0] ? toRecord(rows[0]) : null;
  }

  async create(user: NewUser): Promise<UserRecord> {
    // The UNIQUE constraint on email_key is the real duplicate guarantee: a concurrent insert of
    // the same email inserts nothing, and we report it as a duplicate.
    const now = new Date().toISOString();
    const rows = await this.sql<UserRow>`
      INSERT INTO users (id, full_name, email, email_key, password_hash, created_at, updated_at)
      VALUES (${randomUUID()}, ${user.fullName}, ${user.email}, ${emailKey(user.email)}, ${user.passwordHash}, ${now}, ${now})
      ON CONFLICT (email_key) DO NOTHING
      RETURNING *`;
    if (!rows[0]) throw new DuplicateEmailError();
    return toRecord(rows[0]);
  }
}

let repo: UserRepository | null = null;

export function getUserRepository(): UserRepository {
  repo ??= new PostgresUserRepository();
  return repo;
}
