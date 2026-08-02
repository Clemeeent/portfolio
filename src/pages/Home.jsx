import StackedWorks from '../components/StackedWorks'

/**
 * The homepage is a single pinned viewport: the intro and the works stack
 * share one screen, and scrolling drives the cards through it.
 *
 * <StackedWorks /> owns that whole composition — including <Intro />, because
 * the intro animates completely differently in the pinned and mobile layouts,
 * so the component that picks the layout has to be the one that places it.
 */
export default function Home() {
  return (
    <main>
      <StackedWorks />
    </main>
  )
}
