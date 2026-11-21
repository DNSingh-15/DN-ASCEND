import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { getAllTech, getPractice, getTech, getVideos, youtubeSearchUrl } from "@/lib/content";
import { breadcrumbJsonLd, crumbsFor, relatedTopics, topicJsonLd, topicMeta, topicPath } from "@/lib/seo";
import AdUnit from "@/components/AdUnit";
import JsonLd from "@/components/JsonLd";
import ShareButtons from "@/components/ShareButtons";
import LeetCodePractice from "@/components/LeetCodePractice";
import Markdown from "@/components/Markdown";
import { RelatedLinks, TopicBreadcrumbs, TopicHeader, TopicPager } from "@/components/TopicParts";
import VideoCard from "@/components/VideoCard";

// Full notes for signed-in users. Visitors without a session never reach this page: the proxy serves them the
// public preview (src/app/preview/[tech]/[topic]) at the same URL instead.

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

export default async function TopicPage({ params }: Props) {
  const { tech, topic } = await params;
  const t = getTech(tech);
  const index = t?.topics.findIndex((x) => x.slug === topic) ?? -1;
  if (!t || index < 0) notFound();

  const tp = t.topics[index];
  const videos = getVideos(t.slug, tp.slug);
  const practice = getPractice(t.slug, tp.slug);

  return (
    <div className="mx-auto max-w-4xl space-y-8" style={{ "--accent": t.color } as CSSProperties}>
      <JsonLd data={topicJsonLd(t, tp)} />
      <JsonLd data={breadcrumbJsonLd(crumbsFor(t, tp))} />
      <TopicBreadcrumbs t={t} tp={tp} />
      <TopicHeader t={t} tp={tp} index={index} />

      <article className="glass glass-strong prose prose-slate dark:prose-invert max-w-none rounded-3xl p-6 sm:p-10 prose-headings:scroll-mt-24 prose-pre:text-sm prose-pre:rounded-xl">
        <Markdown>{tp.body}</Markdown>
      </article>

      <ShareButtons path={topicPath(t, tp)} title={tp.title} />

      <AdUnit />

      <LeetCodePractice problems={practice} />

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
          <div className="glass rounded-2xl p-6 text-sm text-muted">
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

      <RelatedLinks heading="Related topics" links={relatedTopics(t, tp)} />
      <TopicPager t={t} index={index} />
    </div>
  );
}
