"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useProfiles } from "@/lib/profile-context";
import { cx } from "./ui";

export function ProfileSwitcher() {
  const { profile, profiles, select } = useProfiles();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-12 cursor-pointer items-center gap-2.5 rounded-full border border-line bg-white py-1.5 pr-4 pl-1.5"
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-cobalt text-sm font-semibold text-white">
          {profile.name.charAt(0).toUpperCase()}
        </span>
        <span className="text-sm font-semibold">{profile.name}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-64 rounded-2xl border border-line bg-white p-2 shadow-lg">
          <ul role="listbox" aria-label="Profiles" className="flex flex-col">
            {profiles.map((p) => (
              <li key={p.id} role="option" aria-selected={p.id === profile.id}>
                <button
                  type="button"
                  onClick={() => {
                    select(p.id);
                    setOpen(false);
                  }}
                  className={cx(
                    "flex min-h-11 w-full cursor-pointer items-center justify-between rounded-xl px-3 text-left text-sm",
                    p.id === profile.id ? "bg-cobalt-soft font-semibold text-cobalt" : "hover:bg-paper",
                  )}
                >
                  {p.name}
                  <span className="font-mono text-xs text-muted">{p.dob}</span>
                </button>
              </li>
            ))}
          </ul>
          <Link href="/start" className="mt-1 flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-cobalt hover:bg-paper">
            + New profile
          </Link>
        </div>
      )}
    </div>
  );
}
