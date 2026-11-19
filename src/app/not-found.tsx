import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";

// Unknown URLs return a real 404 with noindex (never a redirect to login), so Google drops them instead of reporting soft 404s.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <InfoPage title="Page not found" intro="This page does not exist or has moved.">
      <p>
        Go back to the <Link href="/">TechOrbitInd home page</Link> to browse Full Stack, AI, Cloud, DSA and System Design
        topics.
      </p>
    </InfoPage>
  );
}
