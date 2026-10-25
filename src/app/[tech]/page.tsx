import Link from "next/link";
import { notFound } from "next/navigation";
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

      <header className="flex items-center gap-4">
        <span className="text-5xl">{t.icon}</span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.name}</h1>
          <p className="mt-1 max-w-3xl text-muted">{t.description}</p>
        </div>
      </header>

      <ol className="grid gap-3 md:grid-cols-2">
        {t.topics.map((topic, i) => (
          <li key={topic.slug}>
            <Link
              href={`/${t.slug}/${topic.slug}`}
              className="card group flex h-full gap-4 rounded-xl p-4 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                style={{ background: t.color }}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold group-hover:underline">{topic.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{topic.summary}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
