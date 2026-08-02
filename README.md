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
    features.js       ← the full-bleed blocks below the works list
  components/
    Intro.jsx         heading + bio, scrolls away behind the works
    StackedWorks.jsx  all the scroll maths + the three reveal strategies
    WorkCard.jsx      one card: collapsed row ⇄ expanded excerpt
    FeatureBlocks.jsx full-width sections with bottom caption strips
    PreviewSurface.jsx image slot, falls back to an accent gradient
    SiteFooter.jsx
  pages/
    Home.jsx          Intro → StackedWorks → FeatureBlocks → Footer
    CaseStudy.jsx     /work/:slug — the full write-up
    NotFound.jsx
```

## Editing content

Everything on the site comes from `src/data/works.js` and `src/data/features.js`.
Both files document every field at the top. To add a project, append an object to
the `works` array — the homepage row, the excerpt card, the `/work/<slug>` route
and the "next project" link all follow automatically.

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

All of it lives in the `TUNING` object at the top of
`src/components/StackedWorks.jsx`:

| Key                | What it does                                                        |
| ------------------ | ------------------------------------------------------------------- |
| `UNIT_VH`          | Scroll distance per card. Raise it to slow the whole thing down.     |
| `LEAD`             | Scroll before the first card opens.                                  |
| `RAMP`             | How much of a card's turn is spent morphing (0–1). Higher = softer.  |
| `TAIL`             | How long the last card stays open before the section releases.       |
| `ROW_H*`           | Collapsed strip height, per breakpoint.                              |
| `EXPANDED_MIN/MAX` | Clamps on the expanded card height.                                  |

The choreography is documented with an ASCII timeline in the same file. Two
things worth knowing before changing it:

- Each hand-off is a mirror — the outgoing card's collapse and the incoming
  card's expansion use the same eased curve, so their combined height is
  constant and nothing below the pair ever jitters.
- The expanded height is computed from the viewport, not hard-coded, so the
  whole list always fits on screen while pinned.

### Three modes

`StackedWorks` picks one at runtime:

1. **Desktop** — the section is pinned with `position: sticky` and cards are
   absolutely positioned, moved with `translateY`. Only the active card's height
   changes, so a resizing card never reflows its siblings.
2. **Under 768px** — no pin (it fights mobile URL-bar resizing). The list flows
   normally and whichever card is nearest the middle of the viewport opens.
3. **`prefers-reduced-motion`** — every card renders open, nothing moves.

## Deploying

Static build, any host. Because `/work/<slug>` only exists in the client-side
router, the host has to serve `index.html` for unknown paths:

- **Netlify / Cloudflare Pages** — `public/_redirects` (included)
- **Vercel** — `vercel.json` (included)
- **GitHub Pages** — no rewrite support; either add a `404.html` copy of
  `index.html` or swap `BrowserRouter` for `HashRouter` in `src/main.jsx`
