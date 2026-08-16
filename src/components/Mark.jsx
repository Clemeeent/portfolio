/* ---------------------------------------------------------------------------
   MARKS — the little graphic shapes that sit inside inline chips.

   All original, all drawn on a 24×24 grid, all using `currentColor` so they
   take the colour of whatever text they sit in. Sized in `em` at the point of
   use, so a mark always scales with its sentence.

   Add one by dropping a new entry in `marks` below — the key is the name you
   pass to <Mark name="…" />. Keep them simple: at inline size (~18–22px) any
   detail finer than a 1.5px stroke disappears.

   Stroked marks use `stroke="currentColor" fill="none"`; solid ones use
   `fill="currentColor"`. Mixing both in one set is deliberate — it keeps a run
   of chips from looking mechanical.
--------------------------------------------------------------------------- */

const S = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const marks = {
  /** Four-point sparkle, solid. Good for emphasis / "new". */
  spark: (
    <path
      fill="currentColor"
      d="M12 1.5c.6 5.4 3.6 8.4 9 9-5.4.6-8.4 3.6-9 9-.6-5.4-3.6-8.4-9-9 5.4-.6 8.4-3.6 9-9Z"
    />
  ),

  /** Ellipse with a dot — a badge/seal, echoing an enclosing logotype. */
  seal: (
    <g {...S}>
      <ellipse cx="12" cy="12" rx="10" ry="6.5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </g>
  ),

  /** Outward spiral. Reads as process, iteration, "in progress". */
  spiral: (
    <path
      {...S}
      d="M12 13.4c0-.8.7-1.5 1.5-1.5 1.2 0 2.1 1 2.1 2.3 0 1.8-1.5 3.2-3.4 3.2-2.5 0-4.5-2-4.5-4.6 0-3.2 2.6-5.8 5.9-5.8 4 0 7.2 3.2 7.2 7.2"
    />
  ),

  /** Six-spoke asterisk / burst. */
  burst: (
    <g {...S}>
      <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
    </g>
  ),

  /** Concentric rings — a target, or "focus". */
  rings: (
    <g {...S}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.2" />
    </g>
  ),

  /** Squiggle. Softens a run of geometric marks. */
  wave: <path {...S} d="M2.5 14.5c2.6-5 5.2-5 7.8 0s5.2 5 7.8 0 2.6-5 3.4-3.2" />,

  /** Arrow leaving a circle — outward, "go there". */
  send: (
    <g {...S}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.8 15.2 15.2 8.8M10.4 8.8h4.8v4.8" />
    </g>
  ),

  /** Rosette of petals. The most decorative of the set. */
  rosette: (
    <g {...S}>
      {[0, 60, 120].map((deg) => (
        <ellipse
          key={deg}
          cx="12"
          cy="12"
          rx="3.2"
          ry="9.2"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
    </g>
  ),

  /** Eye. Attention, research, looking closely. */
  eye: (
    <g {...S}>
      <path d="M1.8 12S5.6 5.6 12 5.6 22.2 12 22.2 12 18.4 18.4 12 18.4 1.8 12 1.8 12Z" />
      <circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none" />
    </g>
  ),

  /** Soft organic blob, solid. */
  blob: (
    <path
      fill="currentColor"
      d="M12.6 2.4c4.4-.9 8.6 2.2 9 6.4.4 4.2-2.6 6.2-4.6 8.6-2 2.4-3.6 5-6.8 4.4-3.2-.6-5-3.8-6.4-7-1.4-3.2-1.6-6.6.8-8.8 2.4-2.2 3.6-2.7 8-3.6Z"
    />
  ),

  /** Half-filled circle. Duality, "goal-based and free". */
  half: (
    <g {...S}>
      <circle cx="12" cy="12" r="9" />
      <path
        d="M12 3a9 9 0 0 1 0 18Z"
        fill="currentColor"
        stroke="none"
      />
    </g>
  ),

  /** Stack of bars — a list, a set, an archive. */
  stack: (
    <g {...S}>
      <path d="M3.6 7.5h16.8M3.6 12h16.8M3.6 16.5h16.8" />
    </g>
  ),
}

/**
 * <Mark name="spark" /> — an inline graphic shape.
 *
 * Decorative by default (aria-hidden). Pass a `title` only if the mark is
 * carrying meaning the surrounding text doesn't already say.
 */
export default function Mark({ name, className = '', title }) {
  const glyph = marks[name]
  if (!glyph) return null

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
    >
      {title && <title>{title}</title>}
      {glyph}
    </svg>
  )
}
