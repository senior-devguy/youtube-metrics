# Pulse — Creator Analytics

Prototype analytics dashboard combining YouTube channel metrics and web-store metrics.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173/. The Vite config sets `server.host: true`, so the dev server is also reachable from other devices on your LAN (look for the `Network:` URL Vite prints).

## Build

```bash
npm run build        # tsc -b && vite build → dist/
npm run preview      # serve dist/ locally on :4173
```

## What's here

Three sections, picked from the left rail:

| Page         | Path        | Metrics                                                                           |
| ------------ | ----------- | --------------------------------------------------------------------------------- |
| Overview     | `/`         | Total revenue, YouTube views, units sold, store conversion · combined area chart  |
| YouTube      | `/youtube`  | Views, ad revenue, effective RPM, subscribers · views/revenue tabs · channel list |
| Web Store    | `/store`    | Revenue, units, conversion rate, AOV · revenue/units/conversion tabs · store list |

Each page has two filters in the header:
- **Source picker**: scope to a single channel/store or roll up "all"
- **Range picker**: 7 / 30 / 90 days, with previous-period deltas

Mock data is deterministic (seeded PRNG in [src/lib/mock-data.ts](src/lib/mock-data.ts)), 90 days of daily points across 4 channels and 4 stores — names are made up.

## Stack

- React 19 + TypeScript + Vite 7
- Tailwind CSS v4 + design tokens ported from the Fleetmule design system (see `../design.md`)
- shadcn/ui-style primitives (button, card, badge, tabs, select, separator) under `src/components/ui/`
- recharts for the time series
- `next-themes` for the light/dark toggle (class-based)
- react-router-dom for the three routes

## Deploy to Vercel

A `vercel.json` with the SPA rewrite rule is already committed. Two options:

**Option A — Vercel CLI**

```bash
npx vercel@latest login          # one-time
npx vercel@latest --prod         # from inside app/
```

**Option B — Vercel Dashboard**

1. Push this repo to GitHub.
2. Import it at https://vercel.com/new.
3. Set **Root Directory** to `app/`.
4. Framework preset: **Vite** (auto-detected). Build = `npm run build`, output = `dist`.

No env vars are needed; everything is mock data.

## Project layout

```
app/
  src/
    components/
      ui/          ← shadcn-style primitives (button, card, badge, select, tabs, ...)
      layout/      ← AppShell, Sidebar, ThemeProvider, ModeToggle
      dashboard/   ← StatCard, PageHeader, Leaderboard, RangeSelect, SourcePicker
      charts/      ← RevenueAreaChart, BarSeriesChart, LineSeriesChart, ChartTooltip
    pages/         ← Overview, YouTube, WebStore
    lib/           ← mock-data, format, utils (cn)
    index.css      ← design tokens (@theme), font import, scrollbar utilities
```
