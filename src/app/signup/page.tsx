import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = { title: "Create an account" };

export default function SignupPage() {
  return (
    <AuthShell title="Your matrix, on every device." body="Create a free account to save profiles for yourself, family, partners and your team.">
      <SignupForm />
    </AuthShell>
  );
}
