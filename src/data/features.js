/* ---------------------------------------------------------------------------
   FULL-BLEED CONTENT BLOCKS — the large stacked sections below the works list.

   Each block fills most of the viewport width, has rounded corners, an image
   area (or an accent gradient placeholder) and a caption strip pinned to its
   bottom edge.

   eyebrow  string   small label, top-left of the block
   title    string   large headline inside the block
   caption  string   left side of the bottom strip
   meta     string   right side of the bottom strip
   accent   [from,to] gradient used when `image` is null
   image    string?  path to a real image, e.g. '/blocks/process.jpg'
   href     string?  optional link — internal path or external URL
--------------------------------------------------------------------------- */

export const features = [
  {
    eyebrow: 'Approach',
    title: 'Design that survives contact with engineering',
    caption: 'How I work — discovery, prototyping, shipping',
    meta: 'Process',
    accent: ['#e7e4ff', '#bfb4ef'],
    image: null,
    href: null,
  },
  {
    eyebrow: 'Craft',
    title: 'Systems, not screens',
    caption: 'Design systems, tokens and the handoff in between',
    meta: 'Systems',
    accent: ['#dfeeff', '#adcdf0'],
    image: null,
    href: null,
  },
  {
    eyebrow: 'Elsewhere',
    title: 'Writing, side projects and things in progress',
    caption: 'Notes on research tooling and interface craft',
    meta: 'Journal',
    accent: ['#e9ebe6', '#c4c9bd'],
    image: null,
    href: null,
  },
]
