import fs from "node:fs";
import path from "node:path";

// Intrinsic width/height of images in public/, read from the file header at build time, so <img> tags in the notes can
// carry width and height attributes. The browser then reserves the right space before the image loads (no layout shift).

const cache = new Map<string, { width: number; height: number } | null>();

function read(file: string): { width: number; height: number } | null {
  const b = fs.readFileSync(file);
  // PNG: IHDR chunk
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  // WebP: RIFF....WEBP + VP8 / VP8L / VP8X
  if (b.length > 30 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const chunk = b.toString("ascii", 12, 16);
    if (chunk === "VP8 ") return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (chunk === "VP8L") {
      const bits = b.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (chunk === "VP8X") return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
  }
  // JPEG: walk the segments to the first SOFn marker
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) return null;
      const marker = b[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return null;
}

/** Size of a site-relative image such as "/images/node.webp"; null for remote URLs, unknown formats or missing files. */
export function localImageSize(src: string | undefined): { width: number; height: number } | null {
  if (!src || !src.startsWith("/") || src.startsWith("//")) return null;
  if (cache.has(src)) return cache.get(src)!;
  let size: { width: number; height: number } | null = null;
  try {
    const publicDir = path.join(process.cwd(), "public");
    const file = path.join(publicDir, decodeURIComponent(src.split(/[?#]/)[0]));
    if (file.startsWith(publicDir + path.sep)) size = read(file);
  } catch {
    size = null;
  }
  cache.set(src, size);
  return size;
}
