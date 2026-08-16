/* ---------------------------------------------------------------------------
   SELECTED WORKS — single source of truth.

   Every card on the homepage, every `/work/[slug]` route and the "next project"
   link at the bottom of a case study are generated from this array. Reorder it
   and the scroll reveal reorders with it (cards open top-to-bottom, in array
   order).

   Field reference
   ---------------
   year      string   shown muted on the left of the row
   title     string   near-black, the headline of the row
   client    string   shown muted to the right of the title
   slug      string   URL segment → /work/<slug>. Must be unique.
   illustration string name of a graphic in src/components/Illustration.jsx —
                      access-anywhere, any-device, goal-vs-free, distribution,
                      ellipsis-ladder. Used for the card preview and the
                      case-study hero whenever `cover` is null.
   excerpt   string   1–2 sentences, only visible in the expanded card state
   tags      string[] small meta chips in the expanded card + case study header
   role      string   your role, case-study header only
   accent    [from,to] two CSS colors used for the placeholder preview gradient
   cover     string?  path to a real image (e.g. '/covers/maze-anywhere.jpg').
                      When null, the accent gradient placeholder is used.
   body      Block[]  full case study. Stubbed for now — see block types below.

   Body block types
   ----------------
   { type: 'lead',    text }              large intro paragraph
   { type: 'heading', text }              section heading
   { type: 'text',    text }              body paragraph
   { type: 'list',    items: string[] }   bulleted list
   { type: 'quote',   text, cite }        pull quote
   { type: 'figure',  caption, src? }     image slot; falls back to a gradient
   { type: 'stats',   items: [{value,label}] }  results row
--------------------------------------------------------------------------- */

export const works = [
  {
    year: '2026',
    title: 'Making research accessible from anywhere',
    client: 'Maze',
    slug: 'research-from-anywhere',
    illustration: 'access-anywhere',
    excerpt:
      'Research insights were locked inside a desktop tool only researchers opened. I rebuilt the surface so any teammate could reach a study, a clip or a finding from wherever they already work.',
    tags: ['Product design', 'Design system', '0 → 1'],
    role: 'Lead product designer',
    accent: ['#e8e4ff', '#c9bdf5'],
    cover: null,
    body: [
      {
        type: 'lead',
        text: 'Placeholder lead paragraph. Set the scene in two or three sentences: what the product was, who it served, and why this project existed.',
      },
      { type: 'heading', text: 'The problem' },
      {
        type: 'text',
        text: 'Stub copy. Describe the pain in the user’s words, not the company’s. Add the evidence you had at the start — support tickets, churn interviews, session recordings.',
      },
      {
        type: 'list',
        items: [
          'Symptom one — replace with a real observation.',
          'Symptom two — replace with a real observation.',
          'Symptom three — replace with a real observation.',
        ],
      },
      { type: 'figure', caption: 'Before: the original flow, annotated.' },
      { type: 'heading', text: 'Approach' },
      {
        type: 'text',
        text: 'Stub copy. Walk through the shape of the solution and the two or three decisions that mattered most. Keep the detours in — they are the interesting part.',
      },
      {
        type: 'quote',
        text: '“Placeholder quote from a user, a stakeholder or a teammate.”',
        cite: 'Research participant',
      },
      { type: 'figure', caption: 'After: the shipped experience.' },
      { type: 'heading', text: 'Outcome' },
      {
        type: 'stats',
        items: [
          { value: '—', label: 'Adoption' },
          { value: '—', label: 'Time to insight' },
          { value: '—', label: 'Weekly active teams' },
        ],
      },
      {
        type: 'text',
        text: 'Stub copy. Close with what shipped, what moved, and what you would do differently.',
      },
    ],
  },
  {
    year: '2025',
    title: 'Enabling user testing on any device',
    client: 'Maze',
    slug: 'testing-on-any-device',
    illustration: 'any-device',
    excerpt:
      'Mobile was half the traffic our customers cared about and none of the traffic we could test. This is how a desktop-only testing engine learned to run on phones and tablets.',
    tags: ['Product design', 'Mobile', 'Research ops'],
    role: 'Product designer',
    accent: ['#dcecff', '#b5d3f7'],
    cover: null,
    body: [
      {
        type: 'lead',
        text: 'Placeholder lead paragraph — the one-breath summary of the project.',
      },
      { type: 'heading', text: 'Context' },
      {
        type: 'text',
        text: 'Stub copy. What existed before, and what constraint forced the work.',
      },
      { type: 'figure', caption: 'Device matrix explorations.' },
      { type: 'heading', text: 'Design decisions' },
      {
        type: 'list',
        items: [
          'Decision one and the trade-off it carried.',
          'Decision two and the trade-off it carried.',
        ],
      },
      { type: 'figure', caption: 'The shipped mobile tester.' },
      { type: 'heading', text: 'Outcome' },
      {
        type: 'stats',
        items: [
          { value: '—', label: 'Mobile studies' },
          { value: '—', label: 'Completion rate' },
          { value: '—', label: 'Support load' },
        ],
      },
    ],
  },
  {
    year: '2024',
    title: 'Goal-based and Free explore usability testing',
    client: 'Maze',
    slug: 'goal-based-free-explore',
    illustration: 'goal-vs-free',
    excerpt:
      'Two new test types that let researchers choose between a measured path and an open one — without forcing them to learn two different products.',
    tags: ['Product design', 'Information architecture'],
    role: 'Product designer',
    accent: ['#e2f3e6', '#b9dfc4'],
    cover: null,
    body: [
      { type: 'lead', text: 'Placeholder lead paragraph.' },
      { type: 'heading', text: 'The problem' },
      {
        type: 'text',
        text: 'Stub copy. Why one test type was not enough, and what broke when people improvised around it.',
      },
      { type: 'figure', caption: 'Concept models for the two modes.' },
      { type: 'heading', text: 'Approach' },
      {
        type: 'text',
        text: 'Stub copy. How the two modes were unified behind one setup flow.',
      },
      { type: 'figure', caption: 'Final interface.' },
      { type: 'heading', text: 'Outcome' },
      { type: 'text', text: 'Stub copy. Results and learnings.' },
    ],
  },
  {
    year: '2020',
    title: 'Distributing public funds across UE',
    client: 'Octave Octave',
    slug: 'public-funds-ue',
    illustration: 'distribution',
    excerpt:
      'A distribution platform for European public funding, designed for civil servants who audit every step and applicants who had never seen a grant form before.',
    tags: ['Service design', 'Complex forms', 'Accessibility'],
    role: 'Product designer',
    accent: ['#fdeadf', '#f6c9ac'],
    cover: null,
    body: [
      { type: 'lead', text: 'Placeholder lead paragraph.' },
      { type: 'heading', text: 'Context' },
      {
        type: 'text',
        text: 'Stub copy. The institutional constraints and who the two audiences were.',
      },
      { type: 'figure', caption: 'Service blueprint.' },
      { type: 'heading', text: 'Approach' },
      {
        type: 'list',
        items: [
          'Constraint one — regulatory or accessibility requirement.',
          'Constraint two — legacy system integration.',
        ],
      },
      { type: 'figure', caption: 'Application flow, end to end.' },
      { type: 'heading', text: 'Outcome' },
      { type: 'text', text: 'Stub copy. What shipped and what it changed.' },
    ],
  },
  {
    year: '2019',
    title: 'Celebrating 70 years of INRA',
    client: 'Werkstatt',
    slug: 'inra-70-years',
    illustration: 'ellipsis-ladder',
    excerpt:
      'An anniversary microsite turning seven decades of agricultural research into a timeline people actually scrolled to the end of.',
    tags: ['Art direction', 'Editorial', 'Motion'],
    role: 'Designer',
    accent: ['#efe7dc', '#d7c3a6'],
    cover: null,
    body: [
      { type: 'lead', text: 'Placeholder lead paragraph.' },
      { type: 'heading', text: 'Brief' },
      {
        type: 'text',
        text: 'Stub copy. The commission, the audience and the deadline.',
      },
      { type: 'figure', caption: 'Art direction boards.' },
      { type: 'heading', text: 'Execution' },
      {
        type: 'text',
        text: 'Stub copy. The timeline mechanic and how the archive material was handled.',
      },
      { type: 'figure', caption: 'Launched microsite.' },
      { type: 'heading', text: 'Outcome' },
      { type: 'text', text: 'Stub copy. Reach and reception.' },
    ],
  },
]

/** Look up a single case study by its URL slug. */
export const getWorkBySlug = (slug) => works.find((w) => w.slug === slug)

/** The work that follows `slug` in the array — wraps around to the first. */
export const getNextWork = (slug) => {
  const i = works.findIndex((w) => w.slug === slug)
  if (i === -1) return null
  return works[(i + 1) % works.length]
}
