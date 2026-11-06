import type { CSSProperties } from "react";
import { leetCodeUrl, type Difficulty, type LeetCodeProblem } from "@/lib/content";

// Text and tint per difficulty. Dark-mode text is lightened to keep contrast on the glass background.
const DIFFICULTY: Record<Difficulty, string> = {
  Easy: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/40 dark:text-emerald-300",
  Medium: "bg-amber-500/15 text-amber-700 ring-amber-500/40 dark:text-amber-300",
  Hard: "bg-rose-500/15 text-rose-700 ring-rose-500/40 dark:text-rose-300",
};

/** "LeetCode Practice" section shown under a DSA topic. Renders nothing when the topic has no problems. */
export default function LeetCodePractice({ problems }: { problems: LeetCodeProblem[] }) {
  if (problems.length === 0) return null;

  return (
    // Pinned to the theme accent so the buttons stay teal/cyan even on topics with another track color.
    <section className="space-y-4" aria-labelledby="leetcode-practice" style={{ "--accent": "var(--accent-default)" } as CSSProperties}>
      <div>
        <h2 id="leetcode-practice" className="text-xl font-semibold">
          🧩 LeetCode Practice
        </h2>
        <p className="text-sm text-muted">Apply this topic on real interview problems. Opens on leetcode.com.</p>
      </div>

      <ul className="grid gap-4 md:grid-cols-2">
        {problems.map((p) => (
          <li key={p.slug} className="glass glass-hover group relative flex flex-col gap-3 overflow-hidden rounded-2xl p-5">
            <span className="accent-orb" aria-hidden />
            <div className="relative flex flex-wrap items-center gap-2 text-xs font-medium">
              <span className="text-muted">#{p.id}</span>
              <span className={`rounded-full px-2.5 py-0.5 ring-1 ${DIFFICULTY[p.difficulty]}`}>{p.difficulty}</span>
              <span className="glass-tile rounded-full px-2.5 py-0.5">
                <span aria-hidden>⏱ </span>
                ~{p.minutes} min<span className="sr-only"> recommended solving time</span>
              </span>
            </div>
            <h3 className="relative text-lg font-semibold leading-snug">{p.title}</h3>
            <p className="relative flex-1 text-sm text-muted">{p.tests}</p>
            <a
              href={leetCodeUrl(p.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="accent-chip relative inline-flex w-fit items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Solve on LeetCode <span aria-hidden>↗</span>
              <span className="sr-only"> {p.title} (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
