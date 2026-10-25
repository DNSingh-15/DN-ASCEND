// Shared markdown parser for content/*.md. Used by the Next.js app (via src/lib/content.ts)
// and by the video finder script, so both agree on topic slugs.
import fs from "node:fs";
import path from "node:path";

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[`'"?.,()/:&+]/g, " ")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: raw.slice(m[0].length) };
}

export function parseTech(slug, raw) {
  const { meta, body } = parseFrontmatter(raw);
  const topics = [];
  let current = null;
  let inFence = false;

  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    const heading = !inFence && line.match(/^## (.+)$/);
    if (heading) {
      current = { title: heading[1].trim(), video: "", summary: "", lines: [] };
      topics.push(current);
      continue;
    }
    if (!current) continue;
    if (!current.lines.length && !inFence) {
      const kv = line.match(/^(video|summary):\s*(.*)$/);
      if (kv) {
        current[kv[1]] = kv[2].trim();
        continue;
      }
      if (!line.trim()) continue;
    }
    current.lines.push(line);
  }

  const used = new Set();
  return {
    slug,
    name: meta.name ?? slug,
    icon: meta.icon ?? "📘",
    category: meta.category ?? "Other",
    track: meta.track ?? "fullstack",
    level: meta.level ?? "",
    color: meta.color ?? "#6366f1",
    order: Number(meta.order ?? 99),
    description: meta.description ?? "",
    topics: topics.map((t) => {
      let s = slugify(t.title) || "topic";
      while (used.has(s)) s += "-2";
      used.add(s);
      return {
        slug: s,
        title: t.title,
        videoQuery: t.video || `${meta.name ?? slug} ${t.title}`,
        summary: t.summary,
        body: t.lines.join("\n").trim(),
      };
    }),
  };
}

export function loadAll(contentDir) {
  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parseTech(f.replace(/\.md$/, ""), fs.readFileSync(path.join(contentDir, f), "utf8")))
    .sort((a, b) => a.order - b.order);
}
