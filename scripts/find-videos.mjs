// Finds Hindi YouTube videos for every topic and writes data/videos.json.
// Run: npm run find-videos            (all topics)
//      npm run find-videos -- react   (only topics whose tech slug matches)
//
// Ranking per topic: Apna College first, then other known Hindi channels,
// then any result whose title is clearly Hindi. Max 3 videos per topic.
// If no Hindi video is found, up to 2 English videos are used instead (lang: "en").
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadAll } from "./content.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
const OUT = path.join(root, "data", "videos.json");
const MAX_PER_TOPIC = 3;
const DELAY_MS = 900;

const APNA = /apna college|shradha khapra/i;
const HINDI_CHANNELS =
  /codewithharry|chai aur code|akshay saini|codehelp|babbar|geeky shows|code bless you|roadsidecoder|engineer codewala|the coding monk|technical suneja|love babbar|hitesh|thapa|sheryians|kunal kushwaha|cyber ?clan|jenny|dev ?ed|bhai|coder/i;
const HINDI_TITLE = /[ऀ-ॿ]|hindi|हिंदी|हिन्दी/i;

const STOP = new Set(["the", "and", "with", "for", "of", "in", "a", "to", "js", "vs"]);

async function fetchHtml(url) {
  let lastErr;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "en-US,en;q=0.9" },
      });
      if (res.ok) return await res.text();
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastErr = err;
    }
    await sleep(2000 * (attempt + 1)); // back off when YouTube throttles us
  }
  throw lastErr;
}

async function search(query) {
  const url = "https://www.youtube.com/results?search_query=" + encodeURIComponent(query);
  const html = await fetchHtml(url);
  const m = html.match(/var ytInitialData = (\{.*?\});<\/script>/s);
  if (!m) return [];
  const out = [];
  const walk = (node) => {
    if (!node || typeof node !== "object") return;
    if (node.videoRenderer) {
      const v = node.videoRenderer;
      out.push({
        id: v.videoId,
        title: v.title?.runs?.map((r) => r.text).join("") ?? "",
        channel: v.ownerText?.runs?.[0]?.text ?? "",
        length: v.lengthText?.simpleText ?? "",
      });
      return;
    }
    for (const k in node) walk(node[k]);
  };
  walk(JSON.parse(m[1]));
  return out;
}

// Words that must appear in the title for a technology, so an Apna College C++ or
// generic JavaScript video is never attached to a TypeScript topic.
const TECH_WORDS = {
  javascript: ["javascript", "js"],
  typescript: ["typescript"],
  react: ["react"],
  nextjs: ["next.js", "nextjs", "next js"],
  nodejs: ["node"],
  fastapi: ["fastapi", "fast api"],
  python: ["python"],
  postgresql: ["postgres", "sql"],
  aws: ["aws", "amazon"],
  azure: ["azure"],
};

// Relevant = title has one of the technology's words (when it has any) AND shares at
// least one meaningful topic word beyond the technology name.
function relevant(video, query, techSlug) {
  const title = video.title.toLowerCase();
  const techWords = TECH_WORDS[techSlug] ?? [];
  if (techWords.length && !techWords.some((w) => title.includes(w))) return false;
  const topicWords = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !STOP.has(w) && !techWords.includes(w));
  if (topicWords.length === 0) return true;
  const hits = topicWords.filter((w) => title.includes(w)).length;
  // Techs without a fixed keyword (system design, AI) need two matches to avoid noise.
  return hits >= (techWords.length ? 1 : Math.min(2, topicWords.length));
}

function isHindi(video) {
  return HINDI_TITLE.test(video.title) || HINDI_CHANNELS.test(video.channel) || APNA.test(video.channel);
}

async function findFor(query, techSlug) {
  const picked = [];
  const seen = new Set();
  const ok = (v) => relevant(v, query, techSlug);
  const add = (lang, max) => (v) => {
    if (!v.id || seen.has(v.id) || picked.length >= max) return;
    seen.add(v.id);
    picked.push({ ...v, lang });
  };
  const addHindi = add("hi", MAX_PER_TOPIC);

  const apna = (await search(`apna college ${query} hindi`)).filter((v) => APNA.test(v.channel));
  apna.filter(ok).forEach(addHindi);
  await sleep(DELAY_MS);

  const generic = (await search(`${query} hindi`)).filter(isHindi);
  generic.filter((v) => APNA.test(v.channel) && ok(v)).forEach(addHindi);
  generic.filter((v) => HINDI_CHANNELS.test(v.channel) && ok(v)).forEach(addHindi);
  generic.filter(ok).forEach(addHindi);

  // No Hindi video exists for this topic: fall back to English ones (marked lang: "en").
  if (picked.length === 0) {
    await sleep(DELAY_MS);
    const english = (await search(`${query} tutorial`)).filter(ok);
    english.forEach(add("en", 2));
  }
  return picked;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const filter = process.argv[2];
const techs = loadAll(path.join(root, "content")).filter((t) => !filter || t.slug === filter);
const existing = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : {};
const result = filter ? existing : {};

let done = 0;
let total = techs.reduce((n, t) => n + t.topics.length, 0);
for (const t of techs) {
  for (const topic of t.topics) {
    const key = `${t.slug}/${topic.slug}`;
    try {
      result[key] = await findFor(topic.videoQuery, t.slug);
    } catch (err) {
      console.error(`! ${key}: ${err.message}`);
      result[key] = result[key] ?? [];
    }
    done++;
    console.log(`[${done}/${total}] ${key} -> ${result[key].length} video(s)`);
    await sleep(DELAY_MS);
  }
}

fs.writeFileSync(OUT, JSON.stringify(result, null, 2) + "\n");
const empty = Object.entries(result).filter(([, v]) => v.length === 0).map(([k]) => k);
console.log(`\nWrote ${OUT}`);
const englishOnly = Object.values(result).filter((v) => v.length && v.every((x) => x.lang === "en")).length;
console.log(`Topics using English fallback: ${englishOnly}`);
console.log(`Topics with no video at all: ${empty.length}`);
for (const k of empty) console.log("  - " + k);
