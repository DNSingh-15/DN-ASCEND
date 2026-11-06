// Checks data/leetcode-practice.json against LeetCode itself and the DSA topics in content/.
//
//   node scripts/verify-leetcode.mjs            check only; exits 1 on any problem
//   node scripts/verify-leetcode.mjs --write    also fill in id, title and difficulty from LeetCode
//
// Each entry only needs { slug, minutes, tests }. The official title, number and difficulty are fetched
// from LeetCode so they cannot drift from what is shown on leetcode.com.
import fs from "node:fs";
import path from "node:path";
import { loadAll } from "./content.mjs";

const root = path.resolve(import.meta.dirname, "..");
const file = path.join(root, "data", "leetcode-practice.json");
const write = process.argv.includes("--write");
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const problems = [];

async function lookup(slug) {
  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json", Referer: "https://leetcode.com" },
    body: JSON.stringify({
      query: "query($s:String!){ question(titleSlug:$s){ questionFrontendId title difficulty isPaidOnly } }",
      variables: { s: slug },
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()).data?.question ?? null;
}

// 1. Every DSA topic has 1-2 problems, and every key matches a real topic.
const dsaKeys = new Set();
for (const tech of loadAll(path.join(root, "content")).filter((t) => t.track === "dsa")) {
  for (const topic of tech.topics) dsaKeys.add(`${tech.slug}/${topic.slug}`);
}
for (const key of dsaKeys) {
  const n = data[key]?.length ?? 0;
  if (n < 1 || n > 2) problems.push(`${key}: has ${n} problems (need 1-2)`);
}
for (const key of Object.keys(data)) if (!dsaKeys.has(key)) problems.push(`${key}: not a DSA topic`);

// 2. No problem is reused, and each is verified against LeetCode.
const seen = new Map();
for (const [key, list] of Object.entries(data)) {
  for (const p of list) {
    if (seen.has(p.slug)) problems.push(`${p.slug}: used in both ${seen.get(p.slug)} and ${key}`);
    seen.set(p.slug, key);
    if (!p.tests || !p.minutes) problems.push(`${key}/${p.slug}: missing "tests" or "minutes"`);
  }
}

const cache = new Map();
for (const [key, list] of Object.entries(data)) {
  for (const p of list) {
    if (!cache.has(p.slug)) {
      try {
        cache.set(p.slug, await lookup(p.slug));
      } catch (e) {
        problems.push(`${p.slug}: lookup failed (${e.message})`);
        cache.set(p.slug, undefined);
      }
    }
    const q = cache.get(p.slug);
    if (q === undefined) continue;
    if (!q) {
      problems.push(`${key}/${p.slug}: no such LeetCode problem`);
      continue;
    }
    if (q.isPaidOnly) problems.push(`${key}/${p.slug}: premium-only problem`);
    const real = { id: Number(q.questionFrontendId), title: q.title, difficulty: q.difficulty };
    if (write) Object.assign(p, real);
    else if (p.id !== real.id || p.title !== real.title || p.difficulty !== real.difficulty) {
      problems.push(`${key}/${p.slug}: stored ${p.id} ${p.title} ${p.difficulty} but LeetCode says ${real.id} ${real.title} ${real.difficulty}`);
    }
  }
}

if (write) {
  // Keep the id/title/difficulty fields right after slug for readability.
  const ordered = Object.fromEntries(
    Object.entries(data).map(([k, list]) => [
      k,
      list.map(({ slug, id, title, difficulty, minutes, tests }) => ({ slug, id, title, difficulty, minutes, tests })),
    ]),
  );
  fs.writeFileSync(file, JSON.stringify(ordered, null, 2) + "\n");
}

const total = Object.values(data).reduce((n, l) => n + l.length, 0);
console.log(`${dsaKeys.size} DSA topics, ${Object.keys(data).length} with practice, ${total} problems (${seen.size} unique)`);
if (problems.length) {
  console.error(problems.map((p) => "FAIL " + p).join("\n"));
  process.exit(1);
}
console.log(write ? "OK, verified and written" : "OK, all verified");
