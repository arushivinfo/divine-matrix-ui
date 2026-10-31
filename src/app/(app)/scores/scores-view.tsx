"use client";

import { useState } from "react";
import { DayPicker } from "@/components/day-picker";
import { EngineNotice } from "@/components/engine-notice";
import { Badge, Bar, Card, CardTitle, PageHeader, Ring, Segmented, Skeleton, cx, type Tone } from "@/components/ui";
import { PLANET_CODE, PLANET_NAME } from "@/lib/engine/constants";
import { istDay } from "@/lib/engine/core";
import { fetchAnalysis, useEngine, type HourMode, type Risk } from "@/lib/engine-api";
import { useNow, useProfiles } from "@/lib/profile-context";
import { birthInput } from "@/lib/profiles";

const LEVEL_TONE: Record<string, Tone> = { LOW: "good", MEDIUM: "warn", HIGH: "bad", CRITICAL: "bad" };
const RISK_TONE: Record<Risk, Tone> = { low: "good", moderate: "warn", high: "bad" };

export function ScoresView() {
  const { profile, ready } = useProfiles();
  const now = useNow();
  const [picked, setPicked] = useState<string | null>(null);
  const [mode, setMode] = useState<HourMode>("business");

  const day = picked ?? (now ? istDay(now) : null);
  const birth = birthInput(profile);
  const { data: a, error, retry } = useEngine(
    ready && day ? `${birth.dob}|${birth.tob}|${birth.lat}|${birth.lon}|${day}|${mode}` : null,
    () => fetchAnalysis(birth, day!, mode),
  );

  return (
    <>
      <PageHeader
        kicker={`Scored for ${profile.name} · live positions for the chosen day`}
        title="Life Scores"
        tag="KP cusps · Gochar · Vastu"
        actions={day && <DayPicker value={day} onChange={setPicked} />}
      />
      {error ? (
        <EngineNotice error={error} onRetry={retry} />
      ) : !a ? (
        <Skeleton className="h-[640px]" />
      ) : (
        <>
          <div className="flex flex-wrap gap-6">
            <Card dark className="flex-[1_1_320px] !flex-row flex-wrap items-center !gap-7">
              <Ring value={a.overall.score} size={148} stroke={14} label={`Overall score ${a.overall.score} of 100`}>
                <span className="font-display text-[40px] leading-none font-extrabold">{a.overall.score}</span>
                <span className="text-xs text-soft">of 100</span>
              </Ring>
              <div className="flex min-w-0 flex-[1_1_200px] flex-col gap-3">
                <span className="font-display text-2xl font-extrabold">{a.overall.verdict}</span>
                {a.overall.parts.map((p) => (
                  <div key={p.label} className="flex justify-between border-b border-ink-3 pb-2 text-sm">
                    <span className="text-soft">{p.label}</span>
                    <span className="font-mono font-semibold">{p.value}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="flex-[1_1_320px]">
              <span className="font-mono text-xs tracking-[0.12em] text-link uppercase">Your brief</span>
              <p className="font-display text-[22px] leading-snug font-bold">{a.brief.headline}</p>
              <ul className="flex list-disc flex-col gap-2 pl-5 text-[15px] leading-normal text-fg-2">
                {a.brief.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-6">
            <Card>
              <CardTitle title="Wealth" sub="Where money works hardest right now" right={<Badge tone="info">{a.wealth.trend}</Badge>} />
              {(
                [
                  ["Property", a.wealth.property, "#2F45FF", "Mars · 4th house"],
                  ["Shares", a.wealth.shares, "#8E9BFF", "Mercury + Rahu · 5th & 11th"],
                  ["Gold", a.wealth.gold, "#B45309", "Jupiter · 2nd & 9th"],
                ] as const
              ).map(([label, s, color, hint]) => (
                <div key={label} className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">{label}</span>
                    <span className="font-mono font-semibold">
                      {s.score}%{" "}
                      <span className={cx("text-xs", s.transit > 0 ? "text-green" : s.transit < 0 ? "text-red" : "text-muted")}>
                        {s.transit > 0 ? `▲${s.transit}` : s.transit < 0 ? `▼${Math.abs(s.transit)}` : "●0"}
                      </span>
                    </span>
                  </div>
                  <Bar value={s.score} color={color} />
                  <span className="text-xs text-muted">{hint}</span>
                </div>
              ))}
            </Card>

            <Card>
              <CardTitle
                title="Conflict risk"
                sub="Friction in relationships and at work"
                right={<Badge tone={LEVEL_TONE[a.conflict.level]} mono>{a.conflict.level}</Badge>}
              />
              <Bar value={a.conflict.score} color={a.conflict.score >= 45 ? "#C9372C" : a.conflict.score >= 20 ? "#B45309" : "#047857"} />
              {a.conflict.triggers.length === 0 ? (
                <p className="text-sm font-medium text-green">No active friction — all clear.</p>
              ) : (
                a.conflict.triggers.map((t) => (
                  <div key={t.text} className="flex items-center gap-2.5 rounded-xl bg-subtle px-3 py-2.5 text-sm">
                    <span className={cx("size-2 shrink-0 rounded-full", t.severity === "medium" ? "bg-amber" : "bg-red")} />
                    {t.text}
                  </div>
                ))
              )}
              {a.conflict.triggers[0] && (
                <p className="rounded-xl bg-cobalt-soft p-3 text-sm leading-normal text-fg-2">
                  Suggested practice: {a.conflict.triggers[0].practice}
                </p>
              )}
            </Card>

            <Card>
              <CardTitle title="Best hours" sub="Hora-based timing for the chosen day" />
              <Segmented
                label="Purpose"
                value={mode}
                onChange={setMode}
                options={[
                  { value: "business", label: "Business" },
                  { value: "partner", label: "Partner" },
                  { value: "dating", label: "Dating" },
                ]}
              />
              <div className="rounded-2xl bg-cobalt-soft p-3.5 text-center">
                <span className="block text-xs text-fg-2">Peak window</span>
                <span className="block font-display text-2xl font-extrabold text-link">
                  {a.hours.window.from} – {a.hours.window.to}
                </span>
                <span className="block font-mono text-xs text-muted">{a.hours.window.lords.map((l) => PLANET_NAME[l]).join(", ")} hora</span>
              </div>
              <div className="grid grid-cols-6 gap-1">
                {a.hours.slots.map((h) => (
                  <span
                    key={h.hour}
                    title={`${PLANET_NAME[h.lord]} hora`}
                    className={cx(
                      "rounded-md py-1.5 text-center font-mono text-[11px] font-semibold",
                      h.score >= 3 ? "bg-heat-peak text-heat-peak-fg" : h.score >= 2 ? "bg-heat-high text-heat-high-fg" : h.score < 0 ? "bg-red-soft text-red" : "bg-subtle text-muted",
                    )}
                  >
                    {String(h.hour).padStart(2, "0")}
                    <span className="block text-[10px] opacity-75">{PLANET_CODE[h.lord]}</span>
                  </span>
                ))}
              </div>
            </Card>

            <Card>
              <CardTitle title="Learning & exams" sub="Focus, competition and higher study" />
              {(
                [
                  ["Focus & memory", a.learning.focus, "Mercury · 5th house"],
                  ["Competitive exams", a.learning.competition, "Mars + Rahu · 6th house"],
                  ["Higher education", a.learning.higherEd, "Jupiter · 9th house"],
                ] as const
              ).map(([label, score, hint]) => (
                <div key={label} className="flex items-center justify-between gap-3 rounded-[14px] bg-subtle px-3.5 py-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold">{label}</span>
                    <span className="text-xs text-muted">{hint}</span>
                  </div>
                  <Badge tone={score >= 75 ? "good" : score >= 50 ? "warn" : "bad"} mono>{score}</Badge>
                </div>
              ))}
              <p className="text-sm leading-normal text-fg-2">{a.learning.tip}</p>
            </Card>

            <Card>
              <CardTitle title="Wellbeing" sub="KP cusp sub-lords and dosha balance" />
              <div className="flex flex-col gap-2">
                {a.health.cusps.map((c) => (
                  <div key={c.house} className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-muted">{c.label}</span>
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-xs">{PLANET_NAME[c.lord]}</span>
                      <Badge tone={RISK_TONE[c.risk]}>{c.status}</Badge>
                    </span>
                  </div>
                ))}
              </div>
              {(
                [
                  ["Vata", a.health.doshas.vata, "#2F45FF"],
                  ["Pitta", a.health.doshas.pitta, "#E5484D"],
                  ["Kapha", a.health.doshas.kapha, "#0E7C66"],
                ] as const
              ).map(([label, pct, color]) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="min-w-[60px] text-sm font-semibold">{label}</span>
                  <div className="flex-1"><Bar value={pct} color={color} /></div>
                  <span className="min-w-10 text-right font-mono text-[13px] font-semibold">{pct}%</span>
                </div>
              ))}
              {a.health.watch.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {a.health.watch.map((o) => (
                    <span key={o} className="rounded-full bg-red-soft px-2.5 py-1.5 text-[13px] text-red">{o}</span>
                  ))}
                </div>
              )}
              <p className="text-sm leading-normal text-fg-2">{a.health.advice}</p>
              <p className="text-xs leading-normal text-muted">For reflection only, not a diagnosis. Please consult a qualified medical professional.</p>
            </Card>

            <Card>
              <CardTitle title="Space alignment" sub="How each direction of your home or desk supports you" />
              <div className="grid grid-cols-3 gap-1.5">
                {a.space.map((d) => (
                  <div
                    key={d.dir}
                    title={`${PLANET_NAME[d.lord]} · ${d.score > 0 ? "+" : ""}${d.score}`}
                    className={cx(
                      "flex flex-col gap-0.5 rounded-xl px-2 py-3 text-center",
                      d.score >= 2 ? "bg-cobalt text-white" : d.score === 1 ? "bg-cobalt-soft text-fg" : d.score <= -1 ? "bg-red-soft text-red" : "bg-subtle text-fg",
                    )}
                  >
                    <span className="font-mono text-[13px] font-semibold">{d.dir === "C" ? "Centre" : d.dir}</span>
                    <span className="text-xs">{PLANET_NAME[d.lord]}</span>
                    <span className="font-mono text-sm font-semibold">{d.score > 0 ? `+${d.score}` : d.score}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-fg-2">
                Activate:{" "}
                {a.space.filter((d) => d.score >= 1).map((d) => (d.dir === "C" ? "Centre" : d.dir)).join(", ") || "—"}
                {a.space.some((d) => d.score <= -1) && (
                  <> · Blocked: {a.space.filter((d) => d.score <= -1).map((d) => d.dir).join(", ")}</>
                )}
              </p>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
