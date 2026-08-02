import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { features } from '../data/features'
import PreviewSurface from './PreviewSurface'

/**
 * One full-bleed block: a tall rounded panel with a caption strip pinned to its
 * bottom edge. The inner surface drifts vertically as the block crosses the
 * viewport — a slow parallax that keeps the stack from feeling static.
 *
 * Tuning: PARALLAX is the total travel in px across a full pass of the block.
 */
const PARALLAX = 60

function FeatureBlock({ feature }) {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'], // enters bottom → exits top
  })

  const y = useTransform(scrollYProgress, [0, 1], [-PARALLAX, PARALLAX])

  return (
    <article
      ref={ref}
      className="relative flex h-[72svh] min-h-[420px] flex-col overflow-hidden rounded-block border border-hairline bg-card"
    >
      {/* Image area */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <motion.div style={{ y }} className="absolute -inset-y-[8%] inset-x-0">
          <PreviewSurface src={feature.image} accent={feature.accent} />
        </motion.div>

        <div className="relative flex h-full flex-col justify-between p-6 sm:p-9">
          <span className="pill self-start bg-card/80 backdrop-blur-sm">
            {feature.eyebrow}
          </span>
          <h3 className="display max-w-[16ch] text-3xl font-medium text-balance text-ink sm:text-5xl lg:text-6xl">
            {feature.title}
          </h3>
        </div>
      </div>

      {/* Caption strip along the bottom edge */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-hairline bg-card px-6 py-5 sm:px-9">
        <p className="text-sm text-pretty text-ink/70 sm:text-base">
          {feature.caption}
        </p>
        <span className="shrink-0 text-xs tracking-[0.14em] text-muted uppercase">
          {feature.meta}
        </span>
      </div>
    </article>
  )
}

/** The stacked full-width sections that continue the page below the works. */
export default function FeatureBlocks() {
  return (
    <section className="relative z-10 px-5 pt-8 pb-24 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5">
        {features.map((feature) => (
          <FeatureBlock key={feature.title} feature={feature} />
        ))}
      </div>
    </section>
  )
}
