import { adsTxtLine } from "@/lib/ads";

// /ads.txt (Authorized Digital Sellers), required by AdSense. Built from ADSENSE_CLIENT_ID at build time.
// Until AdSense is configured it is a real 404, so no invalid seller record is published.
export const dynamic = "force-static";

export function GET() {
  const line = adsTxtLine();
  if (!line) return new Response("Not found\n", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  return new Response(`${line}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
