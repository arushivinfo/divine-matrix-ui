/**
 * Energy Grid heatmap palette. Same tiers and hue families as the original
 * Divine Matrix engine (green → light green → slate → red), retuned so each
 * step also differs in lightness and sits with the rest of the brand.
 */
export type HeatLevel = "peak" | "high" | "baseline" | "critical";

interface Swatch {
  bg: string;
  fg: string;
}

const LIGHT: Record<HeatLevel, Swatch> = {
  peak: { bg: "#32D583", fg: "#052E1A" },
  high: { bg: "#A6F4C5", fg: "#053321" },
  baseline: { bg: "#E4E7EC", fg: "#344054" },
  critical: { bg: "#B42318", fg: "#FFFFFF" },
};

/** On dark surfaces (hero) the baseline tier becomes a dark slate. */
const DARK: Record<HeatLevel, Swatch> = {
  ...LIGHT,
  high: { bg: "#7CE7AC", fg: "#053321" },
  baseline: { bg: "#262C38", fg: "#C9CED8" },
};

export const HEAT_INFO: Record<HeatLevel, { label: string; range: string }> = {
  peak: { label: "Peak", range: "34+" },
  high: { label: "High", range: "28–33" },
  baseline: { label: "Baseline", range: "21–27" },
  critical: { label: "Critical", range: "≤20" },
};

export const HEAT_LEVELS: HeatLevel[] = ["peak", "high", "baseline", "critical"];

export function heatSwatch(level: HeatLevel, surface: "light" | "dark" = "light") {
  return (surface === "dark" ? DARK : LIGHT)[level];
}

export function heatLevel(load: number): HeatLevel {
  if (load >= 34) return "peak";
  if (load >= 28) return "high";
  if (load >= 21) return "baseline";
  return "critical";
}

/** Planet chips: birth positions in ink, live positions in sky blue with a soft halo. */
export const CHIP = {
  natal: { bg: "#0D1117", fg: "#FFFFFF" },
  live: { bg: "#7CD4FD", fg: "#0B3A53" },
};

/** Cell outline when a live body is within orb of a birth body. */
export const ALIGNMENT_RING = "#36BFFA";
