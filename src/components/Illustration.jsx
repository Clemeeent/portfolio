/* ---------------------------------------------------------------------------
   ILLUSTRATIONS — one flat graphic per project.

   Big filled geometric forms, one saturated colour each, sitting on the paper
   background. No outlines, no gradients, no detail: they should still read at
   the size of a card preview and survive being cropped.

   Where shapes overlap, the one in front is stroked with the SURFACE colour
   rather than left to merge — that's what carves the visible slit between
   forms and stops an arrangement collapsing into one blob.

   Add one by dropping an entry in `illustrations` below, then pointing a
   project at it with `illustration: '<key>'` in src/data/works.js.

   The viewBox is 400×320 and every drawing is centred with margin. It renders
   with `meet`, so the whole composition always fits whatever frame it's given
   and the surface colour fills the rest — the card preview is roughly square,
   the case-study hero is very wide, and `slice` would crop the drawing to
   fragments in the second one.
--------------------------------------------------------------------------- */

/** Saturated palette, in the register of the reference shapes. */
const C = {
  orange: '#f4793a',
  pink: '#f98cb6',
  amber: '#e6b043',
  magenta: '#c22a95',
  teal: '#2fae9b',
}

/** Background colour used to carve gaps between overlapping shapes. */
const SURFACE = '#f1f0ee'

const illustrations = {
  /**
   * Data reachable from anywhere — a core with agents connected to it.
   * A hub with thick spokes out to nodes of varying shape: the point is that
   * the things reaching in are not all the same kind of client.
   */
  'access-anywhere': {
    color: C.orange,
    draw: (fill) => {
      const cx = 200
      const cy = 160
      const r = 122
      const nodes = [0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180
        return {
          x: cx + r * Math.cos(rad),
          y: cy - r * Math.sin(rad),
          kind: i % 3,
        }
      })

      return (
        <>
          {/* Spokes first, so the nodes sit on top of them */}
          <g
            stroke={fill}
            strokeWidth="15"
            strokeLinecap="round"
            fill="none"
          >
            {nodes.map((n, i) => (
              <line key={i} x1={cx} y1={cy} x2={n.x} y2={n.y} />
            ))}
          </g>

          {nodes.map((n, i) =>
            n.kind === 0 ? (
              <circle key={i} cx={n.x} cy={n.y} r="26" fill={fill} />
            ) : n.kind === 1 ? (
              <rect
                key={i}
                x={n.x - 24}
                y={n.y - 24}
                width="48"
                height="48"
                rx="12"
                fill={fill}
              />
            ) : (
              <path
                key={i}
                d={`M${n.x} ${n.y - 28}L${n.x + 26} ${n.y + 18}L${n.x - 26} ${n.y + 18}Z`}
                fill={fill}
                strokeLinejoin="round"
                stroke={fill}
                strokeWidth="8"
              />
            ),
          )}

          {/* The core, drawn last and ringed in the surface colour so the
              spokes appear to arrive at it rather than pass through */}
          <circle
            cx={cx}
            cy={cy}
            r="52"
            fill={fill}
            stroke={SURFACE}
            strokeWidth="12"
          />
        </>
      )
    },
  },

  /**
   * Testing on any device — a landscape screen, a tablet and a phone, at three
   * clearly different proportions, overlapping at three different heights.
   *
   * Two earlier attempts failed in instructive ways: same-size rotated slabs
   * read as abstract blocks, and bottom-aligning them in ascending height read
   * as a bar chart. Staggering them vertically and letting them overlap is what
   * makes them read as devices.
   */
  'any-device': {
    color: C.pink,
    draw: (fill) => (
      <g fill={fill} stroke={SURFACE} strokeWidth="12">
        <rect x="248" y="72" width="118" height="152" rx="15" />
        <rect x="34" y="104" width="214" height="142" rx="14" />
        {/* The phone in front — mobile is the point of the project */}
        <rect x="178" y="140" width="78" height="150" rx="18" />
      </g>
    ),
  },

  /**
   * Goal-based vs free explore — the same stroke, once as a dead straight run
   * to a target, once wandering. All the meaning is in the path.
   */
  'goal-vs-free': {
    color: C.amber,
    draw: (fill) => (
      <g
        stroke={fill}
        strokeWidth="17"
        strokeLinecap="round"
        fill="none"
      >
        {/* Goal-based: straight there */}
        <line x1="56" y1="104" x2="300" y2="104" />
        <path d="M300 104 L296 104" />
        <circle cx="330" cy="104" r="19" fill={fill} stroke="none" />

        {/* Free explore: same distance, taken differently */}
        <path d="M56 224c34-58 62 46 96-4s52 52 88 4 44 26 62 8" />
      </g>
    ),
  },

  /**
   * Distributing public funds — one source fanning into many recipients.
   * NOTE: invented. There was no brief for this project, so treat it as a
   * placeholder for whatever the work was actually about.
   */
  'distribution': {
    color: C.magenta,
    draw: (fill) => (
      <>
        <rect x="140" y="36" width="120" height="46" rx="23" fill={fill} />
        <g fill={fill} stroke={SURFACE} strokeWidth="11">
          {[-1.6, -0.8, 0, 0.8, 1.6].map((k, i) => {
            const topX = 200 + k * 26
            const botX = 200 + k * 82
            return (
              <path
                key={i}
                d={`M${topX - 16} 96 L${topX + 16} 96 L${botX + 30} 286 L${botX - 30} 286 Z`}
              />
            )
          })}
        </g>
      </>
    ),
  },

  /**
   * INRA at 70 — the Guggenheim rotunda as an ellipsis ladder: rings stacked
   * and shrinking as they climb, the way the ramp reads looking up from the
   * floor.
   */
  'ellipsis-ladder': {
    color: C.teal,
    draw: (fill) => (
      <g stroke={fill} strokeWidth="15" fill="none">
        {Array.from({ length: 7 }, (_, i) => (
          <ellipse
            key={i}
            cx="200"
            cy={272 - i * 34}
            rx={150 - i * 17}
            ry={26 - i * 1.8}
          />
        ))}
      </g>
    ),
  },
}

/**
 * <Illustration name="access-anywhere" /> — a project's flat graphic.
 *
 * Decorative: the card and the case study both name the project in text right
 * next to it, so there is nothing here for a screen reader to gain.
 */
export default function Illustration({ name, className = '' }) {
  const item = illustrations[name]
  if (!item) return null

  return (
    <svg
      viewBox="0 0 400 320"
      preserveAspectRatio="xMidYMid meet"
      className={`h-full w-full ${className}`}
      aria-hidden="true"
      style={{ backgroundColor: SURFACE }}
    >
      {item.draw(item.color)}
    </svg>
  )
}
