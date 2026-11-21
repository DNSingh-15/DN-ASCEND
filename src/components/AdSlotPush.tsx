"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** Asks AdSense to fill the <ins> just before this element, once per mount (client-side navigations included). */
export default function AdSlotPush() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ins = ref.current?.parentElement?.querySelector("ins.adsbygoogle");
    if (!ins || ins.getAttribute("data-adsbygoogle-status")) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blockers or a not-yet-approved account: the slot simply stays empty.
    }
  }, []);

  return <span ref={ref} hidden />;
}
