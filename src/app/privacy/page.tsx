import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What information TechOrbitInd collects and how it is used.",
};

// Describes what the app does today. Placeholders in [brackets] are for the owner to fill in, and the text should be reviewed before relying on it.
export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy Policy" intro="Last updated: [date]">
      <h2>What we collect</h2>
      <p>
        When you create an account we store your full name, email address and password. The password is stored only as a
        salted hash, never in plain text.
      </p>
      <h2>Cookies and local storage</h2>
      <ul>
        <li>A signed, HttpOnly session cookie keeps you logged in for up to 7 days.</li>
        <li>Your light or dark theme choice is saved in your browser&apos;s local storage.</li>
      </ul>
      <h2>Third parties</h2>
      <p>
        The site and its database are hosted on Netlify. Topic pages show YouTube video thumbnails, and videos play through
        YouTube&apos;s privacy-enhanced embed only after you press play.
      </p>
      <h2>Contact</h2>
      <p>For questions or to request deletion of your account data, email [contact email].</p>
    </InfoPage>
  );
}
