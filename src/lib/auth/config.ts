// Central auth settings. Safe to import from the proxy, route handlers, client components and server code.

export const SESSION_COOKIE = "ascend_session";
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

/** Pages a signed-out visitor may open. Every other page needs a signed-in user. */
export const AUTH_PAGES = ["/login", "/signup"];

export function isAuthPage(pathname: string): boolean {
  return AUTH_PAGES.some((p) => pathname === p || pathname === `${p}/`);
}

/** Information pages and the Home page: anyone may open them. */
export const PUBLIC_PAGES = ["/", "/contact", "/privacy", "/terms"];

/** First path segments that belong to the app itself, so they are never a course (tech) slug. */
const RESERVED_ROOTS = new Set(["login", "signup", "learning", "api", "preview", "track"]);

function segments(pathname: string): string[] {
  return pathname.split("/").filter(Boolean);
}

/**
 * Category pages are open to everyone (and to search engines): a track such as /track/ai, or a course such as /react.
 * They only list topic titles and one-line summaries. Unknown slugs fall through to the page's own 404.
 */
export function isCategoryPage(pathname: string): boolean {
  const s = segments(pathname);
  return (s.length === 1 && !RESERVED_ROOTS.has(s[0])) || (s.length === 2 && s[0] === "track");
}

/** Pages anyone may open without an account: Home, the information pages and the category pages. */
export function isPublicPage(pathname: string): boolean {
  return PUBLIC_PAGES.some((p) => pathname === p || (p !== "/" && pathname === `${p}/`)) || isCategoryPage(pathname);
}

/**
 * A topic page, /<course>/<topic>. Signed-in users get the full notes; everyone else gets a short public preview
 * (see PREVIEW_PREFIX), so the full notes never leave the server for a visitor without a session.
 */
export function isTopicPage(pathname: string): boolean {
  const s = segments(pathname);
  return s.length === 2 && !RESERVED_ROOTS.has(s[0]);
}

/** Internal route that renders the signed-out preview. The proxy rewrites topic URLs to it; it is never a public URL. */
export const PREVIEW_PREFIX = "/preview";

export function previewPathFor(pathname: string): string {
  return `${PREVIEW_PREFIX}/${segments(pathname).join("/")}`;
}

/** If this is a direct request to the internal preview route, the real topic URL it stands for (otherwise null). */
export function topicPathFromPreview(pathname: string): string | null {
  const s = segments(pathname);
  return s[0] === "preview" && s.length === 3 ? `/${s[1]}/${s[2]}` : null;
}

/** Pages that render for visitors without a session: the public pages, plus topic pages (which show them a preview). */
export function isOpenPage(pathname: string): boolean {
  return isPublicPage(pathname) || isTopicPage(pathname);
}

/** Only allow same-site relative paths as a post-login destination (no open redirects). */
export function safeNextPath(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return "/";
  if (isAuthPage(raw.split("?")[0])) return "/";
  return raw;
}
