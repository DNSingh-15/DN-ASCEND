import Link from "next/link";
import { TRACKS, techsInTrack } from "@/lib/content";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">What do you want to learn?</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TRACKS.map((track) => {
          const techs = techsInTrack(track.id);
          const topics = techs.reduce((n, t) => n + t.topics.length, 0);
          return (
            <Link
              key={track.id}
              href={`/track/${track.id}`}
              className="card group relative overflow-hidden rounded-2xl p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className="absolute inset-x-0 top-0 h-1" style={{ background: track.color }} aria-hidden />
              <span className="text-4xl">{track.icon}</span>
              <h2 className="mt-4 text-xl font-semibold group-hover:underline">{track.label}</h2>
              <p className="mt-1 text-sm text-muted">{track.blurb}</p>
              <p className="mt-4 text-sm font-medium" style={{ color: track.color }}>
                {topics} topics →
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
