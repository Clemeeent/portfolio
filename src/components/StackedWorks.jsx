import { useEffect, useMemo, useRef, useState } from 'react'
import {
  animate,
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

   THE TIMELINE (in "units"; UNIT_VH converts a unit to scroll distance)

     0      LEAD    LEAD+1   LEAD+2   LEAD+3   LEAD+4        +TAIL
     |───────|════════|════════|════════|════════|═════════════|
      intro   card 0   card 1   card 2   card 3   card 4 held
      alone   rises    rises    rises    rises    to the end

   Card k rises over RAMP units starting at LEAD + k. Card k's collapse shares
   exactly the window of card k+1's rise, so the two are mirrors: the shrinking
   card's bottom edge and the rising card's top edge meet precisely, and the
   stack never gaps or overlaps mid-motion.
=========================================================================== */
const TUNING = {
  UNIT_VH: 80, // scroll distance (in vh) per card — raise it to slow things down
  LEAD: 0.4, // units of scroll on the intro alone before card 0 moves
  SLOT: 1, // units per card (leave at 1; pace with UNIT_VH)
  RAMP: 0.45, // portion of a slot spent rising/collapsing. Higher = softer.
  TAIL: 0.6, // units the last card is held before the page ends

  INTRO_FADE_FROM: 0.2, // unit at which the intro starts fading out
  INTRO_FADE_TO: 0.74, // unit by which it is fully gone (card 0 covers it)
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
/** Ease in/out so cards don't start and stop abruptly at the ramp edges. */
const smoothstep = (t) => t * t * (3 - 2 * t)
const lerp = (a, b, t) => a + (b - a) * t

/**
 * How far card `k` has travelled from its waiting slot to its docked slot at
 * timeline position `u`. 0 = still waiting, 1 = docked. Never goes back down —
 * once a card has risen it stays at the top.
 */
function riseAt(u, k, { LEAD, SLOT, RAMP }) {
  return smoothstep(clamp01((u - (LEAD + k * SLOT)) / (SLOT * RAMP)))
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
function timelineUnits(total, { LEAD, SLOT, RAMP, TAIL }) {
  return LEAD + (total - 1) * SLOT + SLOT * RAMP + TAIL
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
 * `openness` is therefore cosmetic here — it drives the ↗ button and how deep
 * the shadow sits, not the geometry.
 */
function ScrollDrivenCard({ work, index, total, progress, metrics }) {
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
    return smoothstep(clamp01((p * units - from) / (to - from)))
  })
  const introOpacity = useTransform(introFade, (t) => 1 - t)
  const introBlurPx = useTransform(introFade, (t) => t * TUNING.INTRO_BLUR)
  const introFilter = useMotionTemplate`blur(${introBlurPx}px)`

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `calc(100svh + ${units * TUNING.UNIT_VH}svh)` }}
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
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------------ */
/* Mobile / reduced motion: plain vertical accordion, no pinning             */
/* ------------------------------------------------------------------------ */

/**
 * Card whose openness springs to a boolean target instead of tracking scroll.
 * Here the card really does resize: the accordion is in normal flow, so there
 * is no card on top to reveal it by moving away.
 */
function AnimatedCard({ work, isOpen, metrics, cardRef }) {
  const openness = useMotionValue(isOpen ? 1 : 0)

  useEffect(() => {
    const controls = animate(openness, isOpen ? 1 : 0, {
      type: 'spring',
      stiffness: 260,
      damping: 34,
      restDelta: 0.001,
    })
    return () => controls.stop()
  }, [isOpen, openness])

  const height = useTransform(
    openness,
    [0, 1],
    [metrics.headerH, metrics.accordionExpandedH],
  )

  return (
    <div ref={cardRef}>
      <WorkCard
        work={work}
        openness={openness}
        height={height}
        headerH={metrics.headerH}
      />
    </div>
  )
}

/**
 * Mobile fallback. The pinned rise-and-dock choreography needs vertical room
 * the phone viewport doesn't have, and pinning fights mobile URL-bar resizing,
 * so the list flows normally and whichever card is nearest the middle of the
 * viewport opens. Still scroll-driven, still one at a time — just no pin.
 */
function AccordionWorks({ metrics, forceAllOpen }) {
  const [active, setActive] = useState(0)
  const refs = useRef([])

  useEffect(() => {
    if (forceAllOpen) return
    const els = refs.current.filter(Boolean)
    if (!els.length) return

    // Watch a thin band across the middle of the viewport; the card whose
    // centre is closest to it wins. Widen the band by shrinking the 42% inset.
    const io = new IntersectionObserver(
      () => {
        const mid = window.innerHeight / 2
        let best = 0
        let bestDist = Infinity
        els.forEach((el, i) => {
          const rect = el.getBoundingClientRect()
          const dist = Math.abs(rect.top + rect.height / 2 - mid)
          if (dist < bestDist) {
            bestDist = dist
            best = i
          }
        })
        setActive(best)
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: [0, 0.5, 1] },
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [forceAllOpen])

  return (
    <>
      <section className="px-5 pt-24 pb-16 sm:px-8">
        <Intro className="mx-auto w-full max-w-[1400px]" />
      </section>

      <section className="px-5 pb-16 sm:px-8">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="flex flex-col gap-2.5">
            {works.map((work, i) => (
              <AnimatedCard
                key={work.slug}
                work={work}
                isOpen={forceAllOpen || i === active}
                metrics={metrics}
                cardRef={(el) => {
                  refs.current[i] = el
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* ------------------------------------------------------------------------ */

/**
 * <StackedWorks /> — owns the whole homepage: it picks a strategy and computes
 * the geometry both of them share.
 *
 *   desktop + motion OK    → pinned rise-and-dock stack
 *   small screen           → vertical accordion (scroll-linked, unpinned)
 *   prefers-reduced-motion → every card open, no movement at all
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

    return {
      headerH,
      waitTop,
      yWait,
      yDock,
      cardH,
      // The accordion isn't a deck — cards sit in normal flow and genuinely
      // resize, so it needs its own expanded height.
      accordionExpandedH: Math.round(clamp(260, viewportH * 0.56, 520)),
      units: timelineUnits(n, TUNING),
    }
  }, [viewportH])

  if (reduceMotion) return <AccordionWorks metrics={metrics} forceAllOpen />
  if (isSmall) return <AccordionWorks metrics={metrics} />
  return <PinnedStack metrics={metrics} />
}
