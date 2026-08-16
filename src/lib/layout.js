import { useCallback, useEffect, useState } from 'react'

/* ---------------------------------------------------------------------------
   LAYOUT VARIANTS — four looks for the same deck mechanic.

   The scroll interaction is identical in all of them. What changes is the
   typography and how a project's client is treated, which is where the
   homepage either agrees with the intro sentence or doesn't.

   Switch with the control bottom-right, or by URL: /?layout=editorial
   The choice is remembered in localStorage.

   To ship one and drop the switcher: set DEFAULT below, remove
   <LayoutSwitcher /> from StackedWorks, and delete the variants you don't want
   from LAYOUTS.
--------------------------------------------------------------------------- */

export const LAYOUTS = {
  deck: {
    label: 'Deck',
    note: 'Where we are now — sans titles, plain client, flush stack.',
    titleFont: 'sans',
    client: 'plain',
    stagger: 0,
    chipTone: 'soft',
  },
  folders: {
    label: 'Folders',
    note: 'Each card indented like a tab, so the stack reads as filed folders.',
    titleFont: 'sans',
    client: 'plain',
    stagger: 30, // px of extra indent per card down the stack
    chipTone: 'soft',
  },
  editorial: {
    label: 'Editorial',
    note: 'Serif titles and the client as a soft chip — matches the intro.',
    titleFont: 'serif',
    client: 'chip',
    stagger: 0,
    chipTone: 'soft',
  },
  gradient: {
    label: 'Gradient',
    note: 'Serif titles, client as a vivid gradient pill. The NN/G flavour.',
    titleFont: 'serif',
    client: 'gradient',
    stagger: 0,
    chipTone: 'gradient',
  },
}

const DEFAULT = 'deck'
const KEY = 'portfolio:layout'

const isValid = (v) => Object.prototype.hasOwnProperty.call(LAYOUTS, v)

function readInitial() {
  if (typeof window === 'undefined') return DEFAULT
  const fromUrl = new URLSearchParams(window.location.search).get('layout')
  if (isValid(fromUrl)) return fromUrl
  try {
    const stored = localStorage.getItem(KEY)
    if (isValid(stored)) return stored
  } catch {
    /* private mode — fall through to the default */
  }
  return DEFAULT
}

/**
 * Current layout variant, plus a setter that persists it and reflects it in
 * the URL so a given look can be linked or bookmarked.
 */
export function useLayoutVariant() {
  const [variant, setVariant] = useState(readInitial)

  // Keep the back/forward buttons working when the URL carries ?layout=.
  useEffect(() => {
    const onPop = () => setVariant(readInitial())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const choose = useCallback((next) => {
    if (!isValid(next)) return
    setVariant(next)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* ignore */
    }
    const url = new URL(window.location.href)
    url.searchParams.set('layout', next)
    window.history.replaceState({}, '', url)
  }, [])

  return [variant, choose, LAYOUTS[variant]]
}

/* Vivid gradients for the `gradient` variant, cycled by index. Chosen to sit
   on a warm off-white with black text over them, like the reference. */
export const GRADIENTS = [
  ['#b6a5f7', '#35c6a6'],
  ['#f3c451', '#5cc08b'],
  ['#f4756a', '#c07be0'],
  ['#9fb8f8', '#37c9c9'],
  ['#f7a6c9', '#f3c451'],
]

export const gradientFor = (i) => GRADIENTS[i % GRADIENTS.length]
