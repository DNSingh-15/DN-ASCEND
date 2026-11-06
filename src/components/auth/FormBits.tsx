import type { ReactNode } from "react";

export function FormAlert({ tone, children }: { tone: "error" | "info"; children: ReactNode }) {
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`rounded-xl px-4 py-3 text-sm ${tone === "error" ? "auth-alert-error" : "auth-alert-info"}`}>
      {children}
    </div>
  );
}

export function SubmitButton({ pending, label, pendingLabel }: { pending: boolean; label: string; pendingLabel: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="accent-chip auth-submit flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[15px] font-semibold"
    >
      {pending && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />}
      {pending ? pendingLabel : label}
    </button>
  );
}
