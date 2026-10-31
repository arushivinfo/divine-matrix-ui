"use client";

import { useEffect, useState } from "react";
import type { PlanetId } from "./engine/constants";
import type { BirthInput } from "./engine/core";
import { SUPABASE_KEY, SUPABASE_URL } from "./supabase";

/**
 * Client for the private Divine Matrix engine (divine-matrix-backend), which
 * computes the proprietary scores server-side. Standard astronomy (positions,
 * grid, dashas, panchang) still runs in the browser.
 */
const ENGINE_URL = process.env.NEXT_PUBLIC_ENGINE_URL ?? `${SUPABASE_URL}/functions/v1/engine`;

/* ---------- Response shapes ---------- */

export type HourMode = "business" | "partner" | "dating";
export type Risk = "low" | "moderate" | "high";
export type Severity = "critical" | "high" | "medium";

export interface ChapterPeriod {
  lord: PlanetId;
  label: string;
  sub?: string;
  years: number;
  start: Date;
  end: Date;
}

export interface Analysis {
  md?: ChapterPeriod;
  ad?: ChapterPeriod;
  wealth: {
    property: { score: number; transit: number };
    shares: { score: number; transit: number };
    gold: { score: number; transit: number };
    trend: "Rising" | "Falling" | "Stable";
  };
  conflict: { score: number; level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"; triggers: { severity: Severity; text: string; practice: string }[] };
  learning: { focus: number; competition: number; higherEd: number; tip: string };
  health: {
    cusps: { house: number; label: string; lord: PlanetId; risk: Risk; status: string }[];
    doshas: { vata: number; pitta: number; kapha: number };
    dominant: "Vata" | "Pitta" | "Kapha";
    watch: string[];
    advice: string;
    score: number;
  };
  hours: { slots: { hour: number; lord: PlanetId; score: number }[]; window: { from: string; to: string; lords: PlanetId[] } };
  overall: { score: number; verdict: string; parts: { label: string; value: number }[] };
  space: { dir: string; lord: PlanetId; score: number }[];
  brief: { headline: string; points: string[] };
}

export type Element = "Fire" | "Earth" | "Air" | "Water";
export type FrictionStatus = "harmonious" | "supportive" | "neutral" | "clash";

export interface Compatibility {
  match: number;
  verdict: string;
  factors: { key: "moon" | "lagna" | "sun"; title: string; pair: [Element, Element]; label: string; status: FrictionStatus; flow: number }[];
}

export interface TeamSynergy {
  type: Element;
  mix: { element: Element; pct: number }[];
  members: { name: string; dominant: Element; role: string }[];
  gaps: string[];
}

export type TravelDirection = "NORTH" | "EAST" | "SOUTH" | "WEST";
export type CheckStatus = "clear" | "boost" | "watch" | "blocked";

export interface JourneyPlan {
  score: number;
  verdict: "GO" | "CAUTION" | "AVOID";
  headline: string;
  summary: string;
  blocked: TravelDirection;
  departure: { start: Date; end: Date; name: string } | null;
  checks: { label: string; value: string; note: string; status: CheckStatus }[];
  months: { year: number; month: number; score: number }[];
}

/** Descriptions for each team type (copy only — the type itself comes from the engine). */
export const TEAM_TYPES: Record<Element, { name: string; strength: string; risk: string }> = {
  Fire: { name: "Visionary expansion squad", strength: "Rapid R&D and innovation", risk: "Burnout and power conflicts" },
  Earth: { name: "Execution powerhouse", strength: "Operations and quality", risk: "Resistance to change" },
  Air: { name: "Strategy & communication hub", strength: "Marketing and networking", risk: "High talk, low delivery" },
  Water: { name: "Empathy & integration core", strength: "People and customer retention", risk: "Slow decision loops" },
};

/* ---------- Requests ---------- */

async function post<T>(route: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${ENGINE_URL}/${route}`, {
      method: "POST",
      headers: { "content-type": "application/json", apikey: SUPABASE_KEY },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Can’t reach the Divine Matrix engine. Check your connection.");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error((data as { error?: string } | null)?.error ?? `Engine error (${res.status})`);
  return data as T;
}

const reviveDates = <T extends { start: string | Date; end: string | Date }>(p: T | undefined) =>
  p ? { ...p, start: new Date(p.start), end: new Date(p.end) } : undefined;

export async function fetchAnalysis(birth: BirthInput, day: string, hourMode: HourMode = "business"): Promise<Analysis> {
  const a = await post<Analysis>("analyse", { birth, day, hourMode });
  return { ...a, md: reviveDates(a.md), ad: reviveDates(a.ad) };
}

export function fetchCompatibility(a: BirthInput, b: BirthInput) {
  return post<Compatibility>("compatibility", { a, b });
}

export function fetchTeam(people: { name: string; birth: BirthInput }[]) {
  return post<TeamSynergy>("team", { people });
}

export async function fetchJourney(birth: BirthInput, day: string, direction: TravelDirection): Promise<JourneyPlan> {
  const plan = await post<JourneyPlan>("journey", { birth, day, direction });
  return { ...plan, departure: reviveDates(plan.departure ?? undefined) ?? null };
}

/* ---------- Hooks ---------- */

/** `value`, but only after it has stopped changing for `ms` (e.g. while a slider is dragged). */
export function useDebounced<T>(value: T, ms = 300) {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setSettled(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return settled;
}

interface Result<T> {
  key: string;
  data: T | null;
  error: string | null;
}

/**
 * Runs `load` whenever `key` changes (null = nothing to load yet). Results are
 * stored per key, so a stale response never overwrites a newer request.
 */
export function useEngine<T>(key: string | null, load: () => Promise<T>) {
  const [result, setResult] = useState<Result<T> | null>(null);
  const [attempt, setAttempt] = useState(0);
  const requestKey = key === null ? null : `${key}#${attempt}`;

  useEffect(() => {
    if (requestKey === null) return;
    let cancelled = false;
    load().then(
      (data) => !cancelled && setResult({ key: requestKey, data, error: null }),
      (err: Error) => !cancelled && setResult({ key: requestKey, data: null, error: err.message }),
    );
    return () => {
      cancelled = true;
    };
    // `load` is recreated every render; `requestKey` captures everything it depends on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey]);

  const current = result && result.key === requestKey ? result : null;
  return {
    data: current?.data ?? null,
    error: current?.error ?? null,
    loading: requestKey !== null && !current,
    retry: () => setAttempt((n) => n + 1),
  };
}
