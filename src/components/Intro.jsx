import Chip from './Chip'
import { LAYOUTS, gradientFor } from '../lib/layout'

/**
 * <Intro /> — the name, the intro sentence and the "selected works" label.
 *
 * The sentence is set in a serif with key phrases chipped out, so the facts
 * that matter (role, place, work) carry the emphasis. The chips take their tone
 * from the active layout variant: soft grey with a mark, or a vivid gradient
 * pill. Swap any `mark` below for another name in Mark.jsx.
 *
 * Presentational only — it carries no scroll logic, because the two layouts
 * animate it very differently:
 *
 *   desktop — <StackedWorks /> pins it and fades + blurs it in place as the
 *             first card rises over it (it never scrolls away)
 *   mobile  — it scrolls off normally above the static list
 */
export default function Intro({ variant = 'deck', className = '' }) {
  const tone = (LAYOUTS[variant] ?? LAYOUTS.deck).chipTone

  // In gradient tone the mark is dropped — the pill's colour is the emphasis,
  // and a mark on top of a gradient reads as clutter.
  const chip = (children, mark, i) => (
    <Chip tone={tone} mark={tone === 'gradient' ? undefined : mark} gradient={gradientFor(i)}>
      {children}
    </Chip>
  )

  return (
    <div className={className}>
      {/* The only place the name appears on the homepage. It sits inside the
          intro layer, so it fades out with the sentence as the first card
          rises — move it out into a persistent header if you'd rather it stay
          on screen (that needs TOP_PAD in StackedWorks raised to make room). */}
      <p className="mb-7 text-sm font-medium tracking-[-0.01em] text-ink sm:text-[15px]">
        Clément Lebau
      </p>

      <h1 className="sentence max-w-[22ch] text-[7vw] text-ink sm:max-w-none sm:text-[4.4vw] lg:text-[2.9vw]">
        {chip('Product designer', 'rings', 0)} based in{' '}
        {chip('Paris, France', 'spark', 1)}
        <br className="hidden sm:block" /> Building{' '}
        {chip('research tools', 'eye', 2)} at {chip('Maze', 'spiral', 3)} and
        open to {chip('new work', 'send', 4)}
      </h1>

      <span className="pill mt-10">Selected works</span>
    </div>
  )
}
