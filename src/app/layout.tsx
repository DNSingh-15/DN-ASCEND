import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import UserMenu from "@/components/auth/UserMenu";

export const metadata: Metadata = {
  title: {
    default: "TechOrbitInd – Learn, Build & Grow",
    template: "%s · TechOrbitInd",
  },
  description: "Learn Full Stack, AI, Cloud, DSA & System Design with step-by-step notes, diagrams and hand-picked videos.",
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
        <header className="sticky top-3 z-40 mx-auto max-w-6xl px-4">
          <div className="glass flex h-14 items-center justify-between gap-4 rounded-2xl px-3 sm:px-4">
            <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30 dark:from-cyan-500 dark:via-teal-500 dark:to-sky-600 dark:shadow-teal-500/30">
                ⚡
              </span>
              <span>TechOrbitInd</span>
            </Link>
            <div className="flex items-center gap-2">
              <UserMenu />
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
