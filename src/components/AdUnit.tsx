import Script from "next/script";
import { ADSENSE_CLIENT, ADSENSE_SLOT } from "@/lib/ads";
import AdSlotPush from "./AdSlotPush";

/**
 * A clearly labelled advertisement area between content sections, styled like the rest of the site.
 * Renders nothing until ADSENSE_CLIENT_ID is configured (see src/lib/ads.ts), so no placeholder or invalid ad code ships.
 * With a publisher ID but no ADSENSE_SLOT_ID it only loads the AdSense script on this page, for Auto ads.
 * Only used on content pages (Home, track, course, full topic): never on login, signup, the dashboard or the information pages.
 */
export default function AdUnit({ className = "" }: { className?: string }) {
  if (!ADSENSE_CLIENT) return null;

  const script = (
    <Script
      id="adsbygoogle-js"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      strategy="lazyOnload"
      crossOrigin="anonymous"
    />
  );
  if (!ADSENSE_SLOT) return script;

  return (
    <aside aria-label="Advertisement" className={`glass rounded-2xl p-3 ${className}`}>
      {script}
      <p className="mb-2 text-center text-[11px] uppercase tracking-wider text-muted">Advertisement</p>
      <div className="ad-slot">
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={ADSENSE_SLOT}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
      <AdSlotPush />
    </aside>
  );
}
