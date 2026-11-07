import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "./config";
import { createSessionToken, verifySessionToken } from "./session-token";

// Helpers shared by the /api/auth/* Route Handlers.

function isHttps(req: NextRequest): boolean {
  return req.nextUrl.protocol === "https:" || req.headers.get("x-forwarded-proto") === "https";
}

export function setSessionCookie(res: NextResponse, req: NextRequest, userId: string) {
  res.cookies.set(SESSION_COOKIE, createSessionToken(userId), {
    httpOnly: true,
    secure: isHttps(req),
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(res: NextResponse, req: NextRequest) {
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, secure: isHttps(req), sameSite: "lax", path: "/", maxAge: 0 });
}

export function sessionUserId(req: NextRequest): string | null {
  return verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)?.uid ?? null;
}

/**
 * Every host this request may legitimately have come from. Proxies (Netlify deploy previews, `netlify dev`)
 * can report the public host in x-forwarded-host and the internal one in host, or a comma-separated list,
 * so accept any of them, plus the URLs Netlify assigns to this deploy.
 */
function ownHosts(req: NextRequest): Set<string> {
  const hosts = new Set<string>();
  const add = (value: string | null | undefined) => {
    for (const h of value?.split(",") ?? []) if (h.trim()) hosts.add(h.trim().toLowerCase());
  };
  add(req.headers.get("x-forwarded-host"));
  add(req.headers.get("host"));
  add(req.nextUrl.host);
  for (const key of ["URL", "DEPLOY_PRIME_URL", "DEPLOY_URL"]) {
    try {
      add(new URL(process.env[key] ?? "").host);
    } catch {}
  }
  return hosts;
}

/**
 * Reject cross-site POSTs (CSRF): when the browser sends Origin, it must be this site. A cross-site attacker
 * cannot choose the Host / X-Forwarded-Host the browser sends to us, so matching any of them is still safe.
 */
export function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return ownHosts(req).has(new URL(origin).host.toLowerCase());
  } catch {
    return false;
  }
}

/** Parse a small JSON body and pick string fields; anything else becomes "". */
export async function readJsonFields<K extends string>(req: NextRequest, keys: readonly K[]): Promise<Record<K, string> | null> {
  if (!req.headers.get("content-type")?.includes("application/json")) return null;
  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > 10_000) return null;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return null;
  }
  if (!body || typeof body !== "object") return null;
  const out = {} as Record<K, string>;
  for (const k of keys) {
    const v = (body as Record<string, unknown>)[k];
    out[k] = typeof v === "string" ? v : "";
  }
  return out;
}

export function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
}

export function json(data: unknown, status = 200, headers?: HeadersInit) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store", ...headers } });
}
