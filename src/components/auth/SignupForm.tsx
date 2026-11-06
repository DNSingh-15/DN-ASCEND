"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { PASSWORD_MIN, passwordChecks, validateSignup, type SignupErrors, type SignupInput } from "@/lib/auth/validation";
import AuthField, { LockIcon, MailIcon, UserIcon } from "./AuthField";
import { goTo, signup } from "./auth-client";
import { FormAlert, SubmitButton } from "./FormBits";

const EMPTY: SignupInput = { fullName: "", email: "", password: "", confirmPassword: "" };

export default function SignupForm({ next }: { next: string }) {
  const [values, setValues] = useState<SignupInput>(EMPTY);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof SignupInput, boolean>>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  // Editing a field re-checks it live once it has been visited, and drops any server message for it
  // (e.g. "email already exists"). Changing the password also re-checks the confirmation.
  function update(field: keyof SignupInput, value: string) {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    const found = validateSignup(nextValues);
    setErrors((prev) => {
      const out: SignupErrors = { ...prev, [field]: touched[field] ? found[field] : undefined };
      if (field === "password" && touched.confirmPassword) out.confirmPassword = found.confirmPassword;
      return out;
    });
  }

  // Leaving a field with something typed in it shows its message; leaving it empty stays quiet until submit.
  function blur(field: keyof SignupInput) {
    if (!values[field]) return;
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateSignup(values)[field] }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (pending) return;
    setFormError("");
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true });
    const found = validateSignup(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setPending(true);
    const result = await signup<SignupErrors>(values);
    if (result.ok) return goTo(next);
    setPending(false);
    setErrors(result.fieldErrors ?? {});
    setFormError(result.error);
  }

  const checks = passwordChecks(values.password);
  const emailTaken = Boolean(errors.email && /already exists/i.test(errors.email));

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {formError && (
        <FormAlert tone="error">
          {formError}
          {emailTaken && (
            <>
              {" "}
              <Link href={`/login${next === "/" ? "" : `?next=${encodeURIComponent(next)}`}`} className="auth-link font-semibold">
                Log in
              </Link>
            </>
          )}
        </FormAlert>
      )}

      <AuthField
        label="Full name"
        name="fullName"
        autoComplete="name"
        placeholder="Jane Doe"
        icon={<UserIcon />}
        value={values.fullName}
        onChange={(e) => update("fullName", e.target.value)}
        onBlur={() => blur("fullName")}
        error={errors.fullName}
        autoFocus
      />
      <AuthField
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        inputMode="email"
        placeholder="you@example.com"
        icon={<MailIcon />}
        value={values.email}
        onChange={(e) => update("email", e.target.value)}
        onBlur={() => blur("email")}
        error={errors.email}
      />
      <AuthField
        label="Password"
        type="password"
        name="password"
        autoComplete="new-password"
        placeholder={`At least ${PASSWORD_MIN} characters`}
        icon={<LockIcon />}
        value={values.password}
        onChange={(e) => update("password", e.target.value)}
        onBlur={() => blur("password")}
        error={errors.password}
        hint={
          <ul className="flex flex-wrap gap-x-4 gap-y-1 pt-0.5 text-xs" aria-label="Password requirements">
            <Rule ok={checks.length}>{`${PASSWORD_MIN}+ characters`}</Rule>
            <Rule ok={checks.letter}>A letter</Rule>
            <Rule ok={checks.number}>A number</Rule>
          </ul>
        }
      />
      <AuthField
        label="Confirm password"
        type="password"
        name="confirmPassword"
        autoComplete="new-password"
        placeholder="Type it again"
        icon={<LockIcon />}
        value={values.confirmPassword}
        onChange={(e) => update("confirmPassword", e.target.value)}
        onBlur={() => blur("confirmPassword")}
        error={errors.confirmPassword}
      />

      <SubmitButton pending={pending} label="Create account" pendingLabel="Creating account…" />

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href={next === "/" ? "/login" : `/login?next=${encodeURIComponent(next)}`} className="auth-link font-semibold">
          Log in
        </Link>
      </p>
    </form>
  );
}

function Rule({ ok, children }: { ok: boolean; children: string }) {
  return (
    <li className={`flex items-center gap-1.5 ${ok ? "auth-rule-ok" : "text-muted"}`}>
      <span aria-hidden>{ok ? "✓" : "○"}</span>
      {children}
      <span className="sr-only">{ok ? "(met)" : "(not met)"}</span>
    </li>
  );
}
