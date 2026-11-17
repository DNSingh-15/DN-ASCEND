// Central auth settings. Safe to import from the proxy, route handlers and server code.

export const SESSION_COOKIE = "ascend_session";
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

/** Pages a signed-out visitor may open. Every other page needs a signed-in user. */
export const AUTH_PAGES = ["/login", "/signup"];

export function isAuthPage(pathname: string): boolean {
  return AUTH_PAGES.some((p) => pathname === p || pathname === `${p}/`);
}

/** Pages anyone may open without an account: the public Home and the information pages. Everything else needs sign-in. */
export const PUBLIC_PAGES = ["/", "/contact", "/privacy", "/terms"];

export function isPublicPage(pathname: string): boolean {
  return PUBLIC_PAGES.some((p) => pathname === p || (p !== "/" && pathname === `${p}/`));
}

/** Only allow same-site relative paths as a post-login destination (no open redirects). */
export function safeNextPath(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return "/";
  if (isAuthPage(raw.split("?")[0])) return "/";
  return raw;
}
