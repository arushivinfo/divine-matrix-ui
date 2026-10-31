"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useProfiles } from "@/lib/profile-context";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { cx } from "./ui";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" },
  { href: "/scores", label: "Life Scores", icon: "M4 20V10M10 20V4M16 20v-7M22 20H2" },
  { href: "/chapters", label: "Life Chapters", icon: "M4 6h16M4 12h10M4 18h6" },
  { href: "/today", label: "Today", icon: "M12 7v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { href: "/compatibility", label: "Compatibility", icon: "M9 12a4 4 0 100-8 4 4 0 000 8zM15 20a4 4 0 100-8 4 4 0 000 8z" },
  { href: "/journey", label: "Journey Planner", icon: "M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, user, username, signOut } = useAuth();
  const { syncing, syncError } = useProfiles();
  return (
    <div className="bg-contrast lg:w-[260px] lg:shrink-0">
      <nav
        aria-label="App"
        className="flex w-full flex-col gap-6 px-4 py-6 text-[#C9CED8] lg:sticky lg:top-0 lg:h-screen lg:gap-7 lg:py-7"
      >
        <div className="flex items-center justify-between gap-3 pl-3">
          <Logo size={24} />
          <ThemeToggle onDark />
        </div>
        <div className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3 text-[15px] font-medium transition-colors",
                  active ? "bg-[#1E2532] text-white" : "text-soft hover:bg-ink-2 hover:text-white",
                )}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={item.icon} />
                </svg>
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-ink-3 bg-ink-2 p-4 lg:mt-auto lg:flex-col lg:items-stretch">
          {!ready ? (
            <span className="text-sm text-soft">Checking sign-in…</span>
          ) : user ? (
            <>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-xs text-muted-2">Signed in as</span>
                <span className="truncate text-sm font-semibold text-paper">@{username ?? user.email}</span>
                <span className={cx("text-xs", syncError ? "text-coral" : "text-soft")}>
                  {syncError ? "Couldn’t sync profiles" : syncing ? "Syncing profiles…" : "Profiles synced to your account"}
                </span>
              </div>
              <div className="flex gap-2">
                <Link href="/start" className="flex-1 rounded-full bg-signal px-3.5 py-2.5 text-center text-[13px] font-semibold whitespace-nowrap text-ink">
                  New profile
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    await signOut();
                    router.push("/");
                  }}
                  className="cursor-pointer flex-1 rounded-full border border-ink-3 px-3.5 py-2.5 text-center text-[13px] font-semibold whitespace-nowrap text-soft hover:text-white"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-sm font-semibold text-paper">Save your profiles</span>
                <span className="text-[13px] leading-normal text-soft">Sign in to keep them on every device.</span>
              </div>
              <div className="flex gap-2">
                <Link href="/login" className="flex-1 rounded-full bg-signal px-3.5 py-2.5 text-center text-[13px] font-semibold whitespace-nowrap text-ink">
                  Sign in
                </Link>
                <Link href="/signup" className="flex-1 rounded-full border border-ink-3 px-3.5 py-2.5 text-center text-[13px] font-semibold whitespace-nowrap text-soft hover:text-white">
                  Create account
                </Link>
              </div>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
