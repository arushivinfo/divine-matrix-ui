"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
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
  return (
    <div className="bg-ink lg:w-[260px] lg:shrink-0">
      <nav
        aria-label="App"
        className="flex w-full flex-col gap-6 px-4 py-6 text-[#C9CED8] lg:sticky lg:top-0 lg:h-screen lg:gap-7 lg:py-7"
      >
        <div className="px-3">
          <Logo size={24} />
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
        <div className="mt-auto hidden flex-col gap-2.5 rounded-2xl border border-ink-3 bg-ink-2 p-4 lg:flex">
          <span className="text-sm font-semibold text-paper">Add another profile</span>
          <span className="text-[13px] leading-normal text-soft">Track family, partners or your team.</span>
          <Link href="/start" className="self-start rounded-full bg-lime px-3.5 py-2.5 text-[13px] font-semibold text-ink">
            New profile
          </Link>
        </div>
    </nav>
    </div>
  );
}
