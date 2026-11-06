import type { NextRequest } from "next/server";
import { clearSessionCookie, isSameOrigin, json } from "@/lib/auth/http";

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return json({ error: "Cross-site request blocked." }, 403);
  const res = json({ ok: true });
  clearSessionCookie(res, req);
  return res;
}
