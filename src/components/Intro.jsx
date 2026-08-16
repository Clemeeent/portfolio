import Chip from './Chip'

/**
 * <Intro /> — the name, the intro sentence and the "selected works" label.
 *
 * The sentence is set in a serif with key phrases chipped out in bold sans, so
 * the facts that matter (role, place, work) carry the emphasis. Swap any `mark`
 * below for another name in Mark.jsx.
 *
 * Presentational only — it carries no scroll logic, because the two layouts
 * animate it very differently:
 *
 *   desktop — <StackedWorks /> pins it and fades + blurs it in place as the
 *             first card rises over it (it never scrolls away)
 *   mobile  — it scrolls off normally above the static list
 */
export default function Intro({ className = '' }) {
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
        <Chip mark="rings">Product designer</Chip> based in{' '}
        <Chip mark="spark">Paris, France</Chip>
        <br className="hidden sm:block" /> Building{' '}
        <Chip mark="eye">research tools</Chip> at <Chip mark="spiral">Maze</Chip>{' '}
        and open to <Chip mark="send">new work</Chip>
      </h1>

      <span className="pill mt-10">Selected works</span>
    </div>
  )
}
