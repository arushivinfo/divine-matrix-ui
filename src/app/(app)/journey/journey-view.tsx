"use client";

import { useState } from "react";
import { EngineNotice } from "@/components/engine-notice";
import { Badge, Card, CardTitle, PageHeader, Skeleton, cx, type Tone } from "@/components/ui";
import { istDay } from "@/lib/engine/core";
import { fetchJourney, useEngine, type CheckStatus as Status, type TravelDirection } from "@/lib/engine-api";
import { MONTHS_LONG, MONTHS_SHORT, fmtTime } from "@/lib/format";
import { useNow, useProfiles } from "@/lib/profile-context";
import { birthInput } from "@/lib/profiles";

const DIRECTIONS: TravelDirection[] = ["NORTH", "EAST", "SOUTH", "WEST"];
const STATUS: Record<Status, { tone: Tone; label: string }> = {
  clear: { tone: "good", label: "Clear" },
  boost: { tone: "info", label: "Boost" },
  watch: { tone: "warn", label: "Watch" },
  blocked: { tone: "bad", label: "Blocked" },
};
const title = (d: string) => d.charAt(0) + d.slice(1).toLowerCase();

export function JourneyView() {
  const { profile, ready } = useProfiles();
  const now = useNow();
  const [picked, setPicked] = useState<string | null>(null);
  const [direction, setDirection] = useState<TravelDirection>("EAST");
  const day = picked ?? (now ? istDay(now) : null);
  const birth = birthInput(profile);
  const { data: plan, error, retry } = useEngine(
    ready && day ? `${birth.dob}|${birth.tob}|${birth.lat}|${birth.lon}|${day}|${direction}` : null,
    () => fetchJourney(birth, day!, direction),
  );

  const best = plan ? [...plan.months].sort((x, y) => y.score - x.score).slice(0, 2) : [];

  return (
    <>
      <PageHeader kicker="Pick the right day, time and direction" title="Journey Planner" tag="Yatra muhurat · Disha shool" />

      <Card className="!flex-row flex-wrap items-end">
        <div className="flex flex-[1_1_200px] flex-col gap-2">
          <label htmlFor="td" className="text-sm font-semibold">Travel date</label>
          <input
            id="td"
            type="date"
            value={day ?? ""}
            onChange={(e) => e.target.value && setPicked(e.target.value)}
            className="h-13 rounded-2xl border border-line-strong bg-surface px-3.5 font-mono text-[15px]"
          />
        </div>
        <div className="flex flex-[2_1_320px] flex-col gap-2">
          <span className="text-sm font-semibold" id="dir-label">Direction</span>
          <div role="group" aria-labelledby="dir-label" className="grid grid-cols-4 gap-2">
            {DIRECTIONS.map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={d === direction}
                onClick={() => setDirection(d)}
                className={cx(
                  "h-13 cursor-pointer rounded-2xl border font-semibold",
                  d === direction ? "border-fg bg-fg text-bg" : "border-line-strong bg-surface",
                  plan?.blocked === d && d !== direction && "text-red",
                )}
              >
                {title(d)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {error ? (
        <EngineNotice error={error} onRetry={retry} />
      ) : !plan ? (
        <Skeleton className="h-[520px]" />
      ) : (
        <>
          <section className="flex flex-wrap items-center gap-8 rounded-3xl bg-contrast p-7 text-paper">
            <div
              className={cx(
                "flex size-[140px] shrink-0 flex-col items-center justify-center rounded-[32px] text-ink",
                plan.verdict === "GO" ? "bg-signal" : plan.verdict === "CAUTION" ? "bg-[#FFB547]" : "bg-coral",
              )}
            >
              <span className="font-display text-5xl leading-none font-extrabold">{plan.score}</span>
              <span className="text-[13px] font-semibold">out of 100</span>
            </div>
            <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-2.5">
              <span className="font-mono text-xs tracking-[0.12em] text-signal uppercase">Verdict · {plan.verdict}</span>
              <span className="font-display text-3xl font-extrabold tracking-tight">{plan.headline}</span>
              <span className="text-[15px] leading-relaxed text-soft">
                {plan.summary}
                {plan.departure && ` Best departure: ${fmtTime(plan.departure.start)}–${fmtTime(plan.departure.end)} (${plan.departure.name}).`}
              </span>
            </div>
          </section>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
            {plan.checks.map((c) => (
              <div key={c.label} className="flex flex-col gap-2.5 rounded-[20px] border border-line bg-surface p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{c.label}</span>
                  <Badge tone={STATUS[c.status].tone}>{STATUS[c.status].label}</Badge>
                </div>
                <span className="font-display text-xl font-bold">{c.value}</span>
                <span className="text-[13px] leading-normal text-muted">{c.note}</span>
              </div>
            ))}
          </div>

          <Card>
            <CardTitle title="Best months to travel" sub="Next 12 months · Jupiter & Saturn movement" />
            <div className="grid h-40 grid-cols-12 items-end gap-1.5">
              {plan.months.map((m) => (
                <div key={`${m.year}-${m.month}`} className="flex h-full flex-col items-center justify-end gap-1.5" title={`${MONTHS_LONG[m.month]} ${m.year}: ${m.score}`}>
                  <div
                    className={cx("w-full rounded-lg", m.score >= 70 ? "bg-heat-peak" : m.score >= 50 ? "bg-heat-high" : "bg-heat-base")}
                    style={{ height: `${Math.max(m.score, 6)}%` }}
                  />
                  <span className="font-mono text-[11px] text-muted">{MONTHS_SHORT[m.month]}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-fg-2">
              Peak months:{" "}
              {best.map((m, i) => (
                <span key={`${m.year}-${m.month}`}>
                  {i > 0 && " and "}
                  <strong>{MONTHS_LONG[m.month]} {m.year}</strong>
                </span>
              ))}
              .
            </p>
          </Card>
        </>
      )}
    </>
  );
}
