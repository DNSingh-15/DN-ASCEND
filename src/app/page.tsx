import Link from "next/link";
import type { CSSProperties } from "react";
import { TRACKS, techsInTrack } from "@/lib/content";

export default function Dashboard() {
  const totalTopics = TRACKS.reduce(
    (sum, track) => sum + techsInTrack(track.id).reduce((n, t) => n + t.topics.length, 0),
    0,
  );

  return (
    <div className="space-y-10">
      <section className="glass relative overflow-hidden rounded-3xl px-6 py-10 sm:px-10 sm:py-14">
        <span className="accent-orb" style={{ "--accent": "var(--hero-accent)" } as CSSProperties} aria-hidden />
        <p className="glass-tile inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {TRACKS.length} tracks · {totalTopics} topics
        </p>
        <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
          What do you want to <span className="text-gradient">learn</span>?
        </h1>
        <p className="mt-3 max-w-2xl text-muted sm:text-lg">
          Step-by-step notes with diagrams and hand-picked videos for Full Stack, Cloud, AI, DSA and System Design.
        </p>
      </section>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TRACKS.map((track) => {
          const techs = techsInTrack(track.id);
          const topics = techs.reduce((n, t) => n + t.topics.length, 0);
          return (
            <Link
              key={track.id}
              href={`/track/${track.id}`}
              style={{ "--accent": track.color } as CSSProperties}
              className="glass glass-hover group relative overflow-hidden rounded-2xl p-6"
            >
              <span className="accent-orb" aria-hidden />
              <span className="glass-tile flex h-14 w-14 items-center justify-center rounded-2xl text-3xl">
                {track.icon}
              </span>
              <h2 className="mt-5 text-xl font-semibold">{track.label}</h2>
              <p className="mt-1 text-sm text-muted">{track.blurb}</p>
              <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: track.color }}>
                {topics} topics
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
