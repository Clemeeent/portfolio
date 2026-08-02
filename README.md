# Portfolio

Scroll-driven portfolio site. React + Vite + Tailwind v4 + Framer Motion, no backend.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serve the production build
```

## Structure

```
src/
  data/
    works.js          ← selected works: rows, excerpts, full case studies
    features.js       ← full-bleed blocks (not currently on the page)
  components/
    Intro.jsx         heading + bio, scrolls away behind the works
    StackedWorks.jsx  all the scroll maths + the three reveal strategies
    WorkCard.jsx      one card: collapsed row ⇄ expanded excerpt
    FeatureBlocks.jsx full-width sections — unused, kept for re-use
    PreviewSurface.jsx image slot, falls back to an accent gradient
    SiteFooter.jsx
  pages/
    Home.jsx          Intro → StackedWorks (the page ends with the works)
    CaseStudy.jsx     /work/:slug — the full write-up
    NotFound.jsx
```

## Editing content

Everything on the site comes from `src/data/works.js`, which documents every
field at the top. To add a project, append an object to the `works` array — the
homepage row, the excerpt card, the `/work/<slug>` route and the "next project"
link all follow automatically.

The homepage ends with the works list. `FeatureBlocks.jsx` (full-bleed sections,
driven by `src/data/features.js`) and `SiteFooter.jsx` are still in the repo but
no longer rendered there — re-import either one in `Home.jsx` to bring it back.
The footer is still used by the case-study pages.

Case-study bodies are an array of typed blocks (`lead`, `heading`, `text`,
`list`, `quote`, `figure`, `stats`), rendered by `Block` in `CaseStudy.jsx`. They
are stubbed with placeholder copy right now. To add a new block type, add a
`case` to that switch.

### Images

Every image slot falls back to a gradient built from the item's `accent` pair, so
nothing looks broken while the real assets are missing. Drop files in `public/`
and set the path:

- `cover` on a work → the card preview + the case-study hero
- `src` on a `figure` block → that figure
- `image` on a feature → that block's background

## Tuning the scroll reveal

The homepage is a single pinned viewport, from scroll 0. Nothing in it scrolls —
the cards move within it. Every card has exactly two resting places:

```
┌──────────────────────────────┐  ← TOP_PAD
│ 2026  docked row             │    yDock(k) — cards that had their turn
│ 2025  docked row             │
├──────────────────────────────┤
│ 2024  ACTIVE                 │    fills the gap between the two stacks
│       expanded excerpt       │
├──────────────────────────────┤
│ 2020  waiting row            │    yWait(k) — never moves until its turn
│ 2019  waiting row (peeks)    │
└──────────────────────────────┘  ← viewport bottom
```

A card travels from `yWait(k)` to `yDock(k)` exactly once, growing upward from a
near-fixed bottom edge as it goes. **The rows below it do not move** — that is
the defining property of the interaction.

Every number lives in the `TUNING` object at the top of
`src/components/StackedWorks.jsx`:

| Key                | What it does                                                       |
| ------------------ | ------------------------------------------------------------------ |
| `UNIT_VH`          | Scroll distance per card. Raise it to slow the whole thing down.    |
| `LEAD`             | Scroll on the intro alone before card 0 moves.                      |
| `RAMP`             | Portion of a card's turn spent rising/collapsing. Higher = softer.  |
| `TAIL`             | How long the last card is held before the page ends.                |
| `PEEK`             | Px of the **last** waiting row left visible on first paint. Raise to show more of it, lower to give the intro more room, set to `rowH` to fit every row fully. |
| `TOP_PAD`          | Px above the first docked row.                                      |
| `ACTIVE_GAP`       | Px between the active card's bottom and the waiting stack.          |
| `ROW_RATIO/MIN/MAX`| Collapsed row height, as a share of viewport height plus clamps.    |
| `INTRO_FADE_*`     | When the intro fades and blurs out behind the first card.           |

Two things worth knowing before changing the timing:

- Each hand-off is a mirror — card `k`'s collapse shares exactly the window of
  card `k+1`'s rise, so the shrinking card's bottom edge and the rising card's
  top edge meet precisely. The stack never gaps or overlaps mid-motion.
- Positions are derived from the viewport, not hard-coded, so the whole list
  fits on any window size.

### Three modes

`StackedWorks` picks one at runtime:

1. **Desktop** — the pinned rise-and-dock stack described above. Cards are
   absolutely positioned and travel with `translateY` (a compositor transform);
   only their own height triggers layout, and because they're out of flow, one
   card resizing never reflows the others.
2. **Under 768px** — no pin. The choreography needs vertical room a phone
   doesn't have, and pinning fights mobile URL-bar resizing, so the list flows
   normally and whichever card is nearest the middle of the viewport opens.
3. **`prefers-reduced-motion`** — every card renders open, nothing moves.

`StackedWorks` owns the whole homepage, `<Intro />` included, because the intro
animates completely differently in the pinned and mobile layouts — so the
component that picks the layout has to be the one that places it.

## Deploying

Static build, any host. Because `/work/<slug>` only exists in the client-side
router, the host has to serve `index.html` for unknown paths:

- **Netlify / Cloudflare Pages** — `public/_redirects` (included)
- **Vercel** — `vercel.json` (included)
- **GitHub Pages** — no rewrite support; either add a `404.html` copy of
  `index.html` or swap `BrowserRouter` for `HashRouter` in `src/main.jsx`
