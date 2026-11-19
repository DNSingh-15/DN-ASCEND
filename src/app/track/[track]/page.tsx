import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import JsonLd from "@/components/JsonLd";
import SystemDesignTabs from "@/components/SystemDesignTabs";
import { TRACKS, getTrack, groupByCategory, techsInTrack } from "@/lib/content";
import { breadcrumbJsonLd, trackJsonLd, trackMeta } from "@/lib/seo";

// Public track page: lists the courses (or, for System Design, the topic titles) in one learning track.

type Props = { params: Promise<{ track: string }> };

export function generateStaticParams() {
  return TRACKS.map((t) => ({ track: t.id }));
}

// Only the five tracks exist; anything else is a real 404.
export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const { track } = await params;
  const t = getTrack(track);
  return t ? trackMeta(t) : { title: "Not found" };
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
      topics: t.topics.map((tp) => ({ slug: tp.slug, title: tp.title, summary: tp.summary, group: tp.group })),
    }));

  return (
    <div className="space-y-8">
      <JsonLd data={trackJsonLd(track)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: track.label, path: `/track/${track.id}` },
        ])}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/learning" className="hover:text-[var(--fg)]">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--fg)]">{track.label}</span>
      </nav>

      <header
        style={{ "--accent": track.color } as CSSProperties}
        className="glass relative flex items-center gap-5 overflow-hidden rounded-3xl p-6 sm:p-8"
      >
        <span className="accent-orb" aria-hidden />
        <span className="glass-tile flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-4xl">
          {track.icon}
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {track.label} <span className="sr-only">tutorials and learning roadmap</span>
          </h1>
          <p className="mt-1 text-muted">{track.blurb}</p>
        </div>
      </header>

      {tabs.length > 0 ? (
        <SystemDesignTabs tabs={tabs} />
      ) : (
        groupByCategory(techs).map(([category, items], _i, all) => (
          <section key={category} className="space-y-3">
            {all.length > 1 && (
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">{category}</h2>
            )}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((t) => (
                <Link
                  key={t.slug}
                  href={`/${t.slug}`}
                  style={{ "--accent": t.color } as CSSProperties}
                  className="glass glass-hover group relative overflow-hidden rounded-2xl p-5"
                >
                  <span className="accent-orb" aria-hidden />
                  <span className="glass-tile flex h-12 w-12 items-center justify-center rounded-xl text-2xl">
                    {t.icon}
                  </span>
                  {/* h3 under a category heading, h2 when the cards sit directly under the page title. */}
                  {all.length > 1 ? (
                    <h3 className="mt-4 text-lg font-semibold">{t.name}</h3>
                  ) : (
                    <h2 className="mt-4 text-lg font-semibold">{t.name}</h2>
                  )}
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{t.description}</p>
                  <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: t.color }}>
                    {t.topics.length} topics
                    <span className="transition-transform group-hover:translate-x-1">→</span>
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
