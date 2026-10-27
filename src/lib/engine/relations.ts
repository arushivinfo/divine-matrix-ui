import { ELEMENTS } from "./constants";
import { getRashi, type Chart } from "./core";

export type Element = (typeof ELEMENTS)[number];
export const elementOf = (rashi: number): Element => ELEMENTS[rashi % 4];

/** Friction points between elements [a][b]: Fire, Earth, Air, Water. */
const FRICTION = [
  [0, 3, 1, 5],
  [3, 0, 5, 1],
  [1, 5, 0, 3],
  [5, 1, 3, 0],
];
const FRICTION_LABEL = [
  ["High echo", "Smothering", "Mutual support", "Direct clash"],
  ["Smothering", "High echo", "Direct clash", "Mutual support"],
  ["Mutual support", "Direct clash", "High echo", "Smothering"],
  ["Direct clash", "Mutual support", "Smothering", "High echo"],
];
export type FrictionStatus = "harmonious" | "supportive" | "neutral" | "clash";
const FRICTION_STATUS: FrictionStatus[][] = [
  ["harmonious", "neutral", "supportive", "clash"],
  ["neutral", "harmonious", "clash", "supportive"],
  ["supportive", "clash", "harmonious", "neutral"],
  ["clash", "supportive", "neutral", "harmonious"],
];

export interface Factor {
  key: "moon" | "lagna" | "sun";
  title: string;
  pair: [Element, Element];
  label: string;
  status: FrictionStatus;
  /** 0–100, higher is smoother. */
  flow: number;
}

export interface Compatibility {
  match: number;
  verdict: string;
  factors: Factor[];
}

function points(chart: Chart) {
  return {
    moon: getRashi(chart.positions.Ch.sid),
    lagna: chart.lagna.rashi,
    sun: getRashi(chart.positions.Su.sid),
  };
}

export function compatibility(a: Chart, b: Chart): Compatibility {
  const pa = points(a);
  const pb = points(b);
  const factor = (key: Factor["key"], title: string): Factor => {
    const ea = pa[key] % 4;
    const eb = pb[key] % 4;
    return {
      key,
      title,
      pair: [ELEMENTS[ea], ELEMENTS[eb]],
      label: FRICTION_LABEL[ea][eb],
      status: FRICTION_STATUS[ea][eb],
      flow: Math.round((1 - FRICTION[ea][eb] / 5) * 100),
    };
  };
  const factors = [factor("moon", "Emotional sync"), factor("lagna", "Outlook"), factor("sun", "Core drive")];
  const friction = (f: Factor) => FRICTION[ELEMENTS.indexOf(f.pair[0])][ELEMENTS.indexOf(f.pair[1])];
  const total = friction(factors[0]) + friction(factors[1]) * 0.5 + friction(factors[2]) * 0.3;
  const match = Math.round((1 - total / 9) * 100);
  const verdict = match >= 80 ? "Deep natural flow" : match >= 60 ? "Strong connection" : match >= 40 ? "Takes effort" : "High friction";
  return { match, verdict, factors };
}

export const TEAM_TYPES: Record<Element, { name: string; strength: string; risk: string; role: string }> = {
  Fire: { name: "Visionary expansion squad", strength: "Rapid R&D and innovation", risk: "Burnout and power conflicts", role: "Pioneer / pitch lead" },
  Earth: { name: "Execution powerhouse", strength: "Operations and quality", risk: "Resistance to change", role: "Process manager" },
  Air: { name: "Strategy & communication hub", strength: "Marketing and networking", risk: "High talk, low delivery", role: "Strategy lead" },
  Water: { name: "Empathy & integration core", strength: "People and customer retention", risk: "Slow decision loops", role: "Culture builder" },
};
const GAP_ADVICE: Record<Element, string> = {
  Fire: "Vision gap — add an innovator.",
  Earth: "Execution gap — add a process manager.",
  Air: "Communication gap — add a strategist.",
  Water: "Empathy gap — add a people specialist.",
};

export interface TeamMember {
  name: string;
  dominant: Element;
  role: string;
}
export interface TeamSynergy {
  type: Element;
  mix: { element: Element; pct: number }[];
  members: TeamMember[];
  gaps: string[];
}

/** Element vector per person: Moon ×3, Lagna ×2, Sun ×1. */
export function teamSynergy(people: { name: string; chart: Chart }[]): TeamSynergy {
  const team = [0, 0, 0, 0];
  const members = people.map(({ name, chart }) => {
    const p = points(chart);
    const vec = [0, 0, 0, 0];
    vec[p.moon % 4] += 3;
    vec[p.lagna % 4] += 2;
    vec[p.sun % 4] += 1;
    vec.forEach((v, i) => (team[i] += v));
    const dominant = ELEMENTS[vec.indexOf(Math.max(...vec))];
    return { name, dominant, role: TEAM_TYPES[dominant].role };
  });
  const total = team.reduce((x, y) => x + y, 0) || 1;
  const mix = ELEMENTS.map((element, i) => ({ element, pct: Math.round((team[i] / total) * 100) }));
  const type = ELEMENTS[team.indexOf(Math.max(...team))];
  const gaps = mix.filter((m) => m.pct < 20).map((m) => GAP_ADVICE[m.element]);
  return { type, mix, members, gaps };
}
