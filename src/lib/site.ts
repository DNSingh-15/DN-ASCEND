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

export const CONTACT_EMAIL = "anuradhasingh93661@gmail.com";

/**
 * The person behind the brand, shown on Home, About, Editorial Policy and in structured data.
 * PLACEHOLDERS: replace the bracketed values below with the real details. Nothing is guessed or invented.
 *   name        full name as it should appear publicly
 *   jobTitle    optional role or title; leave "" to hide it
 *   profileUrl  link to their public profile (e.g. LinkedIn); leave "" to hide the link everywhere
 *   profileName the network that URL belongs to, used as the link text (e.g. "LinkedIn")
 * While name is still a [placeholder], the topic byline falls back to the brand name, and the layout's author tag and
 * the schema.org Person are left out, so search engines never see placeholder text.
 */
export const CREATOR = {
  name: "[Family member name]",
  jobTitle: "",
  profileUrl: "",
  profileName: "LinkedIn",
};

/** True once CREATOR.name has been replaced with a real name. */
export const CREATOR_READY = !/^\[.*\]$/.test(CREATOR.name.trim());

// Derived from public/logo/techorbitind.png by scripts/make-brand-assets.mjs (the 1.1 MB master is never served on pages).
/** 1200×630 social share card: full logo on the brand background. */
export const OG_IMAGE = { url: "/logo/techorbitind-og.png", width: 1200, height: 630, alt: "TechOrbitInd – Learn Full Stack, AI, Cloud, DSA & System Design" };
/** Square cube mark, 512×512: Organization logo in structured data and the web app manifest. */
export const LOGO_512 = "/logo/techorbitind-512.png";
/** Square cube mark, 96×96: the header and sign-in tiles. */
export const LOGO_MARK = "/logo/techorbitind-mark.png";

/** "Last updated" date of the About, Privacy, Terms, Disclaimer and Editorial Policy pages. Change it whenever one of them changes. */
export const POLICY_UPDATED = "2026-11-21";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** "21 November 2026": the date style used on every page. */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
}
