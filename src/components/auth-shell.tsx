import type { ReactNode } from "react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

/** Two-panel layout shared by the sign-in and sign-up pages. */
export function AuthShell({ title, body, children }: { title: string; body: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-wrap">
      <aside className="flex min-w-0 flex-[1_1_420px] flex-col justify-between gap-12 bg-contrast p-8 text-paper sm:p-12">
        <div className="flex items-center justify-between gap-3">
          <Logo />
          <ThemeToggle onDark />
        </div>
        <div className="flex max-w-[440px] flex-col gap-5">
          <h1 className="font-display text-[44px] leading-[1.05] font-extrabold tracking-[-0.03em]">{title}</h1>
          <p className="text-[17px] leading-relaxed text-soft">{body}</p>
        </div>
        <p className="text-sm text-muted-2">Backed by classical Vedic &amp; modern astrology · Powered by the Divine Matrix System™</p>
      </aside>
      <main className="flex min-w-0 flex-[999_1_560px] items-center justify-center px-6 py-16 sm:px-12">{children}</main>
    </div>
  );
}

export const authInputClass = "h-13 rounded-2xl border border-line-strong bg-surface px-4 text-base text-fg";
