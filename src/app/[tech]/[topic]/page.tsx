import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTech, getTech, getTrack, getVideos, youtubeSearchUrl } from "@/lib/content";
import Markdown from "@/components/Markdown";
import VideoCard from "@/components/VideoCard";

type Props = { params: Promise<{ tech: string; topic: string }> };

export function generateStaticParams() {
  return getAllTech().flatMap((t) => t.topics.map((topic) => ({ tech: t.slug, topic: topic.slug })));
}

export async function generateMetadata({ params }: Props) {
  const { tech, topic } = await params;
  const t = getTech(tech);
  const tp = t?.topics.find((x) => x.slug === topic);
  return { title: tp && t ? `${tp.title} · ${t.name}` : "Not found" };
}

export default async function TopicPage({ params }: Props) {
  const { tech, topic } = await params;
  const t = getTech(tech);
  const index = t?.topics.findIndex((x) => x.slug === topic) ?? -1;
  if (!t || index < 0) notFound();

  const tp = t.topics[index];
  const prev = t.topics[index - 1];
  const next = t.topics[index + 1];
  const videos = getVideos(t.slug, tp.slug);
  const track = getTrack(t.track);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-muted">
        <Link href="/" className="hover:text-[var(--fg)]">
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

      <header className="space-y-3">
        <p className="text-sm font-medium" style={{ color: t.color }}>
          {t.icon} {t.name} · Topic {index + 1} of {t.topics.length}
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{tp.title}</h1>
        {tp.summary && <p className="text-lg text-muted">{tp.summary}</p>}
      </header>

      <article className="card prose prose-slate dark:prose-invert max-w-none rounded-2xl p-6 sm:p-8 prose-headings:scroll-mt-20 prose-pre:text-sm">
        <Markdown>{tp.body}</Markdown>
      </article>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">📺 Watch &amp; learn</h2>
            <p className="text-sm text-muted">Hindi videos first (Apna College preferred), English if none found.</p>
          </div>
          <a
            href={youtubeSearchUrl(tp.videoQuery)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-red-500 hover:underline"
          >
            More on YouTube ↗
          </a>
        </div>

        {videos.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {videos.map((v, i) => (
              <VideoCard key={v.id} video={v} featured={i === 0} />
            ))}
          </div>
        ) : (
          <div className="card rounded-xl p-6 text-sm text-muted">
            No video listed for this topic yet.{" "}
            <a
              href={youtubeSearchUrl(tp.videoQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-red-500 hover:underline"
            >
              Search on YouTube ↗
            </a>
          </div>
        )}
      </section>

      <nav className="grid gap-3 border-t border-[var(--border)] pt-6 sm:grid-cols-2">
        {prev ? (
          <Link href={`/${t.slug}/${prev.slug}`} className="card rounded-xl p-4 hover:shadow-md">
            <p className="text-xs text-muted">← Previous</p>
            <p className="font-medium">{prev.title}</p>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/${t.slug}/${next.slug}`}
            className="card rounded-xl p-4 text-right hover:shadow-md sm:col-start-2"
          >
            <p className="text-xs text-muted">Next →</p>
            <p className="font-medium">{next.title}</p>
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
