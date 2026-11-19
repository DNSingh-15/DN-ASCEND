import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
import { CONTACT_EMAIL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Contact TechOrbitInd with questions, feedback or a topic you would like to see covered. Email us and we will reply as soon as we can.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <InfoPage title="Contact" intro="Questions, feedback or a topic you would like to see? Get in touch.">
      <p>
        Email:{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>
          <strong>{CONTACT_EMAIL}</strong>
        </a>
      </p>
      <p>We read every message and reply as soon as we can.</p>
    </InfoPage>
  );
}
