import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, isAuthPage } from "@/lib/auth/config";
import { verifySessionToken } from "@/lib/auth/session-token";

// Route protection (optimistic check): only reads and verifies the signed cookie, never touches users.json.
// Pages re-check against the real user via getCurrentUser() (see lib/auth/session.ts), and API handlers check themselves.
export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const signedIn = Boolean(verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value));

  if (isAuthPage(pathname)) {
    // Already signed in: no reason to see the login / signup forms again.
    if (signedIn) return NextResponse.redirect(new URL("/", req.url));
    return NextResponse.next();
  }

  if (!signedIn) {
    const url = new URL("/login", req.url);
    if (pathname !== "/") url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Everything except API routes (they enforce auth themselves), Next internals and static files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images/|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|txt|xml|json)$).*)"],
};
