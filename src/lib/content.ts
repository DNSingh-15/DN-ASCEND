import path from "node:path";
import videosJson from "../../data/videos.json";
import practiceJson from "../../data/leetcode-practice.json";
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
  { id: "fullstack", label: "Full Stack", icon: "🧑‍💻", blurb: "Frontend, backend and databases", color: "#14b8a6" },
  { id: "cloud", label: "Cloud", icon: "☁️", blurb: "AWS and Azure", color: "#0ea5e9" },
  { id: "ai", label: "AI", icon: "🤖", blurb: "GenAI, agents and MCP", color: "#06b6d4" },
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
  /** Step heading such as "Step 1: Fundamentals"; empty when the notes have no groups. */
  group: string;
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

export type Difficulty = "Easy" | "Medium" | "Hard";

export type LeetCodeProblem = {
  /** LeetCode title slug, which is also the URL path. */
  slug: string;
  id: number;
  title: string;
  difficulty: Difficulty;
  /** Suggested solving time in minutes. */
  minutes: number;
  /** One line on what the problem tests. */
  tests: string;
};

const practice = practiceJson as Record<string, LeetCodeProblem[]>;

/** LeetCode practice for a topic. Maintained in data/leetcode-practice.json, checked by scripts/verify-leetcode.mjs. */
export function getPractice(techSlug: string, topicSlug: string): LeetCodeProblem[] {
  return practice[`${techSlug}/${topicSlug}`] ?? [];
}

export function leetCodeUrl(slug: string): string {
  return `https://leetcode.com/problems/${slug}/`;
}

export function youtubeSearchUrl(query: string): string {
  return "https://www.youtube.com/results?search_query=" + encodeURIComponent(query + " hindi");
}

export function groupByCategory(techs: Tech[]): [string, Tech[]][] {
  const map = new Map<string, Tech[]>();
  for (const t of techs) map.set(t.category, [...(map.get(t.category) ?? []), t]);
  return [...map.entries()];
}
