"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { isAuthPage } from "@/lib/auth/config";

/** Pages that must never show ads: the sign-in forms, the dashboard and the information pages. */
function adFree(pathname: string): boolean {
  return isAuthPage(pathname) || /^\/(learning|about|contact|privacy|terms|disclaimer|editorial-policy)\/?$/.test(pathname);
}

/**
 * The AdSense script stays loaded after a client-side navigation, so Auto ads could otherwise follow a visitor from an
 * article onto the login or signup page. This marks those pages on <html>, and globals.css hides any ad there.
 * Only rendered when AdSense is configured; it does not touch the auth components or their behaviour.
 */
export default function AdGuard() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    if (adFree(pathname)) root.dataset.noAds = "";
    else delete root.dataset.noAds;
  }, [pathname]);
  return null;
}
