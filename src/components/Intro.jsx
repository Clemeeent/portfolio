import Chip from './Chip'
import { CHIP_GRADIENTS } from '../lib/gradients'

/**
 * <Intro /> — the intro sentence and the "selected works" label. The name
 * lives in <Wordmark />, pinned to the top of the viewport by StackedWorks.
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
      <h1 className="sentence max-w-[22ch] text-[7vw] text-ink sm:max-w-none sm:text-[4.4vw] lg:text-[2.9vw]">
        <Chip mark="rings" gradient={CHIP_GRADIENTS[0]}>
          Senior product designer
        </Chip>{' '}
        based in{' '}
        <Chip mark="spark" gradient={CHIP_GRADIENTS[1]}>
          Paris, France
        </Chip>
        <br className="hidden sm:block" /> Building{' '}
        <Chip mark="eye" gradient={CHIP_GRADIENTS[2]}>
          research tools
        </Chip>{' '}
        at{' '}
        <Chip mark="spiral" gradient={CHIP_GRADIENTS[3]}>
          Maze
        </Chip>{' '}
        and open to{' '}
        <Chip mark="send" gradient={CHIP_GRADIENTS[4]}>
          new work
        </Chip>
      </h1>

      <span className="pill mt-10">Selected works</span>
    </div>
  )
}
