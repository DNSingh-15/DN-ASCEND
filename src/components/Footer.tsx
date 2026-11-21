import Link from "next/link";
import { TRACKS } from "@/lib/content";
import { SITE_NAME } from "@/lib/site";

// Site-wide footer: every track, the information pages and the legal pages, as plain crawlable links.
const COLUMNS = [
  {
    heading: "Learn",
    links: [{ href: "/learning", label: "Learning" }, ...TRACKS.map((t) => ({ href: `/track/${t.id}`, label: t.label }))],
  },
  {
    heading: SITE_NAME,
    links: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About Us" },
      { href: "/editorial-policy", label: "Editorial Policy" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-4 pb-8">
      <div className="glass rounded-2xl px-6 py-6">
        <nav aria-label="Footer" className="grid gap-6 text-sm sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h2 className="text-xs font-semibold uppercase tracking-wider">{col.heading}</h2>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-muted transition hover:text-[var(--fg)]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <p className="mt-5 border-t border-[var(--border)] pt-5 text-center text-sm text-muted">
          © {new Date().getFullYear()} TechOrbitInd. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
