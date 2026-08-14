import { useMemo, useRef } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from 'framer-motion'
import { works } from '../data/works'
import {
  useMediaQuery,
  usePrefersReducedMotion,
  useViewportHeight,
} from '../lib/hooks'
import Intro from './Intro'
import WorkCard from './WorkCard'

/* ===========================================================================
   TUNING — every number that shapes the reveal lives here.
   ===========================================================================

   THE LAYOUT — it is a DECK, not a list
   -------------------------------------
   The whole first screen is pinned from scroll 0. Nothing in it scrolls; the
   cards move within it.

   Every card is full size at all times and NEVER resizes. Card k+1 is drawn on
   top of card k, offset down by exactly headerH, so all you see of a covered
   card is its header strip. A card looks "expanded" only because the next card
   is still far below it, leaving its excerpt uncovered:

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

   A card travels from yWait(k) to yDock(k) exactly once. Two consequences:

     · Card k "collapses" for free. It doesn't shrink — card k+1 rises over it
       until only its header shows.
     · The whole reveal is a set of translateYs on opaque layers. No height
       animation, no layout, no content repaint. That is why it stays smooth.

   The cards still waiting below never move until their turn.

   THE TIMELINE (in "units"; one unit = one card's turn = unitPx of scroll)

     0        1        2        3        4        5
     |════════|════════|════════|════════|════════|
      card 0   card 1   card 2   card 3   card 4
      rises    rises    rises    rises    rises

   Card k rises over its whole slot, from unit k to unit k+1. There is NO lead
   before the first card, NO hold once a card lands, and NO tail after the last
   one — at every point in the pinned range exactly one card is in motion. A
   hold would mean scroll being consumed with nothing moving, which reads as
   the page lingering on a card and ignoring your input.

   Card k's collapse shares exactly the window of card k+1's rise, so the two
   are mirrors: the shrinking card's bottom edge and the rising card's top edge
   meet precisely, and the stack never gaps or overlaps mid-motion.
=========================================================================== */
const TUNING = {
  // Scroll distance per card, as a MULTIPLE OF THE DISTANCE THE CARD TRAVELS.
  // At 1, one pixel of scroll moves the active card exactly one pixel — the
  // deck tracks the wheel 1:1, the same rate ordinary page content would move.
  // Raise it to make cards move slower than the scroll. No value produces a
  // hold; the mapping is continuous by construction.
  SCROLL_RATIO: 1,

  SLOT: 1, // units per card
  RAMP: 1, // MUST stay equal to SLOT. A card's rise fills its entire slot, so
  //          there is never a stretch of scroll where nothing moves. Lowering
  //          this reintroduces dead scroll at the end of every card's turn.

  INTRO_FADE_FROM: 0, // unit at which the intro starts fading out
  INTRO_FADE_TO: 0.7, // unit by which it is fully gone (card 0 covers it)
  INTRO_BLUR: 10, // px of blur at full fade

  TOP_PAD: 24, // px above the first docked card
  BOTTOM_PAD: 28, // px below the last card when it is active
  PEEK: 44, // px of the LAST waiting card left visible on first paint.
  //          Raise it to show more of the bottom card, lower it to give the
  //          intro more room. Set it to headerH to show every header fully.

  // The header strip is both the visible sliver of a covered card AND the
  // offset between cards in the deck. Everything below the strip is hidden by
  // the next card, which is what makes the overlap read as stacked paper.
  HEADER_RATIO: 0.093, // as a share of viewport height
  HEADER_MIN: 60,
  HEADER_MAX: 88,
  WAIT_TOP_MIN_RATIO: 0.3, // never let the waiting deck start above this
  CARD_MIN_H: 220, // px floor for a card
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const clamp = (min, v, max) => Math.min(max, Math.max(min, v))
const lerp = (a, b, t) => a + (b - a) * t

/**
 * How far card `k` has travelled from its waiting slot to its docked slot at
 * timeline position `u`. 0 = still waiting, 1 = docked. Never goes back down —
 * once a card has risen it stays at the top.
 *
 * DELIBERATELY LINEAR. There is no easing curve here: one pixel of scroll must
 * always move a card the same distance, so the motion is locked to the wheel /
 * trackpad rather than running to its own timing. An ease would make the card
 * accelerate and decelerate while you scroll at a constant rate — which is
 * exactly the "animation with a mind of its own" feel we do not want.
 */
function riseAt(u, k, { SLOT, RAMP }) {
  return clamp01((u - k * SLOT) / (SLOT * RAMP))
}

/**
 * How open card `k` is at `u`. 0 = collapsed row, 1 = expanded.
 * It opens as it rises and closes as the NEXT card rises — the two ramps are
 * the same window, which is what keeps the stack seamless. The last card
 * never closes.
 */
function opennessAt(u, k, total, timing) {
  const rise = riseAt(u, k, timing)
  if (k === total - 1) return rise
  return rise * (1 - riseAt(u, k + 1, timing))
}

/** Total length of the timeline in units. */
function timelineUnits(total, { SLOT, RAMP }) {
  return (total - 1) * SLOT + SLOT * RAMP
}

/** The timeline position at which card `k` is fully open. */
function fullyOpenAt(k, { SLOT, RAMP }) {
  return k * SLOT + SLOT * RAMP
}

/* ------------------------------------------------------------------------ */
/* Desktop: pinned viewport, cards rise from the bottom stack to the top     */
/* ------------------------------------------------------------------------ */

/**
 * One card in the deck. Its height never changes — only `y` does.
 *
 * The card looks collapsed whenever the NEXT card is drawn on top of it,
 * hiding everything below its header strip; it looks expanded when the next
 * card is still far below, leaving its excerpt uncovered. So the entire
 * reveal is a stack of `translateY`s: no layout, no repaint of card content,
 * just the compositor moving opaque layers over one another.
 *
 * `openness` is therefore cosmetic here — it drives the ↗ button, not the
 * geometry.
 */
function ScrollDrivenCard({ work, index, total, progress, metrics, onActivate }) {
  const { headerH, units, yWait, yDock, cardH } = metrics

  const y = useTransform(progress, (p) =>
    lerp(yWait[index], yDock[index], riseAt(p * units, index, TUNING)),
  )

  const openness = useTransform(progress, (p) =>
    opennessAt(p * units, index, total, TUNING),
  )

  return (
    <WorkCard
      work={work}
      openness={openness}
      height={cardH[index]}
      headerH={headerH}
      fadeContent={false}
      // Clicking a covered card scrolls it into focus rather than navigating.
      // Only the card actually in focus opens its case study.
      onActivate={() => onActivate(index)}
      // LATER cards sit on top: card k+1 covers card k, which is the whole
      // mechanism. Reverse this and the deck inverts into a plain list.
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        y,
        zIndex: index + 1,
      }}
    />
  )
}

function PinnedStack({ metrics }) {
  const sectionRef = useRef(null)

  // Progress 0 → 1 across the pinned range. The section starts at the top of
  // the document, so progress is 0 at scrollY 0 — the interaction begins
  // immediately, with no hero to scroll past first.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const { units, waitTop } = metrics

  // The intro fades and blurs in place as card 0 rises over it. It never
  // moves — matching the reference, where the heading stays put while the
  // card slides up across it.
  //
  // Expressed as an explicit function of timeline units (not a normalised
  // input range) so it stays in the same vocabulary as the card timing above,
  // and so clamping is guaranteed by clamp01 rather than assumed.
  const introFade = useTransform(scrollYProgress, (p) => {
    const from = TUNING.INTRO_FADE_FROM
    const to = TUNING.INTRO_FADE_TO
    // Linear, like the card travel — the fade tracks scroll 1:1.
    return clamp01((p * units - from) / (to - from))
  })
  const introOpacity = useTransform(introFade, (t) => 1 - t)
  const introBlurPx = useTransform(introFade, (t) => t * TUNING.INTRO_BLUR)
  const introFilter = useMotionTemplate`blur(${introBlurPx}px)`

  /**
   * Scroll so that card `index` is exactly fully open. Used when a covered
   * card is clicked: bring it into focus instead of navigating away.
   *
   * This is a user-initiated jump (like an anchor link), not scroll
   * interference — it only ever runs on click, never while scrolling.
   */
  const scrollToCard = (index) => {
    const el = sectionRef.current
    if (!el) return
    const sectionTop = el.getBoundingClientRect().top + window.scrollY
    const pinnedRange = el.offsetHeight - window.innerHeight
    const p = clamp01(fullyOpenAt(index, TUNING) / units)
    window.scrollTo({
      top: Math.round(sectionTop + p * pinnedRange),
      behavior: 'smooth',
    })
  }

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `calc(100svh + ${units * metrics.unitPx}px)` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden px-5 sm:px-8 lg:px-12">
        <div className="relative mx-auto h-full w-full max-w-[1400px]">
          {/* Intro layer — occupies the space above the waiting stack */}
          <motion.div
            style={{ opacity: introOpacity, filter: introFilter, height: waitTop }}
            className="pointer-events-none absolute inset-x-0 top-0 z-0 flex flex-col justify-center pb-8"
          >
            <Intro />
          </motion.div>

          {/* Cards. Absolutely positioned; every position comes from scroll. */}
          {works.map((work, i) => (
            <ScrollDrivenCard
              key={work.slug}
              work={work}
              index={i}
              total={works.length}
              progress={scrollYProgress}
              metrics={metrics}
              onActivate={scrollToCard}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------------ */
/* Mobile / reduced motion: a plain list. No pin, no animation at all.        */
/* ------------------------------------------------------------------------ */

/**
 * Small screens and `prefers-reduced-motion` get every card open, in normal
 * document flow, with nothing animating.
 *
 * This used to be a spring-driven accordion that opened whichever card was
 * nearest the middle of the viewport. That failed the "follows your scroll"
 * test in the most basic way: the spring kept running after you stopped
 * scrolling, so the page moved on its own. A scroll-linked version would have
 * been worse — with cards in normal flow, resizing one shifts everything below
 * it, which shifts what counts as "nearest the middle", which resizes cards…
 * a feedback loop that fights the user's scroll.
 *
 * A static list has neither problem, and reads perfectly well on a phone.
 */
function StaticWorks({ metrics }) {
  // WorkCard wants a MotionValue; this one is a constant and never changes.
  const alwaysOpen = useMotionValue(1)

  return (
    <>
      <section className="px-5 pt-24 pb-16 sm:px-8">
        <Intro className="mx-auto w-full max-w-[1400px]" />
      </section>

      <section className="px-5 pb-16 sm:px-8">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-2.5">
          {works.map((work) => (
            <WorkCard
              key={work.slug}
              work={work}
              openness={alwaysOpen}
              height={metrics.staticCardH}
              headerH={metrics.headerH}
              fadeContent={false}
            />
          ))}
        </div>
      </section>
    </>
  )
}

/* ------------------------------------------------------------------------ */

/**
 * <StackedWorks /> — owns the whole homepage: it picks a layout and computes
 * the geometry they share.
 *
 *   desktop + motion OK    → pinned deck, every position a pure function of
 *                            scrollY, mapped linearly
 *   small screen           → static list, nothing animates
 *   prefers-reduced-motion → same static list
 *
 * Nothing here intercepts scroll: no wheel or touch handlers, no scroll-snap,
 * no smooth-scroll, no programmatic scrolling. The pin is CSS `position:
 * sticky`, so the page scrolls natively at 1:1 the whole way down.
 */
export default function StackedWorks() {
  const viewportH = useViewportHeight()
  const isSmall = useMediaQuery('(max-width: 767px)')
  const reduceMotion = usePrefersReducedMotion()

  const metrics = useMemo(() => {
    const n = works.length

    // The header strip: the sliver of each card left visible once the next one
    // is drawn over it. It is also the offset between cards in both stacks.
    const headerH = Math.round(
      clamp(TUNING.HEADER_MIN, viewportH * TUNING.HEADER_RATIO, TUNING.HEADER_MAX),
    )

    // Where the waiting deck begins. Sized so the LAST card still peeks above
    // the fold, then floored so the intro always keeps usable space.
    const waitTop = Math.round(
      Math.max(
        viewportH * TUNING.WAIT_TOP_MIN_RATIO,
        viewportH - TUNING.PEEK - (n - 1) * headerH,
      ),
    )

    // Each card's two resting positions. Both stacks use headerH as the pitch,
    // so consecutive cards overlap by (cardH - headerH) — they are a deck, not
    // a list, and no gap ever opens between them.
    const yWait = Array.from({ length: n }, (_, k) => waitTop + k * headerH)
    const yDock = Array.from(
      { length: n },
      (_, k) => TUNING.TOP_PAD + k * headerH,
    )

    // Card heights are FIXED. A card is sized to fill from its docked slot
    // down to where the next card waits, which is exactly the space left
    // uncovered when it is the active one. The last card has nothing waiting
    // below it, so it runs to the bottom of the viewport instead.
    const cardH = Array.from({ length: n }, (_, k) => {
      const bottom =
        k === n - 1 ? viewportH - TUNING.BOTTOM_PAD : yWait[k + 1]
      return Math.max(TUNING.CARD_MIN_H, Math.round(bottom - yDock[k]))
    })

    // Every card travels exactly this far (waitTop − TOP_PAD; the k * headerH
    // terms cancel). Spending the same number of scroll pixels on that travel
    // is what makes the deck move 1:1 with the wheel at SCROLL_RATIO = 1.
    const travel = waitTop - TUNING.TOP_PAD
    const unitPx = Math.max(1, Math.round(travel * TUNING.SCROLL_RATIO))

    return {
      headerH,
      waitTop,
      unitPx,
      yWait,
      yDock,
      cardH,
      // The static list isn't a deck — cards sit in normal flow, fully open,
      // so they get their own height.
      staticCardH: Math.round(clamp(320, viewportH * 0.62, 560)),
      units: timelineUnits(n, TUNING),
    }
  }, [viewportH])

  if (reduceMotion || isSmall) return <StaticWorks metrics={metrics} />
  return <PinnedStack metrics={metrics} />
}
