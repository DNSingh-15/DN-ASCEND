import type { NextRequest } from "next/server";
import { getUserById } from "@/lib/auth/auth-service";
import { clearSessionCookie, json, sessionUserId } from "@/lib/auth/http";

/** Who is signed in? Returns { user } or 401 (and clears a cookie that points to a user that no longer exists). */
export async function GET(req: NextRequest) {
  const id = sessionUserId(req);
  const user = id ? await getUserById(id) : null;
  if (!user) {
    const res = json({ user: null }, 401);
    if (id) clearSessionCookie(res, req);
    return res;
  }
  return json({ user });
}
