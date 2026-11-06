import type { NextRequest } from "next/server";
import { registerUser } from "@/lib/auth/auth-service";
import { clientIp, isSameOrigin, json, readJsonFields, setSessionCookie } from "@/lib/auth/http";
import { hitRateLimit } from "@/lib/auth/rate-limit";

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return json({ error: "Cross-site request blocked." }, 403);

  const limit = hitRateLimit(`signup:${clientIp(req)}`, 10, 60 * 60 * 1000);
  if (limit.limited) {
    return json({ error: "Too many sign-up attempts. Please try again later." }, 429, { "Retry-After": String(limit.retryAfterSec) });
  }

  const body = await readJsonFields(req, ["fullName", "email", "password", "confirmPassword"] as const);
  if (!body) return json({ error: "Invalid request." }, 400);

  try {
    const result = await registerUser(body);
    if (!result.ok) return json({ error: result.error, fieldErrors: result.fieldErrors }, result.status);

    const res = json({ user: result.value }, 201);
    setSessionCookie(res, req, result.value.id);
    return res;
  } catch (err) {
    console.error("[auth] signup failed", err);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
}
