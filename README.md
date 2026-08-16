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
    Intro.jsx         name, serif intro sentence, "selected works" label
    Chip.jsx          a phrase lifted into bold sans on a soft highlight
    Mark.jsx          the little graphic shapes that sit inside chips
    StackedWorks.jsx  all the scroll maths + both reveal strategies
    WorkCard.jsx      one card: header strip above an excerpt
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
the cards move within it.

**It's a deck, not a list.** Every card is full size at all times and never
resizes. Card `k+1` is drawn on top of card `k`, offset down by exactly
`headerH`, so all you see of a covered card is its header strip. A card looks
"expanded" only because the next card is still far below it, leaving its excerpt
uncovered:

```
┌──────────────────────────────┐  ← TOP_PAD
│ 2026  header strip           │  ▄ docked, covered by 2025
│ 2025  header strip           │  ▄ docked, covered by 2024
│ 2024  header strip           │  ← ACTIVE: nothing covers it, so its
│       excerpt  ▪ preview     │    excerpt shows all the way down to
│       tags                   │    where 2020 waits
├──────────────────────────────┤
│ 2020  header strip           │  ▄ waiting, covered by 2019
│ 2019  header strip (peeks)   │  ▄ waiting
└──────────────────────────────┘  ← viewport bottom

yDock(k) = TOP_PAD + k * headerH      yWait(k) = waitTop + k * headerH
```

A card travels from `yWait(k)` to `yDock(k)` exactly once. Two consequences
worth knowing before you touch it:

- **A card "collapses" for free.** It doesn't shrink — card `k+1` rises over it
  until only its header shows.
- **The whole reveal is `translateY` on opaque layers.** No height animation, no
  layout, no content repaint. That's why it stays smooth.

The cards still waiting below never move until their turn.

Every number lives in the `TUNING` object at the top of
`src/components/StackedWorks.jsx`:

| Key                | What it does                                                       |
| ------------------ | ------------------------------------------------------------------ |
| `SCROLL_RATIO`     | Scroll per card, as a multiple of how far the card actually travels. At `1`, one pixel of scroll moves the active card exactly one pixel. Raise it to make cards move slower than the scroll. |
| `RAMP`             | Must stay equal to `SLOT`. A card's rise fills its whole slot; lowering it reintroduces dead scroll at the end of every card's turn. |
| `PEEK`             | Px of the **last** waiting card left visible on first paint. Raise to show more of it, lower to give the intro more room, set to `headerH` to show every header fully. |
| `TOP_PAD`          | Px above the first docked card.                                     |
| `HEADER_RATIO/MIN/MAX` | Header strip height — both the visible sliver of a covered card and the offset between cards in the deck. |
| `INTRO_FADE_*`     | When the intro fades and blurs out behind the first card.           |

Card heights are derived, not configured: a card is sized to fill from its
docked slot down to where the next card waits, which is exactly the space left
uncovered when it's the active one. Everything is computed from the viewport, so
the deck fits any window size.

### Clicking a card

A tile does one of two things depending on whether it's the card in focus:

- **In focus** → it's a link, and opens the case study.
- **Covered** → it's a button, and scrolls itself into focus first.

So a partly hidden card can never navigate you somewhere you can't see. Only a
covered card's visible header strip is clickable anyway — the card on top of it
wins the pointer. Both states are real focusable controls, so every project
stays keyboard-reachable. In the static list (mobile / reduced motion) every
card is open, so every tile is a plain link.

### Three modes

`StackedWorks` picks one at runtime:

1. **Desktop** — the pinned deck described above. Cards are absolutely
   positioned and travel with `translateY`; nothing resizes.
2. **Under 768px, and `prefers-reduced-motion`** — a static list: every card
   open, in normal flow, nothing animating. The overlap needs vertical room a
   phone doesn't have, and pinning fights mobile URL-bar resizing.

## No scroll jacking

The page scrolls natively at 1:1 and the deck is locked to it. Specifically:

- **Nothing intercepts scroll.** No wheel or touch handlers, no `scroll-snap`,
  no `scroll-behavior: smooth`, no programmatic scrolling (the one
  `window.scrollTo` is a scroll reset on route change). The pin is CSS
  `position: sticky`, so real scroll distance is consumed and the scrollbar
  behaves normally.
- **The mapping is linear and 1:1.** `riseAt()` has no easing curve, and the
  pinned range is derived from how far the cards actually travel. Measured
  across the whole scroll range: exactly 1.00 card-pixels per scroll-pixel,
  min and max alike.
- **There are no holds.** Each card's rise fills its entire slot, so at every
  point in the range exactly one card is moving — zero dead steps measured
  across the full sweep. A hold is scroll being consumed with nothing moving,
  which reads as the page lingering on a card and ignoring your input.
- **Nothing keeps moving after you stop.** Every position is a pure function of
  `scrollY` — no springs, no inertia, no lerp-toward-target. Stop scrolling and
  the frame is final.
- **Browser scroll restoration is left alone**, for the same reason: landing
  mid-pin on reload renders correctly with no catch-up.

The one time-based animation left in the project is the case-study page's fade
on mount (`CaseStudy.jsx`), which is a route transition and has nothing to do
with scroll.

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
