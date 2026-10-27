import { dayNoon, findAlignments, transitFor, type Chart } from "./core";
import { currentPeriod, vimshottari, vimshottariSub } from "./dasha";
import {
  bestHours,
  brief,
  conflictRisk,
  learningScores,
  overallScore,
  spaceAlignment,
  wealthScores,
  wellbeing,
  type HourMode,
} from "./insights";

/** Everything the dashboard and Life Scores need for one profile on one calendar day. */
export function analyse(chart: Chart, day: string, hourMode: HourMode = "business") {
  const at = dayNoon(day);
  const live = transitFor(day);
  const alignments = findAlignments(chart.positions, live);
  const vim = vimshottari(chart);
  const md = currentPeriod(vim, at);
  const ad = md ? currentPeriod(vimshottariSub(md), at) : undefined;
  const wealth = wealthScores(chart, live);
  const conflict = conflictRisk(chart, live);
  const learning = learningScores(chart, live);
  const health = wellbeing(chart, live, md?.lord);
  const hours = bestHours(chart, day, hourMode);
  const overall = overallScore(chart, wealth, conflict, learning, health, vim, at);
  return {
    live,
    alignments,
    md,
    ad,
    wealth,
    conflict,
    learning,
    health,
    hours,
    overall,
    space: spaceAlignment(chart),
    brief: brief(wealth, conflict, learning, health, hours),
  };
}

export type Analysis = ReturnType<typeof analyse>;
