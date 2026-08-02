import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useTransform,
} from 'framer-motion'
import PreviewSurface from './PreviewSurface'

/**
 * <WorkCard /> — one project, in three visual states driven by a single
 * `openness` motion value (0 = collapsed row, 1 = expanded excerpt).
 *
 *   openness 0      collapsed strip:  year · title · client
 *   openness 0→1    morphing:         grows in height, pushes to full width
 *   openness 1      excerpt:          intro text + preview image + ↗ button
 *
 * This component owns NO scroll logic — it just renders whatever `openness` it
 * is handed. The parent (<StackedWorks />) decides where that value comes from
 * (scroll position on desktop, active index on mobile). That split is what
 * keeps the scroll maths in one tunable place.
 *
 * Props
 *   work        item from src/data/works.js
 *   openness    MotionValue<number> 0..1
 *   collapsedH  px height of the compact row
 *   expandedH   px height of the excerpt state
 *   style       extra motion styles from the parent (position / y offset)
 */
export default function WorkCard({
  work,
  openness,
  collapsedH,
  expandedH,
  style,
  className = '',
}) {
  // `isOpen` mirrors `openness` into React state, but only at the halfway mark,
  // so we can flip non-animatable things (cursor, aria, tab order) once per
  // card instead of on every frame.
  const [isOpen, setIsOpen] = useState(false)
  useMotionValueEvent(openness, 'change', (v) => {
    const next = v > 0.5
    setIsOpen((prev) => (prev === next ? prev : next))
  })

  const height = useTransform(
    openness,
    [0, 1],
    [collapsedH, Math.max(expandedH, collapsedH)],
  )

  // Rows and the expanded card share one width — the card grows vertically
  // only, so the stack reads as a single column at every moment.

  // Shadow deepens as the card lifts off the stack. Even collapsed rows carry
  // a little, so the waiting stack reads as stacked paper rather than a list.
  const shadowBlur = useTransform(openness, [0, 1], [16, 48])
  const shadowY = useTransform(openness, [0, 1], [-2, 18])
  const shadowAlpha = useTransform(openness, [0, 1], [0.05, 0.11])
  const boxShadow = useMotionTemplate`0px ${shadowY}px ${shadowBlur}px rgba(22, 22, 26, ${shadowAlpha})`

  // Excerpt content fades in over the back half of the morph, so text never
  // appears while the card is still visibly resizing.
  const contentOpacity = useTransform(openness, [0.4, 0.9], [0, 1])
  const contentY = useTransform(openness, [0.4, 1], [12, 0])
  const arrowScale = useTransform(openness, [0.5, 1], [0.6, 1])
  const arrowOpacity = useTransform(openness, [0.5, 0.95], [0, 1])

  return (
    <motion.article
      style={{ height, boxShadow, ...style }}
      className={`relative overflow-hidden rounded-card border border-hairline bg-card will-change-[height,transform] ${className}`}
    >
      {/* Stretched link: the whole tile is the click target. It stays in the
          document at all times so keyboard users can reach every project, but
          the ↗ affordance only shows in the expanded state. */}
      <Link
        to={`/work/${work.slug}`}
        aria-label={`${work.title} — ${work.client}, ${work.year}. Read the case study.`}
        className="absolute inset-0 z-20 rounded-card focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:outline-none"
      />

      <div className="relative flex h-full flex-col">
        {/* ---- Compact row — visible in every state, never moves ---- */}
        <div
          className="relative flex shrink-0 items-center gap-3 pr-16 pl-5 sm:gap-5 sm:pr-20 sm:pl-7"
          style={{ height: collapsedH }}
        >
          <span className="w-10 shrink-0 text-xs tabular-nums text-muted sm:w-12 sm:text-sm">
            {work.year}
          </span>
          <h3 className="line-clamp-2 text-[15px] leading-tight font-medium tracking-[-0.01em] text-ink sm:text-lg lg:text-xl">
            {work.title}
          </h3>
          <span className="hidden shrink-0 text-sm text-muted sm:inline">
            {work.client}
          </span>

          {/* ↗ button, top-right. Decorative — the stretched link above handles
              the click. Wrapped in a plain div so Tailwind's centering
              transform isn't overwritten by the motion `scale`. */}
          <div className="absolute top-1/2 right-4 -translate-y-1/2 sm:right-5">
            <motion.span
              aria-hidden="true"
              style={{ scale: arrowScale, opacity: arrowOpacity }}
              className="flex size-9 items-center justify-center rounded-full border border-hairline bg-paper text-ink sm:size-10"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </motion.span>
          </div>
        </div>

        {/* ---- Excerpt — only readable once the card is (nearly) open ---- */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          aria-hidden={!isOpen}
          className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_minmax(0,1fr)] gap-4 px-5 pb-5 sm:grid-cols-[1.05fr_1fr] sm:grid-rows-1 sm:gap-7 sm:px-7 sm:pb-7"
        >
          <div className="flex min-h-0 flex-col">
            {/* The compact row hides the client on small screens — surface it
                here instead so the expanded state is never missing context. */}
            <p className="mb-2 text-sm text-muted sm:hidden">{work.client}</p>
            <p className="max-w-prose text-[15px] leading-relaxed text-pretty text-ink/70 sm:text-base">
              {work.excerpt}
            </p>

            <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
              {work.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-hairline px-2.5 py-1 text-[11px] tracking-wide text-muted"
                >
                  {tag}
                </span>
              ))}
              <span className="ml-auto hidden text-sm font-medium text-ink sm:inline">
                Read case study
              </span>
            </div>
          </div>

          <div className="relative min-h-0 overflow-hidden rounded-xl bg-paper">
            <PreviewSurface
              src={work.cover}
              accent={work.accent}
              alt={`${work.title} preview`}
              label={work.client}
            />
          </div>
        </motion.div>
      </div>
    </motion.article>
  )
}
