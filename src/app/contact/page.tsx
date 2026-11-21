import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import JsonLd from "@/components/JsonLd";
import { CONTACT_EMAIL, CREATOR } from "@/lib/site";
import { infoPageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Contact TechOrbitInd with questions, feedback or a topic you would like to see covered. Email us and we will reply as soon as we can.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <InfoPage title="Contact" intro="Questions, feedback or a topic you would like to see? Get in touch." current="/contact">
      <JsonLd
        data={infoPageJsonLd({
          type: "ContactPage",
          name: "Contact",
          description: "Contact TechOrbitInd with questions, feedback, corrections or topic requests.",
          path: "/contact",
        })}
      />
      {/* Shown as plain text on purpose: no mailto: link, so clicking it does nothing. Readers copy the address themselves. */}
      <p>
        Email: <strong className="select-all break-all">{CONTACT_EMAIL}</strong>
      </p>
      <p>We read every message and reply as soon as we can.</p>

      <h2>What to write to us about</h2>
      <ul>
        <li>
          <strong>Corrections</strong>: an error, an outdated statement or a broken link. Please include the page address.
        </li>
        <li>
          <strong>Topic requests</strong>: a technology or interview topic you would like covered.
        </li>
        <li>
          <strong>Account help</strong>: trouble signing in, or a request to delete your account data (send it from the email
          address on the account).
        </li>
        <li>
          <strong>Feedback and collaboration</strong>: what works, what doesn&apos;t, and ideas for the platform.
        </li>
      </ul>

      <h2>Other ways to connect</h2>
      <p>
        {CREATOR.profileUrl && (
          <>
            Follow or message the creator, {CREATOR.name}, on{" "}
            <a href={CREATOR.profileUrl} target="_blank" rel="noopener noreferrer">
              {CREATOR.profileName} ↗
            </a>
            .{" "}
          </>
        )}
        To learn more about the platform, see <Link href="/about">About Us</Link> and our{" "}
        <Link href="/editorial-policy">Editorial Policy</Link>.
      </p>
    </InfoPage>
  );
}
