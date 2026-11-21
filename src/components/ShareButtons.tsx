import { absoluteUrl } from "@/lib/site";
import CopyLinkButton from "./CopyLinkButton";

/**
 * Share links for a page. Plain share-intent URLs (no third-party scripts or trackers), so they cost nothing to load
 * and work without JavaScript; only "Copy link" needs the browser.
 */
export default function ShareButtons({ path, title }: { path: string; title: string }) {
  const url = absoluteUrl(path);
  const u = encodeURIComponent(url);
  const text = encodeURIComponent(title);
  const targets = [
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { name: "X", href: `https://twitter.com/intent/tweet?url=${u}&text=${text}` },
    { name: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { name: "Telegram", href: `https://t.me/share/url?url=${u}&text=${text}` },
  ];

  return (
    <section aria-labelledby="share-heading" className="glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 id="share-heading" className="text-sm font-semibold">
        Found this useful? Share it
      </h2>
      <ul className="flex flex-wrap gap-2 text-sm font-medium">
        {targets.map((s) => (
          <li key={s.name}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              aria-label={`Share on ${s.name} (opens in a new tab)`}
              className="glass-tile inline-flex rounded-xl px-3 py-1.5 transition hover:scale-[1.03]"
            >
              {s.name}
            </a>
          </li>
        ))}
        <li>
          <CopyLinkButton url={url} />
        </li>
      </ul>
    </section>
  );
}
