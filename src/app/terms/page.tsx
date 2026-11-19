import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
import { CONTACT_EMAIL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms & Conditions",
  description: "The terms for using TechOrbitInd: your account, acceptable use of the learning material, and third-party videos and practice links.",
  path: "/terms",
});

// Plain-language starting point. Placeholders in [brackets] are for the owner to fill in, and the text should be reviewed before relying on it.
export default function TermsPage() {
  return (
    <InfoPage title="Terms & Conditions" intro="Last updated: [date]">
      <h2>Your account</h2>
      <p>Keep your login details private. You are responsible for activity on your account.</p>
      <h2>Acceptable use</h2>
      <p>Do not try to disrupt the service or copy the learning material in bulk to republish it.</p>
      <h2>Content</h2>
      <p>
        The material is provided for learning, as is. Embedded videos belong to their YouTube creators and practice problems
        link to LeetCode; their own terms apply.
      </p>
      <h2>Contact</h2>
      <p>Questions about these terms: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
    </InfoPage>
  );
}
