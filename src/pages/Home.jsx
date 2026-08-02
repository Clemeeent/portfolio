import Intro from '../components/Intro'
import StackedWorks from '../components/StackedWorks'
import FeatureBlocks from '../components/FeatureBlocks'
import SiteFooter from '../components/SiteFooter'

/**
 * Homepage composition, top to bottom:
 *   1. <Intro />        background layer — heading, bio (scrolls away)
 *   2. <StackedWorks /> pinned, scroll-driven stack of project cards
 *   3. <FeatureBlocks/> full-bleed content sections
 *   4. <SiteFooter />
 */
export default function Home() {
  return (
    <main>
      <Intro />
      <StackedWorks />
      <FeatureBlocks />
      <SiteFooter />
    </main>
  )
}
