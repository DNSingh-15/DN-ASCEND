import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";
import { safeNextPath } from "@/lib/auth/config";

export const metadata: Metadata = { title: "Log in" };

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const raw = typeof params.next === "string" ? params.next : undefined;
  const next = safeNextPath(raw);
  const notice = raw && next !== "/" ? "Please log in to continue." : undefined;

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue your learning journey."
      footer={<>Your progress, notes and tracks are waiting.</>}
    >
      <LoginForm next={next} notice={notice} />
    </AuthShell>
  );
}
