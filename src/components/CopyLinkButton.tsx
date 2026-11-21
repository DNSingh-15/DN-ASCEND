"use client";

import { useState } from "react";

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <button type="button" onClick={copy} className="glass-tile inline-flex rounded-xl px-3 py-1.5 transition hover:scale-[1.03]">
      <span aria-live="polite">{copied ? "Link copied ✓" : "Copy link"}</span>
    </button>
  );
}
