import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, isAuthPage, isPublicPage, isTopicPage, previewPathFor, topicPathFromPreview } from "@/lib/auth/config";
import { verifySessionToken } from "@/lib/auth/session-token";

// Route protection (optimistic check): only reads and verifies the signed cookie, never touches the database.
// API handlers check the user themselves, and the header menu re-checks the session in the browser.
//
// Access rules:
//   - Home, Contact, Privacy, Terms and the category pages (/track/*, /<course>) are open to everyone, search engines included.
//   - Topic pages (/<course>/<topic>): signed-in users get the full notes. Everyone else is served a short public preview
//     from the internal /preview route (a rewrite, so the URL stays the same and no redirect happens). The full notes
//     are never sent to a visitor without a valid session.
//   - Everything else needs a signed-in user and redirects to /login.
export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const signedIn = Boolean(verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value));

  if (isAuthPage(pathname)) {
    // Already signed in: no reason to see the login / signup forms again.
    if (signedIn) return NextResponse.redirect(new URL("/", req.url));
    return NextResponse.next();
  }

  // /preview/* is an internal route. A direct request is sent to the real topic URL, so there is one URL per topic.
  const topicUrl = topicPathFromPreview(pathname);
  if (topicUrl) return NextResponse.redirect(new URL(topicUrl, req.url), 308);

  if (isPublicPage(pathname)) return NextResponse.next();

  if (isTopicPage(pathname)) {
    if (signedIn) return NextResponse.next();
    return NextResponse.rewrite(new URL(previewPathFor(pathname), req.url));
  }

  if (!signedIn) {
    const url = new URL("/login", req.url);
    if (pathname !== "/") url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skipped entirely: API routes (they enforce auth themselves), Next internals, static files (images, logo, icons,
  // robots.txt, sitemap.xml, a Search Console verification file) and the fixed public pages (Home, Contact, Privacy, Terms),
  // so those are served straight from the CDN. Category pages still pass through here and are let through by isPublicPage,
  // which keeps every protected route behind one check.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images/|logo/|google[a-z0-9]+\\.html$|$|contact/?$|privacy/?$|terms/?$|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|txt|xml|json)$).*)",
  ],
};
