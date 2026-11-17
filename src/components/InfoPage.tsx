import type { ReactNode } from "react";

/** Shared layout for the Contact, Privacy and Terms pages, built from the existing glass styles. */
export default function InfoPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <span className="accent-orb" aria-hidden />
        <h1 className="relative text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="relative mt-2 text-muted sm:text-lg">{intro}</p>
      </header>
      <div className="glass glass-strong prose prose-slate dark:prose-invert max-w-none rounded-3xl p-6 sm:p-10">{children}</div>
    </div>
  );
}
