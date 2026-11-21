import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import AdGuard from "@/components/AdGuard";
import UserMenu from "@/components/auth/UserMenu";
import { ADSENSE_CLIENT } from "@/lib/ads";
import { CREATOR, CREATOR_READY, LOGO_MARK, OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // Author tags only once a real name is set in CREATOR (src/lib/site.ts); never a placeholder.
  ...(CREATOR_READY
    ? { authors: [{ name: CREATOR.name, ...(CREATOR.profileUrl ? { url: CREATOR.profileUrl } : {}) }], creator: CREATOR.name }
    : {}),
  publisher: SITE_NAME,
  category: "education",
  formatDetection: { telephone: false, email: false, address: false },
  // Canonical URLs and robots directives are set per page (src/lib/seo.ts), never here: a site-wide default would leak
  // into the 404 page as "index" plus a canonical pointing at /_not-found.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_IN",
    url: "/",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION, images: [OG_IMAGE.url] },
  // Google Search Console "HTML tag" method: set GOOGLE_SITE_VERIFICATION in Netlify's environment variables, then redeploy.
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
  // AdSense site ownership ("Meta tag" method), only once ADSENSE_CLIENT_ID is set (see src/lib/ads.ts).
  ...(ADSENSE_CLIENT ? { other: { "google-adsense-account": ADSENSE_CLIENT } } : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef1fb" },
    { media: "(prefers-color-scheme: dark)", color: "#060914" },
  ],
};

// Runs before paint so the saved theme applies without a flash.
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <header className="sticky top-3 z-40 mx-auto max-w-6xl px-4">
          <div className="glass flex h-14 items-center justify-between gap-4 rounded-2xl px-3 sm:px-4">
            <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight" aria-label={`${SITE_NAME} home`}>
              <Image
                src={LOGO_MARK}
                alt=""
                width={36}
                height={36}
                priority
                unoptimized
                className="h-9 w-9 rounded-xl shadow-lg shadow-indigo-500/30 dark:shadow-teal-500/30"
              />
              <span>{SITE_NAME}</span>
            </Link>
            <div className="flex items-center gap-2">
              <UserMenu />
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-10 outline-none">
          {children}
        </main>
        <Footer />
        {ADSENSE_CLIENT && <AdGuard />}
      </body>
    </html>
  );
}
