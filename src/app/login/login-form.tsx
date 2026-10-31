"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authInputClass } from "@/components/auth-shell";
import { useAuth } from "@/lib/auth-context";

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError("Enter your username or email and your password.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await signIn(identifier, password);
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-[440px] flex-col gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-4xl font-extrabold tracking-[-0.03em]">Sign in</h2>
        <p className="text-muted">
          New here?{" "}
          <Link href="/signup" className="font-semibold text-link">
            Create an account
          </Link>
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="identifier" className="text-sm font-semibold">Username or email</label>
        <input
          id="identifier"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          className={authInputClass}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-semibold">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className={authInputClass}
        />
      </div>
      {error && (
        <p role="alert" className="rounded-2xl bg-red-soft px-4 py-3 text-sm font-medium text-red">{error}</p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="flex h-14 cursor-pointer items-center justify-center rounded-full bg-cobalt font-semibold text-white disabled:cursor-wait disabled:opacity-70"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
      <Link href="/dashboard" className="text-center text-sm text-muted hover:text-fg">
        Continue without an account
      </Link>
    </form>
  );
}
