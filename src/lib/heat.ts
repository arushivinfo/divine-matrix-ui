/**
 * Energy Grid heatmap palette, taken from the original Divine Matrix engine:
 * DMLI (Ashtakavarga load) tiers coloured from neon green down to deep red.
 */
export type HeatLevel = "peak" | "high" | "baseline" | "critical";

export const HEAT: Record<HeatLevel, { bg: string; fg: string; label: string; range: string; onGreen: boolean }> = {
  peak: { bg: "#00FF66", fg: "#0A0A0A", label: "Peak", range: "34+", onGreen: true },
  high: { bg: "#4DFF88", fg: "#0A0A0A", label: "High", range: "28–33", onGreen: true },
  baseline: { bg: "#2C3539", fg: "#E0E0E0", label: "Baseline", range: "21–27", onGreen: false },
  critical: { bg: "#8B0000", fg: "#FFFFFF", label: "Critical", range: "≤20", onGreen: false },
};

export const HEAT_LEVELS: HeatLevel[] = ["peak", "high", "baseline", "critical"];

export function heatLevel(load: number): HeatLevel {
  if (load >= 34) return "peak";
  if (load >= 28) return "high";
  if (load >= 21) return "baseline";
  return "critical";
}

/** Planet chips: birth positions in clay (black on green cells), live positions in cyan with a blinking halo. */
export const CHIP = {
  natal: { bg: "#C45B28", fg: "#FFFFFF" },
  natalOnGreen: { bg: "#0A0A0A", fg: "#FFFFFF" },
  live: { bg: "#00BFFF", fg: "#0A0A0A" },
  liveOnGreen: { bg: "#0077CC", fg: "#FFFFFF" },
};

/** Cell outline when a live body is within orb of a birth body. */
export const ALIGNMENT_RING = "rgba(0, 191, 255, 0.6)";
