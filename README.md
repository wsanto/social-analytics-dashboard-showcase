# Social Analytics Dashboard (showcase excerpt)

An excerpt from a social-media sentiment/emotion analytics product I built — a dashboard for
visualizing sentiment, emotion, and topic trends across social media content. This repo shows the
**charting and dashboard infrastructure** — 14 distinct chart types (time series, gauges, heatmaps,
radar, leaderboards, growth patterns) plus a typed API client — as a demonstration of data
visualization and dashboard engineering, not the underlying analysis product itself.

**No real user data:** the source project this was extracted from is itself a sales-demo
deployment that runs entirely on frozen, stubbed data — it was never connected to a live backend or
real social media accounts. This showcase excerpt contains no data at all, real or stubbed, only the
rendering/UI code.

This is a curated excerpt, not the full app: the per-user/segment/archetype profiling pages, and the
constants defining the product's proprietary emotion taxonomy, are excluded, so this repo is for
reading, not running.

## What's included here

- **`components/charts/`** — 14 chart components: sentiment gauge, emotion time series, emotion
  leaderboard, geo heatmap, growth patterns, multi-dimensional chart, narrative flow, segment
  comparison, top topics, and more.
- **`lib/api-client.ts`** — a typed REST client (env-configured base URL and API key header, typed
  responses, centralized error handling).
- **`lib/time-range-context.tsx`, `topics-context.tsx`** — shared filter-state context providers
  used across dashboard views.
- **`components/ui/`** — generic UI primitives (sidebar, sheet, dialog, select, tabs, etc.).

## What was built but isn't shown here

- **Per-user and per-segment profiling pages** — the product tracks individual users' psychographic
  archetypes and emotional profiles over time; those pages, and the API layer that fetches
  per-user profiles, are withheld.
- **The proprietary emotion taxonomy** — a 29+ emotion classification system (primary, complex, and
  "meta" emotions like breakthrough/insight/flow) that the whole product is built around.
- **Metric definitions and the full data schema** — how each chart's underlying metrics are
  actually computed.

I'm happy to walk through the design of any of these in conversation — they're just not published
as code.

## Stack

Next.js (App Router), TypeScript, Tailwind, Recharts-based data visualization, a typed REST API
client.
