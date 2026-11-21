import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// /robots.txt. Everything public is crawlable. Only the API and the internal preview route are blocked.
// /login, /signup and /learning stay crawlable on purpose: they carry a noindex tag, which Google can only see if it may crawl them.
// Google's AdSense crawler (Mediapartners-Google) gets its own group with no blocks, so it can review every page that may show ads.
// Note: robots.txt only controls crawling; protected content is protected by the proxy, not by this file.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/preview/"] },
      { userAgent: "Mediapartners-Google", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
