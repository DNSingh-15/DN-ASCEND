import { hashPassword, verifyAgainstDummy, verifyPassword } from "./password";
import { DuplicateEmailError, getUserRepository, toPublicUser, type PublicUser } from "./user-repository";
import {
  normalizeEmail,
  normalizeName,
  validateLogin,
  validateSignup,
  type LoginErrors,
  type LoginInput,
  type SignupErrors,
  type SignupInput,
} from "./validation";

// Business rules for sign-up and login. No HTTP or cookie code here, so the same functions can back
// a Route Handler today and an Express/Node service tomorrow.

export type Result<T, E> = { ok: true; value: T } | { ok: false; status: number; error: string; fieldErrors?: E };

export const INVALID_CREDENTIALS = "Incorrect email or password.";
export const EMAIL_TAKEN = "An account with this email already exists. Try logging in instead.";

export async function registerUser(input: SignupInput): Promise<Result<PublicUser, SignupErrors>> {
  const fieldErrors = validateSignup(input);
  if (Object.keys(fieldErrors).length) {
    return { ok: false, status: 400, error: "Please fix the highlighted fields.", fieldErrors };
  }

  const repo = getUserRepository();
  const email = normalizeEmail(input.email);

  // Fast path for a friendly message; create() repeats this check under the file lock, which is the real guarantee.
  if (await repo.findByEmail(email)) {
    return { ok: false, status: 409, error: EMAIL_TAKEN, fieldErrors: { email: EMAIL_TAKEN } };
  }

  try {
    const user = await repo.create({
      fullName: normalizeName(input.fullName),
      email,
      passwordHash: await hashPassword(input.password),
    });
    return { ok: true, value: toPublicUser(user) };
  } catch (err) {
    if (err instanceof DuplicateEmailError) {
      return { ok: false, status: 409, error: EMAIL_TAKEN, fieldErrors: { email: EMAIL_TAKEN } };
    }
    throw err;
  }
}

export async function authenticate(input: LoginInput): Promise<Result<PublicUser, LoginErrors>> {
  const fieldErrors = validateLogin(input);
  if (Object.keys(fieldErrors).length) {
    return { ok: false, status: 400, error: "Please fix the highlighted fields.", fieldErrors };
  }

  const user = await getUserRepository().findByEmail(input.email);
  if (!user) {
    await verifyAgainstDummy(input.password);
    return { ok: false, status: 401, error: INVALID_CREDENTIALS };
  }
  if (!(await verifyPassword(input.password, user.passwordHash))) {
    return { ok: false, status: 401, error: INVALID_CREDENTIALS };
  }
  return { ok: true, value: toPublicUser(user) };
}

export async function getUserById(id: string): Promise<PublicUser | null> {
  const user = await getUserRepository().findById(id);
  return user ? toPublicUser(user) : null;
}
