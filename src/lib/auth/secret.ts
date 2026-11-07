let cached: string | null = null;

/**
 * Key used to sign session cookies. Read only from the SESSION_SECRET environment variable
 * (Netlify env vars in production, .env.local locally). Nothing is ever written to disk.
 */
export function getSessionSecret(): string {
  if (cached) return cached;

  const fromEnv = process.env.SESSION_SECRET;
  if (!fromEnv || fromEnv.length < 32) {
    throw new Error("SESSION_SECRET is missing or shorter than 32 characters. Set it in the environment (e.g. .env.local).");
  }
  return (cached = fromEnv);
}
