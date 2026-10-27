"use client";

import { useMemo, useState } from "react";
import { DayPicker } from "@/components/day-picker";
import { Badge, Card, CardTitle, PageHeader, Skeleton, cx, type Tone } from "@/components/ui";
import { PLANET_NAME } from "@/lib/engine/constants";
import { istDay } from "@/lib/engine/core";
import { WEEKDAY_EN, WEEKDAY_LORD, calcPanchang, type HourQuality } from "@/lib/engine/panchang";
import { fmtDay, fmtTime } from "@/lib/format";
import { useNow, useProfiles } from "@/lib/profile-context";
import { cityById } from "@/lib/profiles";

const QUALITY: Record<HourQuality, { bar: string; label: string; meaning: string }> = {
  best: { bar: "bg-lime", label: "Excellent", meaning: "The strongest kind of hour — start what matters." },
  good: { bar: "bg-cobalt", label: "Good", meaning: "Favourable for work, money and new starts." },
  neutral: { bar: "bg-ink-line", label: "Neutral", meaning: "Fine for routine work and travel." },
  bad: { bar: "bg-coral", label: "Avoid", meaning: "Avoid starting important things." },
};

const scoreTone = (s: number): Tone => (s >= 70 ? "good" : s >= 50 ? "warn" : "bad");

export function TodayView() {
  const { profile } = useProfiles();
  const now = useNow();
  const [picked, setPicked] = useState<string | null>(null);
  const city = cityById(profile.cityId);
  const today = now ? istDay(now) : null;
  const day = picked ?? today;
  const p = useMemo(() => (day ? calcPanchang(day, city.lat, city.lon) : null), [day, city.lat, city.lon]);

  const header = (
    <PageHeader
      kicker={`${city.name} · ${day ? fmtDay(day) : ""}`}
      title="Today"
      tag="Panchang · Choghadiya · Muhurat"
      actions={day && <DayPicker value={day} onChange={setPicked} />}
    />
  );
  if (!p || !now || !day) {
    return (
      <>
        {header}
        <Skeleton className="h-[640px]" />
      </>
    );
  }

  const isToday = day === today;
  const t = now.getTime();
  const current = isToday ? p.choghadiya.find((c) => t >= c.start.getTime() && t < c.end.getTime()) : undefined;
  const first = p.choghadiya[0]?.start.getTime() ?? 0;
  const last = p.choghadiya[p.choghadiya.length - 1]?.end.getTime() ?? 1;
  const nowPct = isToday ? ((t - first) / (last - first)) * 100 : -1;
  const inRahu = isToday && p.rahuKaal && t >= p.rahuKaal.start.getTime() && t < p.rahuKaal.end.getTime();
  const inAbhijit = isToday && p.abhijit && t >= p.abhijit.start.getTime() && t < p.abhijit.end.getTime();
  const hero = current ?? p.choghadiya.find((c) => c.isDay && c.quality === "best") ?? p.choghadiya[0];

  return (
    <>
      {header}
      <section className="flex flex-col gap-5 rounded-3xl bg-ink p-7 text-paper">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-2 font-mono text-xs tracking-[0.12em] text-lime uppercase">
              {isToday && <span className="size-2 rounded-full bg-lime" style={{ animation: "dm-pulse 1.8s ease-out infinite" }} />}
              {current ? `Right now · ${fmtTime(now)}` : "Best hour of the day"}
            </span>
            <span className="font-display text-[34px] font-extrabold tracking-tight">
              {hero ? `${hero.name} · ${fmtTime(hero.start)}–${fmtTime(hero.end)}` : "—"}
            </span>
            <span className="text-[15px] text-soft">
              {inRahu ? "Caution window is running — hold important starts." : inAbhijit ? "Golden window is running now." : hero && QUALITY[hero.quality].meaning}
            </span>
          </div>
          <div className="flex gap-7">
            <Fact label="Sunrise" value={fmtTime(p.sunrise)} />
            <Fact label="Sunset" value={fmtTime(p.sunset)} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="relative flex h-12 gap-[3px]">
            {p.choghadiya.map((c) => (
              <span
                key={c.start.getTime()}
                title={`${c.name} · ${fmtTime(c.start)}–${fmtTime(c.end)} · ${QUALITY[c.quality].label}`}
                className={cx("min-w-0 flex-1 rounded-lg", QUALITY[c.quality].bar, current === c && "ring-2 ring-white")}
              />
            ))}
            {nowPct >= 0 && nowPct <= 100 && (
              <span aria-hidden="true" className="absolute -top-1.5 -bottom-1.5 w-[3px] rounded bg-white" style={{ left: `${nowPct}%` }} />
            )}
          </div>
          <div className="flex justify-between font-mono text-xs text-muted-2">
            <span>{fmtTime(p.sunrise)}</span>
            <span>{fmtTime(p.sunset)}</span>
            <span>{fmtTime(p.choghadiya[15]?.end)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-4.5 text-[13px] text-[#C9CED8]">
          {(Object.keys(QUALITY) as HourQuality[]).map((q) => (
            <span key={q} className="flex items-center gap-1.5">
              <span className={cx("size-2.5 rounded-[3px]", QUALITY[q].bar)} />
              {QUALITY[q].label}
            </span>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-4">
        <Window
          label="Golden window · Abhijit"
          time={p.abhijit ? `${fmtTime(p.abhijit.start)} – ${fmtTime(p.abhijit.end)}` : "—"}
          note="The strongest 48 minutes of the day for anything important."
          className="border-[#D9F08A] bg-[#F7FFDB]"
          tone="text-[#3F5200]"
        />
        <Window
          label="Caution window · Rahu Kaal"
          time={p.rahuKaal ? `${fmtTime(p.rahuKaal.start)} – ${fmtTime(p.rahuKaal.end)}` : "—"}
          note="Avoid starting new things or signing."
          className="border-[#FFD2CE] bg-red-soft"
          tone="text-red"
        />
        {(
          [
            ["Business", p.scores.business],
            ["Property", p.scores.property],
            ["Travel", p.scores.travel],
          ] as const
        ).map(([label, score]) => (
          <div key={label} className="flex flex-col gap-2 rounded-[20px] border border-line bg-white p-5">
            <span className="flex items-center justify-between text-sm font-semibold text-cobalt">
              {label} day score <Badge tone={scoreTone(score)} mono>{score}</Badge>
            </span>
            <span className="font-display text-[22px] font-bold">{score >= 70 ? "Favourable" : score >= 50 ? "Mixed" : "Avoid"}</span>
            <span className="text-[13px] text-[#3A4150]">Based on tithi, nakshatra, yoga and weekday.</span>
          </div>
        ))}
      </div>

      <Card>
        <CardTitle title="Day profile" tag="Panchang" />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
          <Detail label="Lunar day · Tithi" value={p.tithi.name} note={`${p.tithi.paksha} paksha · ${p.tithi.progress}% elapsed`} good={p.tithi.good} />
          <Detail label="Moon station · Nakshatra" value={p.nakshatra.name} note={`${p.nakshatra.progress}% elapsed`} good={p.nakshatra.good} />
          <Detail label="Sun–Moon blend · Yoga" value={p.yoga.name} note={p.yoga.bad ? "Inauspicious yoga" : "Auspicious yoga"} good={!p.yoga.bad} />
          <Detail label="Half-day · Karana" value={p.karana.name} note="Half of the lunar day" />
          <Detail label="Day ruler · Vara" value={WEEKDAY_EN[p.weekday]} note={`Ruled by ${PLANET_NAME[WEEKDAY_LORD[p.weekday]]}`} />
          <Detail
            label="Daylight"
            value={p.sunrise && p.sunset ? `${((p.sunset.getTime() - p.sunrise.getTime()) / 3600000).toFixed(1)} hrs` : "—"}
            note={`${fmtTime(p.sunrise)} – ${fmtTime(p.sunset)}`}
          />
        </div>
      </Card>

      <Card>
        <CardTitle title="Hour by hour" sub="Day and night choghadiya" tag="Choghadiya" />
        <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-8">
          {p.choghadiya.map((c) => (
            <div
              key={c.start.getTime()}
              className={cx("flex items-center justify-between rounded-xl px-3 py-2 text-sm", current === c ? "bg-cobalt-soft font-semibold" : "")}
            >
              <span className="flex items-center gap-2.5">
                <span className={cx("size-2.5 rounded-[3px]", QUALITY[c.quality].bar)} />
                {c.name}
                <span className="text-xs text-muted">{c.isDay ? "Day" : "Night"}</span>
              </span>
              <span className="font-mono text-[13px] text-muted">{fmtTime(c.start)} – {fmtTime(c.end)}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-2">{label}</span>
      <span className="font-mono text-lg font-semibold">{value}</span>
    </div>
  );
}

function Window({ label, time, note, className, tone }: { label: string; time: string; note: string; className: string; tone: string }) {
  return (
    <div className={cx("flex flex-col gap-2 rounded-[20px] border p-5", className)}>
      <span className={cx("text-sm font-semibold", tone)}>{label}</span>
      <span className="font-mono text-xl font-semibold whitespace-nowrap">{time}</span>
      <span className="text-[13px] leading-normal text-[#3A4150]">{note}</span>
    </div>
  );
}

function Detail({ label, value, note, good }: { label: string; value: string; note: string; good?: boolean }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-paper p-4">
      <span className="text-xs font-semibold tracking-[0.06em] text-muted uppercase">{label}</span>
      <span className="font-display text-lg font-bold">{value}</span>
      <span className={cx("text-[13px]", good === undefined ? "text-muted" : good ? "text-green" : "text-red")}>{note}</span>
    </div>
  );
}
