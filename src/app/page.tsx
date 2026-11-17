import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import GuestActions from "@/components/auth/GuestActions";
import { TRACKS, techsInTrack } from "@/lib/content";

// Public Home page: the entry point for everyone. Static, so it is served from the CDN; the Login / Create Account
// buttons appear client-side only for visitors without a session (see GuestActions).
export const metadata: Metadata = {
  title: { absolute: "TechOrbitInd – Learn, Build & Grow" },
  description: "Learn Full Stack, AI, Cloud, DSA & System Design with step-by-step notes, diagrams and hand-picked videos.",
};

export default function Home() {
  const totalTopics = TRACKS.reduce(
    (sum, track) => sum + techsInTrack(track.id).reduce((n, t) => n + t.topics.length, 0),
    0,
  );

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="glass relative overflow-hidden rounded-3xl px-6 py-10 sm:px-10 sm:py-14">
        <span className="accent-orb" style={{ "--accent": "var(--hero-accent)" } as CSSProperties} aria-hidden />
        <p className="glass-tile inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {TRACKS.length} tracks · {totalTopics} topics
        </p>
        <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
          Learn, build and grow with <span className="text-gradient">TechOrbitInd</span>
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-muted sm:text-lg">
          TechOrbitInd is a technology learning platform. Learn Full Stack, AI, Cloud, DSA &amp; System Design through
          step-by-step notes, diagrams and hand-picked videos, organised so you always know what to learn next.
        </p>
        <div className="relative mt-7 flex flex-wrap items-center gap-3">
          <Link href="/learning" className="accent-chip auth-submit rounded-xl px-5 py-2.5 text-[15px] font-semibold">
            Start Learning →
          </Link>
          <GuestActions />
        </div>
      </section>

      <section aria-labelledby="tracks-heading" className="space-y-4">
        <h2 id="tracks-heading" className="text-sm font-semibold uppercase tracking-wider text-muted">
          What you can learn
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TRACKS.map((track) => {
            const topics = techsInTrack(track.id).reduce((n, t) => n + t.topics.length, 0);
            return (
              <Link
                key={track.id}
                href={`/track/${track.id}`}
                style={{ "--accent": track.color } as CSSProperties}
                className="glass glass-hover group relative overflow-hidden rounded-2xl p-6"
              >
                <span className="accent-orb" aria-hidden />
                <span className="glass-tile relative flex h-14 w-14 items-center justify-center rounded-2xl text-3xl">
                  {track.icon}
                </span>
                <h3 className="relative mt-5 text-xl font-semibold tracking-tight">{track.label}</h3>
                <p className="relative mt-1 text-sm text-muted">{track.blurb}</p>
                <p className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: track.color }}>
                  {topics} topics
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Placeholders in [brackets] are for the creator to fill in. */}
      <section aria-labelledby="creator-heading" className="glass relative overflow-hidden rounded-3xl p-6 sm:p-10">
        <span className="accent-orb" aria-hidden />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
          <span
            className="accent-chip flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl"
            aria-hidden
          >
            ⚡
          </span>
          <div className="space-y-3">
            <h2 id="creator-heading" className="text-2xl font-bold tracking-tight">
              Meet the Creator
            </h2>
            <div>
              <p className="text-lg font-semibold">D. N. Singh</p>
              <p className="text-sm text-muted">Senior Application Developer</p>
            </div>
            <p className="text-muted">
              Building scalable applications, intelligent AI systems, and next-generation technology solutions. Creator of
              TechOrbitInd, making technology learning structured, practical, and accessible.
            </p>
            <p>
              <a
                href="https://www.linkedin.com/in/dnsingh123"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--accent-default)] hover:underline"
              >
                Connect on LinkedIn ↗
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
