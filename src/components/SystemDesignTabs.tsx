"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";

export type TabData = {
  slug: string;
  label: string;
  note: string;
  color: string;
  topics: { slug: string; title: string; summary: string; group: string }[];
};

export default function SystemDesignTabs({ tabs }: { tabs: TabData[] }) {
  const [active, setActive] = useState(tabs[0].slug);

  // Restore the tab from the URL hash after mount (avoids a hydration mismatch).
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (tabs.some((t) => t.slug === hash)) setActive(hash);
  }, [tabs]);

  function select(slug: string) {
    setActive(slug);
    history.replaceState(null, "", `#${slug}`);
  }

  const current = tabs.find((t) => t.slug === active) ?? tabs[0];

  // Keep topics in order, starting a new section whenever the step heading changes.
  const groups: { group: string; topics: TabData["topics"] }[] = [];
  for (const topic of current.topics) {
    const last = groups[groups.length - 1];
    if (last && last.group === topic.group) last.topics.push(topic);
    else groups.push({ group: topic.group, topics: [topic] });
  }

  return (
    <div className="space-y-6">
      <div role="tablist" className="glass inline-flex rounded-2xl p-1.5">
        {tabs.map((t) => (
          <button
            key={t.slug}
            role="tab"
            aria-selected={t.slug === current.slug}
            onClick={() => select(t.slug)}
            className={`rounded-xl px-5 py-2 text-sm font-semibold transition ${
              t.slug === current.slug ? "accent-chip" : "text-muted hover:text-[var(--fg)]"
            }`}
            style={{ "--accent": t.color } as CSSProperties}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="text-muted">{current.note}</p>

      <div className="space-y-8" style={{ "--accent": current.color } as CSSProperties}>
        {groups.map(({ group, topics }) => {
          // "Step 3: Cache" -> badge "Step 3" + title "Cache"
          const [badge, ...rest] = group.split(":");
          const title = rest.join(":").trim();
          return (
            <section key={group || "all"} className="space-y-3">
              {group && (
                <h2 className="flex items-center gap-3">
                  <span className="accent-chip rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide">
                    {title ? badge : group}
                  </span>
                  {title && <span className="text-lg font-semibold">{title}</span>}
                </h2>
              )}
              <ul className="grid gap-3 md:grid-cols-2">
                {topics.map((topic) => (
                  <li key={topic.slug}>
                    <Link
                      href={`/${current.slug}/${topic.slug}`}
                      className="glass glass-hover group flex h-full items-start gap-3 rounded-2xl p-4"
                    >
                      <span
                        className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]"
                        aria-hidden
                      />
                      <div className="min-w-0">
                        <h3 className="font-semibold leading-snug">{topic.title}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-muted">{topic.summary}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
