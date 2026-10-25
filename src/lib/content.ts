import path from "node:path";
import videosJson from "../../data/videos.json";
import { loadAll } from "../../scripts/content.mjs";

export type Video = {
  id: string;
  title: string;
  channel: string;
  length?: string;
  /** "hi" = Hindi, "en" = English fallback used when no Hindi video was found. */
  lang?: "hi" | "en";
};

export type TrackId = "fullstack" | "cloud" | "ai" | "dsa" | "system-design";

export type TrackInfo = { id: TrackId; label: string; icon: string; blurb: string; color: string };

export const TRACKS: TrackInfo[] = [
  { id: "fullstack", label: "Full Stack", icon: "🧑‍💻", blurb: "Frontend, backend and databases", color: "#6366f1" },
  { id: "cloud", label: "Cloud", icon: "☁️", blurb: "AWS and Azure", color: "#0ea5e9" },
  { id: "ai", label: "AI", icon: "🤖", blurb: "GenAI, agents and MCP", color: "#a855f7" },
  { id: "dsa", label: "DSA", icon: "🧮", blurb: "Data structures and algorithms", color: "#10b981" },
  { id: "system-design", label: "System Design", icon: "🏗️", blurb: "Low level and high level design", color: "#f97316" },
];

export function getTrack(id: string): TrackInfo | undefined {
  return TRACKS.find((t) => t.id === id);
}

export function techsInTrack(id: TrackId): Tech[] {
  return getAllTech().filter((t) => t.track === id);
}

export type Topic = {
  slug: string;
  title: string;
  videoQuery: string;
  summary: string;
  body: string;
};

export type Tech = {
  slug: string;
  name: string;
  icon: string;
  category: string;
  track: TrackId;
  /** "lld" | "hld" for System Design, empty otherwise. */
  level: string;
  color: string;
  order: number;
  description: string;
  topics: Topic[];
};

const videos = videosJson as Record<string, Video[]>;

let cache: Tech[] | null = null;

export function getAllTech(): Tech[] {
  if (!cache || process.env.NODE_ENV === "development") {
    cache = loadAll(path.join(process.cwd(), "content")) as Tech[];
  }
  return cache;
}

export function getTech(slug: string): Tech | undefined {
  return getAllTech().find((t) => t.slug === slug);
}

export function getVideos(techSlug: string, topicSlug: string): Video[] {
  return videos[`${techSlug}/${topicSlug}`] ?? [];
}

export function youtubeSearchUrl(query: string): string {
  return "https://www.youtube.com/results?search_query=" + encodeURIComponent(query + " hindi");
}

export function groupByCategory(techs: Tech[]): [string, Tech[]][] {
  const map = new Map<string, Tech[]>();
  for (const t of techs) map.set(t.category, [...(map.get(t.category) ?? []), t]);
  return [...map.entries()];
}
