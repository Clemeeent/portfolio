import { useCallback, useEffect, useState } from 'react'

/* ---------------------------------------------------------------------------
   TYPE VARIANTS — three proposals for how the two families divide the page.

   The layout is identical in all three. What changes is which text is set in
   the serif and which in the sans, which is the whole question of whether the
   page reads as one voice or two.

   Applied as `data-type` on <html>; the rules live in index.css.
   Switch bottom-right, or by URL: /?type=editorial

   To ship one: set DEFAULT below, delete TypeSwitcher.jsx and its use in
   StackedWorks, and drop the variants you don't want.
--------------------------------------------------------------------------- */

export const TYPE_VARIANTS = {
  contrast: {
    label: 'Contrast',
    note: 'Serif sentence, sans list. Two voices, deliberately — the intro speaks, the list catalogues.',
  },
  editorial: {
    label: 'Editorial',
    note: 'Serif throughout, including the list titles. One voice; the most consistent of the three.',
  },
  grotesk: {
    label: 'Grotesk',
    note: 'No serif at all. The chips carry the emphasis on their own.',
  },
}

const DEFAULT = 'contrast'
const KEY = 'portfolio:type'
const isValid = (v) => Object.prototype.hasOwnProperty.call(TYPE_VARIANTS, v)

function readInitial() {
  if (typeof window === 'undefined') return DEFAULT
  const fromUrl = new URLSearchParams(window.location.search).get('type')
  if (isValid(fromUrl)) return fromUrl
  try {
    const stored = localStorage.getItem(KEY)
    if (isValid(stored)) return stored
  } catch {
    /* private mode */
  }
  return DEFAULT
}

/** Current type variant, plus a setter that persists it and reflects it in the URL. */
export function useTypeVariant() {
  const [variant, setVariant] = useState(readInitial)

  // Set on <html> rather than threaded through props, so the case-study pages
  // pick it up too without every component needing to know about it.
  useEffect(() => {
    document.documentElement.dataset.type = variant
  }, [variant])

  const choose = useCallback((next) => {
    if (!isValid(next)) return
    setVariant(next)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* ignore */
    }
    const url = new URL(window.location.href)
    url.searchParams.set('type', next)
    window.history.replaceState({}, '', url)
  }, [])

  return [variant, choose]
}
