import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { getAllTech, getTech, getTrack } from "@/lib/content";

type Props = { params: Promise<{ tech: string }> };

export function generateStaticParams() {
  return getAllTech().map((t) => ({ tech: t.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { tech } = await params;
  const t = getTech(tech);
  return { title: t ? `${t.name} topics` : "Not found" };
}

export default async function TechPage({ params }: Props) {
  const { tech } = await params;
  const t = getTech(tech);
  if (!t) notFound();
  const track = getTrack(t.track);

  return (
    <div className="space-y-8">
      <nav className="text-sm text-muted">
        <Link href="/" className="hover:text-[var(--fg)]">
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
          <h1 className="text-3xl font-bold tracking-tight">{t.name}</h1>
          <p className="mt-1 max-w-3xl text-muted">{t.description}</p>
        </div>
      </header>

      <ol className="grid gap-4 md:grid-cols-2" style={{ "--accent": t.color } as CSSProperties}>
        {t.topics.map((topic, i) => (
          <li key={topic.slug}>
            <Link
              href={`/${t.slug}/${topic.slug}`}
              className="glass glass-hover group flex h-full gap-4 rounded-2xl p-4"
            >
              <span className="accent-chip flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold">{topic.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{topic.summary}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
