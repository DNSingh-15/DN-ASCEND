import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import JsonLd from "@/components/JsonLd";
import { TRACKS, getAllTech, totalTopics } from "@/lib/content";
import { courseLabel, infoPageJsonLd, pageMetadata } from "@/lib/seo";
import { CONTACT_EMAIL, CREATOR, POLICY_UPDATED, SITE_NAME } from "@/lib/site";

const TITLE = "About Us";
const DESCRIPTION =
  "About TechOrbitInd: a family-owned, independent technology learning platform with step-by-step notes on Full Stack, AI, Cloud, DSA and System Design.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: "/about" });

export default function AboutPage() {
  const courses = getAllTech();
  return (
    <InfoPage title={TITLE} intro={`The story behind ${SITE_NAME}, who writes it and how it is organised.`} updated={POLICY_UPDATED} current="/about">
      <JsonLd data={infoPageJsonLd({ type: "AboutPage", name: TITLE, description: DESCRIPTION, path: "/about", updated: POLICY_UPDATED })} />

      <h2>What {SITE_NAME} is</h2>
      <p>
        {SITE_NAME} is a technology learning platform. It covers Full Stack development, Artificial Intelligence, Cloud computing,
        Data Structures &amp; Algorithms and System Design through step-by-step notes, diagrams and hand-picked videos,
        organised so you always know what to learn next.
      </p>
      <p>
        Today the platform has {TRACKS.length} learning tracks, {courses.length} courses and {totalTopics()} topics. Course
        pages and topic introductions are open to everyone; a free account unlocks the full notes, code examples, diagrams,
        video lessons and LeetCode practice for every topic.
      </p>

      <h2>Our mission</h2>
      <p>
        To make technology learning structured, practical and accessible: one clear path from fundamentals to interview-ready
        depth, explained in plain language, without paywalls on the core material.
      </p>

      <h2>Who it is for</h2>
      <ul>
        <li>Students and freshers building strong foundations in programming and computer science.</li>
        <li>Working developers moving into a new stack, cloud platforms or AI engineering.</li>
        <li>Anyone preparing for software engineering interviews, from DSA rounds to system design.</li>
      </ul>

      <h2>What you can learn</h2>
      <ul>
        {TRACKS.map((track) => (
          <li key={track.id}>
            <Link href={`/track/${track.id}`}>{track.label}</Link>: {track.blurb}.
          </li>
        ))}
      </ul>
      <p>
        Courses include{" "}
        {courses.map((t, i) => (
          <span key={t.slug}>
            <Link href={`/${t.slug}`}>{courseLabel(t)}</Link>
            {i < courses.length - 2 ? ", " : i === courses.length - 2 ? " and " : "."}
          </span>
        ))}
      </p>

      <h2>Who runs {SITE_NAME}</h2>
      <p>
        {SITE_NAME} is a family-owned brand, created and maintained by <strong>{CREATOR.name}</strong>
        {CREATOR.jobTitle ? `, ${CREATOR.jobTitle}` : ""}.
        {CREATOR.profileUrl && (
          <>
            {" "}
            You can{" "}
            <a href={CREATOR.profileUrl} target="_blank" rel="noopener noreferrer">
              connect on {CREATOR.profileName} ↗
            </a>
            .
          </>
        )}
      </p>

      <h2>Independence</h2>
      <p>
        TechOrbitInd is an independently developed educational project. It is not affiliated with, sponsored by, or endorsed
        by any employer or organization with which its creator may be associated. All opinions and educational materials
        published on this platform are personal.
      </p>

      <h2>How the material is made</h2>
      <p>
        Every topic is written as structured notes with key points for interviews, then paired with videos and practice
        problems that are checked against their sources. Read our <Link href="/editorial-policy">Editorial Policy</Link> for
        how content is researched, reviewed and corrected, and the <Link href="/disclaimer">Disclaimer</Link> for the limits of
        what the material promises.
      </p>

      <h2>Get in touch</h2>
      <p>
        Questions, feedback, a correction or a topic you would like to see? Email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or visit the <Link href="/contact">Contact</Link> page.
      </p>
    </InfoPage>
  );
}
