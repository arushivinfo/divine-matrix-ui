"use client";

import { useState } from "react";
import { EngineNotice } from "@/components/engine-notice";
import { Badge, Bar, Card, PageHeader, Ring, Skeleton, cx, type Tone } from "@/components/ui";
import { TEAM_TYPES, fetchCompatibility, fetchTeam, useEngine, type FrictionStatus } from "@/lib/engine-api";
import { useProfiles } from "@/lib/profile-context";
import { birthInput, type Profile } from "@/lib/profiles";

const STATUS: Record<FrictionStatus, { tone: Tone; label: string; bar: string }> = {
  harmonious: { tone: "good", label: "In flow", bar: "#2F45FF" },
  supportive: { tone: "info", label: "Supportive", bar: "#2F45FF" },
  neutral: { tone: "warn", label: "Some friction", bar: "#B45309" },
  clash: { tone: "bad", label: "Clash", bar: "#C9372C" },
};
const ELEMENT_COLOR = { Fire: "#FF8A5B", Earth: "#32D583", Air: "#8E9BFF", Water: "#7CD4FD" };

const selectClass = "h-13 rounded-2xl border border-line-strong bg-surface px-3.5 text-[15px] text-fg";

export function CompatibilityView() {
  const { ready, profile, profiles } = useProfiles();
  const [aId, setAId] = useState<string | null>(null);
  const [bId, setBId] = useState<string | null>(null);
  const [team, setTeam] = useState<string[] | null>(null);

  const a = profiles.find((p) => p.id === (aId ?? profile.id)) ?? profiles[0];
  const b = profiles.find((p) => p.id === (bId ?? profiles.find((x) => x.id !== a.id)?.id)) ?? profiles[1];
  const teamIds = team ?? profiles.map((p) => p.id);

  const members = profiles.filter((p) => teamIds.includes(p.id));
  const sig = (p: Profile) => `${p.dob}|${p.tob}|${p.cityId}`;

  const pair = useEngine(ready && a.id !== b.id ? `${sig(a)}~${sig(b)}` : null, () => fetchCompatibility(birthInput(a), birthInput(b)));
  const teamResult = useEngine(ready && members.length >= 2 ? members.map((p) => `${p.name}:${sig(p)}`).join(",") : null, () =>
    fetchTeam(members.map((p) => ({ name: p.name, birth: birthInput(p) }))),
  );
  const match = pair.data;
  const synergy = teamResult.data;

  if (!ready) return <Skeleton className="h-[640px]" />;

  const toggle = (id: string) => setTeam(teamIds.includes(id) ? teamIds.filter((x) => x !== id) : [...teamIds, id]);

  return (
    <>
      <PageHeader kicker="See how people flow together" title="Compatibility" tag="Kundli matching · Tattva" />

      <Card className="!flex-row flex-wrap items-center !gap-8 p-7">
        <div className="flex min-w-0 flex-[1_1_360px] flex-wrap items-end gap-3">
          <div className="flex flex-[1_1_140px] flex-col gap-2">
            <label htmlFor="pa" className="text-sm font-semibold">Person A</label>
            <select id="pa" value={a.id} onChange={(e) => setAId(e.target.value)} className={selectClass}>
              {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <span className="flex h-13 w-11 items-center justify-center" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B6472" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 7h13l-3-3M17 17H4l3 3" />
            </svg>
          </span>
          <div className="flex flex-[1_1_140px] flex-col gap-2">
            <label htmlFor="pb" className="text-sm font-semibold">Person B</label>
            <select id="pb" value={b.id} onChange={(e) => setBId(e.target.value)} className={selectClass}>
              {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
        {match ? (
          <div className="flex min-w-0 flex-[1_1_280px] items-center gap-5">
            <Ring value={match.match} size={120} stroke={12} color="#2F45FF" track="var(--ring-track)" label={`Match ${match.match} percent`}>
              <span className="font-display text-3xl font-extrabold">{match.match}%</span>
            </Ring>
            <div className="flex flex-col gap-1.5">
              <span className="font-display text-[22px] font-extrabold">{match.verdict}</span>
              <span className="text-sm leading-normal text-muted">Weighted on Moon (emotions), ascendant (outlook) and Sun (drive) elements.</span>
            </div>
          </div>
        ) : pair.error ? (
          <div className="flex-[1_1_280px]">
            <EngineNotice compact error={pair.error} onRetry={pair.retry} />
          </div>
        ) : pair.loading ? (
          <p className="flex-[1_1_280px] animate-pulse text-sm text-muted">Calculating match…</p>
        ) : (
          <p className="flex-[1_1_280px] text-sm text-muted">Pick two different people to compare.</p>
        )}
      </Card>

      {match && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
          {match.factors.map((f) => (
            <Card key={f.key}>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-[19px] font-bold">{f.title}</h2>
                <Badge tone={STATUS[f.status].tone}>{STATUS[f.status].label}</Badge>
              </div>
              <span className="font-mono text-[13px] text-muted">
                {f.key === "moon" ? "Moon" : f.key === "lagna" ? "Ascendant" : "Sun"}: {f.pair[0]} ↔ {f.pair[1]}
              </span>
              <Bar value={f.flow} color={STATUS[f.status].bar} />
              <p className="text-sm text-fg-2">{f.label}</p>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-1">
        <span className="text-sm text-muted">Enterprise</span>
        <h2 className="font-display text-[28px] font-extrabold tracking-tight">Team Synergy</h2>
      </div>
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">Team members</legend>
        {profiles.map((p) => {
          const on = teamIds.includes(p.id);
          return (
            <label
              key={p.id}
              className={cx(
                "flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-semibold",
                on ? "border-fg bg-fg text-bg" : "border-line-strong bg-surface",
              )}
            >
              <input type="checkbox" checked={on} onChange={() => toggle(p.id)} className="accent-signal" />
              {p.name}
            </label>
          );
        })}
      </fieldset>

      {synergy ? (
        <section className="flex flex-wrap gap-8 rounded-3xl bg-contrast p-7 text-paper">
          <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-4">
            <span className="font-mono text-xs tracking-[0.12em] text-signal uppercase">Team type</span>
            <span className="font-display text-3xl font-extrabold">{TEAM_TYPES[synergy.type].name}</span>
            <span className="text-[15px] leading-relaxed text-soft">
              Strength: {TEAM_TYPES[synergy.type].strength}. Risk: {TEAM_TYPES[synergy.type].risk}.
            </span>
            <div className="flex flex-col gap-2.5">
              {synergy.mix.map((m) => (
                <div key={m.element} className="flex items-center gap-3">
                  <span className="min-w-14 text-sm">{m.element}</span>
                  <div className="flex-1"><Bar value={m.pct} color={ELEMENT_COLOR[m.element]} track="bg-ink-3" /></div>
                  <span className="min-w-10 text-right font-mono text-[13px]">{m.pct}%</span>
                </div>
              ))}
            </div>
            {synergy.gaps.map((g) => (
              <p key={g} className="rounded-xl bg-ink-2 px-3 py-2.5 text-sm text-coral">{g}</p>
            ))}
          </div>
          <div className="grid min-w-0 flex-[1_1_320px] grid-cols-2 content-start gap-3">
            {synergy.members.map((m) => (
              <div key={m.name} className="flex flex-col gap-2 rounded-2xl border border-ink-3 bg-ink-2 p-4">
                <span className="flex items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-full font-semibold text-ink" style={{ background: ELEMENT_COLOR[m.dominant] }}>
                    {m.name.charAt(0)}
                  </span>
                  <span className="font-semibold">{m.name}</span>
                </span>
                <span className="text-xs text-muted-2">Leads with {m.dominant}</span>
                <span className="text-sm font-semibold text-signal">{m.role}</span>
              </div>
            ))}
          </div>
        </section>
      ) : teamResult.error ? (
        <EngineNotice error={teamResult.error} onRetry={teamResult.retry} />
      ) : teamResult.loading ? (
        <Skeleton className="h-[360px]" />
      ) : (
        <p className="text-sm text-muted">Select at least two members to analyse the team.</p>
      )}
    </>
  );
}
