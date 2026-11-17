import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms for using TechOrbitInd.",
};

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
      <p>Questions about these terms: [contact email].</p>
    </InfoPage>
  );
}
