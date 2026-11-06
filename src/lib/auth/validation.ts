// Form validation shared by the browser (instant feedback) and the server (the real check).
// Keep this file free of Node-only imports so client components can use it.

export type SignupInput = { fullName: string; email: string; password: string; confirmPassword: string };
export type LoginInput = { email: string; password: string };
export type SignupErrors = Partial<Record<keyof SignupInput, string>>;
export type LoginErrors = Partial<Record<keyof LoginInput, string>>;

export const NAME_MIN = 2;
export const NAME_MAX = 60;
export const EMAIL_MAX = 254;
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M} '.-]*$/u;

export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

export function normalizeEmail(email: string): string {
  return email.trim();
}

/** Lower-cased form used for uniqueness checks (emails are case-insensitive). */
export function emailKey(email: string): string {
  return normalizeEmail(email).toLowerCase();
}

export function passwordChecks(password: string) {
  return {
    length: password.length >= PASSWORD_MIN,
    letter: /\p{L}/u.test(password),
    number: /\d/.test(password),
  };
}

export function validateName(value: string): string | undefined {
  const name = normalizeName(value);
  if (!name) return "Full name is required.";
  if (name.length < NAME_MIN) return `Full name must be at least ${NAME_MIN} characters.`;
  if (name.length > NAME_MAX) return `Full name must be at most ${NAME_MAX} characters.`;
  if (!NAME_RE.test(name)) return "Full name can only contain letters, spaces, apostrophes, periods and hyphens.";
}

export function validateEmail(value: string): string | undefined {
  const email = normalizeEmail(value);
  if (!email) return "Email is required.";
  if (email.length > EMAIL_MAX || !EMAIL_RE.test(email)) return "Enter a valid email address.";
}

export function validateNewPassword(value: string): string | undefined {
  if (!value) return "Password is required.";
  if (value.length > PASSWORD_MAX) return `Password must be at most ${PASSWORD_MAX} characters.`;
  const c = passwordChecks(value);
  if (!c.length) return `Password must be at least ${PASSWORD_MIN} characters.`;
  if (!c.letter || !c.number) return "Password must include at least one letter and one number.";
}

export function validateSignup(input: SignupInput): SignupErrors {
  const errors: SignupErrors = {};
  const name = validateName(input.fullName);
  const email = validateEmail(input.email);
  const password = validateNewPassword(input.password);
  if (name) errors.fullName = name;
  if (email) errors.email = email;
  if (password) errors.password = password;
  if (!input.confirmPassword) errors.confirmPassword = "Please confirm your password.";
  else if (!password && input.password !== input.confirmPassword) errors.confirmPassword = "Passwords do not match.";
  return errors;
}

export function validateLogin(input: LoginInput): LoginErrors {
  const errors: LoginErrors = {};
  const email = validateEmail(input.email);
  if (email) errors.email = email;
  if (!input.password) errors.password = "Password is required.";
  else if (input.password.length > PASSWORD_MAX) errors.password = "Password is too long.";
  return errors;
}
