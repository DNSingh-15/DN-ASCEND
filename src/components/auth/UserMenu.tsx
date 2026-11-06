"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isAuthPage } from "@/lib/auth/config";
import { fetchSession, goTo, logout, type ClientUser } from "./auth-client";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase() || "?";
}

/**
 * Header account area. Content pages stay statically rendered, so the signed-in user is fetched here
 * on the client. If the cookie points to an account that no longer exists, the user is sent to login.
 */
export default function UserMenu() {
  const pathname = usePathname();
  const onAuthPage = isAuthPage(pathname);
  const [user, setUser] = useState<ClientUser | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onAuthPage) return;
    let cancelled = false;
    fetchSession().then(({ user, status }) => {
      if (cancelled) return;
      if (user) setUser(user);
      else if (status === 401) goTo(`/login?next=${encodeURIComponent(location.pathname + location.search)}`);
    });
    return () => {
      cancelled = true;
    };
  }, [onAuthPage]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function onLogout() {
    setBusy(true);
    await logout();
    goTo("/login");
  }

  if (onAuthPage) {
    return (
      <nav className="flex items-center gap-1 text-sm font-medium">
        <Link href="/login" className={`rounded-xl px-3 py-2 transition ${pathname.startsWith("/login") ? "glass-tile" : "text-muted hover:text-[var(--fg)]"}`}>
          Log in
        </Link>
        <Link href="/signup" className={`rounded-xl px-3 py-2 transition ${pathname.startsWith("/signup") ? "glass-tile" : "text-muted hover:text-[var(--fg)]"}`}>
          Sign up
        </Link>
      </nav>
    );
  }

  if (!user) return <span className="glass-tile h-9 w-9 animate-pulse rounded-xl" aria-hidden />;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${user.fullName}`}
        className="glass-tile flex h-9 items-center gap-2 rounded-xl pl-1 pr-2.5 text-sm font-medium transition hover:scale-[1.03]"
      >
        <span className="accent-chip flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold">{initials(user.fullName)}</span>
        <span className="hidden max-w-[10rem] truncate sm:inline">{user.fullName.split(" ")[0]}</span>
      </button>
      {open && (
        <div role="menu" className="glass glass-strong absolute right-0 mt-2 w-64 rounded-2xl p-2">
          <div className="px-3 py-2">
            <p className="truncate font-semibold">{user.fullName}</p>
            <p className="truncate text-sm text-muted">{user.email}</p>
          </div>
          <div className="my-1 border-t border-[var(--border)]" />
          <button
            type="button"
            role="menuitem"
            onClick={onLogout}
            disabled={busy}
            className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition hover:bg-[var(--glass-hover)] disabled:opacity-60"
          >
            {busy ? "Logging out…" : "Log out"}
          </button>
        </div>
      )}
    </div>
  );
}
