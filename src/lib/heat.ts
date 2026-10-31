/**
 * Energy Grid heatmap palette. Same tiers and hue families as the original
 * Divine Matrix engine (green → light green → slate → red), retuned so each
 * step also differs in lightness. Colours are CSS variables, so they follow
 * the light/dark theme (see globals.css).
 */
export type HeatLevel = "peak" | "high" | "baseline" | "critical";

const SWATCH: Record<HeatLevel, { bg: string; fg: string }> = {
  peak: { bg: "var(--heat-peak)", fg: "var(--heat-peak-fg)" },
  high: { bg: "var(--heat-high)", fg: "var(--heat-high-fg)" },
  baseline: { bg: "var(--heat-base)", fg: "var(--heat-base-fg)" },
  critical: { bg: "var(--heat-crit)", fg: "var(--heat-crit-fg)" },
};

export const HEAT_INFO: Record<HeatLevel, { label: string; range: string }> = {
  peak: { label: "Peak", range: "34+" },
  high: { label: "High", range: "28–33" },
  baseline: { label: "Baseline", range: "21–27" },
  critical: { label: "Critical", range: "≤20" },
};

export const HEAT_LEVELS: HeatLevel[] = ["peak", "high", "baseline", "critical"];

export function heatSwatch(level: HeatLevel) {
  return SWATCH[level];
}

export function heatLevel(load: number): HeatLevel {
  if (load >= 34) return "peak";
  if (load >= 28) return "high";
  if (load >= 21) return "baseline";
  return "critical";
}

/** Planet chips: birth positions in ink (inverted in dark theme), live positions in sky blue with a soft halo. */
export const CHIP = {
  natal: { bg: "var(--chip-natal)", fg: "var(--chip-natal-fg)" },
  live: { bg: "#7CD4FD", fg: "#0B3A53" },
};

/** Cell outline when a live body is within orb of a birth body. */
export const ALIGNMENT_RING = "#36BFFA";
