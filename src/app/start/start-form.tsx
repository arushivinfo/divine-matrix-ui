"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cx } from "@/components/ui";
import { isUnderAgeLimit } from "@/lib/engine/core";
import { useProfiles } from "@/lib/profile-context";
import { CITIES, PRESETS, cityById, type Profile } from "@/lib/profiles";

const inputClass = "h-13 rounded-2xl border border-[#D5D9E0] bg-white px-4 text-base text-ink";

export function StartForm() {
  const router = useRouter();
  const { save, select } = useProfiles();
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [cityId, setCityId] = useState(CITIES[0].id);
  const [error, setError] = useState<string | null>(null);

  const city = cityById(cityId);

  function openPreset(p: Profile) {
    select(p.id);
    router.push("/dashboard");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !dob || !tob) {
      setError("Please fill in your name, date and time of birth.");
      return;
    }
    if (isUnderAgeLimit(dob, new Date())) {
      setError("Divine Matrix doesn’t analyse charts for children aged two or under.");
      return;
    }
    save({ id: `p-${Date.now()}`, name: name.trim(), dob, tob, cityId });
    router.push("/dashboard");
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-[560px] flex-col gap-7" noValidate>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs tracking-[0.12em] text-cobalt uppercase">Step 1 of 1</span>
        <h2 className="font-display text-4xl font-extrabold tracking-[-0.03em]">Create your matrix</h2>
      </div>

      <div className="flex flex-col gap-2.5">
        <span className="text-sm font-semibold text-muted">Or open a saved profile</span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => openPreset(p)}
              className="min-h-11 cursor-pointer rounded-full border border-[#D5D9E0] bg-white px-4.5 text-sm font-semibold hover:border-ink"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-semibold">Name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" className={inputClass} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="dob" className="text-sm font-semibold">Date of birth</label>
          <input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={cx(inputClass, "font-mono")} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="tob" className="text-sm font-semibold">Time of birth (IST)</label>
          <input id="tob" type="time" value={tob} onChange={(e) => setTob(e.target.value)} className={cx(inputClass, "font-mono")} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="city" className="text-sm font-semibold">Place of birth</label>
        <select id="city" value={cityId} onChange={(e) => setCityId(e.target.value)} className={inputClass}>
          {CITIES.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <span className="font-mono text-[13px] text-muted">
          {city.lat.toFixed(4)}° N · {city.lon.toFixed(4)}° E
        </span>
      </div>

      {error && (
        <p role="alert" className="rounded-2xl bg-red-soft px-4 py-3 text-sm font-medium text-red">{error}</p>
      )}

      <button type="submit" className="flex h-14 cursor-pointer items-center justify-center gap-2.5 rounded-full bg-cobalt font-semibold text-white">
        Build my matrix
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
      <p className="text-center text-[13px] text-muted">
        Don’t know your exact time? Use 12:00 — your grid will still work, with less precision on hourly windows.
      </p>
    </form>
  );
}
