"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { computeChart, type Chart } from "./engine/core";
import { PRESETS, birthInput, type Profile } from "./profiles";

const STORAGE_KEY = "dm.profiles.v1";

interface Stored {
  activeId: string;
  saved: Profile[];
}

const DEFAULT_STORED: Stored = { activeId: PRESETS[0].id, saved: [] };

/* ---------- Saved profiles: a small external store over localStorage ---------- */

const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedValue: Stored = DEFAULT_STORED;

function readRaw() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getStored(): Stored {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedValue = raw ? (JSON.parse(raw) as Stored) : DEFAULT_STORED;
    } catch {
      cachedValue = DEFAULT_STORED;
    }
  }
  return cachedValue;
}

function setStored(value: Stored) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode): keep the change for this session only.
    cachedRaw = JSON.stringify(value);
    cachedValue = value;
  }
  listeners.forEach((l) => l());
}

function subscribeStored(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === STORAGE_KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const noopSubscribe = () => () => {};

/* ---------- Context ---------- */

interface ProfileState {
  /** False during the server prerender, before browser storage can be read. */
  ready: boolean;
  profile: Profile;
  profiles: Profile[];
  select: (id: string) => void;
  save: (profile: Profile) => void;
}

const ProfileContext = createContext<ProfileState | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const stored = useSyncExternalStore(subscribeStored, getStored, () => DEFAULT_STORED);

  const value = useMemo<ProfileState>(() => {
    const profiles = [...stored.saved, ...PRESETS.filter((p) => !stored.saved.some((s) => s.id === p.id))];
    const profile = profiles.find((p) => p.id === stored.activeId) ?? PRESETS[0];
    return {
      ready,
      profile,
      profiles,
      select: (id) => setStored({ ...getStored(), activeId: id }),
      save: (p) => {
        const current = getStored();
        setStored({ activeId: p.id, saved: [p, ...current.saved.filter((s) => s.id !== p.id)] });
      },
    };
  }, [ready, stored]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfiles() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfiles must be used inside <ProfileProvider>");
  return ctx;
}

/* ---------- Clock: the current time, client only, refreshed every 30 seconds ---------- */

let clockNow: Date | null = null;
const clockListeners = new Set<() => void>();
let clockTimer: ReturnType<typeof setInterval> | undefined;

function subscribeClock(listener: () => void) {
  clockListeners.add(listener);
  if (!clockTimer) {
    clockTimer = setInterval(() => {
      clockNow = new Date();
      clockListeners.forEach((l) => l());
    }, 30000);
  }
  return () => {
    clockListeners.delete(listener);
    if (clockListeners.size === 0 && clockTimer) {
      clearInterval(clockTimer);
      clockTimer = undefined;
      clockNow = null;
    }
  };
}

function getClock() {
  clockNow ??= new Date();
  return clockNow;
}

/** The current time; null during the server prerender. */
export function useNow() {
  return useSyncExternalStore(subscribeClock, getClock, () => null);
}

/* ---------- Charts ---------- */

const chartCache = new Map<string, Chart>();

export function chartFor(profile: Profile): Chart {
  const key = `${profile.dob}|${profile.tob}|${profile.cityId}`;
  let chart = chartCache.get(key);
  if (!chart) {
    chart = computeChart(birthInput(profile));
    chartCache.set(key, chart);
  }
  return chart;
}

export function useChart() {
  const { profile, ready } = useProfiles();
  const chart = useMemo(() => (ready ? chartFor(profile) : null), [profile, ready]);
  return { profile, chart };
}
