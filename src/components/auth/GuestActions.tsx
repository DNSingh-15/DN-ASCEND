"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchSession } from "./auth-client";

/**
 * Login / Create Account buttons for the Home hero, shown only to visitors without a session.
 * Decided in the browser (sharing the header's session request) so the Home page itself stays static and CDN-cacheable.
 */
export default function GuestActions() {
  const [guest, setGuest] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchSession().then(({ user }) => {
      if (!cancelled && !user) setGuest(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!guest) return null;
  return (
    <>
      <Link href="/login" className="glass-tile rounded-xl px-5 py-2.5 text-[15px] font-semibold transition hover:scale-[1.03]">
        Login
      </Link>
      <Link href="/signup" className="glass-tile rounded-xl px-5 py-2.5 text-[15px] font-semibold transition hover:scale-[1.03]">
        Create Account
      </Link>
    </>
  );
}
