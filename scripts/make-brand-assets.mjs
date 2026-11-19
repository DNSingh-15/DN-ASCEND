// Builds the small brand images from the master logo in public/logo/techorbitind.png (1.1 MB, too heavy to serve on every page).
// Run again after replacing the master logo:   node scripts/make-brand-assets.mjs
// Uses `sharp`, which is installed as a dependency of Next.js. The outputs are committed, so builds never run this.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const master = path.join(root, "public/logo/techorbitind.png");

// The master is 1402x1122 on a solid #000011 background. The cube sits at x 525-888, y 221-633; the wordmark starts at y ~683.
const BG = { r: 0, g: 0, b: 17, alpha: 1 };
const CUBE_CENTER = { x: 706, y: 427 };

/** Square crop around the cube only (never reaches the wordmark), resized to `size`. */
function mark(side, size) {
  return sharp(master)
    .extract({ left: CUBE_CENTER.x - side / 2, top: CUBE_CENTER.y - side / 2, width: side, height: side })
    .resize(size, size)
    .ensureAlpha() // RGBA: required inside favicon.ico, harmless elsewhere
    .png({ compressionLevel: 9, palette: false });
}

const out = (rel) => path.join(root, rel);

// Header and sign-up tile (shown at 36-48px, so 96px covers 2x screens).
await mark(470, 96).toFile(out("public/logo/techorbitind-mark.png"));
// Organization `logo` in structured data (Google wants a square, at least 112px).
await mark(500, 512).toFile(out("public/logo/techorbitind-512.png"));
// Favicons: a tighter crop so the cube stays readable at 16-48px.
await mark(440, 192).toFile(out("src/app/icon.png"));
await mark(440, 180).toFile(out("src/app/apple-icon.png"));

// favicon.ico: a single 48x48 PNG wrapped in an ICO container (browsers and crawlers still request /favicon.ico).
const ico48 = await mark(440, 48).toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // one image
header.writeUInt8(48, 6); // width
header.writeUInt8(48, 7); // height
header.writeUInt16LE(1, 10); // colour planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(ico48.length, 14); // image size
header.writeUInt32LE(22, 18); // image offset
fs.writeFileSync(out("src/app/favicon.ico"), Buffer.concat([header, ico48]));

// Social share card, 1200x630: the full logo (cube + wordmark) fitted to the height, centred on the same background.
const fitted = await sharp(master)
  .extract({ left: 200, top: 170, width: 1002, height: 720 }) // trims empty margin, keeps the whole logo
  .resize({ height: 630, fit: "inside" })
  .toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: BG } })
  .composite([{ input: fitted, gravity: "center" }])
  .png({ compressionLevel: 9, palette: true, quality: 90 })
  .toFile(out("public/logo/techorbitind-og.png"));

for (const f of ["public/logo/techorbitind-mark.png", "public/logo/techorbitind-512.png", "public/logo/techorbitind-og.png", "src/app/icon.png", "src/app/apple-icon.png", "src/app/favicon.ico"]) {
  console.log(f.padEnd(40), `${(fs.statSync(out(f)).size / 1024).toFixed(1)} KB`);
}
