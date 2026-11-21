import Link from "next/link";
import type { ReactNode } from "react";
import { formatDate } from "@/lib/site";

/** Information pages linked from every info page, so readers (and crawlers) can move between them. */
const INFO_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/editorial-policy", label: "Editorial Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/contact", label: "Contact" },
];

/**
 * Shared layout for the About, Contact, Privacy, Terms, Disclaimer and Editorial Policy pages, built from the existing glass styles.
 * `updated` (YYYY-MM-DD) shows a "Last updated" line; `current` is this page's path, so it is left out of the "More" links.
 */
export default function InfoPage({
  title,
  intro,
  updated,
  current,
  children,
}: {
  title: string;
  intro: string;
  updated?: string;
  current?: string;
  children: ReactNode;
}) {
  const more = current ? INFO_LINKS.filter((l) => l.href !== current) : [];
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <span className="accent-orb" aria-hidden />
        <h1 className="relative text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="relative mt-2 text-muted sm:text-lg">{intro}</p>
        {updated && (
          <p className="relative mt-3 text-sm text-muted">
            Last updated: <time dateTime={updated}>{formatDate(updated)}</time>
          </p>
        )}
      </header>
      <div className="glass glass-strong prose prose-slate dark:prose-invert max-w-none rounded-3xl p-6 sm:p-10">{children}</div>
      {more.length > 0 && (
        <nav aria-label="More information" className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
          {more.map((l) => (
            <Link key={l.href} href={l.href} className="text-muted transition hover:text-[var(--fg)] hover:underline">
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
