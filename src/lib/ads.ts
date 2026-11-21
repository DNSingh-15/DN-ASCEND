// Google AdSense settings. Nothing ad-related is rendered until a real publisher ID is configured, so the site never ships
// placeholder or invalid ad code. Set these in Netlify's environment variables, then redeploy (they are read at build time):
//
//   ADSENSE_CLIENT_ID  your publisher ID, e.g. ca-pub-1234567890123456 (AdSense → Account → Account information)
//   ADSENSE_SLOT_ID    optional: the ID of a responsive display ad unit (AdSense → Ads → By ad unit).
//                      Without it, ad-eligible pages only load the AdSense script, so Auto ads can run there.
//
// Ads only ever appear on pages that render <AdUnit />: Home, track, course and full topic pages. The login, signup, dashboard,
// information pages and signed-out topic previews never load the AdSense script, so ads cannot overlap the sign-in forms.

function valid(value: string | undefined, pattern: RegExp): string | null {
  const v = value?.trim();
  return v && pattern.test(v) ? v : null;
}

export const ADSENSE_CLIENT = valid(process.env.ADSENSE_CLIENT_ID, /^ca-pub-\d{10,20}$/);
export const ADSENSE_SLOT = valid(process.env.ADSENSE_SLOT_ID, /^\d{5,20}$/);

/** The line Google expects in /ads.txt for this publisher (null when AdSense is not configured). */
export function adsTxtLine(): string | null {
  return ADSENSE_CLIENT ? `google.com, ${ADSENSE_CLIENT.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0` : null;
}
