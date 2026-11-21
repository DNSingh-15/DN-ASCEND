import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import JsonLd from "@/components/JsonLd";
import { CONTACT_EMAIL, POLICY_UPDATED } from "@/lib/site";
import { infoPageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms & Conditions",
  description: "The terms for using TechOrbitInd: your account, acceptable use of the learning material, and third-party videos and practice links.",
  path: "/terms",
});

// Plain-language terms. Review the text before relying on it, and update POLICY_UPDATED (src/lib/site.ts) when it changes.
export default function TermsPage() {
  return (
    <InfoPage title="Terms & Conditions" intro="The rules for using TechOrbitInd." updated={POLICY_UPDATED} current="/terms">
      <JsonLd
        data={infoPageJsonLd({
          name: "Terms & Conditions",
          description: "The terms for using TechOrbitInd: your account, acceptable use, content, third-party links and advertising.",
          path: "/terms",
          updated: POLICY_UPDATED,
        })}
      />
      <p>
        By using techorbitind.in you agree to these terms. If you do not agree, please do not use the site.
      </p>

      <h2>Your account</h2>
      <p>Keep your login details private. You are responsible for activity on your account.</p>
      <p>
        Provide accurate information when you sign up. You may stop using the site at any time and ask us to delete your account
        by emailing us.
      </p>

      <h2>Acceptable use</h2>
      <p>Do not try to disrupt the service or copy the learning material in bulk to republish it.</p>
      <p>
        You may use the material for your own learning, and share links to any page. Automated scraping, attempts to bypass
        sign-in, and any unlawful use are not allowed. We may suspend accounts that break these terms.
      </p>

      <h2>Content</h2>
      <p>
        The material is provided for learning, as is. Embedded videos belong to their YouTube creators and practice problems
        link to LeetCode; their own terms apply.
      </p>
      <p>
        The notes, diagrams and site design are owned by TechOrbitInd unless stated otherwise. See the{" "}
        <Link href="/disclaimer">Disclaimer</Link> for the limits of what the material promises.
      </p>

      <h2>Advertising</h2>
      <p>
        The site may display advertising served by third parties such as Google AdSense. Clicking an ad takes you to a website we
        do not control. See the <Link href="/privacy">Privacy Policy</Link> for how advertising cookies are used.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent permitted by law, TechOrbitInd is not liable for any indirect or consequential loss arising from use of the
        site or its material. The service may change, or be unavailable at times, without notice.
      </p>

      <h2>Changes and governing law</h2>
      <p>
        We may update these terms; the &quot;Last updated&quot; date at the top shows when they last changed. These terms are
        governed by the laws of India.
      </p>

      <h2>Contact</h2>
      <p>Questions about these terms: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
    </InfoPage>
  );
}
