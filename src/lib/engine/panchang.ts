import * as Astronomy from "astronomy-engine";
import { NAKSHATRA_EN, type PlanetId } from "./constants";
import { calcPositions } from "./core";

export const TITHI_EN = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami",
  "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima / Amavasya",
];
export const YOGA_EN = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shula",
  "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan",
  "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti",
];
export const KARANA_EN = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti", "Shakuni", "Chatushpada", "Naga", "Kimstughna"];
export const WEEKDAY_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const WEEKDAY_LORD: PlanetId[] = ["Su", "Ch", "Ma", "Bu", "Gu", "Sh", "Sa"];

/** 1-based slot of daylight (eighths) that is Rahu Kaal, Sunday first. */
export const RAHU_KAAL_SLOT = [8, 2, 7, 5, 6, 4, 3];

export type HourQuality = "best" | "good" | "neutral" | "bad";
const CHOGH_DAY = ["Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg"];
const CHOGH_NIGHT = ["Shubh", "Amrit", "Char", "Rog", "Kaal", "Labh", "Udveg", "Shubh"];
const CHOGH_QUALITY: Record<string, HourQuality> = {
  Amrit: "best",
  Shubh: "good",
  Labh: "good",
  Char: "neutral",
  Rog: "bad",
  Kaal: "bad",
  Udveg: "bad",
};
const GOOD_TITHIS = [1, 2, 3, 5, 7, 10, 11, 13];
const GOOD_NAKSHATRAS = [0, 3, 6, 7, 11, 12, 14, 16, 21, 22, 26];
const BAD_YOGAS = [0, 6, 10, 12, 14, 16, 26];

export interface Choghadiya {
  name: string;
  quality: HourQuality;
  start: Date;
  end: Date;
  isDay: boolean;
}

export interface Panchang {
  weekday: number;
  tithi: { index: number; name: string; paksha: "Shukla" | "Krishna"; progress: number; good: boolean };
  nakshatra: { index: number; name: string; progress: number; good: boolean };
  yoga: { index: number; name: string; bad: boolean };
  karana: { name: string };
  sunrise: Date | null;
  sunset: Date | null;
  rahuKaal: { start: Date; end: Date } | null;
  abhijit: { start: Date; end: Date } | null;
  choghadiya: Choghadiya[];
  scores: { business: number; property: number; travel: number };
}

/** IST midnight of a calendar day ("YYYY-MM-DD"). */
function istMidnight(day: string) {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) - 5.5 * 3600000);
}

export function weekdayOf(day: string) {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function sunriseSunset(day: string, lat: number, lon: number) {
  const observer = new Astronomy.Observer(lat, lon, 0);
  const from = istMidnight(day);
  try {
    const rise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, from, 1);
    const set = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, from, 1);
    return { sunrise: rise?.date ?? null, sunset: set?.date ?? null };
  } catch {
    return { sunrise: null, sunset: null };
  }
}

export function dayChoghadiya(day: string, sunrise: Date, sunset: Date): Choghadiya[] {
  const weekday = weekdayOf(day);
  const dayLen = (sunset.getTime() - sunrise.getTime()) / 8;
  const nightLen = (24 * 3600000 - (sunset.getTime() - sunrise.getTime())) / 8;
  const out: Choghadiya[] = [];
  for (let i = 0; i < 8; i++) {
    const name = CHOGH_DAY[(weekday + i) % 8];
    const start = new Date(sunrise.getTime() + i * dayLen);
    out.push({ name, quality: CHOGH_QUALITY[name], start, end: new Date(start.getTime() + dayLen), isDay: true });
  }
  for (let i = 0; i < 8; i++) {
    const name = CHOGH_NIGHT[(weekday + i) % 8];
    const start = new Date(sunset.getTime() + i * nightLen);
    out.push({ name, quality: CHOGH_QUALITY[name], start, end: new Date(start.getTime() + nightLen), isDay: false });
  }
  return out;
}

export function tithiNumber(moonSid: number, sunSid: number) {
  const diff = (moonSid - sunSid + 360) % 360;
  return Math.floor(diff / 12) % 15;
}

export function isGoodTithi(tithi: number) {
  return GOOD_TITHIS.includes(tithi + 1);
}

/** Panchang for a calendar day at 12:00 IST, for a place. */
export function calcPanchang(day: string, lat: number, lon: number): Panchang {
  const [y, m, d] = day.split("-").map(Number);
  const at = new Date(Date.UTC(y, m - 1, d, 6, 30));
  const { positions } = calcPositions(at);
  const moon = positions.Ch.sid;
  const sun = positions.Su.sid;
  const weekday = weekdayOf(day);

  const diff = (moon - sun + 360) % 360;
  const tithiIdx = Math.floor(diff / 12);
  const tithi = tithiIdx % 15;
  const nakSpan = 360 / 27;
  const nak = Math.floor(moon / nakSpan);
  const yoga = Math.floor(((moon + sun) % 360) / nakSpan) % 27;
  const karana = Math.floor(diff / 6) % 11;

  const { sunrise, sunset } = sunriseSunset(day, lat, lon);
  let rahuKaal = null;
  let abhijit = null;
  let choghadiya: Choghadiya[] = [];
  if (sunrise && sunset) {
    const eighth = (sunset.getTime() - sunrise.getTime()) / 8;
    const rStart = new Date(sunrise.getTime() + (RAHU_KAAL_SLOT[weekday] - 1) * eighth);
    rahuKaal = { start: rStart, end: new Date(rStart.getTime() + eighth) };
    const midday = (sunrise.getTime() + sunset.getTime()) / 2;
    abhijit = { start: new Date(midday - 24 * 60000), end: new Date(midday + 24 * 60000) };
    choghadiya = dayChoghadiya(day, sunrise, sunset);
  }

  const good = isGoodTithi(tithi);
  const nakGood = GOOD_NAKSHATRAS.includes(nak);
  const yogaBad = BAD_YOGAS.includes(yoga);
  const base = (good ? 35 : 15) + (nakGood ? 35 : 15) + (yogaBad ? 0 : 20);
  const clamp = (v: number) => Math.max(0, Math.min(100, v));

  return {
    weekday,
    tithi: { index: tithi, name: TITHI_EN[tithi], paksha: tithiIdx < 15 ? "Shukla" : "Krishna", progress: Math.round(((diff % 12) / 12) * 100), good },
    nakshatra: { index: nak, name: NAKSHATRA_EN[nak], progress: Math.round(((moon % nakSpan) / nakSpan) * 100), good: nakGood },
    yoga: { index: yoga, name: YOGA_EN[yoga], bad: yogaBad },
    karana: { name: KARANA_EN[karana] },
    sunrise,
    sunset,
    rahuKaal,
    abhijit,
    choghadiya,
    scores: {
      business: clamp(base + (weekday === 3 || weekday === 5 ? 10 : 0)),
      property: clamp(base + (weekday === 4 ? 10 : -5)),
      travel: clamp(base + (weekday === 1 ? 10 : 0) - (weekday === 6 ? 10 : 0)),
    },
  };
}
