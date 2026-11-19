import type { Metadata } from "next";
import {
  CONTACT_EMAIL,
  CREATOR,
  LOGO_512,
  OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  absoluteUrl,
} from "./site";
import { getAllTech, getTrack, techsInTrack, type Tech, type Topic, type TrackInfo } from "./content";

// Everything SEO that depends on the notes: titles, descriptions, preview text, related links, structured data.
// The notes themselves (content/*.md) are never changed or exposed from here: only titles, summaries and a short teaser.

/** Hand-written search titles and descriptions per course. Keys are the file names in content/. */
const COURSE_SEO: Record<string, { label: string; title: string; description: string }> = {
  javascript: {
    label: "JavaScript",
    title: "JavaScript Tutorial: Closures, Promises & Event Loop",
    description:
      "Learn JavaScript step by step: data types, hoisting, closures, promises, async/await, the event loop, ES6 and interview questions, with diagrams and videos.",
  },
  typescript: {
    label: "TypeScript",
    title: "TypeScript Tutorial: Types, Interfaces & Generics",
    description:
      "A TypeScript tutorial covering basic types, interfaces, unions, generics, utility types, classes and React props, plus common TypeScript interview topics.",
  },
  react: {
    label: "React.js",
    title: "React.js Tutorial: Hooks, State & Interview Questions",
    description:
      "Learn React.js from components, JSX and props to useState, useEffect, useMemo, custom hooks, Context vs Redux, performance tuning and interview prep.",
  },
  nextjs: {
    label: "Next.js",
    title: "Next.js Tutorial: App Router, Server Components & SSR",
    description:
      "Learn Next.js: routing, SSR, SSG and ISR, Server and Client Components, data fetching and caching, Server Actions, Route Handlers, metadata and SEO.",
  },
  nodejs: {
    label: "Node.js",
    title: "Node.js Tutorial: Event Loop, Express & REST APIs",
    description:
      "Learn Node.js and Express: how the event loop and libuv work, modules, streams, clusters, REST APIs, JWT authentication, security, caching and scaling.",
  },
  fastapi: {
    label: "FastAPI",
    title: "FastAPI Tutorial: Pydantic, Async & Dependency Injection",
    description:
      "Build Python APIs with FastAPI: path and query parameters, Pydantic models, dependency injection, async, JWT auth, databases, testing and deployment.",
  },
  python: {
    label: "Python",
    title: "Python Tutorial: Basics, OOP, NumPy & Pandas",
    description:
      "Learn Python from variables and loops to functions, decorators, generators, object-oriented programming, NumPy and Pandas, with interview-focused notes.",
  },
  postgresql: {
    label: "PostgreSQL",
    title: "PostgreSQL Tutorial: SQL, Indexing & Transactions",
    description:
      "PostgreSQL notes for developers: joins, data modeling, indexing, query optimization, transactions, MVCC, JSONB, partitioning, replication and sharding.",
  },
  aws: {
    label: "AWS",
    title: "AWS Tutorial: IAM, EC2, S3, Lambda & Serverless",
    description:
      "Learn AWS cloud computing: IAM, VPC, EC2, S3, Lambda, API Gateway, DynamoDB, SQS/SNS, ECS, CloudWatch and CI/CD with Docker and GitHub Actions.",
  },
  azure: {
    label: "Azure",
    title: "Azure Tutorial: App Service, Functions & AKS",
    description:
      "Learn Microsoft Azure: resource groups, Entra ID, App Service, Blob Storage, Functions, API Management, Cosmos DB, Key Vault, containers, AKS and CI/CD.",
  },
  "ai-fundamentals": {
    label: "AI",
    title: "Generative AI & LLM Fundamentals for Developers",
    description:
      "Understand Generative AI and LLMs: tokens, context windows, sampling, hallucination, prompt engineering, embeddings, RAG vs fine-tuning and guardrails.",
  },
  "generative-ai": {
    label: "Generative AI & RAG",
    title: "RAG Tutorial: Chunking, Embeddings & Vector Search",
    description:
      "Learn Retrieval-Augmented Generation end to end: ingestion, chunking, embeddings, vector databases, hybrid search, re-ranking, answer generation and RAG evaluation.",
  },
  "agentic-ai": {
    label: "Agentic AI",
    title: "Agentic AI Tutorial: AI Agents, LangChain & LangGraph",
    description:
      "Learn Agentic AI: the agent loop, tool calling, multi-agent patterns, LangChain chains and memory, LangGraph state, human-in-the-loop and guardrails.",
  },
  mcp: {
    label: "MCP",
    title: "Model Context Protocol (MCP) Explained",
    description:
      "What the Model Context Protocol (MCP) is and why it exists: the N×M integration problem, tools, host-client-server architecture, JSON-RPC, transports and scaling.",
  },
  "dsa-basics": {
    label: "DSA",
    title: "DSA Fundamentals: Big-O, Arrays, Recursion & Sorting",
    description:
      "Data Structures and Algorithms basics: Big-O, arrays, strings, two pointers, sliding window, hashing, recursion, backtracking, sorting and binary search.",
  },
  "dsa-data-structures": {
    label: "Data Structures",
    title: "Data Structures: Trees, Graphs, Heaps & Dynamic Programming",
    description:
      "Learn linked lists, stacks, queues, trees, heaps, tries, graphs (BFS, DFS, Dijkstra), dynamic programming and greedy algorithms with LeetCode practice.",
  },
  "system-design-lld": {
    label: "Low Level Design",
    title: "Low Level Design (LLD): OOP, SOLID & Design Patterns",
    description:
      "Low level design for interviews: OOP, SOLID, creational, structural and behavioral design patterns, UML, concurrency, and designs like Parking Lot and Splitwise.",
  },
  "system-design-hld": {
    label: "High Level Design",
    title: "High Level Design (HLD): Scalability, Caching & CAP",
    description:
      "System design for interviews: scaling, databases, sharding, CAP theorem, caching, CDNs, load balancing, queues, microservices, and designs like YouTube and Uber.",
  },
};

const TRACK_SEO: Record<string, { title: string; description: string; h2?: string }> = {
  fullstack: {
    title: "Full Stack Developer Roadmap: React, Node.js & Python",
    description:
      "A step-by-step full stack developer learning path: JavaScript, TypeScript, React, Next.js, Node.js, FastAPI, Python and PostgreSQL, with notes, diagrams and videos.",
  },
  cloud: {
    title: "Cloud Computing Tutorials: AWS & Azure for Developers",
    description:
      "Learn cloud computing with AWS and Azure: IAM, networking, compute, storage, serverless, containers, databases and CI/CD, explained step by step.",
  },
  ai: {
    title: "AI Tutorials: Generative AI, RAG, Agentic AI & MCP",
    description:
      "Learn Artificial Intelligence as a developer: LLM fundamentals, Retrieval-Augmented Generation (RAG), agentic AI with LangChain and LangGraph, and MCP.",
  },
  dsa: {
    title: "DSA Tutorials: Data Structures & Algorithms Interview Prep",
    description:
      "Master DSA for coding interviews: complexity, arrays, recursion, sorting, linked lists, trees, graphs, dynamic programming and greedy, with LeetCode practice.",
  },
  "system-design": {
    title: "System Design Tutorials: LLD & HLD for Interviews",
    description:
      "Learn system design and software architecture: OOP, SOLID and design patterns for LLD, plus scalability, caching, databases and distributed systems for HLD.",
  },
};

export function courseLabel(t: Tech): string {
  return COURSE_SEO[t.slug]?.label ?? t.name;
}

// ---------------------------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------------------------

const SHARE_IMAGES = [OG_IMAGE];

type PageMeta = { title: string; description: string; path: string; absoluteTitle?: boolean; type?: "website" | "article"; noindex?: boolean };

const TITLE_MAX = 65;

/** "<title> · TechOrbitInd" when that fits in search results, otherwise just the title (Google shows the site name separately). */
export function withBrand(title: string): string {
  const branded = `${title} · ${SITE_NAME}`;
  return branded.length <= TITLE_MAX ? branded : title;
}

/** Title, description, canonical, Open Graph and Twitter card for one page. The root layout sets metadataBase. */
export function pageMetadata({ title, description, path, absoluteTitle, type = "website", noindex }: PageMeta): Metadata {
  const fullTitle = absoluteTitle ? title : withBrand(title);
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: { type, url: path, siteName: SITE_NAME, title: fullTitle, description, locale: "en_IN", images: SHARE_IMAGES },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [OG_IMAGE.url] },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  };
}

export const HOME_META = { title: SITE_TITLE, description: SITE_DESCRIPTION, path: "/" };

export function trackMeta(track: TrackInfo): Metadata {
  const seo = TRACK_SEO[track.id];
  return pageMetadata({ title: seo?.title ?? `${track.label} tutorials`, description: seo?.description ?? track.blurb, path: `/track/${track.id}` });
}

export function courseMeta(t: Tech): Metadata {
  const seo = COURSE_SEO[t.slug];
  const fallback = `${t.name} tutorial: ${t.topics.length} topics with notes, diagrams and videos.`;
  return pageMetadata({ title: seo?.title ?? `${t.name} Tutorial`, description: seo?.description ?? (t.description || fallback), path: `/${t.slug}` });
}

function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(" ", max - 1)).replace(/[,;:\-–(]+$/, "") + "…";
}

export function topicTitle(t: Tech, tp: Topic): string {
  const full = `${tp.title} – ${courseLabel(t)} Tutorial`;
  if (full.length <= TITLE_MAX) return full;
  const short = `${tp.title} – ${courseLabel(t)}`;
  return short.length <= TITLE_MAX ? short : tp.title;
}

export function topicDescription(t: Tech, tp: Topic): string {
  const tail = ` ${courseLabel(t)} tutorial with interview notes on ${SITE_NAME}.`;
  const lead = tp.summary.replace(/\s+/g, " ").trim();
  return clip(lead && !/[.!?]$/.test(lead) ? `${lead}.${tail}` : `${lead}${tail}`, 160);
}

export function topicPath(t: Tech, tp: Topic): string {
  return `/${t.slug}/${tp.slug}`;
}

/** Same metadata for the full notes (signed in) and the preview (signed out): both live at the same URL. */
export function topicMeta(t: Tech, tp: Topic): Metadata {
  return pageMetadata({
    title: topicTitle(t, tp),
    description: topicDescription(t, tp),
    path: topicPath(t, tp),
    type: "article",
    noindex: !isIndexableTopic(t, tp),
  });
}

// ---------------------------------------------------------------------------------------------
// Public preview of a topic
// ---------------------------------------------------------------------------------------------

const PREVIEW_MAX = 480;
/** Below this much public text a topic page is too thin to be useful in search, so it is kept out of the index. */
const MIN_INDEXABLE_CHARS = 180;

const BLOCK_START = /^(\s*([-*+]\s|\d+[.)]\s)|\s*\||\s*>|\s*<|\s*!\[|\s*---+\s*$)/;

/**
 * A short plain-text teaser: the first prose paragraph(s) of the notes, with markdown stripped, at most ~480 characters.
 * Skips code, tables, lists and diagrams, so only introductory sentences ever leave the server for signed-out visitors.
 */
export function previewExcerpt(body: string): string {
  const paras: string[] = [];
  let buf: string[] = [];
  let fence = false;
  let skipBlock = false;
  const flush = () => {
    if (buf.length) paras.push(buf.join(" "));
    buf = [];
  };

  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      flush();
      fence = !fence;
      continue;
    }
    if (fence) continue;
    if (!line.trim() || /^#{1,6}\s/.test(line)) {
      flush();
      skipBlock = false;
      continue;
    }
    if (skipBlock) continue;
    if (BLOCK_START.test(line)) {
      flush();
      skipBlock = true; // the rest of this list / table / quote, up to the next blank line
      continue;
    }
    buf.push(line.trim());
  }
  flush();

  const picked: string[] = [];
  let total = 0;
  for (const p of paras) {
    if (/:$/.test(p)) continue; // introduces a list or code block that is not part of the preview
    const text = p
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/(\*\*|__|`)/g, "")
      .replace(/(^|\s)[*_]([^*_\n]+)[*_](?=\s|[.,;:!?]|$)/g, "$1$2")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) continue;
    picked.push(text);
    total += text.length + 1;
    if (total >= PREVIEW_MAX) break;
  }

  const joined = picked.join(" ");
  if (joined.length <= PREVIEW_MAX) return joined;
  const cut = joined.slice(0, PREVIEW_MAX);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
  if (end >= PREVIEW_MAX * 0.5) return cut.slice(0, end + 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:\-–(]+$/, "") + "…";
}

const indexable = new Map<string, boolean>();

/** Topics with enough public text (summary + teaser) are indexed and listed in the sitemap; very short ones are noindex. */
export function isIndexableTopic(t: Tech, tp: Topic): boolean {
  const key = `${t.slug}/${tp.slug}`;
  let ok = indexable.get(key);
  if (ok === undefined) {
    ok = tp.summary.length + previewExcerpt(tp.body).length >= MIN_INDEXABLE_CHARS;
    indexable.set(key, ok);
  }
  return ok;
}

// ---------------------------------------------------------------------------------------------
// Related topics and courses (internal links)
// ---------------------------------------------------------------------------------------------

export type RelatedLink = { href: string; title: string; note: string };

/** Same-named topics in other courses first (for example Middleware in Next.js, Node.js and FastAPI), then neighbours in the same step. */
export function relatedTopics(t: Tech, tp: Topic, limit = 6): RelatedLink[] {
  const out: RelatedLink[] = [];
  const seen = new Set<string>([`${t.slug}/${tp.slug}`]);
  const add = (tech: Tech, topic: Topic, note: string) => {
    const key = `${tech.slug}/${topic.slug}`;
    if (seen.has(key) || out.length >= limit) return;
    seen.add(key);
    out.push({ href: topicPath(tech, topic), title: topic.title, note });
  };

  const title = tp.title.toLowerCase();
  for (const other of getAllTech()) {
    if (other.slug === t.slug) continue;
    const match = other.topics.find((x) => x.title.toLowerCase() === title);
    if (match) add(other, match, `${courseLabel(other)} · same topic`);
  }

  const index = t.topics.findIndex((x) => x.slug === tp.slug);
  const sameStep = t.topics.filter((x, i) => i !== index && x.group === tp.group);
  sameStep.sort((a, b) => Math.abs(t.topics.indexOf(a) - index) - Math.abs(t.topics.indexOf(b) - index));
  for (const x of sameStep) add(t, x, `${courseLabel(t)}${x.group ? ` · ${x.group}` : ""}`);
  return out;
}

/** Other courses in the same track, then the rest of the catalogue, for the bottom of a course page. */
export function relatedCourses(t: Tech, limit = 6): RelatedLink[] {
  const sameTrack = techsInTrack(t.track).filter((x) => x.slug !== t.slug);
  const rest = getAllTech().filter((x) => x.slug !== t.slug && x.track !== t.track);
  return [...sameTrack, ...rest].slice(0, limit).map((x) => ({
    href: `/${x.slug}`,
    title: courseLabel(x),
    note: `${x.topics.length} topics`,
  }));
}

// ---------------------------------------------------------------------------------------------
// Structured data (schema.org JSON-LD)
// ---------------------------------------------------------------------------------------------

const ORG_ID = absoluteUrl("/#organization");
const SITE_ID = absoluteUrl("/#website");
const CREATOR_ID = absoluteUrl("/#creator");

const publisherRef = { "@id": ORG_ID };

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: SITE_NAME,
        url: absoluteUrl("/"),
        logo: { "@type": "ImageObject", url: absoluteUrl(LOGO_512), width: 512, height: 512 },
        image: absoluteUrl(OG_IMAGE.url),
        description: SITE_DESCRIPTION,
        founder: { "@id": CREATOR_ID },
        sameAs: [CREATOR.linkedin],
        contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: CONTACT_EMAIL, availableLanguage: ["English"] },
      },
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        url: absoluteUrl("/"),
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: publisherRef,
      },
      {
        "@type": "Person",
        "@id": CREATOR_ID,
        name: CREATOR.name,
        jobTitle: CREATOR.jobTitle,
        url: CREATOR.linkedin,
        sameAs: [CREATOR.linkedin],
        worksFor: publisherRef,
      },
    ],
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absoluteUrl(c.path) })),
  };
}

export function trackJsonLd(track: TrackInfo) {
  const seo = TRACK_SEO[track.id];
  const techs = techsInTrack(track.id);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: seo?.title ?? track.label,
    description: seo?.description ?? track.blurb,
    url: absoluteUrl(`/track/${track.id}`),
    isPartOf: { "@id": SITE_ID },
    publisher: publisherRef,
    inLanguage: "en",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: techs.map((t, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/${t.slug}`), name: courseLabel(t) })),
    },
  };
}

export function courseJsonLd(t: Tech) {
  const seo = COURSE_SEO[t.slug];
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: seo?.title ?? `${t.name} Tutorial`,
    description: seo?.description ?? t.description,
    url: absoluteUrl(`/${t.slug}`),
    provider: { "@type": "Organization", "@id": ORG_ID, name: SITE_NAME, sameAs: absoluteUrl("/") },
    inLanguage: "en",
    isAccessibleForFree: true,
    educationalLevel: "Beginner to Advanced",
    hasPart: t.topics.slice(0, 100).map((tp) => ({
      "@type": "LearningResource",
      name: tp.title,
      url: absoluteUrl(topicPath(t, tp)),
      description: tp.summary,
    })),
  };
}

export function topicJsonLd(t: Tech, tp: Topic) {
  const url = absoluteUrl(topicPath(t, tp));
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: clip(topicTitle(t, tp), 110),
    description: topicDescription(t, tp),
    url,
    mainEntityOfPage: url,
    image: absoluteUrl(OG_IMAGE.url),
    inLanguage: "en",
    about: courseLabel(t),
    isPartOf: { "@type": "Course", name: COURSE_SEO[t.slug]?.title ?? t.name, url: absoluteUrl(`/${t.slug}`) },
    author: { "@id": CREATOR_ID, "@type": "Person", name: CREATOR.name, url: CREATOR.linkedin },
    publisher: { "@type": "Organization", "@id": ORG_ID, name: SITE_NAME, logo: { "@type": "ImageObject", url: absoluteUrl(LOGO_512) } },
  };
}

/** Breadcrumbs shared by the course and topic pages. */
export function crumbsFor(t: Tech, tp?: Topic): Crumb[] {
  const track = getTrack(t.track);
  const crumbs: Crumb[] = [{ name: "Home", path: "/" }];
  if (track) crumbs.push({ name: track.label, path: `/track/${track.id}` });
  crumbs.push({ name: courseLabel(t), path: `/${t.slug}` });
  if (tp) crumbs.push({ name: tp.title, path: topicPath(t, tp) });
  return crumbs;
}
