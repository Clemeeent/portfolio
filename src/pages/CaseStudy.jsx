import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getNextWork, getWorkBySlug } from '../data/works'
import PreviewSurface from '../components/PreviewSurface'
import SiteFooter from '../components/SiteFooter'
import NotFound from './NotFound'

/** Renders one block from a work's `body` array. See src/data/works.js. */
function Block({ block, accent }) {
  switch (block.type) {
    case 'lead':
      return (
        <p className="text-xl leading-snug text-pretty text-ink sm:text-2xl">
          {block.text}
        </p>
      )

    case 'heading':
      return (
        <h2 className="mt-6 text-sm font-medium tracking-[0.14em] text-muted uppercase">
          {block.text}
        </h2>
      )

    case 'text':
      return (
        <p className="text-base leading-relaxed text-pretty text-ink/75 sm:text-lg">
          {block.text}
        </p>
      )

    case 'list':
      return (
        <ul className="flex flex-col gap-3">
          {block.items.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-base text-ink/75 sm:text-lg"
            >
              <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-muted" />
              {item}
            </li>
          ))}
        </ul>
      )

    case 'quote':
      return (
        <blockquote className="border-l-2 border-hairline pl-6">
          <p className="text-xl leading-snug text-balance text-ink sm:text-2xl">
            {block.text}
          </p>
          {block.cite && (
            <cite className="mt-3 block text-sm text-muted not-italic">
              {block.cite}
            </cite>
          )}
        </blockquote>
      )

    case 'stats':
      return (
        <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-card border border-hairline bg-hairline sm:grid-cols-3">
          {block.items.map((item) => (
            <div key={item.label} className="bg-card p-6">
              <dt className="text-sm text-muted">{item.label}</dt>
              <dd className="mt-2 text-3xl font-medium text-ink sm:text-4xl">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      )

    case 'figure':
      return (
        // Figures break out of the prose column to full content width.
        <figure className="-mx-5 sm:mx-0 lg:-mx-24">
          <div className="h-[46svh] min-h-[260px] overflow-hidden rounded-block border border-hairline bg-paper sm:h-[62svh]">
            <PreviewSurface
              src={block.src}
              accent={accent}
              alt={block.caption}
            />
          </div>
          {block.caption && (
            <figcaption className="mt-3 px-5 text-sm text-muted sm:px-0">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )

    default:
      return null
  }
}

/**
 * <CaseStudy /> — the `/work/:slug` route. The full read that the homepage
 * excerpt teases. Content comes entirely from the `body` array in works.js.
 */
export default function CaseStudy() {
  const { slug } = useParams()
  const work = getWorkBySlug(slug)

  if (!work) return <NotFound />

  const next = getNextWork(slug)

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="px-5 pt-8 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-[1400px]">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 5l-7 7 7 7" />
            </svg>
            All work
          </Link>
        </div>
      </div>

      {/* ---- Header ---- */}
      <header className="px-5 pt-16 pb-10 sm:px-8 sm:pt-24 lg:px-12">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            <span className="tabular-nums">{work.year}</span>
            <span aria-hidden="true">·</span>
            <span>{work.client}</span>
          </div>

          <h1 className="display mt-6 max-w-[18ch] text-[10vw] font-medium text-balance text-ink sm:text-[6.5vw] lg:text-[5vw]">
            {work.title}
          </h1>

          <div className="mt-10 flex flex-wrap gap-2">
            {work.tags.map((tag) => (
              <span key={tag} className="pill">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* ---- Hero ---- */}
      <div className="px-5 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="h-[58svh] min-h-[320px] overflow-hidden rounded-block border border-hairline bg-card">
            <PreviewSurface
              src={work.cover}
              accent={work.accent}
              alt={work.title}
              label={work.client}
            />
          </div>
        </div>
      </div>

      {/* ---- Body ---- */}
      <div className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-12 flex flex-col gap-6 text-sm">
                <div>
                  <p className="text-muted">Role</p>
                  <p className="mt-1 text-ink">{work.role}</p>
                </div>
                <div>
                  <p className="text-muted">Client</p>
                  <p className="mt-1 text-ink">{work.client}</p>
                </div>
                <div>
                  <p className="text-muted">Year</p>
                  <p className="mt-1 text-ink tabular-nums">{work.year}</p>
                </div>
              </div>
            </aside>

            <article className="flex max-w-[70ch] flex-col gap-7">
              {work.body.map((block, i) => (
                <Block key={i} block={block} accent={work.accent} />
              ))}
            </article>
          </div>
        </div>
      </div>

      {/* ---- Next project ---- */}
      {next && (
        <div className="px-5 pb-24 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-[1400px]">
            <Link
              to={`/work/${next.slug}`}
              className="group flex flex-col gap-6 rounded-block border border-hairline bg-card p-6 transition-shadow hover:shadow-[0_20px_44px_rgba(22,22,26,0.08)] sm:flex-row sm:items-center sm:justify-between sm:p-9"
            >
              <div>
                <span className="text-xs tracking-[0.14em] text-muted uppercase">
                  Next project
                </span>
                <p className="display mt-4 max-w-[20ch] text-2xl font-medium text-balance text-ink sm:text-4xl">
                  {next.title}
                </p>
                <p className="mt-3 text-sm text-muted">
                  {next.year} · {next.client}
                </p>
              </div>
              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-full border border-hairline transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      )}

      <SiteFooter />
    </motion.main>
  )
}
