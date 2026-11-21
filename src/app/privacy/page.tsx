import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import JsonLd from "@/components/JsonLd";
import { CONTACT_EMAIL, POLICY_UPDATED } from "@/lib/site";
import { infoPageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "What information TechOrbitInd collects when you create an account, how cookies are used, and how to request deletion of your data.",
  path: "/privacy",
});

// Describes what the app does today. Review the text before relying on it, and update POLICY_UPDATED (src/lib/site.ts) when it changes.
export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy Policy" intro="How TechOrbitInd handles your information." updated={POLICY_UPDATED} current="/privacy">
      <JsonLd
        data={infoPageJsonLd({
          name: "Privacy Policy",
          description: "What information TechOrbitInd collects, how cookies and advertising work, and how to request deletion of your data.",
          path: "/privacy",
          updated: POLICY_UPDATED,
        })}
      />
      <p>
        This policy explains what information TechOrbitInd (&quot;we&quot;, &quot;us&quot;) collects when you use{" "}
        <a href="https://techorbitind.in">techorbitind.in</a>, why, and the choices you have. You can read the public pages
        without an account.
      </p>

      <h2>What we collect</h2>
      <p>
        When you create an account we store your full name, email address and password. The password is stored only as a
        salted hash, never in plain text.
      </p>
      <p>
        We use this information only to create and secure your account and to let you log in. We do not sell or rent your
        personal information. Like most websites, our hosting provider also processes standard technical data (such as IP
        address, browser type and the pages requested) to deliver the site and protect it from abuse, for example by
        limiting repeated login attempts.
      </p>

      <h2>Cookies and local storage</h2>
      <ul>
        <li>A signed, HttpOnly session cookie keeps you logged in for up to 7 days.</li>
        <li>Your light or dark theme choice is saved in your browser&apos;s local storage.</li>
      </ul>
      <p>
        The session cookie is strictly necessary for signing in and is removed when you log out or it expires. You can clear
        cookies and local storage at any time in your browser settings.
      </p>

      <h2>Advertising and advertising cookies</h2>
      <p>
        TechOrbitInd may show advertisements served by Google AdSense to support the free learning material. When ads are
        shown:
      </p>
      <ul>
        <li>Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites.</li>
        <li>
          Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your visits to this
          site and/or other sites on the Internet.
        </li>
        <li>
          You may opt out of personalised advertising by visiting Google&apos;s{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            Ads Settings
          </a>
          . You can also opt out of some third-party vendors&apos; use of cookies for personalised advertising at{" "}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
            www.aboutads.info
          </a>
          .
        </li>
        <li>
          Learn more in{" "}
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
            how Google uses information from sites that use its services
          </a>{" "}
          and{" "}
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
            how Google uses cookies in advertising
          </a>
          .
        </li>
      </ul>
      <p>
        Visitors in the European Economic Area, the United Kingdom and Switzerland are asked for consent before personalised
        ads or advertising cookies are used, through a Google-certified consent message. Ads are never shown on the login and
        sign-up pages.
      </p>

      <h2>Third parties</h2>
      <p>
        The site and its database are hosted on Netlify. Topic pages show YouTube video thumbnails, and videos play through
        YouTube&apos;s privacy-enhanced embed only after you press play.
      </p>
      <p>
        Links to YouTube, LeetCode, LinkedIn and social sharing sites open those services, whose own privacy policies apply.
        Share buttons on this site are plain links: they load no third-party scripts until you click them.
      </p>

      <h2>How long we keep data</h2>
      <p>
        Account information is kept while your account exists. When you ask us to delete your account, we delete your name,
        email address and password hash from our database.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask us to access, correct or delete the personal information we hold about you. Depending on where you live
        (for example under India&apos;s Digital Personal Data Protection Act, 2023 or the EU GDPR) you may have further rights.
        Email us using the address below and we will respond within a reasonable time.
      </p>

      <h2>Children</h2>
      <p>
        TechOrbitInd is not directed at children under 13, and we do not knowingly collect personal information from them. If
        you believe a child has created an account, contact us and we will delete it.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy as the site changes. The &quot;Last updated&quot; date at the top shows when it last changed.
        See also our <Link href="/terms">Terms &amp; Conditions</Link> and <Link href="/disclaimer">Disclaimer</Link>.
      </p>

      <h2>Contact</h2>
      <p>For questions or to request deletion of your account data, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
    </InfoPage>
  );
}
