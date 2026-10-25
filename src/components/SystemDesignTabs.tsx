"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type TabData = {
  slug: string;
  label: string;
  note: string;
  color: string;
  topics: { slug: string; title: string; summary: string }[];
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

  return (
    <div className="space-y-6">
      <div role="tablist" className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--card)] p-1">
        {tabs.map((t) => (
          <button
            key={t.slug}
            role="tab"
            aria-selected={t.slug === current.slug}
            onClick={() => select(t.slug)}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
              t.slug === current.slug ? "text-white shadow" : "text-muted hover:text-[var(--fg)]"
            }`}
            style={t.slug === current.slug ? { background: t.color } : undefined}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="text-muted">{current.note}</p>

      <ol className="grid gap-3 md:grid-cols-2">
        {current.topics.map((topic, i) => (
          <li key={topic.slug}>
            <Link
              href={`/${current.slug}/${topic.slug}`}
              className="card group flex h-full gap-4 rounded-xl p-4 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                style={{ background: current.color }}
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold group-hover:underline">{topic.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{topic.summary}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
