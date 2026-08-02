import { useEffect, useMemo, useRef, useState } from 'react'
import { animate, useMotionValue, useScroll, useTransform } from 'framer-motion'
import { works } from '../data/works'
import { usePrefersReducedMotion, useViewportHeight, useMediaQuery } from '../lib/hooks'
import WorkCard from './WorkCard'

/* ===========================================================================
   TUNING — every number that shapes the reveal lives here.
   ===========================================================================

   The timeline is measured in "units". One unit ≈ one card's turn on screen.
   `UNIT_VH` converts a unit into actual scroll distance, so raising it makes
   the whole interaction slower/longer without changing the choreography.

   Timeline for 5 cards (units along the x-axis):

     0        LEAD      LEAD+1     LEAD+2     ...        LEAD+4    +TAIL
     |---------|==========|==========|=========|==========|=========|
      nothing   card 0     card 0→1   card 1→2   card 3→4  card 4 held
      open yet  opens      hand-off   hand-off   hand-off  open

   Each hand-off is RAMP units long: the outgoing card's collapse and the
   incoming card's expansion are exact mirrors, so their combined height is
   constant and nothing below ever jitters.
=========================================================================== */
const TUNING = {
  UNIT_VH: 80, // scroll distance (in vh) per timeline unit — bigger = slower
  LEAD: 0.55, // units of scroll before card 0 starts opening
  SLOT: 1, // units each card stays in focus (leave at 1; use UNIT_VH to pace)
  RAMP: 0.45, // portion of a slot spent morphing between two cards (0–1)
  TAIL: 0.7, // units the last card stays open before the section releases
  GAP: 10, // px between cards
  ROW_H: 74, // px height of a collapsed row (desktop)
  ROW_H_SM: 76, // px collapsed row on mobile — taller, titles wrap to 2 lines
  ROW_H_SHORT: 64, // px collapsed row on short desktop viewports (< 720px tall)
  HEADER_H: 92, // px reserved above the list for the "selected works" pill
  PAD_Y: 40, // px breathing room top+bottom inside the pinned viewport
  EXPANDED_MIN: 260, // px clamp — never let the excerpt get shorter than this
  EXPANDED_MAX: 560, // px clamp — never let it get taller than this
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
/** Ease in/out so cards don't start and stop abruptly at the ramp edges. */
const smoothstep = (t) => t * t * (3 - 2 * t)

/**
 * How open card `i` is at timeline position `u` (in units).
 * Returns 0 (collapsed) → 1 (fully expanded excerpt).
 */
function opennessAt(u, i, total, { LEAD, SLOT, RAMP }) {
  const ramp = SLOT * RAMP
  const riseStart = LEAD + i * SLOT
  const fallStart = LEAD + (i + 1) * SLOT

  const rise = smoothstep(clamp01((u - riseStart) / ramp))
  // The last card never collapses — it stays open through the TAIL so the
  // section can be scrolled past without the list snapping shut.
  if (i === total - 1) return rise

  const fall = smoothstep(clamp01((u - fallStart) / ramp))
  return rise * (1 - fall)
}

/** Total length of the timeline in units. */
function timelineUnits(total, { LEAD, SLOT, RAMP, TAIL }) {
  return LEAD + (total - 1) * SLOT + SLOT * RAMP + TAIL
}

/* ------------------------------------------------------------------------ */
/* Desktop: one card per scroll slot, pinned                                 */
/* ------------------------------------------------------------------------ */

/**
 * A card whose openness is derived directly from scroll progress.
 *
 * Cards are absolutely positioned and moved with `translateY` (a compositor
 * transform) while only their own height animates. Because they're out of
 * normal flow, one card resizing never reflows its siblings — that's what
 * keeps a five-card stack at 60fps.
 */
function ScrollDrivenCard({ work, index, total, progress, metrics }) {
  const { rowH, expandedH, units } = metrics

  // openness = f(scroll). One motion value, recomputed per frame, no state.
  const openness = useTransform(progress, (p) =>
    opennessAt(p * units, index, total, TUNING),
  )

  // y = the stacked height of everything above this card, at the current
  // frame. Summing live openness values means the cards below an expanding
  // card get pushed down continuously instead of jumping.
  const y = useTransform(progress, (p) => {
    const u = p * units
    let offset = 0
    for (let j = 0; j < index; j += 1) {
      const o = opennessAt(u, j, total, TUNING)
      offset += rowH + TUNING.GAP + o * (expandedH - rowH)
    }
    return offset
  })

  return (
    <WorkCard
      work={work}
      openness={openness}
      collapsedH={rowH}
      expandedH={expandedH}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, y }}
    />
  )
}

function PinnedWorks({ metrics }) {
  const sectionRef = useRef(null)

  // Progress 0 → 1 across the pinned range: 0 when the section's top hits the
  // top of the viewport (pin starts), 1 when its bottom hits the bottom of the
  // viewport (pin releases). The extra 100vh in the section height below is
  // what the sticky child consumes.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const { rowH, expandedH, units } = metrics
  const stackH = (works.length - 1) * (rowH + TUNING.GAP) + expandedH

  return (
    <section
      ref={sectionRef}
      className="relative z-10"
      style={{ height: `calc(100svh + ${units * TUNING.UNIT_VH}svh)` }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden px-5 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-[1400px]">
          <div style={{ height: TUNING.HEADER_H }} className="flex items-end pb-6">
            <span className="pill">Selected works</span>
          </div>

          {/* Fixed-height stage: exactly one card is open at a time and the
              hand-offs are mirrored, so this never needs to resize. */}
          <div className="relative" style={{ height: stackH }}>
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
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------------ */
/* Mobile / reduced motion: plain vertical accordion, no pinning             */
/* ------------------------------------------------------------------------ */

/** Card whose openness springs to a boolean target instead of tracking scroll. */
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

  return (
    <div ref={cardRef}>
      <WorkCard
        work={work}
        openness={openness}
        collapsedH={metrics.rowH}
        expandedH={metrics.accordionExpandedH}
      />
    </div>
  )
}

/**
 * Mobile fallback. Pinned scroll on small screens fights with browser URL-bar
 * resizing, so instead the list flows normally and whichever card is nearest
 * the middle of the viewport opens. Still scroll-driven, still one at a time —
 * just no pin.
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
    <section className="relative z-10 px-5 pb-16 sm:px-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="pb-6">
          <span className="pill">Selected works</span>
        </div>
        <div className="flex flex-col" style={{ gap: TUNING.GAP }}>
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
  )
}

/* ------------------------------------------------------------------------ */

/**
 * <StackedWorks /> — picks a strategy and computes the shared sizing metrics.
 *
 *   desktop + motion OK  → pinned, scroll-linked stack
 *   small screen         → vertical accordion (scroll-linked, unpinned)
 *   prefers-reduced-motion → every card open, no movement at all
 */
export default function StackedWorks() {
  const viewportH = useViewportHeight()
  const isSmall = useMediaQuery('(max-width: 767px)')
  const reduceMotion = usePrefersReducedMotion()

  const metrics = useMemo(() => {
    // Mobile rows are taller (titles wrap); short desktop viewports get
    // shorter rows so the expanded card keeps a usable amount of the screen.
    const rowH = isSmall
      ? TUNING.ROW_H_SM
      : viewportH < 720
        ? TUNING.ROW_H_SHORT
        : TUNING.ROW_H

    // The expanded card takes whatever is left of the viewport once the header
    // and the other collapsed rows have had their share. That way the whole
    // list always fits on screen while pinned, on any window size.
    const consumed =
      TUNING.HEADER_H +
      TUNING.PAD_Y * 2 +
      (works.length - 1) * (rowH + TUNING.GAP)

    const expandedH = Math.round(
      Math.min(
        TUNING.EXPANDED_MAX,
        Math.max(TUNING.EXPANDED_MIN, viewportH - consumed),
      ),
    )

    return {
      rowH,
      expandedH,
      // The accordion isn't pinned, so its expanded card doesn't have to share
      // the viewport with the rest of the list — it can breathe more.
      accordionExpandedH: Math.round(
        Math.min(
          TUNING.EXPANDED_MAX,
          Math.max(TUNING.EXPANDED_MIN, viewportH * 0.56),
        ),
      ),
      units: timelineUnits(works.length, TUNING),
    }
  }, [viewportH, isSmall])

  if (reduceMotion) return <AccordionWorks metrics={metrics} forceAllOpen />
  if (isSmall) return <AccordionWorks metrics={metrics} />
  return <PinnedWorks metrics={metrics} />
}
