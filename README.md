# divine-matrix-ui

Frontend for **Divine Matrix** — a modern cosmic life optimization engine, backed by classical Vedic & modern astrology. Built with [Next.js](https://nextjs.org) 16 (App Router), TypeScript and Tailwind CSS v4.

All calculations run in the browser with [astronomy-engine](https://github.com/cosinekitty/astronomy) — no backend needed yet.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` – start the dev server
- `npm run build` – production build
- `npm run start` – serve the production build
- `npm run lint` – run ESLint

## Screens

| Route | Screen | Classical system |
| --- | --- | --- |
| `/` | Landing page | — |
| `/start` | Create your matrix (birth details) | — |
| `/dashboard` | Energy Grid, live alerts, time slider, positions | Rashi × Tattva, Ashtakavarga (DMLI), Gochar, KP |
| `/scores` | Life Scores: wealth, conflict, best hours, learning, wellbeing, space | KP cusps, Gochar, Hora, Vastu |
| `/chapters` | Life Chapters | Vimshottari, Yogini, Chara dasha |
| `/today` | Daily windows | Panchang, Choghadiya, Rahu Kaal, Abhijit |
| `/compatibility` | Compatibility & Team Synergy | Tattva element friction |
| `/journey` | Journey Planner | Disha shool, Yatra muhurat |

## Structure

```
src/
  app/                 # routes (App Router)
    (app)/             # signed-in app screens sharing the sidebar layout
    start/             # onboarding
  components/          # shared UI (sidebar, hero grid, cards, rings…)
  lib/
    engine/            # the Divine Matrix calculation engine (pure TypeScript)
      core.ts          # positions, ayanamsa, lagna, houses, ashtakavarga, KP, alignments
      dasha.ts         # Vimshottari, Yogini, Chara periods
      insights.ts      # life scores
      panchang.ts      # tithi, nakshatra, yoga, karana, choghadiya, rahu kaal
      relations.ts     # compatibility & team synergy
      journey.ts       # travel planner
      analysis.ts      # one-call analysis for a profile and day
    profile-context.tsx  # active profile (saved in localStorage), clock, chart cache
    profiles.ts        # cities and preset profiles
```

Birth times are entered in IST. Insights are for guidance and reflection only and are not medical advice.
