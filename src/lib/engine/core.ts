import * as Astronomy from "astronomy-engine";
import {
  BAV,
  PLANET_IDS,
  RASHI_LORDS,
  VIM_ORDER,
  VIM_TOTAL,
  VIM_YEARS,
  type PlanetId,
} from "./constants";

export interface BodyPosition {
  /** Tropical ecliptic longitude, degrees. */
  trop: number;
  /** Sidereal (Lahiri) longitude, degrees. */
  sid: number;
}
export type Positions = Record<PlanetId, BodyPosition>;

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;
const NAK_SPAN = 360 / 27;
/** All birth details are entered in Indian Standard Time. */
const IST_OFFSET_HOURS = 5.5;

export function norm(a: number) {
  return ((a % 360) + 360) % 360;
}

export function julianDay(date: Date) {
  return date.getTime() / 86400000 + 2440587.5;
}

/** Lahiri (Chitrapaksha) ayanamsa, polynomial from the B1900.0 epoch. */
export function lahiriAyanamsa(jd: number) {
  const T = (jd - 2415020.0) / 36525;
  return 22.460148 + ((50.2564 * T + 0.0222 * T * T) / 3600) * 100;
}

/** Converts an IST date ("YYYY-MM-DD") and time ("HH:MM") to a UTC instant. */
export function istToDate(dob: string, tob: string) {
  const [y, m, d] = dob.split("-").map(Number);
  const [hh, mm] = tob.split(":").map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh, mm) - IST_OFFSET_HOURS * 3600000);
}

/** Geocentric positions of the nine bodies at an instant. */
export function calcPositions(date: Date): { positions: Positions; ayanamsa: number } {
  const time = Astronomy.MakeTime(date);
  const jd = time.ut + 2451545.0;
  const ayan = lahiriAyanamsa(jd);
  const make = (trop: number): BodyPosition => ({ trop, sid: norm(trop - ayan) });

  const positions = {} as Positions;
  positions.Su = make(Astronomy.SunPosition(time).elon);
  positions.Ch = make(Astronomy.Ecliptic(Astronomy.GeoMoon(time)).elon);
  const bodies: [PlanetId, Astronomy.Body][] = [
    ["Bu", Astronomy.Body.Mercury],
    ["Sh", Astronomy.Body.Venus],
    ["Ma", Astronomy.Body.Mars],
    ["Gu", Astronomy.Body.Jupiter],
    ["Sa", Astronomy.Body.Saturn],
  ];
  for (const [id, body] of bodies) {
    positions[id] = make(Astronomy.Ecliptic(Astronomy.GeoVector(body, time, true)).elon);
  }
  // Mean lunar node (Meeus).
  const Tc = (jd - 2451545.0) / 36525;
  const rahu = norm(125.04452 - 1934.136261 * Tc + 0.0020708 * Tc * Tc + (Tc * Tc * Tc) / 450000);
  positions.Ra = make(rahu);
  positions.Ke = make(norm(rahu + 180));
  return { positions, ayanamsa: ayan };
}

export function getRashi(sid: number) {
  return Math.floor(sid / 30) % 12;
}

/** Tropical ascendant from GMST → LST (Meeus). */
export function calcLagna(jd: number, lat: number, lon: number) {
  const T = (jd - 2451545.0) / 36525;
  const gmst = norm(280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000);
  const lst = norm(gmst + lon);
  const eps = 23.4392911 - 0.0130042 * T - 1.64e-7 * T * T + 5.04e-7 * T * T * T;
  const epsR = eps * DEG;
  const lstR = lst * DEG;
  const latR = lat * DEG;
  const asc = Math.atan2(Math.cos(lstR), -(Math.sin(lstR) * Math.cos(epsR) + Math.tan(latR) * Math.sin(epsR)));
  return norm(asc * RAD);
}

/** Whole-sign house of a rashi counted from the lagna rashi (1–12). */
export function calcHouse(rashi: number, lagnaRashi: number) {
  return ((((rashi - lagnaRashi) % 12) + 12) % 12) + 1;
}

/** Rashi of the given house from the lagna. */
export function houseRashi(lagnaRashi: number, house: number) {
  return (lagnaRashi + house - 1) % 12;
}

export function calcAshtakavarga(positions: Positions, lagnaRashi: number) {
  const contributors = ["Su", "Ch", "Ma", "Bu", "Gu", "Sh", "Sa"] as const;
  const sav = Array<number>(12).fill(0);
  for (const planet of contributors) {
    const table = BAV[planet];
    for (let c = 0; c < 8; c++) {
      const from = c < 7 ? getRashi(positions[contributors[c]].sid) : lagnaRashi;
      for (const h of table[c]) sav[(from + h - 1) % 12] += 1;
    }
  }
  return sav;
}

export interface KPLords {
  signLord: PlanetId;
  starLord: PlanetId;
  subLord: PlanetId;
}

export function resolveKP(sid: number): KPLords {
  const nak = Math.floor(sid / NAK_SPAN);
  const starLord = VIM_ORDER[nak % 9];
  const pos = sid - nak * NAK_SPAN;
  const start = nak % 9;
  let acc = 0;
  let subLord = starLord;
  for (let s = 0; s < 9; s++) {
    const i = (start + s) % 9;
    acc += (VIM_YEARS[i] / VIM_TOTAL) * NAK_SPAN;
    if (pos <= acc + 1e-9) {
      subLord = VIM_ORDER[i];
      break;
    }
  }
  return { signLord: RASHI_LORDS[getRashi(sid)], starLord, subLord };
}

export interface BirthInput {
  dob: string;
  tob: string;
  lat: number;
  lon: number;
}

export interface Chart {
  birth: Date;
  lat: number;
  lon: number;
  positions: Positions;
  ayanamsa: number;
  lagna: { sid: number; rashi: number };
  /** Sarvashtakavarga points per rashi — the Divine Matrix Load Index (DMLI). */
  sav: number[];
}

export function computeChart(input: BirthInput): Chart {
  const birth = istToDate(input.dob, input.tob);
  const { positions, ayanamsa } = calcPositions(birth);
  const lagnaSid = norm(calcLagna(julianDay(birth), input.lat, input.lon) - ayanamsa);
  const lagnaRashi = getRashi(lagnaSid);
  return {
    birth,
    lat: input.lat,
    lon: input.lon,
    positions,
    ayanamsa,
    lagna: { sid: lagnaSid, rashi: lagnaRashi },
    sav: calcAshtakavarga(positions, lagnaRashi),
  };
}

/** Live (gochar) positions for a calendar day ("YYYY-MM-DD"), taken at 12:00 UTC like the original engine. */
export function transitFor(day: string): Positions {
  return calcPositions(dayNoon(day)).positions;
}

/** 12:00 UTC on a calendar day ("YYYY-MM-DD"). */
export function dayNoon(day: string) {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12));
}

/** The IST calendar day ("YYYY-MM-DD") of an instant, optionally shifted by whole days. */
export function istDay(date: Date, offsetDays = 0) {
  const shifted = new Date(date.getTime() + IST_OFFSET_HOURS * 3600000 + offsetDays * 86400000);
  return shifted.toISOString().slice(0, 10);
}

export interface Alignment {
  natal: PlanetId;
  transit: PlanetId;
  distance: number;
  exact: boolean;
}

/** Live bodies within `orb` degrees of a birth body. */
export function findAlignments(natal: Positions, live: Positions, orb = 5): Alignment[] {
  const out: Alignment[] = [];
  for (const n of PLANET_IDS) {
    for (const t of PLANET_IDS) {
      let diff = Math.abs(natal[n].sid - live[t].sid);
      if (diff > 180) diff = 360 - diff;
      if (diff <= orb) out.push({ natal: n, transit: t, distance: diff, exact: diff <= 1 });
    }
  }
  return out.sort((a, b) => a.distance - b.distance);
}

/** Age gate from the original engine: no analysis for children aged two or under. */
export function isUnderAgeLimit(dob: string, now: Date) {
  const [y, m, d] = dob.split("-").map(Number);
  const ageYears = (now.getTime() - new Date(y, m - 1, d).getTime()) / (365.25 * 86400000);
  return ageYears <= 2;
}

export function formatDegrees(deg: number) {
  const inSign = deg % 30;
  const d = Math.floor(inSign);
  const m = Math.floor((inSign - d) * 60);
  return `${d}°${String(m).padStart(2, "0")}′`;
}
