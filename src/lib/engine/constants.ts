export const PLANET_IDS = ["Su", "Ch", "Ma", "Bu", "Gu", "Sh", "Sa", "Ra", "Ke"] as const;
export type PlanetId = (typeof PLANET_IDS)[number];

export const PLANET_NAME: Record<PlanetId, string> = {
  Su: "Sun",
  Ch: "Moon",
  Ma: "Mars",
  Bu: "Mercury",
  Gu: "Jupiter",
  Sh: "Venus",
  Sa: "Saturn",
  Ra: "Rahu",
  Ke: "Ketu",
};

/** Short chip codes shown in the grid. */
export const PLANET_CODE: Record<PlanetId, string> = {
  Su: "Su",
  Ch: "Mo",
  Ma: "Ma",
  Bu: "Me",
  Gu: "Ju",
  Sh: "Ve",
  Sa: "Sa",
  Ra: "Ra",
  Ke: "Ke",
};

export const RASHI_EN = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];
export const RASHI_HI = [
  "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
  "तुला", "वृश्चिक", "धनु", "मकर", "कुम्भ", "मीन",
];
export const RASHI_LORDS: PlanetId[] = ["Ma", "Sh", "Bu", "Ch", "Su", "Bu", "Sh", "Ma", "Gu", "Sa", "Sa", "Gu"];

export const ELEMENTS = ["Fire", "Earth", "Air", "Water"] as const;
export const MODES = ["Initiate", "Sustain", "Adapt"] as const;
export const MODES_CLASSIC = ["Chara", "Sthira", "Dwiswabhava"] as const;

/** Rashi index → [row (element), col (mode)] in the 4×3 grid. */
export const RASHI_TO_RC: [number, number][] = [
  [0, 0], [1, 1], [2, 2], [3, 0], [0, 1], [1, 2],
  [2, 0], [3, 1], [0, 2], [1, 0], [2, 1], [3, 2],
];

/** Standard Parashari Bhinnashtakavarga tables: benefic houses from [Su, Ch, Ma, Bu, Gu, Sh, Sa, Lagna]. */
export const BAV: Record<"Su" | "Ch" | "Ma" | "Bu" | "Gu" | "Sh" | "Sa", number[][]> = {
  Su: [[1,2,4,7,8,9,10,11],[3,6,10,11],[1,2,4,7,8,9,10,11],[3,5,6,9,10,11,12],[5,6,9,11],[6,7,12],[1,2,4,7,8,9,10,11],[3,4,6,10,11,12]],
  Ch: [[3,6,7,8,10,11],[1,3,6,7,10,11],[2,3,5,6,9,10,11],[1,3,4,5,7,8,10,11],[1,4,7,8,10,11,12],[3,4,5,7,9,10,11],[3,5,6,11],[3,6,10,11]],
  Ma: [[3,5,6,10,11],[3,6,11],[1,2,4,7,8,10,11],[3,5,6,11],[6,10,11,12],[6,8,11,12],[1,4,7,8,9,10,11],[1,3,6,10,11]],
  Bu: [[5,6,9,11,12],[2,4,6,8,10,11],[1,2,4,7,8,9,10,11],[1,3,5,6,9,10,11,12],[6,8,11,12],[1,2,3,4,5,8,9,11],[1,2,4,7,8,9,10,11],[1,2,4,6,8,10,11]],
  Gu: [[1,2,3,4,7,8,9,10,11],[2,5,7,9,11],[1,2,4,7,8,10,11],[1,2,4,5,6,9,10,11],[1,2,3,4,7,8,10,11],[2,5,6,9,10,11],[3,5,6,12],[1,2,4,5,6,7,9,10,11]],
  Sh: [[8,11,12],[1,2,3,4,5,8,9,11,12],[3,5,6,9,11,12],[3,5,6,9,11],[5,8,9,10,11],[1,2,3,4,5,8,9,10,11],[3,4,5,8,9,10,11],[1,2,3,4,5,8,9,11]],
  Sa: [[1,2,4,7,8,10,11],[3,6,11],[3,5,6,10,11,12],[6,8,9,10,11,12],[5,6,11,12],[6,11,12],[3,5,6,11],[1,3,4,6,10,11]],
};

/** Vimshottari order and years (also used for KP sub-lords). */
export const VIM_ORDER: PlanetId[] = ["Ke", "Sh", "Su", "Ch", "Ma", "Ra", "Gu", "Sa", "Bu"];
export const VIM_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17];
export const VIM_TOTAL = 120;
export const SOLAR_YEAR_DAYS = 365.25636;

export const NAKSHATRA_EN = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
  "Magha", "P. Phalguni", "U. Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Moola", "P. Ashadha", "U. Ashadha", "Shravana", "Dhanishtha", "Shatabhisha", "P. Bhadrapada", "U. Bhadrapada", "Revati",
];

export const LIFE_SECTOR: Record<PlanetId, string> = {
  Su: "Career & authority",
  Ch: "Mind & emotions",
  Ma: "Energy & competition",
  Bu: "Business & communication",
  Gu: "Wisdom & finance",
  Sh: "Relationships & lifestyle",
  Sa: "Discipline & long-term work",
  Ra: "Ambition & innovation",
  Ke: "Inner work & detachment",
};

/** What a live alignment on each birth body tends to mean. */
export const ALIGNMENT_ADVICE: Record<PlanetId, { positive: string; caution: string }> = {
  Su: { positive: "Leadership is at its peak — a good time for important decisions.", caution: "Avoid ego clashes; lead with diplomacy." },
  Ch: { positive: "Emotional clarity is rising. Start creative projects.", caution: "Avoid overthinking — make time to slow down." },
  Ma: { positive: "Energy is at its highest. A strong window to pitch new deals.", caution: "Avoid haste and aggressive language." },
  Bu: { positive: "Communication and negotiation are sharp. Finalise contracts.", caution: "Check details carefully — miscommunication is possible." },
  Gu: { positive: "A financial growth window is open. Progress in investing and learning.", caution: "Stay grounded; avoid over-optimism." },
  Sh: { positive: "Relationships and social life flourish. Network actively.", caution: "Watch out for overspending and indulgence." },
  Sa: { positive: "Perfect for long-term planning — discipline brings results.", caution: "Handle delays and obstacles with patience." },
  Ra: { positive: "Unconventional opportunities are arriving. Embrace innovation.", caution: "Avoid shortcuts; choose the ethical path." },
  Ke: { positive: "Time for reflection and inner growth. Trust your intuition.", caution: "Don’t let detachment turn into confusion." },
};
