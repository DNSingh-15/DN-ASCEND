"use client";

import { useState } from "react";
import type { Video } from "@/lib/content";

export default function VideoCard({ video, featured }: { video: Video; featured?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const isApna = /apna college|shradha/i.test(video.channel);

  return (
    <div className="card overflow-hidden rounded-xl">
      <div className="relative aspect-video w-full bg-black">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 h-full w-full"
            aria-label={`Play ${video.title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-2xl text-white shadow-lg transition group-hover:scale-110">
                ▶
              </span>
            </span>
            {video.length && (
              <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs text-white">
                {video.length}
              </span>
            )}
          </button>
        )}
      </div>
      <div className="space-y-1 p-3">
        <p className={`line-clamp-2 font-medium ${featured ? "text-base" : "text-sm"}`}>{video.title}</p>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted">{video.channel}</span>
          <span
            className={`rounded-full px-2 py-0.5 font-medium ${
              video.lang === "en"
                ? "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                : "bg-orange-500/15 text-orange-600 dark:text-orange-400"
            }`}
          >
            {video.lang === "en" ? "English" : "हिंदी"}
          </span>
          {isApna && (
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-medium text-emerald-600 dark:text-emerald-400">
              Apna College
            </span>
          )}
          <a
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-red-500 hover:underline"
          >
            Open on YouTube ↗
          </a>
        </div>
      </div>
    </div>
  );
}
