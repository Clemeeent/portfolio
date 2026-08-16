/**
 * <Wordmark /> — the name, pinned to the top of the viewport.
 *
 * Deliberately outside the intro's fading layer: the intro sentence blurs away
 * as the first card rises, and the name should not go with it. On desktop it
 * sits inside the sticky pinned container, so it holds its position for the
 * whole scroll.
 *
 * TOP_PAD in StackedWorks reserves the room it needs — raise both together if
 * this ever grows into a full header.
 */
export default function Wordmark({ className = '' }) {
  return (
    <p
      className={`text-sm font-medium tracking-[-0.01em] text-ink sm:text-[15px] ${className}`}
    >
      Clément Lebau
    </p>
  )
}
