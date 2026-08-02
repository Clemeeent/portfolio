import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import CaseStudy from './pages/CaseStudy'
import NotFound from './pages/NotFound'

/**
 * Reset scroll on navigation. Without this, opening a case study from a card
 * two-thirds down the pinned works section lands you two-thirds down the case
 * study.
 */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // 'instant' — a smooth scroll here would race the route transition.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
