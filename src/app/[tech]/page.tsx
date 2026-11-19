import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { getAllTech, getTech, getTrack } from "@/lib/content";
import { breadcrumbJsonLd, courseJsonLd, courseMeta, crumbsFor, relatedCourses } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { RelatedLinks } from "@/components/TopicParts";

// Public course page: topic titles and one-line summaries only, so it is safe to show everyone and to index.

type Props = { params: Promise<{ tech: string }> };

export function generateStaticParams() {
  return getAllTech().map((t) => ({ tech: t.slug }));
}

// Only the courses in content/ exist; anything else is a real 404 (not a page that redirects to login).
export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const { tech } = await params;
  const t = getTech(tech);
  return t ? courseMeta(t) : { title: "Not found" };
}

export default async function TechPage({ params }: Props) {
  const { tech } = await params;
  const t = getTech(tech);
  if (!t) notFound();
  const track = getTrack(t.track);

  // Keep topics in order, starting a new section whenever the step heading changes.
  const groups: { group: string; topics: typeof t.topics }[] = [];
  for (const topic of t.topics) {
    const last = groups[groups.length - 1];
    if (last && last.group === topic.group) last.topics.push(topic);
    else groups.push({ group: topic.group, topics: [topic] });
  }

  return (
    <div className="space-y-8">
      <JsonLd data={courseJsonLd(t)} />
      <JsonLd data={breadcrumbJsonLd(crumbsFor(t))} />
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/learning" className="hover:text-[var(--fg)]">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        {track && (
          <>
            <Link href={`/track/${track.id}`} className="hover:text-[var(--fg)]">
              {track.label}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-[var(--fg)]">{t.name}</span>
      </nav>

      <header
        style={{ "--accent": t.color } as CSSProperties}
        className="glass relative flex items-center gap-5 overflow-hidden rounded-3xl p-6 sm:p-8"
      >
        <span className="accent-orb" aria-hidden />
        <span className="glass-tile flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-4xl">
          {t.icon}
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t.name} <span className="sr-only">tutorial and interview notes</span>
          </h1>
          <p className="mt-1 max-w-3xl text-muted">{t.description}</p>
        </div>
      </header>

      <div className="space-y-8" style={{ "--accent": t.color } as CSSProperties}>
        {groups.map(({ group, topics }) => {
          // "Step 3: Cache" -> badge "Step 3" + title "Cache"
          const [badge, ...rest] = group.split(":");
          const title = rest.join(":").trim();
          return (
            <section key={group || "all"} className="space-y-3">
              {group && (
                <h2 className="flex items-center gap-3">
                  <span className="accent-chip rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide">
                    {title ? badge : group}
                  </span>
                  {title && <span className="text-lg font-semibold">{title}</span>}
                </h2>
              )}
              <ul className="grid gap-3 md:grid-cols-2">
                {topics.map((topic) => (
                  <li key={topic.slug}>
                    <Link
                      href={`/${t.slug}/${topic.slug}`}
                      className="glass glass-hover group flex h-full items-start gap-3 rounded-2xl p-4"
                    >
                      <span
                        className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]"
                        aria-hidden
                      />
                      <div className="min-w-0">
                        <h3 className="font-semibold leading-snug">{topic.title}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-muted">{topic.summary}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <RelatedLinks heading="Keep learning" links={relatedCourses(t)} />
      </div>
    </div>
  );
}
