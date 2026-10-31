"use client";

import { useMemo, useState } from "react";
import { Badge, PageHeader, Segmented, Skeleton, cx } from "@/components/ui";
import { LIFE_SECTOR, PLANET_CODE } from "@/lib/engine/constants";
import {
  chara,
  currentPeriod,
  periodStatus,
  vimshottari,
  vimshottariSub,
  yogini,
  yoginiSub,
  type Period,
} from "@/lib/engine/dasha";
import { fmtMonthYear } from "@/lib/format";
import { useChart, useNow } from "@/lib/profile-context";

type System = "vimshottari" | "yogini" | "chara";
const LEVEL_NAMES: Record<System, string[]> = {
  vimshottari: ["Mahadasha", "Antardasha", "Pratyantardasha"],
  yogini: ["Yogini dasha", "Sub-period"],
  chara: ["Chara dasha"],
};

export function ChaptersView() {
  const { chart } = useChart();
  const now = useNow();
  const [system, setSystem] = useState<System>("vimshottari");
  const [path, setPath] = useState<Period[]>([]);

  const top = useMemo(() => {
    if (!chart) return [];
    if (system === "vimshottari") return vimshottari(chart);
    if (system === "yogini") return yogini(chart).slice(0, 8);
    return chara(chart);
  }, [chart, system]);

  const maxDepth = LEVEL_NAMES[system].length - 1;
  const parent = path[path.length - 1];
  const periods = !parent ? top : system === "vimshottari" ? vimshottariSub(parent) : yoginiSub(parent);

  if (!chart || !now) return <Skeleton className="h-[640px]" />;

  const running = currentPeriod(periods, now) ?? periods[0];
  const pct = Math.max(0, Math.min(100, Math.round(((now.getTime() - running.start.getTime()) / (running.end.getTime() - running.start.getTime())) * 100)));
  const span = top[top.length - 1].end.getTime() - top[0].start.getTime();
  const nowPct = ((now.getTime() - top[0].start.getTime()) / span) * 100;

  return (
    <>
      <PageHeader
        kicker="The seasons of your life, from birth onward"
        title="Life Chapters"
        tag="Dasha · Vimshottari · Yogini · Chara"
        actions={
          <Segmented
            label="Cycle system"
            value={system}
            onChange={(v) => {
              setSystem(v);
              setPath([]);
            }}
            options={[
              { value: "vimshottari", label: "120-year cycle" },
              { value: "yogini", label: "36-year cycle" },
              { value: "chara", label: "Zone cycle" },
            ]}
          />
        }
      />

      <section className="flex flex-col gap-6 rounded-3xl bg-ink p-7 text-paper">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs tracking-[0.12em] text-signal uppercase">
              Running now · {LEVEL_NAMES[system][path.length]}
            </span>
            <span className="font-display text-4xl font-extrabold tracking-tight">
              {[...path.map((p) => p.label), running.label].join(" · ")}
            </span>
            <span className="text-[15px] text-soft">{running.sub ? `${running.sub} · ` : ""}{LIFE_SECTOR[running.lord]}</span>
          </div>
          <div className="flex flex-wrap gap-8">
            <Fact label="Started" value={fmtMonthYear(running.start)} />
            <Fact label="Ends" value={fmtMonthYear(running.end)} />
            <Fact label="Progress" value={`${pct}%`} />
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="relative flex h-10 gap-[3px]">
            {top.map((p) => {
              const st = periodStatus(p, now);
              return (
                <span
                  key={p.start.getTime()}
                  title={`${p.label} · ${fmtMonthYear(p.start)} → ${fmtMonthYear(p.end)}`}
                  className={cx(
                    "flex min-w-0 items-center justify-center overflow-hidden rounded-lg font-mono text-[11px] font-semibold",
                    st === "now" ? "bg-signal text-ink" : st === "done" ? "bg-ink-3 text-muted-2" : "bg-cobalt text-white",
                  )}
                  style={{ flex: `${p.years} 1 0` }}
                >
                  {system === "chara" ? p.label.slice(0, 3) : PLANET_CODE[p.lord]}
                </span>
              );
            })}
            {nowPct >= 0 && nowPct <= 100 && (
              <span aria-hidden="true" className="absolute -top-1.5 -bottom-1.5 w-[3px] rounded bg-white" style={{ left: `${nowPct}%` }} />
            )}
          </div>
          <div className="flex justify-between font-mono text-xs text-muted-2">
            <span>{fmtMonthYear(top[0].start)}</span>
            <span>{fmtMonthYear(top[top.length - 1].end)}</span>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => setPath([])}
          className="min-h-9 cursor-pointer rounded-full border border-[#D5D9E0] bg-white px-3.5 font-semibold text-cobalt"
        >
          All chapters
        </button>
        {path.map((p, i) => (
          <span key={p.start.getTime()} className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C94A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
            <button type="button" onClick={() => setPath(path.slice(0, i + 1))} className="cursor-pointer font-semibold">
              {p.label}
            </button>
          </span>
        ))}
        <span className="ml-auto text-muted">
          {path.length < maxDepth ? "Tap a chapter to open its sub-chapters" : LEVEL_NAMES[system][path.length]}
        </span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3.5">
        {periods.map((p) => {
          const st = periodStatus(p, now);
          const canOpen = path.length < maxDepth;
          return (
            <button
              key={p.start.getTime()}
              type="button"
              disabled={!canOpen}
              onClick={() => canOpen && setPath([...path, p])}
              className={cx(
                "flex min-h-[150px] flex-col gap-2.5 rounded-[20px] border-2 p-4.5 text-left",
                canOpen ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md" : "cursor-default",
                "transition-transform",
                st === "now" ? "border-ink bg-[#ECFDF3]" : "border-line bg-white",
                st === "done" && "opacity-60",
              )}
            >
              <span className="flex w-full items-center justify-between">
                <span className="font-display text-xl font-extrabold">{p.label}</span>
                <Badge tone={st === "now" ? "signal" : st === "done" ? "neutral" : "info"} mono>
                  {st === "now" ? "Now" : st === "done" ? "Done" : "Next"}
                </Badge>
              </span>
              <span className="font-mono text-[13px] font-semibold text-cobalt">{p.years.toFixed(p.years < 1 ? 2 : 1)} yrs</span>
              <span className="font-mono text-xs leading-normal text-muted">
                {fmtMonthYear(p.start)} → {fmtMonthYear(p.end)}
              </span>
              <span className="text-[13px] leading-normal text-[#3A4150]">{p.sub ? `${p.sub} · ` : ""}{LIFE_SECTOR[p.lord]}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-2">{label}</span>
      <span className="font-mono font-semibold">{value}</span>
    </div>
  );
}
