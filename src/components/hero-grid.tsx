"use client";

import { useEffect, useState } from "react";

const TONE = {
  peak: ["#2F45FF", "#FFFFFF"],
  high: ["#8E9BFF", "#0D1117"],
  steady: ["#2A303C", "#C9CED8"],
  low: ["#FF8A5B", "#0D1117"],
} as const;

/** Illustrative load values for the marketing grid (not a real profile). */
const BASE: [string, number][] = [
  ["Aries", 34], ["Leo", 29], ["Sagittarius", 24],
  ["Capricorn", 22], ["Taurus", 19], ["Virgo", 31],
  ["Libra", 27], ["Aquarius", 35], ["Gemini", 25],
  ["Cancer", 20], ["Scorpio", 28], ["Pisces", 23],
];

const level = (s: number) => (s >= 34 ? "peak" : s >= 28 ? "high" : s >= 21 ? "steady" : "low");

export function HeroGrid() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4.5 rounded-[28px] border border-ink-3 bg-ink-2 p-7">
      <div className="flex items-center justify-between font-mono text-xs tracking-[0.08em] text-muted-2 uppercase">
        <span>Energy Grid</span>
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-lime" style={{ animation: "dm-pulse 1.8s ease-out infinite" }} />
          Live · Today
        </span>
      </div>
      <div className="relative overflow-hidden rounded-2xl">
        <div className="grid grid-cols-3 gap-2.5">
          {BASE.map(([zone, base], i) => {
            const score = tick === 0 ? base : base + ((tick * 7 + i * 5) % 7) - 3;
            const t = level(score);
            const enter = `dm-in 0.6s cubic-bezier(.2,.7,.2,1) ${i * 70}ms both`;
            return (
              <div
                key={zone}
                className="flex min-h-16 flex-col justify-between gap-2 rounded-[14px] p-3.5"
                style={{
                  background: TONE[t][0],
                  color: TONE[t][1],
                  transition: "background-color 0.9s ease, color 0.9s ease",
                  animation: t === "peak" ? `${enter}, dm-glow 2.4s ease-in-out ${900 + i * 70}ms infinite` : enter,
                }}
              >
                <span className="text-xs font-semibold opacity-85">{zone}</span>
                <span key={tick} className="font-mono text-xl font-semibold" style={{ animation: "dm-tick 0.5s ease both" }}>
                  {score}
                </span>
              </div>
            );
          })}
        </div>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 h-0.5 bg-lime opacity-55"
          style={{ boxShadow: "0 0 14px 2px rgba(212,255,58,.6)", animation: "dm-scan 3.6s linear infinite" }}
        />
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-soft">
        {[
          ["#2F45FF", "Peak"],
          ["#8E9BFF", "High"],
          ["#2A303C", "Steady"],
          ["#FF8A5B", "Low"],
        ].map(([c, l]) => (
          <span key={l} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[3px]" style={{ background: c }} />
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}
