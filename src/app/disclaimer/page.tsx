import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import JsonLd from "@/components/JsonLd";
import { infoPageJsonLd, pageMetadata } from "@/lib/seo";
import { CONTACT_EMAIL, POLICY_UPDATED, SITE_NAME } from "@/lib/site";

const TITLE = "Disclaimer";
const DESCRIPTION =
  "TechOrbitInd's disclaimer: educational content only, no professional advice or guarantees, third-party videos and links, trademarks and advertising.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: "/disclaimer" });

export default function DisclaimerPage() {
  return (
    <InfoPage title={TITLE} intro="Please read this before relying on the material on this site." updated={POLICY_UPDATED} current="/disclaimer">
      <JsonLd data={infoPageJsonLd({ name: TITLE, description: DESCRIPTION, path: "/disclaimer", updated: POLICY_UPDATED })} />

      <h2>Educational purposes only</h2>
      <p>
        All notes, code examples, diagrams and other material on {SITE_NAME} are provided for general educational and
        informational purposes. They are not professional, legal, financial, security or career advice, and they are not a
        substitute for the official documentation of the technologies they describe.
      </p>

      <h2>Accuracy</h2>
      <p>
        We work to keep the material correct and current (see our <Link href="/editorial-policy">Editorial Policy</Link>), but
        software changes quickly. Versions, APIs, prices, limits and cloud service behaviour may differ from what is written
        here. The material is provided &quot;as is&quot;, without warranties of any kind, express or implied.
      </p>

      <h2>Code examples</h2>
      <p>
        Code samples are written to explain a concept and are kept short on purpose. Review, test and secure any code before
        using it in production. You are responsible for how you use it, and {SITE_NAME} is not liable for any loss or damage
        arising from its use.
      </p>

      <h2>No guarantees of results</h2>
      <p>
        Interview preparation material is meant to help you learn. {SITE_NAME} does not guarantee any interview outcome,
        job offer, certification result or other result.
      </p>

      <h2>Third-party content and links</h2>
      <p>
        Topic pages embed or link to videos hosted on YouTube and to practice problems on LeetCode, and some pages link to
        other external websites. That content belongs to its creators and is governed by their own terms and privacy policies.
        {` ${SITE_NAME}`} does not control it and is not responsible for its availability or accuracy. A link is not an
        endorsement.
      </p>

      <h2>Trademarks</h2>
      <p>
        Product names, logos and brands mentioned on this site (for example React, Node.js, Python, AWS, Azure, PostgreSQL,
        MongoDB, LangChain, YouTube and LeetCode) are the property of their respective owners. They are used only to identify
        the technologies being taught, and their use does not imply any affiliation with or endorsement by them.
      </p>

      <h2>Advertising</h2>
      <p>
        {SITE_NAME} may display advertisements served by Google AdSense to support the free material. Ads are chosen by the ad
        provider, not by us, and an ad appearing on a page is not an endorsement of the advertiser or its products. Ads never
        influence what we write. See the <Link href="/privacy">Privacy Policy</Link> for how advertising cookies work.
      </p>

      <h2>Views</h2>
      <p>The views expressed on this site are the author&apos;s own and do not represent those of any employer or client.</p>

      <h2>Contact</h2>
      <p>
        Spotted an error or have a concern about something on this site? Email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </InfoPage>
  );
}
