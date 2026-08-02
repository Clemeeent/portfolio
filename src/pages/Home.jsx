import Intro from '../components/Intro'
import StackedWorks from '../components/StackedWorks'

/**
 * Homepage composition, top to bottom:
 *   1. <Intro />        background layer — heading, bio (scrolls away)
 *   2. <StackedWorks /> pinned, scroll-driven stack of project cards
 *
 * The page ends with the works list. <FeatureBlocks /> and <SiteFooter /> still
 * exist in the repo — re-import either one here to bring it back.
 */
export default function Home() {
  return (
    <main>
      <Intro />
      <StackedWorks />
    </main>
  )
}
