import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { withFileLock } from "./file-lock";
import { dataDir } from "./paths";
import { emailKey } from "./validation";

// ---------------------------------------------------------------------------------------------
// Storage boundary. The rest of the app only talks to `UserRepository`, so moving to MySQL later
// means writing a `MySqlUserRepository` with the same three methods and returning it from
// `getUserRepository()`. A matching table:
//
//   CREATE TABLE users (
//     id            CHAR(36)     PRIMARY KEY,
//     full_name     VARCHAR(60)  NOT NULL,
//     email         VARCHAR(254) NOT NULL,
//     email_key     VARCHAR(254) NOT NULL UNIQUE,   -- lower-cased email, enforces no duplicates
//     password_hash VARCHAR(255) NOT NULL,
//     created_at    DATETIME     NOT NULL,
//     updated_at    DATETIME     NOT NULL
//   );
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
// JSON file implementation: data/users.json
// ---------------------------------------------------------------------------------------------

type UsersFile = { version: 1; users: UserRecord[] };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class JsonUserRepository implements UserRepository {
  constructor(private readonly file: string) {}

  private get lockPath() {
    return `${this.file}.lock`;
  }

  /** A missing file means "no users yet". A file that exists but cannot be parsed is an error: we never overwrite it. */
  private async read(): Promise<UsersFile> {
    let raw: string;
    try {
      raw = await fs.readFile(this.file, "utf8");
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return { version: 1, users: [] };
      throw err;
    }
    if (!raw.trim()) return { version: 1, users: [] };
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error(`${this.file} is not valid JSON. Refusing to modify it; fix or restore the file.`);
    }
    const users = Array.isArray(parsed) ? parsed : (parsed as Partial<UsersFile>)?.users;
    if (!Array.isArray(users)) throw new Error(`${this.file} has an unexpected shape. Refusing to modify it.`);
    return { version: 1, users: users as UserRecord[] };
  }

  /** Write to a temp file, then rename over the original, so a crash never leaves a half-written users.json. */
  private async write(data: UsersFile): Promise<void> {
    await fs.mkdir(path.dirname(this.file), { recursive: true });
    const tmp = `${this.file}.${process.pid}.${randomUUID()}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(data, null, 2) + "\n", { encoding: "utf8", mode: 0o600 });
    for (let attempt = 0; ; attempt++) {
      try {
        await fs.rename(tmp, this.file);
        return;
      } catch (err) {
        const code = (err as NodeJS.ErrnoException).code;
        // Windows can briefly refuse the rename while a reader has the file open.
        if ((code === "EPERM" || code === "EACCES" || code === "EBUSY") && attempt < 20) {
          await sleep(20 + attempt * 10);
          continue;
        }
        await fs.unlink(tmp).catch(() => {});
        throw err;
      }
    }
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const key = emailKey(email);
    const { users } = await this.read();
    return users.find((u) => u.emailKey === key) ?? null;
  }

  async findById(id: string): Promise<UserRecord | null> {
    const { users } = await this.read();
    return users.find((u) => u.id === id) ?? null;
  }

  create(user: NewUser): Promise<UserRecord> {
    // Re-read inside the lock so we always append to the latest list and the duplicate check cannot race.
    return withFileLock(this.lockPath, async () => {
      const data = await this.read();
      const key = emailKey(user.email);
      if (data.users.some((u) => u.emailKey === key)) throw new DuplicateEmailError();

      const now = new Date().toISOString();
      const record: UserRecord = {
        id: randomUUID(),
        fullName: user.fullName,
        email: user.email,
        emailKey: key,
        passwordHash: user.passwordHash,
        createdAt: now,
        updatedAt: now,
      };
      await this.write({ version: 1, users: [...data.users, record] });
      return record;
    });
  }
}

let repo: UserRepository | null = null;

export function getUserRepository(): UserRepository {
  repo ??= new JsonUserRepository(path.join(dataDir(), "users.json"));
  return repo;
}
