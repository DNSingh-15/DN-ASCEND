import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import JsonLd from "@/components/JsonLd";
import { infoPageJsonLd, pageMetadata } from "@/lib/seo";
import { CONTACT_EMAIL, CREATOR, POLICY_UPDATED, SITE_NAME } from "@/lib/site";

const TITLE = "Editorial Policy";
const DESCRIPTION =
  "How TechOrbitInd creates, reviews and updates its tutorials: who writes them, how videos and practice problems are chosen, corrections and ad independence.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: "/editorial-policy" });

export default function EditorialPolicyPage() {
  return (
    <InfoPage
      title={TITLE}
      intro={`How ${SITE_NAME} researches, writes, reviews and updates its learning material.`}
      updated={POLICY_UPDATED}
      current="/editorial-policy"
    >
      <JsonLd data={infoPageJsonLd({ name: TITLE, description: DESCRIPTION, path: "/editorial-policy", updated: POLICY_UPDATED })} />

      <h2>Our standards</h2>
      <p>Every page on {SITE_NAME} aims to be:</p>
      <ul>
        <li>
          <strong>Accurate</strong>: technically correct and checked against official documentation and primary sources.
        </li>
        <li>
          <strong>Clear</strong>: explained step by step in plain language, with diagrams where a picture helps.
        </li>
        <li>
          <strong>Practical</strong>: focused on what developers use at work and what interviews actually ask.
        </li>
        <li>
          <strong>Independent</strong>: written for learners, never for advertisers or sponsors.
        </li>
      </ul>

      <h2>Who writes the content</h2>
      <p>
        The notes are written and maintained by {CREATOR.name}
        {CREATOR.jobTitle ? `, ${CREATOR.jobTitle}` : ""}, the creator of {SITE_NAME} (see{" "}
        <Link href="/about">About Us</Link>). Each topic is organised into a course and a numbered step, so material builds on
        what came before it.
      </p>

      <h2>How a topic is put together</h2>
      <ul>
        <li>
          <strong>Notes</strong>: a structured explanation of the concept, followed by key points to remember for interviews.
        </li>
        <li>
          <strong>Code and diagrams</strong>: short examples and flow or UML diagrams that illustrate the idea, written to
          teach rather than to be copied into production unchanged.
        </li>
        <li>
          <strong>Videos</strong>: hand-picked YouTube lessons for each topic. Hindi lessons are preferred (Apna College
          first, then other established Hindi channels), with English lessons used when no suitable Hindi video exists. Videos
          belong to their creators; we only link to and embed them.
        </li>
        <li>
          <strong>Practice problems</strong>: DSA topics link to LeetCode problems. Each problem&apos;s number, title and
          difficulty are checked against LeetCode itself, so they match what you see there.
        </li>
      </ul>

      <h2>Review and updates</h2>
      <p>
        Material is reviewed when a technology releases significant changes, when a reader reports a problem, and as new topics
        are added. Every topic page shows when its notes were last updated, and the{" "}
        <a href="/sitemap.xml">sitemap</a> carries the same dates for search engines.
      </p>

      <h2>Corrections</h2>
      <p>
        If you find an error, an outdated statement or a broken link, email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with the page address and what is wrong. We review every
        report, correct confirmed errors promptly, and update the page&apos;s last-updated date when the notes change.
      </p>

      <h2>Advertising and independence</h2>
      <p>
        {SITE_NAME} may show advertising served by Google AdSense to keep the core material free. Advertising is kept clearly
        separate from the learning content, is labelled as such, and never decides what topics we cover or what we say about
        any product. We do not accept payment for coverage, and we do not publish sponsored content.
      </p>

      <h2>Related policies</h2>
      <p>
        See the <Link href="/disclaimer">Disclaimer</Link>, <Link href="/privacy">Privacy Policy</Link> and{" "}
        <Link href="/terms">Terms &amp; Conditions</Link>.
      </p>
    </InfoPage>
  );
}
