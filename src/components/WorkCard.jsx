import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValueEvent, useTransform } from 'framer-motion'
import Chip from './Chip'
import PreviewSurface from './PreviewSurface'
import { LAYOUTS, gradientFor } from '../lib/layout'

/**
 * <WorkCard /> — one project: a header strip (year · title · client) above an
 * excerpt (intro text, tags, preview image) with a ↗ button.
 *
 * The card is always laid out at full size. On desktop it is NEVER resized —
 * it looks collapsed only because the next card in the deck is drawn on top of
 * it, hiding everything below the header strip. That is what makes the stack
 * read as overlapping cards rather than a list of rows, and it means the whole
 * reveal runs on `transform` alone with no layout work per frame.
 *
 * This component owns no scroll logic. The parent (<StackedWorks />) decides
 * where the card sits and how tall it is.
 *
 * Props
 *   work         item from src/data/works.js
 *   height       px — a number (desktop, fixed) or a MotionValue (mobile, animated)
 *   headerH      px height of the header strip: the sliver left visible when
 *                the next card covers this one
 *   openness     MotionValue<number> 0..1 — cosmetic only (the ↗ button). On
 *                desktop the actual reveal is geometric.
 *   fadeContent  fade the excerpt in with `openness`. Desktop passes false:
 *                there the excerpt is revealed by uncovering, and fading it
 *                while it slides would fight that.
 *   onActivate   called when a card that is NOT in focus is clicked. Given
 *                this, the tile only navigates once it is in focus. Omit it
 *                (static list) and the tile always links.
 *   style        extra motion styles from the parent (position / y offset)
 */
export default function WorkCard({
  work,
  index = 0,
  height,
  headerH,
  openness,
  fadeContent = true,
  onActivate,
  variant = 'deck',
  style,
  className = '',
}) {
  const look = LAYOUTS[variant] ?? LAYOUTS.deck
  // `isOpen` mirrors `openness` into React state, but only at the halfway mark,
  // so we can flip non-animatable things (cursor, aria, tab order) once per
  // card instead of on every frame.
  // Seeded from the current value, not `false`: in the static list `openness`
  // is a constant 1 and never fires a change event, so a hardcoded `false`
  // would leave the excerpt permanently aria-hidden.
  const [isOpen, setIsOpen] = useState(() => openness.get() > 0.5)
  useMotionValueEvent(openness, 'change', (v) => {
    const next = v > 0.5
    setIsOpen((prev) => (prev === next ? prev : next))
  })

  // No drop shadow. The overlap between cards is carried by the hairline
  // border on each card's top edge instead.

  // Only used when `fadeContent` is on (mobile), where the card really does
  // resize and text would otherwise appear mid-morph.
  const fadedOpacity = useTransform(openness, [0.4, 0.9], [0, 1])
  const fadedY = useTransform(openness, [0.4, 1], [12, 0])
  const contentOpacity = fadeContent ? fadedOpacity : 1
  const contentY = fadeContent ? fadedY : 0

  const arrowScale = useTransform(openness, [0.5, 1], [0.6, 1])
  const arrowOpacity = useTransform(openness, [0.5, 0.95], [0, 1])

  return (
    <motion.article
      style={{ height, ...style }}
      className={`relative overflow-hidden rounded-card border border-hairline bg-card will-change-transform ${className}`}
    >
      {/* The whole tile is the click target, but what it does depends on
          whether this card is the one in focus:

            in focus  → a link that opens the case study
            covered   → a button that scrolls this card into focus first

          So a partly hidden card can never navigate you somewhere you can't
          see. Both are real focusable controls, so every project stays
          keyboard-reachable either way. */}
      {isOpen || !onActivate ? (
        <Link
          to={`/work/${work.slug}`}
          aria-label={`${work.title} — ${work.client}, ${work.year}. Read the case study.`}
          className="absolute inset-0 z-20 rounded-card focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:outline-none"
        />
      ) : (
        <button
          type="button"
          onClick={onActivate}
          aria-label={`${work.title} — ${work.client}, ${work.year}. Bring this project into view.`}
          className="absolute inset-0 z-20 cursor-pointer rounded-card focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:outline-none"
        />
      )}

      <div className="relative flex h-full flex-col">
        {/* ---- Header strip — the sliver left visible when this card is
                covered by the next one in the deck ---- */}
        <div
          className="relative flex shrink-0 items-center gap-3 pr-16 pl-5 sm:gap-5 sm:pr-20 sm:pl-7"
          // `folders` indents each card's header a little further than the one
          // above it, so the run of headers reads as a row of tabs rather than
          // a column of rows. Indenting the content, not the card, keeps the
          // deck's overlap geometry untouched.
          style={{ height: headerH, paddingInlineStart: look.stagger ? look.stagger * index + 20 : undefined }}
        >
          <span className="w-10 shrink-0 text-xs tabular-nums text-muted sm:w-12 sm:text-sm">
            {work.year}
          </span>
          <h3
            className={`line-clamp-2 leading-tight text-ink ${
              look.titleFont === 'serif'
                ? 'sentence text-[17px] sm:text-xl lg:text-[26px]'
                : 'text-[15px] font-medium tracking-[-0.01em] sm:text-lg lg:text-xl'
            }`}
          >
            {work.title}
          </h3>

          {look.client === 'plain' && (
            <span className="hidden shrink-0 text-sm text-muted sm:inline">
              {work.client}
            </span>
          )}
          {look.client === 'chip' && (
            <span className="hidden shrink-0 text-base sm:inline">
              <Chip>{work.client}</Chip>
            </span>
          )}
          {look.client === 'gradient' && (
            <span className="hidden shrink-0 text-base sm:inline">
              <Chip tone="gradient" gradient={gradientFor(index)}>
                {work.client}
              </Chip>
            </span>
          )}

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

        {/* ---- Excerpt — uncovered as the card above it moves away ---- */}
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
