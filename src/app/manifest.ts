import type { MetadataRoute } from "next";
import { LOGO_512, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

// /manifest.webmanifest: name, colours and icon when the site is added to a home screen.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#060914",
    theme_color: "#060914",
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png" },
      { src: LOGO_512, sizes: "512x512", type: "image/png" },
    ],
  };
}
