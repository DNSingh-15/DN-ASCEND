import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// When a notes file last changed, for the sitemap's <lastmod>, the TechArticle dateModified and the "Updated" line on topics.
// The last git commit that touched the file is the real edit date; the file's mtime is only a fallback, because a fresh
// clone (as on every Netlify build) gives every file the same mtime. Pages using this are generated at build time.

const cache = new Map<string, Date>();

function gitDate(file: string): Date | null {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", file], { cwd: process.cwd(), encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 5000 }).trim();
    const d = out ? new Date(out) : null;
    return d && !Number.isNaN(d.getTime()) ? d : null;
  } catch {
    return null;
  }
}

function mtime(slug: string): Date {
  try {
    return fs.statSync(path.join(process.cwd(), "content", `${slug}.md`)).mtime;
  } catch {
    return new Date();
  }
}

export function notesUpdated(slug: string): Date {
  let d = cache.get(slug);
  if (!d) {
    d = gitDate(`content/${slug}.md`) ?? mtime(slug);
    cache.set(slug, d);
  }
  return d;
}
