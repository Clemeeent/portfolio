import Mark from './Mark'

/**
 * <Chip> — a phrase lifted out of the serif sentence into bold sans on a soft
 * grey highlight, with an optional graphic mark after it.
 *
 * Styling lives in `.chip` in index.css — see the note there on why it's an
 * inline box rather than a flex one (baseline alignment with the serif).
 */
export default function Chip({ children, mark, className = '' }) {
  return (
    <span className={`chip ${className}`}>
      {children}
      {mark && <Mark name={mark} />}
    </span>
  )
}
