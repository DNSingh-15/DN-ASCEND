import Link from "next/link";
import { getTrack, type Tech, type Topic } from "@/lib/content";
import type { RelatedLink } from "@/lib/seo";

// Pieces shared by the full topic page (signed in) and its public preview (signed out), so both look the same.

export function TopicBreadcrumbs({ t, tp }: { t: Tech; tp: Topic }) {
  const track = getTrack(t.track);
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-muted">
      <Link href="/learning" className="hover:text-[var(--fg)]">
        Dashboard
      </Link>
      <span>/</span>
      {track && (
        <>
          <Link href={`/track/${track.id}${t.level ? `#${t.slug}` : ""}`} className="hover:text-[var(--fg)]">
            {track.label}
          </Link>
          <span>/</span>
        </>
      )}
      <Link href={`/${t.slug}`} className="hover:text-[var(--fg)]">
        {t.name}
      </Link>
      <span>/</span>
      <span className="text-[var(--fg)]">{tp.title}</span>
    </nav>
  );
}

export function TopicHeader({ t, tp, index }: { t: Tech; tp: Topic; index: number }) {
  return (
    <header className="space-y-3">
      <p className="glass-tile inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium" style={{ color: t.color }}>
        {t.icon} {t.name} · Topic {index + 1} of {t.topics.length}
      </p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{tp.title}</h1>
      {tp.summary && <p className="text-lg text-muted">{tp.summary}</p>}
    </header>
  );
}

/** Links to related topics: plain anchors in the HTML, so search engines can follow them too. */
export function RelatedLinks({ heading, links }: { heading: string; links: RelatedLink[] }) {
  if (links.length === 0) return null;
  return (
    <section aria-labelledby="related-heading" className="space-y-3">
      <h2 id="related-heading" className="text-xl font-semibold">
        {heading}
      </h2>
      <ul className="grid gap-3 md:grid-cols-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="glass glass-hover group flex h-full items-start gap-3 rounded-2xl p-4">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" aria-hidden />
              <div className="min-w-0">
                <h3 className="font-semibold leading-snug">{l.title}</h3>
                <p className="mt-1 line-clamp-1 text-sm text-muted">{l.note}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TopicPager({ t, index }: { t: Tech; index: number }) {
  const prev = t.topics[index - 1];
  const next = t.topics[index + 1];
  return (
    <nav aria-label="Previous and next topic" className="grid gap-3 border-t border-[var(--border)] pt-6 sm:grid-cols-2">
      {prev ? (
        <Link href={`/${t.slug}/${prev.slug}`} className="glass glass-hover rounded-2xl p-4">
          <p className="text-xs text-muted">← Previous</p>
          <p className="font-medium">{prev.title}</p>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={`/${t.slug}/${next.slug}`} className="glass glass-hover rounded-2xl p-4 text-right sm:col-start-2">
          <p className="text-xs text-muted">Next →</p>
          <p className="font-medium">{next.title}</p>
        </Link>
      ) : null}
    </nav>
  );
}
