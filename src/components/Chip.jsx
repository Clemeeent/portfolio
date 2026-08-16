import Mark from './Mark'
import { CHIP_GRADIENTS } from '../lib/gradients'

/**
 * <Chip> — a phrase lifted out of the serif sentence into bold sans on a soft
 * grey highlight, with an optional graphic mark after it.
 *
 * At rest it's greyscale. On rollover a gradient fades in behind the text and
 * slowly pans — the colour is a reward for pointing at it rather than
 * decoration that's always on.
 *
 * The gradient is a real element rather than a pseudo-element: inside an inline
 * box, a `z-index: -1` pseudo-element paints *behind* the chip's own background
 * and never shows. Two positioned children in DOM order — fill, then label —
 * paint in the order we want without relying on z-index at all.
 *
 * Styling lives in `.chip` in index.css, including why the chip is an inline
 * box rather than a flex one.
 */
export default function Chip({ children, mark, gradient, className = '' }) {
  const [from, to] = gradient ?? CHIP_GRADIENTS[0]

  return (
    <span
      className={`chip ${className}`}
      style={{ '--chip-from': from, '--chip-to': to }}
    >
      <span className="chip-fill" aria-hidden="true" />
      <span className="chip-label">
        {children}
        {mark && <Mark name={mark} />}
      </span>
    </span>
  )
}
