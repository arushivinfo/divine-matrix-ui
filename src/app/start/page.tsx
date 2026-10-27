import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { StartForm } from "./start-form";

export const metadata: Metadata = { title: "Create your matrix" };

const POINTS = [
  ["M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z", "Calculated privately in your browser"],
  ["M12 7v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z", "Results in under a second"],
  ["M5 12l5 5L20 7", "Save multiple profiles"],
];

export default function StartPage() {
  return (
    <div className="flex min-h-screen flex-wrap">
      <aside className="flex min-w-0 flex-[1_1_420px] flex-col justify-between gap-12 bg-ink p-8 text-paper sm:p-12">
        <Logo />
        <div className="flex max-w-[440px] flex-col gap-5">
          <h1 className="font-display text-[48px] leading-[1.05] font-extrabold tracking-[-0.03em]">Your map starts with one moment.</h1>
          <p className="text-[17px] leading-relaxed text-soft">
            The more precise your birth time, the sharper your grid. Within a few minutes is ideal.
          </p>
        </div>
        <ul className="flex flex-col gap-3.5 text-[15px] text-[#C9CED8]">
          {POINTS.map(([icon, text]) => (
            <li key={text} className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4FF3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={icon} />
              </svg>
              {text}
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex min-w-0 flex-[999_1_560px] items-center justify-center px-6 py-16 sm:px-12">
        <StartForm />
      </main>
    </div>
  );
}
