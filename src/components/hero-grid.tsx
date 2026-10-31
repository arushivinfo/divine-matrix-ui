"use client";

import { useEffect, useState } from "react";
import { HEAT_INFO, HEAT_LEVELS, heatLevel, heatSwatch } from "@/lib/heat";

/** Illustrative load values for the marketing grid (not a real profile). */
const BASE: [string, number][] = [
  ["Aries", 34], ["Leo", 29], ["Sagittarius", 24],
  ["Capricorn", 22], ["Taurus", 19], ["Virgo", 31],
  ["Libra", 27], ["Aquarius", 35], ["Gemini", 25],
  ["Cancer", 20], ["Scorpio", 28], ["Pisces", 23],
];

export function HeroGrid() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between font-mono text-xs tracking-[0.08em] text-muted-2 uppercase">
        <span>Energy Grid</span>
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-signal" style={{ animation: "dm-pulse 1.8s ease-out infinite" }} />
          Live · Today
        </span>
      </div>
      <div className="relative overflow-hidden rounded-2xl">
        <div className="grid grid-cols-3 gap-2.5">
          {BASE.map(([zone, base], i) => {
            const score = tick === 0 ? base : base + ((tick * 7 + i * 5) % 7) - 3;
            const t = heatLevel(score);
            const enter = `dm-in 0.6s cubic-bezier(.2,.7,.2,1) ${i * 70}ms both`;
            return (
              <div
                key={zone}
                className="flex min-h-[72px] flex-col justify-between gap-2 rounded-xl p-3"
                style={{
                  background: heatSwatch(t, "dark").bg,
                  color: heatSwatch(t, "dark").fg,
                  transition: "background-color 0.9s ease, color 0.9s ease",
                  animation: t === "peak" ? `${enter}, dm-peak-glow 2.4s ease-in-out ${900 + i * 70}ms infinite` : enter,
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
          className="pointer-events-none absolute inset-x-0 h-0.5 bg-signal opacity-55"
          style={{ boxShadow: "0 0 14px 2px rgba(50,213,131,.6)", animation: "dm-scan 3.6s linear infinite" }}
        />
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-soft">
        {HEAT_LEVELS.map((lvl) => (
          <span key={lvl} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[3px]" style={{ background: heatSwatch(lvl, "dark").bg }} />
            {HEAT_INFO[lvl].label}
          </span>
        ))}
      </div>
    </div>
  );
}
