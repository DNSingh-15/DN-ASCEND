import fs from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { dataDir } from "./paths";

let cached: string | null = null;

/**
 * Key used to sign session cookies.
 * Uses SESSION_SECRET when set (recommended in production). Otherwise a random key is created once and
 * kept in <data dir>/.session-secret, so logins survive a restart with no setup.
 */
export function getSessionSecret(): string {
  if (cached) return cached;

  const fromEnv = process.env.SESSION_SECRET;
  if (fromEnv && fromEnv.length >= 32) return (cached = fromEnv);

  const file = path.join(dataDir(), ".session-secret");
  try {
    const existing = fs.readFileSync(file, "utf8").trim();
    if (existing.length >= 32) return (cached = existing);
  } catch {}

  fs.mkdirSync(dataDir(), { recursive: true });
  const fresh = randomBytes(48).toString("base64url");
  try {
    fs.writeFileSync(file, fresh, { flag: "wx", mode: 0o600 }); // "wx": never replace a key another process just made
    cached = fresh;
  } catch {
    cached = fs.readFileSync(file, "utf8").trim();
  }
  return cached;
}
