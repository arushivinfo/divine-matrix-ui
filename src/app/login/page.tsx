import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back." body="Sign in to see your matrix and every profile you’ve saved, on any device.">
      <LoginForm />
    </AuthShell>
  );
}
