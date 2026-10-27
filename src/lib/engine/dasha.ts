import { PLANET_NAME, RASHI_EN, SOLAR_YEAR_DAYS, VIM_ORDER, VIM_TOTAL, VIM_YEARS, type PlanetId } from "./constants";
import { getRashi, type Chart } from "./core";

export interface Period {
  /** Ruling body (for Chara, the sign lord). */
  lord: PlanetId;
  /** Display label, e.g. "Venus", "Mangala" or "Leo". */
  label: string;
  /** Secondary label (Yogini name's ruler, Chara sign lord). */
  sub?: string;
  years: number;
  start: Date;
  end: Date;
}

const NAK_SPAN = 360 / 27;
const YOGINI_ORDER: PlanetId[] = ["Ch", "Su", "Gu", "Ma", "Bu", "Sa", "Sh", "Ra"];
const YOGINI_NAMES = ["Mangala", "Pingala", "Dhanya", "Bhramari", "Bhadrika", "Ulka", "Siddha", "Sankata"];
const YOGINI_TOTAL = 36;
/** Jaimini Chara lords: Scorpio → Ketu, Aquarius → Rahu. */
const CHARA_LORDS: PlanetId[] = ["Ma", "Sh", "Bu", "Ch", "Su", "Bu", "Sh", "Ke", "Gu", "Sa", "Ra", "Gu"];

function addYears(date: Date, years: number) {
  return new Date(date.getTime() + years * SOLAR_YEAR_DAYS * 86400000);
}

export function vimshottari(chart: Chart): Period[] {
  const moon = chart.positions.Ch.sid;
  const lordIdx = Math.floor(moon / NAK_SPAN) % 9;
  const balance = (1 - (moon % NAK_SPAN) / NAK_SPAN) * VIM_YEARS[lordIdx];
  const out: Period[] = [];
  let start = chart.birth;
  for (let i = 0; i < 9; i++) {
    const idx = (lordIdx + i) % 9;
    const years = i === 0 ? balance : VIM_YEARS[idx];
    const end = addYears(start, years);
    out.push({ lord: VIM_ORDER[idx], label: PLANET_NAME[VIM_ORDER[idx]], years, start, end });
    start = end;
  }
  return out;
}

/** Antardasha / pratyantardasha inside a Vimshottari period. */
export function vimshottariSub(parent: Period): Period[] {
  const first = VIM_ORDER.indexOf(parent.lord);
  const total = (parent.end.getTime() - parent.start.getTime()) / (SOLAR_YEAR_DAYS * 86400000);
  const out: Period[] = [];
  let start = parent.start;
  for (let i = 0; i < 9; i++) {
    const idx = (first + i) % 9;
    const years = (total * VIM_YEARS[idx]) / VIM_TOTAL;
    const end = addYears(start, years);
    out.push({ lord: VIM_ORDER[idx], label: PLANET_NAME[VIM_ORDER[idx]], years, start, end });
    start = end;
  }
  return out;
}

export function yogini(chart: Chart): Period[] {
  const moon = chart.positions.Ch.sid;
  const first = (Math.floor(moon / NAK_SPAN) + 3) % 8;
  const balance = (1 - (moon % NAK_SPAN) / NAK_SPAN) * (first + 1);
  const out: Period[] = [];
  let start = chart.birth;
  for (let i = 0; i < 24; i++) {
    const idx = (first + i) % 8;
    const years = i === 0 ? balance : idx + 1;
    const end = addYears(start, years);
    out.push({ lord: YOGINI_ORDER[idx], label: YOGINI_NAMES[idx], sub: PLANET_NAME[YOGINI_ORDER[idx]], years, start, end });
    start = end;
  }
  return out;
}

export function yoginiSub(parent: Period): Period[] {
  const first = YOGINI_ORDER.indexOf(parent.lord);
  const total = (parent.end.getTime() - parent.start.getTime()) / (SOLAR_YEAR_DAYS * 86400000);
  const out: Period[] = [];
  let start = parent.start;
  for (let i = 0; i < 8; i++) {
    const idx = (first + i) % 8;
    const years = (total * (idx + 1)) / YOGINI_TOTAL;
    const end = addYears(start, years);
    out.push({ lord: YOGINI_ORDER[idx], label: YOGINI_NAMES[idx], sub: PLANET_NAME[YOGINI_ORDER[idx]], years, start, end });
    start = end;
  }
  return out;
}

export function chara(chart: Chart): Period[] {
  const lagna = chart.lagna.rashi;
  const forward = lagna % 2 === 0;
  const out: Period[] = [];
  let start = chart.birth;
  for (let i = 0; i < 12; i++) {
    const sign = forward ? (lagna + i) % 12 : (((lagna - i) % 12) + 12) % 12;
    const lord = CHARA_LORDS[sign];
    const lordRashi = getRashi(chart.positions[lord].sid);
    let years = sign % 2 === 0 ? (((lordRashi - sign) % 12) + 12) % 12 : (((sign - lordRashi) % 12) + 12) % 12;
    if (years === 0) years = 12;
    const end = addYears(start, years);
    out.push({ lord, label: RASHI_EN[sign], sub: PLANET_NAME[lord], years, start, end });
    start = end;
  }
  return out;
}

export function currentPeriod(periods: Period[], at: Date) {
  return periods.find((p) => at >= p.start && at < p.end);
}

export type PeriodStatus = "done" | "now" | "next";

export function periodStatus(p: Period, at: Date): PeriodStatus {
  if (at >= p.end) return "done";
  if (at >= p.start) return "now";
  return "next";
}
