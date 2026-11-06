// Browser-side calls to the /api/auth/* routes. Components use these instead of calling fetch directly.

export type ClientUser = { id: string; fullName: string; email: string; createdAt: string };
export type ApiResult<E = Record<string, string>> =
  | { ok: true; user: ClientUser }
  | { ok: false; status: number; error: string; fieldErrors?: Partial<E> };

async function post<E>(url: string, body?: unknown): Promise<ApiResult<E>> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: "same-origin",
    });
  } catch {
    return { ok: false, status: 0, error: "Network error. Check your connection and try again." };
  }
  const data = await res.json().catch(() => ({}));
  if (res.ok) return { ok: true, user: data.user };
  return { ok: false, status: res.status, error: data.error ?? "Something went wrong. Please try again.", fieldErrors: data.fieldErrors };
}

export const signup = <E,>(input: { fullName: string; email: string; password: string; confirmPassword: string }) =>
  post<E>("/api/auth/signup", input);

export const login = <E,>(input: { email: string; password: string }) => post<E>("/api/auth/login", input);

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" }).catch(() => {});
}

export async function fetchSession(): Promise<{ user: ClientUser | null; status: number }> {
  try {
    const res = await fetch("/api/auth/session", { credentials: "same-origin", cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    return { user: res.ok ? data.user : null, status: res.status };
  } catch {
    return { user: null, status: 0 };
  }
}

/** Full navigation so the proxy and header see the new cookie straight away. */
export function goTo(path: string) {
  window.location.replace(path);
}
