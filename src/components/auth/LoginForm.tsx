"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { validateLogin, type LoginErrors } from "@/lib/auth/validation";
import AuthField, { LockIcon, MailIcon } from "./AuthField";
import { goTo, login } from "./auth-client";
import { FormAlert, SubmitButton } from "./FormBits";

export default function LoginForm({ next, notice }: { next: string; notice?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (pending) return;
    setFormError("");
    const found = validateLogin({ email, password });
    setErrors(found);
    if (Object.keys(found).length) return;

    setPending(true);
    const result = await login<LoginErrors>({ email, password });
    if (result.ok) return goTo(next);
    setPending(false);
    setErrors(result.fieldErrors ?? {});
    setFormError(result.error);
    setPassword("");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {notice && !formError && <FormAlert tone="info">{notice}</FormAlert>}
      {formError && <FormAlert tone="error">{formError}</FormAlert>}

      <AuthField
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        inputMode="email"
        placeholder="you@example.com"
        icon={<MailIcon />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        autoFocus
      />
      <AuthField
        label="Password"
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder="Your password"
        icon={<LockIcon />}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />

      <SubmitButton pending={pending} label="Log in" pendingLabel="Logging in…" />

      <p className="text-center text-sm text-muted">
        New to ASCEND?{" "}
        <Link href={next === "/" ? "/signup" : `/signup?next=${encodeURIComponent(next)}`} className="auth-link font-semibold">
          Create an account
        </Link>
      </p>
    </form>
  );
}
