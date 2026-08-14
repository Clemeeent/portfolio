/**
 * <Intro /> — name/role line, heading and the "selected works" label.
 *
 * Presentational only. It carries no scroll logic of its own because the two
 * layouts animate it very differently:
 *
 *   desktop — <StackedWorks /> pins it and fades + blurs it in place as the
 *             first card rises over it (it never scrolls away)
 *   mobile  — it scrolls off normally above the accordion
 *
 * Both callers wrap this in their own motion element.
 */
export default function Intro({ className = '' }) {
  return (
    <div className={className}>
      <p className="mb-8 max-w-xl text-sm text-muted sm:text-base">
        Clément Lebau — Product designer
      </p>

      {/* Heading block */}
      <h1 className="display text-[12vw] font-medium text-balance text-ink sm:text-[7vw] lg:text-[5vw]">
        Designing research
        <br />
        tools people
        <br />
        actually open.
      </h1>

      <span className="pill mt-10">Selected works</span>
    </div>
  )
}
