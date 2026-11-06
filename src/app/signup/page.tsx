import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import SignupForm from "@/components/auth/SignupForm";
import { safeNextPath } from "@/lib/auth/config";

export const metadata: Metadata = { title: "Create account" };

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

export default async function SignupPage({ searchParams }: Props) {
  const params = await searchParams;
  const next = safeNextPath(typeof params.next === "string" ? params.next : undefined);

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join ASCEND and start learning step by step."
      footer={<>Your password is hashed before it is stored. We never keep it in plain text.</>}
    >
      <SignupForm next={next} />
    </AuthShell>
  );
}
