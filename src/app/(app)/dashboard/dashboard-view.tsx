"use client";

import { useMemo, useState } from "react";
import { EngineNotice } from "@/components/engine-notice";
import { ProfileSwitcher } from "@/components/profile-switcher";
import { Badge, Card, CardTitle, ClassicTag, Ring, Segmented, Skeleton, cx } from "@/components/ui";
import {
  ALIGNMENT_ADVICE,
  ELEMENTS,
  LIFE_SECTOR,
  MODES,
  PLANET_CODE,
  PLANET_IDS,
  PLANET_NAME,
  RASHI_EN,
  RASHI_TO_RC,
  type PlanetId,
} from "@/lib/engine/constants";
import { calcHouse, dayNoon, findAlignments, formatDegrees, getRashi, istDay, resolveKP, transitFor } from "@/lib/engine/core";
import { currentPeriod, vimshottari, vimshottariSub } from "@/lib/engine/dasha";
import { fetchAnalysis, useDebounced, useEngine } from "@/lib/engine-api";
import { fmtLongDate, fmtMonthYear, greeting } from "@/lib/format";
import { ALIGNMENT_RING, CHIP, HEAT_INFO, HEAT_LEVELS, heatLevel, heatSwatch } from "@/lib/heat";
import { useChart, useNow } from "@/lib/profile-context";
import { birthInput } from "@/lib/profiles";

const ELEMENT_DOT = ["#E5484D", "#B45309", "#2F45FF", "#0E7C66"];

export function DashboardView() {
  const { profile, chart } = useChart();
  const now = useNow();
  const [live, setLive] = useState(true);
  const [days, setDays] = useState(0);

  const today = now ? istDay(now) : null;
  const day = now ? istDay(now, days) : null;
  // Standard astronomy stays in the browser so the grid and slider are instant.
  const livePos = useMemo(() => (day ? transitFor(day) : null), [day]);
  const alignments = useMemo(() => (chart && livePos ? findAlignments(chart.positions, livePos) : []), [chart, livePos]);
  const chapter = useMemo(() => {
    if (!chart || !day) return null;
    const md = currentPeriod(vimshottari(chart), dayNoon(day));
    return { md, ad: md ? currentPeriod(vimshottariSub(md), dayNoon(day)) : undefined };
  }, [chart, day]);

  // Scores come from the private engine; wait until the slider settles before asking.
  const scoreDay = useDebounced(day);
  const birth = birthInput(profile);
  const engine = useEngine(
    chart && scoreDay ? `${birth.dob}|${birth.tob}|${birth.lat}|${birth.lon}|${scoreDay}` : null,
    () => fetchAnalysis(birth, scoreDay!),
  );
  const scores = engine.data;

  if (!chart || !now || !livePos || !chapter || !today) {
    return (
      <>
        <Skeleton className="h-20" />
        <Skeleton className="h-28" />
        <Skeleton className="h-[520px]" />
      </>
    );
  }

  const lagna = chart.lagna.rashi;
  const natalIn = (rashi: number) => PLANET_IDS.filter((p) => getRashi(chart.positions[p].sid) === rashi);
  const liveIn = (rashi: number) => (live ? PLANET_IDS.filter((p) => getRashi(livePos[p].sid) === rashi) : []);
  const alignedRashis = new Set(live ? alignments.map((al) => getRashi(chart.positions[al.natal].sid)) : []);
  const activeSectors = new Set(live ? alignments.map((al) => al.natal) : []);
  const alerts = dedupe(alignments).slice(0, 4);
  const dayLabel = days === 0 ? "Today" : `${days > 0 ? "+" : "−"}${Math.abs(days)} ${Math.abs(days) === 1 ? "day" : "days"}`;

  const rings = [
    { label: "Overall", value: scores?.overall.score, color: "#32D583" },
    { label: "Wealth", value: scores?.overall.parts[0].value, color: "#7CD4FD" },
    { label: "Harmony", value: scores?.overall.parts[1].value, color: "#FFB547" },
    { label: "Learning", value: scores?.overall.parts[4].value, color: "#8E9BFF" },
    { label: "Wellbeing", value: scores?.overall.parts[5].value, color: "#FF8A5B" },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted">{fmtLongDate(now)}</span>
          <h1 className="font-display text-[32px] font-extrabold tracking-tight">
            {greeting(now)}, {profile.name}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Segmented
            label="View"
            value={live ? "live" : "natal"}
            onChange={(v) => setLive(v === "live")}
            options={[
              { value: "natal", label: "My map" },
              { value: "live", label: "Live overlay" },
            ]}
          />
          <ProfileSwitcher />
        </div>
      </div>

      <section aria-label="At a glance" className="flex flex-wrap items-center justify-between gap-3 rounded-[28px] bg-contrast px-6 py-5 text-paper">
        <span className="font-mono text-xs tracking-[0.12em] text-muted-2 uppercase">
          At a glance{days !== 0 && ` · ${dayLabel}`}
        </span>
        <div className="grid w-full grid-cols-3 gap-4 sm:flex sm:w-auto sm:flex-1 sm:flex-wrap sm:justify-end sm:gap-6">
          {rings.map((r) => (
            <div key={r.label} className="flex flex-col items-center gap-1.5 sm:flex-row sm:gap-2.5">
              <Ring value={r.value ?? 0} color={r.color} label={r.value === undefined ? `${r.label} loading` : `${r.label} ${r.value} of 100`}>
                <span className={cx("font-mono text-[15px] font-semibold", r.value === undefined && "animate-pulse text-muted-2")}>
                  {r.value ?? "··"}
                </span>
              </Ring>
              <span className="text-sm font-semibold">{r.label}</span>
            </div>
          ))}
        </div>
      </section>
      {engine.error && <EngineNotice compact error={engine.error} onRetry={engine.retry} />}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <div className="flex flex-col gap-1.5 rounded-[20px] bg-contrast px-6 py-5 text-paper">
          <span className="text-[13px] text-soft">
            Anchor zone <span className="font-mono text-[11px] text-signal">· Lagna</span>
          </span>
          <span className="font-display text-[26px] font-extrabold">
            {RASHI_EN[lagna]} <span className="text-signal">·</span> {ELEMENTS[lagna % 4]}
          </span>
          <span className="font-mono text-[13px] text-soft">{formatDegrees(chart.lagna.sid)} · Whole-sign houses</span>
        </div>
        <Stat label="Overall score" value={scores ? `${scores.overall.score} / 100` : "…"} note={scores?.overall.verdict ?? "Calculating"} tone="text-green" />
        <Stat
          label="Current chapter"
          value={chapter.md ? `${chapter.md.label}${chapter.ad ? " · " + chapter.ad.label : ""}` : "—"}
          note={chapter.ad ? `Until ${fmtMonthYear(chapter.ad.end)}` : ""}
          tone="text-muted"
        />
        <Stat
          label="Best business window"
          value={scores ? `${scores.hours.window.from} – ${scores.hours.window.to}` : "…"}
          note="Hora-based"
          tone="text-link"
        />
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <Card className="min-w-0 flex-[3_1_560px]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-display text-[22px] font-bold">Energy Grid</h2>
                <ClassicTag>Rashi × Tattva · Ashtakavarga</ClassicTag>
              </div>
              <span className="text-sm text-muted">Element × mode, coloured by load index (DMLI).</span>
            </div>
            <div className="flex flex-wrap gap-3.5 text-xs text-muted">
              {HEAT_LEVELS.map((lvl) => (
                <span key={lvl} className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-[3px]" style={{ background: heatSwatch(lvl).bg }} />
                  {HEAT_INFO[lvl].label} {HEAT_INFO[lvl].range}
                </span>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="grid min-w-[560px] grid-cols-[88px_repeat(3,minmax(150px,1fr))] gap-2">
              <span />
              {MODES.map((m) => (
                <span key={m} className="px-2 py-1 font-mono text-[11px] tracking-[0.1em] text-muted uppercase">{m}</span>
              ))}
              {ELEMENTS.map((element, row) => (
                <Row key={element}>
                  <span className="flex items-center gap-2 font-display text-[15px] font-bold">
                    <span className="size-2 rounded-full" style={{ background: ELEMENT_DOT[row] }} />
                    {element}
                  </span>
                  {[0, 1, 2].map((col) => {
                    const rashi = RASHI_TO_RC.findIndex(([r, c]) => r === row && c === col);
                    const load = chart.sav[rashi];
                    const house = calcHouse(rashi, lagna);
                    const forming = alignedRashis.has(rashi);
                    const heat = heatSwatch(heatLevel(load));
                    return (
                      <div
                        key={col}
                        className="flex min-h-[104px] flex-col justify-between gap-2.5 rounded-2xl border-2 p-3"
                        style={{
                          background: heat.bg,
                          color: heat.fg,
                          borderColor: forming ? ALIGNMENT_RING : "transparent",
                          animation: forming ? "dm-cell-align 2s ease-in-out infinite" : undefined,
                        }}
                      >
                        <span className="flex w-full items-baseline justify-between gap-2">
                          <span className="text-[13px] font-semibold">
                            {RASHI_EN[rashi]} <span className="font-medium opacity-70">· H{house}{house === 1 && " ★"}</span>
                          </span>
                          <span className="font-mono text-lg font-semibold">{load}</span>
                        </span>
                        <span className="flex flex-wrap gap-1">
                          {natalIn(rashi).map((p) => (
                            <Chip key={p} code={PLANET_CODE[p]} title={`${PLANET_NAME[p]} at birth`} />
                          ))}
                          {liveIn(rashi).map((p) => (
                            <Chip key={`t-${p}`} code={PLANET_CODE[p]} title={`${PLANET_NAME[p]} live`} live />
                          ))}
                        </span>
                      </div>
                    );
                  })}
                </Row>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5"><Chip code="Su" title="" /> Birth position</span>
            {live && <span className="flex items-center gap-1.5"><Chip code="Sa" title="" live /> Live position</span>}
            {live && (
              <span className="flex items-center gap-1.5">
                <span className="size-3.5 rounded border-2 bg-heat-base" style={{ borderColor: ALIGNMENT_RING }} /> Alignment within 5°
              </span>
            )}
          </div>

          <div className={cx("flex flex-wrap items-center gap-4 rounded-2xl bg-subtle px-5 py-4", !live && "opacity-50")}>
            <label htmlFor="slider" className="flex items-center gap-2 text-sm font-semibold">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F45FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 7v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Time Slider
            </label>
            <input
              id="slider"
              type="range"
              min={-365}
              max={365}
              step={1}
              value={days}
              disabled={!live}
              onChange={(e) => setDays(Number(e.target.value))}
              className="min-h-11 flex-[1_1_240px] accent-cobalt"
            />
            <span className="min-w-[150px] text-right font-mono text-sm font-semibold">
              {dayLabel} <span className="text-muted">· {day}</span>
            </span>
            {days !== 0 && (
              <button type="button" onClick={() => setDays(0)} className="cursor-pointer text-sm font-semibold text-link">
                Reset
              </button>
            )}
          </div>
        </Card>

        <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-6">
          <Card dark>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">
                Live alerts <span className="font-mono text-xs font-semibold text-muted-2">· Gochar</span>
              </h2>
              <Badge tone="signal">{live ? `${alerts.length} active` : "Off"}</Badge>
            </div>
            {!live && <p className="text-sm text-soft">Switch to Live overlay to see alignments.</p>}
            {live && alerts.length === 0 && <p className="text-sm text-soft">No live body is within 5° of a birth position on this day.</p>}
            {live &&
              alerts.map((al) => (
                <div key={`${al.natal}-${al.transit}`} className="flex flex-col gap-1.5 rounded-2xl border border-ink-3 bg-ink-2 p-4">
                  <span
                    className={cx(
                      "self-start rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold tracking-[0.08em] uppercase",
                      al.exact ? "bg-signal text-ink" : "bg-cobalt text-white",
                    )}
                  >
                    {al.exact ? "Exact" : "Forming"}
                  </span>
                  <span className="font-display font-bold">{LIFE_SECTOR[al.natal]}</span>
                  <span className="font-mono text-xs text-muted-2">
                    Live {PLANET_NAME[al.transit]} → birth {PLANET_NAME[al.natal]} · {al.distance.toFixed(1)}° orb
                  </span>
                  <span className="text-sm leading-normal text-[#C9CED8]">{ALIGNMENT_ADVICE[al.natal].positive}</span>
                  <span className="text-sm leading-normal text-muted-2">{ALIGNMENT_ADVICE[al.natal].caution}</span>
                </div>
              ))}
          </Card>

          <Card>
            <h2 className="font-display text-xl font-bold">Life areas right now</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {PLANET_IDS.map((p) => {
                const on = activeSectors.has(p);
                return (
                  <div key={p} className={cx("flex flex-col gap-1 rounded-[14px] border p-3", on ? "border-cobalt/30 bg-cobalt-soft" : "border-line")}>
                    <span className="text-sm font-semibold">{LIFE_SECTOR[p]}</span>
                    <span className={cx("text-xs font-semibold", on ? "text-link" : "text-muted")}>{on ? "Active" : "Steady"}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <CardTitle title="Positions at birth" tag="Birth chart · sidereal · KP" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm tabular-nums">
            <thead>
              <tr className="text-left text-xs tracking-[0.06em] text-muted uppercase">
                {["Body", "Position", "Zone", "House", "Grid cell", "Star / Sub lord"].map((h) => (
                  <th key={h} className="border-b border-line px-3 py-2.5 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLANET_IDS.map((p) => {
                const sid = chart.positions[p].sid;
                const rashi = getRashi(sid);
                const [row, col] = RASHI_TO_RC[rashi];
                const kp = resolveKP(sid);
                return (
                  <tr key={p}>
                    <td className="border-b border-line-soft p-3 font-semibold">{PLANET_NAME[p]}</td>
                    <td className="border-b border-line-soft p-3 font-mono text-[13px]">{formatDegrees(sid)}</td>
                    <td className="border-b border-line-soft p-3">{RASHI_EN[rashi]}</td>
                    <td className="border-b border-line-soft p-3">{calcHouse(rashi, lagna)}</td>
                    <td className="border-b border-line-soft p-3 text-muted">{ELEMENTS[row]} · {MODES[col]}</td>
                    <td className="border-b border-line-soft p-3 font-mono text-[13px] text-link">
                      {PLANET_CODE[kp.starLord]} / {PLANET_CODE[kp.subLord]}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted">
          Lahiri ayanamsa {chart.ayanamsa.toFixed(4)}° · Ascendant {formatDegrees(chart.lagna.sid)} {RASHI_EN[lagna]}
        </p>
      </Card>
    </>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function Stat({ label, value, note, tone }: { label: string; value: string; note: string; tone: string }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-[20px] border border-line bg-surface px-6 py-5">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="font-display text-[26px] font-extrabold">{value}</span>
      <span className={cx("text-[13px] font-semibold", tone)}>{note}</span>
    </div>
  );
}

function Chip({ code, title, live }: { code: string; title: string; live?: boolean }) {
  const c = live ? CHIP.live : CHIP.natal;
  return (
    <span
      title={title || undefined}
      className="rounded-md px-1.5 py-0.5 font-mono text-[11px] font-semibold"
      style={{ background: c.bg, color: c.fg, animation: live ? "dm-halo 1.5s ease-in-out infinite" : undefined }}
    >
      {code}
    </span>
  );
}

/** One alert per birth body, keeping the tightest orb. */
function dedupe<T extends { natal: PlanetId }>(list: T[]) {
  const seen = new Set<PlanetId>();
  return list.filter((x) => (seen.has(x.natal) ? false : (seen.add(x.natal), true)));
}
