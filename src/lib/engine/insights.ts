import { PLANET_IDS, PLANET_NAME, VIM_ORDER, VIM_TOTAL, VIM_YEARS, type PlanetId } from "./constants";
import { calcHouse, getRashi, houseRashi, type Chart, type Positions } from "./core";
import { currentPeriod, type Period } from "./dasha";
import { weekdayOf } from "./panchang";

const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));
const KENDRA_TRIKONA = [1, 4, 5, 7, 9, 10, 11];

/* ---------------- Wealth (investment scoreboard) ---------------- */

export interface WealthScores {
  property: { score: number; transit: number };
  shares: { score: number; transit: number };
  gold: { score: number; transit: number };
  trend: "Rising" | "Falling" | "Stable";
}

export function wealthScores(chart: Chart, live: Positions): WealthScores {
  const { positions, sav } = chart;
  const lagna = chart.lagna.rashi;
  const houseQ: Record<number, number> = { 1: 1, 4: 1, 7: 1, 10: 1, 5: 0.9, 9: 0.9, 2: 0.8, 11: 0.8, 3: 0.5, 6: 0.5, 8: 0.3, 12: 0.3 };

  const natalScore = (pid: PlanetId, relevant: number[]) => {
    const rashi = getRashi(positions[pid].sid);
    const house = calcHouse(rashi, lagna);
    const savNorm = clamp((sav[rashi] - 18) / 20, 0, 1);
    const relevance = relevant.includes(house) ? 1.2 : 0.8;
    return Math.round(Math.min(100, (houseQ[house] ?? 0.5) * 40 + savNorm * 35 + relevance * 25));
  };

  const transitBoost = (house: number) => {
    const target = houseRashi(lagna, house);
    let boost = 0;
    for (const pid of ["Gu", "Sh", "Bu"] as const) {
      const r = getRashi(live[pid].sid);
      if (r === target) boost += 12;
      if ((r + 6) % 12 === target) boost += 6;
      if (pid === "Gu" && ((r + 4) % 12 === target || (r + 8) % 12 === target)) boost += 5;
    }
    for (const pid of ["Sa", "Ra", "Ke"] as const) {
      const r = getRashi(live[pid].sid);
      if (r === target) boost -= 12;
      if ((r + 6) % 12 === target) boost -= 5;
    }
    if (getRashi(live.Ma.sid) === target) boost += house === 4 ? 8 : -5;
    return clamp(boost, -15, 20);
  };

  const h = (n: number) => sav[houseRashi(lagna, n)];

  const propTransit = transitBoost(4);
  const property = clamp(Math.round(natalScore("Ma", [4, 2, 11]) * 0.6 + (h(4) / 40) * 100 * 0.4) + propTransit, 5);
  const sharesTransit = Math.round((transitBoost(5) + transitBoost(11)) / 2);
  const shares = clamp(
    Math.round(natalScore("Bu", [5, 11, 2]) * 0.35 + natalScore("Ra", [5, 11, 10]) * 0.25 + (h(5) / 40) * 100 * 0.4) + sharesTransit,
    5,
  );
  const goldTransit = Math.round((transitBoost(2) + transitBoost(9)) / 2);
  const gold = clamp(Math.round(natalScore("Gu", [2, 5, 9, 11]) * 0.6 + (h(2) / 40) * 100 * 0.4) + goldTransit, 5);

  const total = propTransit + sharesTransit + goldTransit;
  return {
    property: { score: Math.round(property), transit: propTransit },
    shares: { score: Math.round(shares), transit: sharesTransit },
    gold: { score: Math.round(gold), transit: goldTransit },
    trend: total > 5 ? "Rising" : total < -5 ? "Falling" : "Stable",
  };
}

/* ---------------- Conflict risk (conflict radar) ---------------- */

export type Severity = "critical" | "high" | "medium";
export interface ConflictTrigger {
  severity: Severity;
  text: string;
  practice: string;
}
export interface ConflictRisk {
  score: number;
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  triggers: ConflictTrigger[];
}

export function conflictRisk(chart: Chart, live: Positions): ConflictRisk {
  const moonRashi = getRashi(chart.positions.Ch.sid);
  const triggers: ConflictTrigger[] = [];
  let score = 0;

  for (const tp of ["Sa", "Ra", "Ke", "Gu"] as const) {
    const dist = (((getRashi(live[tp].sid) - moonRashi) % 12) + 12) % 12;
    if (dist === 5 || dist === 7) {
      triggers.push({
        severity: tp === "Sa" || tp === "Ra" ? "high" : "medium",
        text: `${PLANET_NAME[tp]} is ${dist === 5 ? "6th" : "8th"} from your birth Moon (Shadashtak)`,
        practice: tp === "Sa" ? "Donate sesame oil on Saturday." : tp === "Ra" ? "Recite the Durga Chalisa." : "Recite the Hanuman Chalisa.",
      });
      score += tp === "Sa" ? 30 : tp === "Ra" ? 25 : 15;
    }
  }
  if (getRashi(live.Ra.sid) === moonRashi) {
    triggers.push({ severity: "critical", text: "Live Rahu is in the same zone as your birth Moon", practice: "Keep Monday fasts; steady the mind with a daily routine." });
    score += 35;
  }
  if (getRashi(live.Ke.sid) === moonRashi) {
    triggers.push({ severity: "high", text: "Live Ketu is over your birth Moon — emotional turbulence possible", practice: "Practise regular meditation and pranayama." });
    score += 25;
  }
  const satRashi = getRashi(live.Sa.sid);
  if (satRashi === getRashi(chart.positions.Su.sid)) {
    triggers.push({ severity: "medium", text: "Live Saturn over your birth Sun — career pressure", practice: "Daily Surya Namaskar; donate jaggery on Sunday." });
    score += 20;
  }
  const satFromMoon = (((satRashi - moonRashi) % 12) + 12) % 12;
  if (satFromMoon === 11 || satFromMoon === 0 || satFromMoon === 1) {
    const phase = satFromMoon === 11 ? "rising phase" : satFromMoon === 0 ? "peak phase" : "setting phase";
    triggers.push({ severity: satFromMoon === 0 ? "critical" : "high", text: `Sade Sati, ${phase}`, practice: "Recite the Hanuman Chalisa seven times on Saturday." });
    score += satFromMoon === 0 ? 30 : 20;
  }

  score = Math.min(100, score);
  const rank: Record<Severity, number> = { critical: 3, high: 2, medium: 1 };
  triggers.sort((a, b) => rank[b.severity] - rank[a.severity]);
  return { score, level: score >= 70 ? "CRITICAL" : score >= 45 ? "HIGH" : score >= 20 ? "MEDIUM" : "LOW", triggers };
}

/* ---------------- Best hours (hora-based time optimizer) ---------------- */

export type HourMode = "business" | "partner" | "dating";
export interface HourSlot {
  hour: number;
  lord: PlanetId;
  score: number;
}
export interface BestHours {
  slots: HourSlot[];
  window: { from: string; to: string; lords: PlanetId[] };
}

const HORA_ORDER: PlanetId[] = ["Su", "Sh", "Bu", "Ch", "Sa", "Gu", "Ma"];
const DAY_HORA_START = [0, 3, 6, 2, 5, 1, 4];
const HOUR_MODES: Record<HourMode, { primary: PlanetId[]; secondary: PlanetId[]; avoid: PlanetId[] }> = {
  business: { primary: ["Bu", "Su"], secondary: ["Gu", "Ma"], avoid: ["Ra", "Ke", "Sa"] },
  partner: { primary: ["Gu", "Sh"], secondary: ["Ch", "Su"], avoid: ["Ra", "Sa", "Ke"] },
  dating: { primary: ["Ch", "Sh"], secondary: ["Gu", "Bu"], avoid: ["Sa", "Ra", "Ke"] },
};

export function bestHours(chart: Chart, day: string, mode: HourMode): BestHours {
  const start = DAY_HORA_START[weekdayOf(day)];
  const m = HOUR_MODES[mode];
  const slots: HourSlot[] = [];
  for (let h = 0; h < 24; h++) {
    const lord = HORA_ORDER[(start + h) % 7];
    let score = m.primary.includes(lord) ? 3 : m.secondary.includes(lord) ? 2 : m.avoid.includes(lord) ? -1 : 1;
    if (KENDRA_TRIKONA.includes(calcHouse(getRashi(chart.positions[lord].sid), chart.lagna.rashi))) score += 1;
    slots.push({ hour: (6 + h) % 24, lord, score });
  }
  const streak = (min: number) => {
    let best = { start: 0, len: 0 };
    const cur = { start: 0, len: 0 };
    slots.forEach((s, i) => {
      if (s.score >= min) {
        if (cur.len === 0) cur.start = i;
        cur.len++;
        if (cur.len > best.len) best = { ...cur };
      } else cur.len = 0;
    });
    return best;
  };
  let best = streak(3);
  if (best.len === 0) best = streak(2);
  const label = (h: number) => `${String(h).padStart(2, "0")}:00`;
  const first = slots[best.start];
  const endHour = (first.hour + Math.max(best.len, 1)) % 24;
  return {
    slots,
    window: {
      from: label(first.hour),
      to: label(endHour),
      lords: [...new Set(slots.slice(best.start, best.start + Math.max(best.len, 1)).map((s) => s.lord))],
    },
  };
}

/* ---------------- Learning & exams ---------------- */

export interface LearningScores {
  focus: number;
  competition: number;
  higherEd: number;
  tip: string;
}

export function learningScores(chart: Chart, live: Positions): LearningScores {
  const { positions, sav } = chart;
  const lagna = chart.lagna.rashi;
  const influence = (pid: PlanetId, house: number) => {
    const dist = (((getRashi(live[pid].sid) - houseRashi(lagna, house)) % 12) + 12) % 12;
    if (dist === 0) return 1;
    if (dist === 6) return 0.7;
    if (pid === "Gu" && (dist === 4 || dist === 8)) return 0.6;
    if (pid === "Ma" && (dist === 3 || dist === 7)) return 0.5;
    if (pid === "Sa" && (dist === 2 || dist === 9)) return 0.5;
    return 0;
  };
  const houseOf = (pid: PlanetId) => calcHouse(getRashi(positions[pid].sid), lagna);
  const h = (n: number) => sav[houseRashi(lagna, n)];

  const buStrength = [1, 2, 4, 5, 7, 10, 11].includes(houseOf("Bu")) ? 1 : 0.5;
  const buLive = influence("Bu", 5) + influence("Bu", 1) * 0.5;
  const malefic5 = influence("Sa", 5) * 0.4 + influence("Ke", 5) * 0.3;
  let focus = Math.round(Math.min(100, (h(5) / 35) * 30 + buStrength * 25 + buLive * 30 + (1 - malefic5) * 15));
  const buSun = Math.abs(live.Bu.sid - live.Su.sid);
  if (buSun < 10 || buSun > 350) focus = Math.max(30, focus - 10);

  const maUpachaya = [3, 6, 10, 11].includes(houseOf("Ma")) ? 1 : 0.6;
  const competition = Math.round(Math.min(100, (h(6) / 35) * 25 + maUpachaya * 20 + influence("Ma", 6) * 25 + influence("Ra", 6) * 20 + 10));

  const guHouse = houseOf("Gu");
  const guKendra = [1, 4, 7, 10].includes(guHouse) ? 1 : [5, 9].includes(guHouse) ? 0.9 : 0.5;
  const higherEd = Math.round(Math.min(100, (h(9) / 35) * 25 + guKendra * 25 + influence("Gu", 9) * 25 + influence("Gu", 5) * 15 + 10));

  let tip = "Keep revising consistently and avoid changing your study plan.";
  if (focus >= 75 && competition >= 70) tip = "Ideal for both deep study and a mock test — tackle complex topics.";
  else if (focus >= 75) tip = "Take a deep study session — retention is at its peak.";
  else if (competition >= 75) tip = "Mock tests and timed practice will be extra effective today.";
  else if (higherEd >= 75) tip = "Seek a mentor’s guidance and push admissions paperwork forward.";
  else if (focus < 50 && competition < 50) tip = "Keep today for revision and light topics; move heavy study to tomorrow.";

  return { focus, competition, higherEd, tip };
}

/* ---------------- Wellbeing (KP cusps + dosha balance) ---------------- */

const ORGANS: Record<PlanetId, string[]> = {
  Su: ["Heart", "Eyes", "Bones"],
  Ch: ["Lungs", "Blood flow", "Fluids"],
  Ma: ["Muscles", "Blood", "Bile"],
  Bu: ["Nervous system", "Skin", "Respiratory tract"],
  Gu: ["Liver", "Kidneys", "Arteries"],
  Sh: ["Kidneys", "Reproductive system", "Throat"],
  Sa: ["Bones", "Teeth", "Joints"],
  Ra: ["Intestines", "Nerves", "Allergies"],
  Ke: ["Nervous system", "Injuries", "Toxin build-up"],
};
const VATA: PlanetId[] = ["Sa", "Bu", "Ra"];
const PITTA: PlanetId[] = ["Su", "Ma", "Ke"];
const KAPHA: PlanetId[] = ["Ch", "Gu", "Sh"];
const NAK_SPAN = 360 / 27;

function cuspSubLord(lagnaRashi: number, house: number): PlanetId {
  const cusp = houseRashi(lagnaRashi, house) * 30;
  const nak = Math.floor(cusp / NAK_SPAN);
  const first = nak % 9;
  const pos = cusp - nak * NAK_SPAN;
  let acc = 0;
  for (let i = 0; i < 9; i++) {
    const idx = (first + i) % 9;
    acc += (VIM_YEARS[idx] / VIM_TOTAL) * NAK_SPAN;
    if (pos < acc) return VIM_ORDER[idx];
  }
  return VIM_ORDER[first];
}

export type Risk = "low" | "moderate" | "high";
export interface Wellbeing {
  cusps: { house: number; label: string; lord: PlanetId; risk: Risk; status: string }[];
  doshas: { vata: number; pitta: number; kapha: number };
  dominant: "Vata" | "Pitta" | "Kapha";
  watch: string[];
  advice: string;
  score: number;
}

export function wellbeing(chart: Chart, live: Positions, chapter: PlanetId | undefined): Wellbeing {
  const lagna = chart.lagna.rashi;
  const pressure = (house: number) => {
    const target = houseRashi(lagna, house);
    let p = 0;
    for (const pid of ["Sa", "Ma", "Ra", "Ke"] as const) {
      const r = getRashi(live[pid].sid);
      if (r === target) p += 2;
      if ((r + 6) % 12 === target) p += 1;
      if (pid === "Sa" && ((r + 2) % 12 === target || (r + 9) % 12 === target)) p += 1;
    }
    for (const pid of ["Gu", "Sh"] as const) {
      const r = getRashi(live[pid].sid);
      if (r === target) p -= 2;
      if (pid === "Gu" && ((r + 4) % 12 === target || (r + 8) % 12 === target)) p -= 1;
    }
    return p;
  };

  const defs = [
    { house: 6, label: "6th · illness" },
    { house: 8, label: "8th · chronic" },
    { house: 12, label: "12th · recovery" },
    { house: 1, label: "1st · immunity" },
  ];
  const cusps = defs.map(({ house, label }) => {
    const lord = cuspSubLord(lagna, house);
    const savPts = chart.sav[houseRashi(lagna, house)];
    const p = pressure(house);
    let risk: Risk;
    let status: string;
    if (house === 1) {
      const immunity = savPts - p;
      risk = immunity >= 30 ? "low" : immunity >= 24 ? "moderate" : "high";
      status = risk === "low" ? "Strong" : risk === "moderate" ? "Average" : "Weak";
    } else {
      const r = (["Sa", "Ma", "Ra", "Ke"].includes(lord) ? 2 : 0) + (savPts < 25 ? 2 : 0) + Math.max(0, p);
      risk = r >= 4 ? "high" : r >= 2 ? "moderate" : "low";
      status = risk === "high" ? "High risk" : risk === "moderate" ? "Moderate" : "Low risk";
    }
    return { house, label, lord, risk, status };
  });

  let vata = 0, pitta = 0, kapha = 0;
  const weigh = (pid: PlanetId, w: number) => {
    if (VATA.includes(pid)) vata += w;
    if (PITTA.includes(pid)) pitta += w;
    if (KAPHA.includes(pid)) kapha += w;
  };
  [cusps[0].lord, chapter ?? "Sa"].forEach((pid) => weigh(pid, 2));
  PLANET_IDS.forEach((pid) => weigh(pid, 1));
  const h6 = houseRashi(lagna, 6);
  const h8 = houseRashi(lagna, 8);
  PLANET_IDS.forEach((pid) => {
    const r = getRashi(live[pid].sid);
    if (r === h6 || r === h8) weigh(pid, 2);
  });
  const total = vata + pitta + kapha || 1;
  const doshas = { vata: Math.round((vata / total) * 100), pitta: Math.round((pitta / total) * 100), kapha: Math.round((kapha / total) * 100) };
  const dominant = doshas.vata >= doshas.pitta && doshas.vata >= doshas.kapha ? "Vata" : doshas.pitta >= doshas.kapha ? "Pitta" : "Kapha";
  const advice = {
    Vata: "Vata-led: favour warm fluids, look after your joints and keep mental load light after 10 pm.",
    Pitta: "Pitta-led: body heat may rise — prefer cooling foods and a calm environment.",
    Kapha: "Kapha-led: watch for sluggishness and congestion — light exercise and warm spiced tea help.",
  }[dominant];

  const watch = [...new Set(cusps.filter((c) => c.house !== 1 && c.risk !== "low").flatMap((c) => ORGANS[c.lord]))];
  const immunity = cusps.find((c) => c.house === 1)!;
  const base = immunity.risk === "low" ? 90 : immunity.risk === "moderate" ? 60 : 35;
  const highCount = cusps.filter((c) => c.house !== 1 && c.risk === "high").length;
  return { cusps, doshas, dominant, watch, advice, score: clamp(Math.round(base - highCount * 12)) };
}

/* ---------------- Space alignment (Vastu directions) ---------------- */

export interface Direction {
  dir: string;
  lord: PlanetId;
  score: number;
}

const VASTU: [string, PlanetId][] = [
  ["E", "Su"], ["NW", "Ch"], ["S", "Ma"], ["N", "Bu"], ["NE", "Gu"], ["SE", "Sh"], ["W", "Sa"], ["SW", "Ra"], ["C", "Ke"],
];
export const COMPASS_ORDER = ["NW", "N", "NE", "W", "C", "E", "SW", "S", "SE"];

export function spaceAlignment(chart: Chart): Direction[] {
  const byDir = new Map<string, Direction>();
  for (const [dir, lord] of VASTU) {
    const rashi = getRashi(chart.positions[lord].sid);
    const house = calcHouse(rashi, chart.lagna.rashi);
    let score = [1, 2, 5, 9, 10, 11].includes(house) ? 2 : [4, 7].includes(house) ? 1 : [6, 8].includes(house) ? -1 : 0;
    if (chart.sav[rashi] >= 34) score += 1;
    else if (chart.sav[rashi] <= 20) score -= 1;
    byDir.set(dir, { dir, lord, score: clamp(score, -2, 2) });
  }
  return COMPASS_ORDER.map((d) => byDir.get(d)!);
}

/* ---------------- Overall score ---------------- */

export interface Overall {
  score: number;
  verdict: string;
  parts: { label: string; value: number }[];
}

export function overallScore(
  chart: Chart,
  wealth: WealthScores,
  conflict: ConflictRisk,
  learning: LearningScores,
  health: Wellbeing,
  vimshottari: Period[],
  at: Date,
): Overall {
  const wealthAvg = Math.round((wealth.property.score + wealth.shares.score + wealth.gold.score) / 3);
  const harmony = Math.max(0, 100 - conflict.score);
  let chapter = 70;
  const md = currentPeriod(vimshottari, at);
  if (md) {
    const rashi = getRashi(chart.positions[md.lord].sid);
    const house = calcHouse(rashi, chart.lagna.rashi);
    chapter = Math.round(Math.min(100, (chart.sav[rashi] / 35) * 50 + (KENDRA_TRIKONA.includes(house) ? 50 : 25)));
  }
  const totalSav = chart.sav.reduce((a, b) => a + b, 0);
  const grid = Math.round(Math.min(100, (totalSav / 370) * 100));
  const learn = Math.round((learning.focus + learning.competition + learning.higherEd) / 3);
  const score = Math.round(wealthAvg * 0.17 + harmony * 0.17 + chapter * 0.17 + grid * 0.17 + learn * 0.16 + health.score * 0.16);
  const verdict = score >= 80 ? "Highly favourable" : score >= 65 ? "Favourable" : score >= 45 ? "Moderate" : "Challenging";
  return {
    score,
    verdict,
    parts: [
      { label: "Wealth", value: wealthAvg },
      { label: "Harmony", value: harmony },
      { label: "Life chapter", value: chapter },
      { label: "Grid strength", value: grid },
      { label: "Learning", value: learn },
      { label: "Wellbeing", value: health.score },
    ],
  };
}

/** Plain-language brief built from the scores. */
export function brief(wealth: WealthScores, conflict: ConflictRisk, learning: LearningScores, health: Wellbeing, hours: BestHours) {
  const assets = [
    ["Property", wealth.property.score],
    ["Shares", wealth.shares.score],
    ["Gold", wealth.gold.score],
  ] as const;
  const top = [...assets].sort((a, b) => b[1] - a[1])[0];
  const headline =
    conflict.level === "LOW"
      ? `A clear day. ${top[0]} is your strongest money move right now.`
      : `${top[0]} is your strongest money move — keep conversations calm and factual today.`;
  const points = [
    `${top[0]} scores ${top[1]}/100, with a ${wealth.trend.toLowerCase()} trend from live movement.`,
    `Best window for business: ${hours.window.from}–${hours.window.to}.`,
    learning.tip,
    health.advice,
  ];
  return { headline, points };
}
