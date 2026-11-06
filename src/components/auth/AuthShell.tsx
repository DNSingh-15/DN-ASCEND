import type { CSSProperties, ReactNode } from "react";

/** Centered glass card used by the login and signup pages. */
export default function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-11rem)] items-center justify-center py-4" style={{ "--accent": "var(--accent-default)" } as CSSProperties}>
      <section className="glass glass-strong relative w-full max-w-md overflow-hidden rounded-3xl px-6 py-8 sm:px-9 sm:py-10">
        <span className="accent-orb" aria-hidden />
        <span className="accent-orb auth-orb-2" aria-hidden />
        <div className="relative">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-2xl text-white shadow-lg shadow-indigo-500/30 dark:from-cyan-500 dark:via-teal-500 dark:to-sky-600 dark:shadow-teal-500/30">
            ⚡
          </span>
          <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-1.5 text-muted">{subtitle}</p>
          <div className="mt-7">{children}</div>
          {footer && <div className="mt-6 border-t border-[var(--border)] pt-5 text-center text-sm text-muted">{footer}</div>}
        </div>
      </section>
    </div>
  );
}
