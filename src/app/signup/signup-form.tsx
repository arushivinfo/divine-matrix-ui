"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authInputClass } from "@/components/auth-shell";
import { USERNAME_PATTERN, useAuth } from "@/lib/auth-context";

export function SignupForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!USERNAME_PATTERN.test(username)) {
      setError("Username must be 3–24 characters: letters, numbers, dots or underscores.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { needsConfirmation } = await signUp(username, email, password);
      if (needsConfirmation) {
        setCheckEmail(true);
        setBusy(false);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  if (checkEmail) {
    return (
      <div className="flex w-full max-w-[440px] flex-col gap-4" role="status">
        <h2 className="font-display text-4xl font-extrabold tracking-[-0.03em]">Check your email</h2>
        <p className="leading-relaxed text-muted">
          We sent a confirmation link to <strong className="text-fg">{email.trim()}</strong>. Open it, then come back and sign in.
        </p>
        <Link href="/login" className="mt-2 flex h-14 items-center justify-center rounded-full bg-cobalt font-semibold text-white">
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-[440px] flex-col gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-4xl font-extrabold tracking-[-0.03em]">Create an account</h2>
        <p className="text-muted">
          Already have one?{" "}
          <Link href="/login" className="font-semibold text-link">
            Sign in
          </Link>
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="username" className="text-sm font-semibold">Username</label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value.trim())}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          aria-describedby="username-hint"
          className={authInputClass}
        />
        <span id="username-hint" className="text-xs text-muted">3–24 characters: letters, numbers, dots or underscores.</span>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-semibold">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={authInputClass} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-semibold">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          aria-describedby="password-hint"
          className={authInputClass}
        />
        <span id="password-hint" className="text-xs text-muted">At least 6 characters.</span>
      </div>
      {error && (
        <p role="alert" className="rounded-2xl bg-red-soft px-4 py-3 text-sm font-medium text-red">{error}</p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="flex h-14 cursor-pointer items-center justify-center rounded-full bg-cobalt font-semibold text-white disabled:cursor-wait disabled:opacity-70"
      >
        {busy ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
