"use client";

import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";

type Props = {
  label: string;
  error?: string;
  hint?: ReactNode;
  icon: ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id">;

export default function AuthField({ label, error, hint, icon, type = "text", ...input }: Props) {
  const id = useId();
  const [reveal, setReveal] = useState(false);
  const isPassword = type === "password";
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(" ") || undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted" aria-hidden>
          {icon}
        </span>
        <input
          id={id}
          type={isPassword && reveal ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`auth-input w-full rounded-xl py-2.5 pl-10 text-[15px] ${isPassword ? "pr-11" : "pr-3"} ${error ? "auth-input-error" : ""}`}
          {...input}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setReveal((v) => !v)}
            aria-label={reveal ? "Hide password" : "Show password"}
            aria-pressed={reveal}
            className="absolute inset-y-0 right-1.5 my-1.5 flex w-8 items-center justify-center rounded-lg text-muted transition hover:text-[var(--fg)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            {reveal ? <EyeOff /> : <Eye />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="auth-error-text text-sm">
          {error}
        </p>
      )}
      {hint && <div id={`${id}-hint`}>{hint}</div>}
    </div>
  );
}

const svg = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Eye() {
  return (
    <svg {...svg} aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg {...svg} aria-hidden>
      <path d="M10.6 5.1A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-2.2 3.2M6.6 6.6A17.4 17.4 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18" />
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg {...svg} aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg {...svg} aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg {...svg} aria-hidden>
      <rect x="4" y="10.5" width="16" height="10.5" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
