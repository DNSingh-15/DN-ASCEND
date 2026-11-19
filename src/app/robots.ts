import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// /robots.txt. Everything public is crawlable. Only the API and the internal preview route are blocked.
// /login, /signup and /learning stay crawlable on purpose: they carry a noindex tag, which Google can only see if it may crawl them.
// Note: robots.txt only controls crawling; protected content is protected by the proxy, not by this file.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/preview/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
