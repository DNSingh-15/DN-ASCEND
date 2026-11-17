import Link from "next/link";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/learning", label: "Learning" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

export default function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-4 pb-8">
      <div className="glass rounded-2xl px-6 py-6">
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-muted transition hover:text-[var(--fg)]">
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="mt-5 border-t border-[var(--border)] pt-5 text-center text-sm text-muted">© 2026 TechOrbitInd. All rights reserved.</p>
      </div>
    </footer>
  );
}
