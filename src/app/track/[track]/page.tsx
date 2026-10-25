import Link from "next/link";
import { notFound } from "next/navigation";
import SystemDesignTabs from "@/components/SystemDesignTabs";
import { TRACKS, getTrack, groupByCategory, techsInTrack } from "@/lib/content";

type Props = { params: Promise<{ track: string }> };

export function generateStaticParams() {
  return TRACKS.map((t) => ({ track: t.id }));
}

export async function generateMetadata({ params }: Props) {
  const { track } = await params;
  return { title: getTrack(track)?.label ?? "Not found" };
}

export default async function TrackPage({ params }: Props) {
  const { track: id } = await params;
  const track = getTrack(id);
  if (!track) notFound();

  const techs = techsInTrack(track.id);

  // System Design: Low Level / High Level tabs, each straight to its topics.
  const tabs = techs
    .filter((t) => t.level)
    .sort((a, b) => (a.level === "lld" ? -1 : 1) - (b.level === "lld" ? -1 : 1))
    .map((t) => ({
      slug: t.slug,
      label: t.level === "lld" ? "Low Level Design" : "High Level Design",
      note: t.description,
      color: t.color,
      topics: t.topics.map((tp) => ({ slug: tp.slug, title: tp.title, summary: tp.summary })),
    }));

  return (
    <div className="space-y-8">
      <nav className="text-sm text-muted">
        <Link href="/" className="hover:text-[var(--fg)]">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--fg)]">{track.label}</span>
      </nav>

      <header className="flex items-center gap-4">
        <span className="text-5xl">{track.icon}</span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{track.label}</h1>
          <p className="text-muted">{track.blurb}</p>
        </div>
      </header>

      {tabs.length > 0 ? (
        <SystemDesignTabs tabs={tabs} />
      ) : (
        groupByCategory(techs).map(([category, items]) => (
          <section key={category} className="space-y-3">
            {groupByCategory(techs).length > 1 && (
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">{category}</h2>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((t) => (
                <Link
                  key={t.slug}
                  href={`/${t.slug}`}
                  className="card group relative overflow-hidden rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <span className="absolute inset-x-0 top-0 h-1" style={{ background: t.color }} aria-hidden />
                  <span className="text-3xl">{t.icon}</span>
                  <h3 className="mt-3 text-lg font-semibold group-hover:underline">{t.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{t.description}</p>
                  <p className="mt-3 text-sm font-medium" style={{ color: t.color }}>
                    {t.topics.length} topics →
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
