import type { NextRequest } from "next/server";
import { authenticate } from "@/lib/auth/auth-service";
import { clientIp, isSameOrigin, json, readJsonFields, setSessionCookie } from "@/lib/auth/http";
import { hitRateLimit, resetRateLimit } from "@/lib/auth/rate-limit";
import { emailKey } from "@/lib/auth/validation";

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return json({ error: "Cross-site request blocked." }, 403);

  const body = await readJsonFields(req, ["email", "password"] as const);
  if (!body) return json({ error: "Invalid request." }, 400);

  // Limit per IP + email so one person cannot lock out everyone else, and guessing one account is slowed down.
  const key = `login:${clientIp(req)}:${emailKey(body.email)}`;
  const limit = hitRateLimit(key, 8, 15 * 60 * 1000);
  if (limit.limited) {
    return json({ error: "Too many login attempts. Please try again in a few minutes." }, 429, { "Retry-After": String(limit.retryAfterSec) });
  }

  try {
    const result = await authenticate(body);
    if (!result.ok) return json({ error: result.error, fieldErrors: result.fieldErrors }, result.status);

    resetRateLimit(key);
    const res = json({ user: result.value });
    setSessionCookie(res, req, result.value.id);
    return res;
  } catch (err) {
    console.error("[auth] login failed", err);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
}
