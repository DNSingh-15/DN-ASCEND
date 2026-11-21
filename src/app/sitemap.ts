import type { MetadataRoute } from "next";
import { TRACKS, getAllTech, techsInTrack } from "@/lib/content";
import { notesUpdated } from "@/lib/content-dates";
import { isIndexableTopic, topicPath } from "@/lib/seo";
import { POLICY_UPDATED, absoluteUrl } from "@/lib/site";

// /sitemap.xml, generated at build time from content/. Lists every public, indexable URL:
// Home, every track, every course, every topic page with enough public text, and the information pages.
// Login, signup, the dashboard, the API and the internal /preview route are deliberately left out.
// Dates come from the last git commit of each notes file (see src/lib/content-dates.ts), so they stay real on fresh clones.

export default function sitemap(): MetadataRoute.Sitemap {
  const techs = getAllTech();
  const dates = new Map(techs.map((t) => [t.slug, notesUpdated(t.slug)]));
  const latest = (slugs: string[]) => new Date(Math.max(...slugs.map((s) => dates.get(s)!.getTime())));
  const siteUpdated = latest(techs.map((t) => t.slug));
  const policyUpdated = new Date(`${POLICY_UPDATED}T00:00:00+05:30`);

  return [
    { url: absoluteUrl("/"), lastModified: siteUpdated, changeFrequency: "weekly", priority: 1 },
    ...TRACKS.map((track) => ({
      url: absoluteUrl(`/track/${track.id}`),
      lastModified: latest(techsInTrack(track.id).map((t) => t.slug)),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...techs.map((t) => ({ url: absoluteUrl(`/${t.slug}`), lastModified: dates.get(t.slug), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...techs.flatMap((t) =>
      t.topics
        .filter((tp) => isIndexableTopic(t, tp))
        .map((tp) => ({ url: absoluteUrl(topicPath(t, tp)), lastModified: dates.get(t.slug), changeFrequency: "monthly" as const, priority: 0.6 })),
    ),
    { url: absoluteUrl("/about"), lastModified: policyUpdated, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/editorial-policy"), lastModified: policyUpdated, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy"), lastModified: policyUpdated, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), lastModified: policyUpdated, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/disclaimer"), lastModified: policyUpdated, changeFrequency: "yearly", priority: 0.2 },
  ];
}
