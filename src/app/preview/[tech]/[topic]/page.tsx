import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { getAllTech, getPractice, getTech, getVideos } from "@/lib/content";
import { breadcrumbJsonLd, crumbsFor, previewExcerpt, relatedTopics, topicJsonLd, topicMeta, topicPath } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { RelatedLinks, TopicBreadcrumbs, TopicHeader, TopicPager } from "@/components/TopicParts";

// Public preview of a topic, for visitors without a session and search engines. Internal route: the proxy rewrites
// /<course>/<topic> here for signed-out requests (same URL, no redirect) and 308s direct visits back to the real URL.
//
// Security: only the title, summary, a short plain-text teaser and counts are rendered. The full notes, code, diagrams,
// video list and practice list are never passed to the output, so they are absent from the HTML and the RSC payload.

type Props = { params: Promise<{ tech: string; topic: string }> };

export function generateStaticParams() {
  return getAllTech().flatMap((t) => t.topics.map((topic) => ({ tech: t.slug, topic: topic.slug })));
}

// Only topics that exist in content/; any other path is a real 404.
export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const { tech, topic } = await params;
  const t = getTech(tech);
  const tp = t?.topics.find((x) => x.slug === topic);
  return t && tp ? topicMeta(t, tp) : { title: "Not found" };
}

function count(body: string, re: RegExp): number {
  return body.match(re)?.length ?? 0;
}

function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}

export default async function TopicPreviewPage({ params }: Props) {
  const { tech, topic } = await params;
  const t = getTech(tech);
  const index = t?.topics.findIndex((x) => x.slug === topic) ?? -1;
  if (!t || index < 0) notFound();

  const tp = t.topics[index];
  const excerpt = previewExcerpt(tp.body);
  const diagrams = count(tp.body, /^\s*```(flow|uml)\b/gm);
  const codeBlocks = count(tp.body, /^\s*```(?!flow\b|uml\b)/gm) / 2;
  const videos = getVideos(t.slug, tp.slug).length;
  const problems = getPractice(t.slug, tp.slug).length;
  const next = encodeURIComponent(topicPath(t, tp));

  const includes = [
    "Step-by-step notes with key points for interviews",
    codeBlocks > 0 && plural(Math.floor(codeBlocks), "code example"),
    diagrams > 0 && plural(diagrams, "diagram"),
    videos > 0 && plural(videos, "hand-picked video lesson"),
    problems > 0 && plural(problems, "LeetCode practice problem"),
  ].filter(Boolean) as string[];

  return (
    <div className="mx-auto max-w-4xl space-y-8" style={{ "--accent": t.color } as CSSProperties}>
      <JsonLd data={topicJsonLd(t, tp)} />
      <JsonLd data={breadcrumbJsonLd(crumbsFor(t, tp))} />
      <TopicBreadcrumbs t={t} tp={tp} />
      <TopicHeader t={t} tp={tp} index={index} />

      <article className="glass glass-strong prose prose-slate dark:prose-invert max-w-none rounded-3xl p-6 sm:p-10">
        {excerpt && <p>{excerpt}</p>}
        <h2>What this {t.name} topic covers</h2>
        <ul>
          {includes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="not-prose mt-8 flex flex-col gap-4 rounded-2xl border border-[var(--border)] p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            Create a free account or log in to read the full notes for <strong className="text-[var(--fg)]">{tp.title}</strong>.
          </p>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link href={`/signup?next=${next}`} rel="nofollow" className="accent-chip auth-submit rounded-xl px-4 py-2 text-sm font-semibold">
              Create free account
            </Link>
            <Link href={`/login?next=${next}`} rel="nofollow" className="glass-tile rounded-xl px-4 py-2 text-sm font-semibold transition hover:scale-[1.03]">
              Log in
            </Link>
          </div>
        </div>
      </article>

      <RelatedLinks heading="Related topics" links={relatedTopics(t, tp)} />
      <TopicPager t={t} index={index} />
    </div>
  );
}
