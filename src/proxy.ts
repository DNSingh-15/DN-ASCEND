import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, isAuthPage, isPublicPage } from "@/lib/auth/config";
import { verifySessionToken } from "@/lib/auth/session-token";

// Route protection (optimistic check): only reads and verifies the signed cookie, never touches the database.
// Pages re-check against the real user via getCurrentUser() (see lib/auth/session.ts), and API handlers check themselves.
export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const signedIn = Boolean(verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value));

  if (isAuthPage(pathname)) {
    // Already signed in: no reason to see the login / signup forms again.
    if (signedIn) return NextResponse.redirect(new URL("/", req.url));
    return NextResponse.next();
  }

  // Public pages (Home, Contact, Privacy, Terms) open for everyone, signed in or not.
  if (isPublicPage(pathname)) return NextResponse.next();

  if (!signedIn) {
    const url = new URL("/login", req.url);
    if (pathname !== "/") url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Everything except API routes (they enforce auth themselves), Next internals, static files and the public pages
  // (Home, Contact, Privacy, Terms: nothing to protect, so they skip the proxy and can be served from the CDN).
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images/|$|contact/?$|privacy/?$|terms/?$|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|txt|xml|json)$).*)"],
};
