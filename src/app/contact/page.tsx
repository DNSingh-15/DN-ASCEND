import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to get in touch with TechOrbitInd.",
};

// Placeholders in [brackets] are for the owner to fill in.
export default function ContactPage() {
  return (
    <InfoPage title="Contact" intro="Questions, feedback or a topic you would like to see? Get in touch.">
      <p>
        Email: <strong>[contact email]</strong>
      </p>
      <p>We read every message and reply as soon as we can.</p>
    </InfoPage>
  );
}
