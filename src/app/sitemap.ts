import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { TRACKS, getAllTech } from "@/lib/content";
import { isIndexableTopic, topicPath } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

// /sitemap.xml, generated at build time from content/. Lists every public, indexable URL:
// Home, every track, every course, every topic page with enough public text, and the information pages.
// Login, signup, the dashboard, the API and the internal /preview route are deliberately left out.

/** Last edit time of one notes file, so Google can tell which pages changed. */
function contentModified(slug: string): Date {
  try {
    return fs.statSync(path.join(process.cwd(), "content", `${slug}.md`)).mtime;
  } catch {
    return new Date();
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const techs = getAllTech();
  const dates = new Map(techs.map((t) => [t.slug, contentModified(t.slug)]));
  const latest = (slugs: string[]) => new Date(Math.max(...slugs.map((s) => dates.get(s)!.getTime())));
  const siteUpdated = latest(techs.map((t) => t.slug));

  return [
    { url: absoluteUrl("/"), lastModified: siteUpdated, changeFrequency: "weekly", priority: 1 },
    ...TRACKS.map((track) => ({
      url: absoluteUrl(`/track/${track.id}`),
      lastModified: latest(techs.filter((t) => t.track === track.id).map((t) => t.slug)),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...techs.map((t) => ({ url: absoluteUrl(`/${t.slug}`), lastModified: dates.get(t.slug), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...techs.flatMap((t) =>
      t.topics
        .filter((tp) => isIndexableTopic(t, tp))
        .map((tp) => ({ url: absoluteUrl(topicPath(t, tp)), lastModified: dates.get(t.slug), changeFrequency: "monthly" as const, priority: 0.6 })),
    ),
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
