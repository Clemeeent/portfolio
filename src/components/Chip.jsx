import Mark from './Mark'

/**
 * <Chip> — a phrase lifted out of running text into bold sans on a highlight.
 *
 * Two tones, from the two references:
 *
 *   soft      grey rounded rectangle, small radius, usually with a Mark after
 *             the text (lfe.org)
 *   gradient  fully round pill with a vivid gradient fill and no mark; the
 *             shape carries the emphasis instead (nngroup.com)
 *
 * Both are `display: inline` boxes rather than flex ones — see the note in
 * index.css for why that matters for baseline alignment.
 */
export default function Chip({
  children,
  mark,
  tone = 'soft',
  gradient,
  className = '',
}) {
  if (tone === 'gradient') {
    const [from, to] = gradient ?? ['#b6a5f7', '#35c6a6']
    return (
      <span
        className={`chip chip-gradient ${className}`}
        style={{ backgroundImage: `linear-gradient(100deg, ${from}, ${to})` }}
      >
        {children}
      </span>
    )
  }

  return (
    <span className={`chip ${className}`}>
      {children}
      {mark && <Mark name={mark} />}
    </span>
  )
}
