import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

/**
 * <Intro /> — the background / lowest-z layer.
 *
 * It sits above the pinned works list in the document and scrolls away behind
 * it: as the section leaves the viewport the whole block drifts up slightly and
 * fades, so the works list appears to rise over it rather than push it.
 *
 * Tuning: `fadeRange` below is expressed in scroll-progress of this section
 * (0 = section top at viewport top, 1 = section bottom at viewport top).
 */
export default function Intro() {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Start fading at 35% of the way out, fully gone by 90%.
  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.9], [1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 1], [0, -80])

  return (
    <section
      ref={ref}
      className="relative z-0 flex min-h-[92svh] items-end px-5 pt-28 pb-16 sm:px-8 lg:px-12"
    >
      <motion.div style={{ opacity, y }} className="w-full">
        <div className="mx-auto w-full max-w-[1400px]">
          <p className="mb-10 max-w-xl text-sm text-muted sm:text-base">
            Clément Lebau — Product designer
          </p>

          {/* Heading block */}
          <h1 className="display text-[13vw] font-medium text-balance text-ink sm:text-[9vw] lg:text-[7.2vw]">
            Designing research
            <br />
            tools people
            <br />
            actually open.
          </h1>

          {/* Two-line subheading / bio */}
          <p className="mt-10 max-w-2xl text-lg leading-snug text-pretty text-ink/70 sm:text-xl">
            Ten years turning dense, expert-only software into products teams
            reach for daily.
            <br className="hidden sm:block" />
            Currently designing the research platform at Maze, from Paris.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
