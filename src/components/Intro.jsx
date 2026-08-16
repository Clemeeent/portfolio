import Mark from './Mark'

/**
 * <Chip> — a phrase lifted out of the serif sentence into bold sans on a soft
 * highlight, with an optional graphic mark after it.
 *
 * The styling lives in `.chip` in index.css (see the note there on why it's an
 * inline box rather than a flex one).
 */
function Chip({ children, mark }) {
  return (
    <span className="chip">
      {children}
      {mark && <Mark name={mark} />}
    </span>
  )
}

/**
 * <Intro /> — the intro sentence and the "selected works" label.
 *
 * The sentence is set in a serif with key phrases chipped out in bold sans, so
 * the facts that matter (role, place, work) carry the emphasis. Marks come from
 * <Mark />; swap any `mark` prop below for another name in that file.
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
