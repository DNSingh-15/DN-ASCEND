// Site-wide constants used for SEO (canonical URLs, Open Graph, structured data) and the Contact page.

/**
 * Canonical origin. www and plain http already 301 to it on Netlify. Deploy previews keep pointing their
 * canonicals here, so only the production domain is indexed. Override with the SITE_URL env var if the domain changes.
 */
export const SITE_URL = (process.env.SITE_URL || "https://techorbitind.in").replace(/\/+$/, "");
export const SITE_NAME = "TechOrbitInd";

export const SITE_TITLE = "TechOrbitInd – Full Stack, AI, Cloud, DSA & System Design";
export const SITE_DESCRIPTION =
  "Learn Full Stack, React, Node.js, Python, Generative AI, RAG, AWS, DSA and System Design with step-by-step notes, diagrams, videos and interview prep.";

export const CONTACT_EMAIL = "dnsingh15softdev@gmail.com";

export const CREATOR = {
  name: "D. N. Singh",
  jobTitle: "Senior Application Developer",
  linkedin: "https://www.linkedin.com/in/dnsingh123",
};

// Derived from public/logo/techorbitind.png by scripts/make-brand-assets.mjs (the 1.1 MB master is never served on pages).
/** 1200×630 social share card: full logo on the brand background. */
export const OG_IMAGE = { url: "/logo/techorbitind-og.png", width: 1200, height: 630, alt: "TechOrbitInd – Learn Full Stack, AI, Cloud, DSA & System Design" };
/** Square cube mark, 512×512: Organization logo in structured data and the web app manifest. */
export const LOGO_512 = "/logo/techorbitind-512.png";
/** Square cube mark, 96×96: the header and sign-in tiles. */
export const LOGO_MARK = "/logo/techorbitind-mark.png";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
