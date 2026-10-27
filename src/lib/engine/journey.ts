import { RASHI_LORDS } from "./constants";
import { calcHouse, calcPositions, dayNoon, getRashi, houseRashi, type Chart } from "./core";
import { RAHU_KAAL_SLOT, dayChoghadiya, isGoodTithi, sunriseSunset, tithiNumber, weekdayOf } from "./panchang";

export type TravelDirection = "NORTH" | "EAST" | "SOUTH" | "WEST";

/** Disha shool: the blocked direction for each weekday and its traditional remedy. */
const DISHA_SHOOL: { blocked: TravelDirection; remedy: string }[] = [
  { blocked: "WEST", remedy: "Have betel leaf or ghee before leaving." },
  { blocked: "EAST", remedy: "Look in a mirror or drink milk before leaving." },
  { blocked: "NORTH", remedy: "Have jaggery before leaving." },
  { blocked: "NORTH", remedy: "Have coriander or sesame seeds before leaving." },
  { blocked: "SOUTH", remedy: "Have curd or cumin seeds before leaving." },
  { blocked: "WEST", remedy: "Have barley or mustard seeds before leaving." },
  { blocked: "EAST", remedy: "Have ginger or black gram before leaving." },
];
const GOOD_NAKS = [0, 3, 6, 7, 11, 12, 14, 16, 21, 22, 26];
const BAD_NAKS = [4, 5, 8, 9, 17, 18];
const GOOD_LORD_HOUSES = [1, 2, 5, 9, 10, 11];

export type Status = "clear" | "boost" | "watch" | "blocked";
export interface Check {
  label: string;
  value: string;
  note: string;
  status: Status;
}

export interface JourneyResult {
  score: number;
  verdict: "GO" | "CAUTION" | "AVOID";
  headline: string;
  summary: string;
  blocked: TravelDirection;
  departure: { start: Date; end: Date; name: string } | null;
  checks: Check[];
  months: { year: number; month: number; score: number }[];
}

const clamp = (v: number) => Math.max(0, Math.min(100, v));

export function planJourney(chart: Chart, day: string, direction: TravelDirection): JourneyResult {
  const lagna = chart.lagna.rashi;
  const weekday = weekdayOf(day);
  const live = calcPositions(new Date(dayNoon(day).getTime() - 5.5 * 3600000)).positions;
  const moonNak = Math.floor(live.Ch.sid / (360 / 27));

  const shool = DISHA_SHOOL[weekday];
  const clash = shool.blocked === direction;

  const lordHouse = (house: number) => {
    const lord = RASHI_LORDS[houseRashi(lagna, house)];
    return { lord, house: calcHouse(getRashi(live[lord].sid), lagna) };
  };
  const ninth = lordHouse(9);
  const twelfth = lordHouse(12);
  const ninthGood = GOOD_LORD_HOUSES.includes(ninth.house);
  const twelfthGood = GOOD_LORD_HOUSES.includes(twelfth.house);
  const nakGood = GOOD_NAKS.includes(moonNak);
  const nakBad = BAD_NAKS.includes(moonNak);
  const tithiGood = isGoodTithi(tithiNumber(live.Ch.sid, live.Su.sid));

  let departure: JourneyResult["departure"] = null;
  const { sunrise, sunset } = sunriseSunset(day, chart.lat, chart.lon);
  if (sunrise && sunset) {
    const rahuSlot = RAHU_KAAL_SLOT[weekday] - 1;
    const slot = dayChoghadiya(day, sunrise, sunset)
      .filter((c) => c.isDay)
      .find((c, i) => i !== rahuSlot && (c.quality === "best" || c.quality === "good"));
    if (slot) departure = { start: slot.start, end: slot.end, name: slot.name };
  }

  let score = 50;
  if (clash) score -= 25;
  if (nakGood) score += 20;
  else if (nakBad) score -= 20;
  score += ninthGood ? 15 : -10;
  if (twelfthGood) score += 10;
  score += tithiGood ? 10 : -5;
  score = clamp(score);

  const h4 = houseRashi(lagna, 4);
  let vehicle = 50;
  if (getRashi(live.Bu.sid) === h4) vehicle += 20;
  if (getRashi(live.Sh.sid) === h4) vehicle += 20;
  if (tithiGood) vehicle += 15;
  if (clash) vehicle -= 15;
  if (nakBad) vehicle -= 10;
  vehicle = clamp(vehicle);

  const verdict = score >= 70 && !clash ? "GO" : score >= 45 ? "CAUTION" : "AVOID";
  const dirName = direction.charAt(0) + direction.slice(1).toLowerCase();
  const headline =
    verdict === "GO" ? `Go — heading ${dirName.toLowerCase()} is clear.` : verdict === "CAUTION" ? "Proceed carefully." : "Postpone if you can.";
  const summary =
    verdict === "GO"
      ? "No blocked direction, a supportive Moon and an active travel zone."
      : clash
        ? `${dirName} is blocked today. ${shool.remedy}`
        : "Leave in a good window and avoid the caution period.";

  const months: JourneyResult["months"] = [];
  const [y0, m0] = day.split("-").map(Number);
  for (let i = 0; i < 12; i++) {
    const year = y0 + Math.floor((m0 - 1 + i) / 12);
    const month = (m0 - 1 + i) % 12;
    const p = calcPositions(new Date(Date.UTC(year, month, 15, 6))).positions;
    const jup = calcHouse(getRashi(p.Gu.sid), lagna);
    const sat = calcHouse(getRashi(p.Sa.sid), lagna);
    let ms = 50;
    if ([1, 5, 9, 11].includes(jup)) ms += 25;
    if ([6, 8, 12].includes(sat)) ms -= 15;
    if ([3, 9].includes(jup)) ms += 10;
    months.push({ year, month, score: clamp(ms) });
  }

  const checks: Check[] = [
    {
      label: "Blocked direction",
      value: clash ? `${dirName} is blocked` : `None for ${dirName}`,
      note: `Today blocks ${shool.blocked.charAt(0) + shool.blocked.slice(1).toLowerCase()}.${clash ? " " + shool.remedy : ""}`,
      status: clash ? "blocked" : "clear",
    },
    {
      label: "Moon check",
      value: nakGood ? "Supportive" : nakBad ? "Unfavourable" : "Neutral",
      note: "Based on the Moon’s nakshatra on the day.",
      status: nakGood ? "clear" : nakBad ? "blocked" : "watch",
    },
    {
      label: "Long-distance zone",
      value: ninthGood ? "Active" : "Quiet",
      note: `9th lord moving through house ${ninth.house}.`,
      status: ninthGood ? "boost" : "watch",
    },
    {
      label: "Foreign & expenses zone",
      value: twelfthGood ? "Supportive" : "Keep a buffer",
      note: `12th lord moving through house ${twelfth.house}.`,
      status: twelfthGood ? "boost" : "watch",
    },
    {
      label: "Lunar day",
      value: tithiGood ? "Favourable" : "Mixed",
      note: "Tithi quality for starting a journey.",
      status: tithiGood ? "clear" : "watch",
    },
    {
      label: "Vehicle purchase",
      value: `${vehicle}/100`,
      note: vehicle >= 70 ? "A good day to buy." : vehicle >= 45 ? "Possible — pick a good window." : "Better to wait.",
      status: vehicle >= 70 ? "clear" : vehicle >= 45 ? "watch" : "blocked",
    },
  ];

  return { score, verdict, headline, summary, blocked: shool.blocked, departure, checks, months };
}
