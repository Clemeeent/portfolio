# What I need from you

Everything on this site is content-shaped: the code is done long before the site
is. This is the list of what to write and gather, in priority order, mapped to
the exact fields in `src/data/works.js`.

The guidance is grounded in Nielsen Norman Group's portfolio research — they
surveyed 200+ hiring managers who hire for UX roles. Sources at the bottom.

---

## The one-line summary

> "Show me how you started with an opportunity and produced real value for a
> user and the organization." — a hiring manager, quoted by NN/g

Every case study needs to answer four questions in order: **what was broken,
what you did, what you decided and why, what changed.** Most portfolios answer
the second and skip the fourth. The fourth is the one that gets you hired.

---

## Priority 1 — do this first, it unblocks everything

### Pick which projects make the cut

NN/g name "including every project you have ever worked on" as a top portfolio
mistake. Five is a good number and you already have five. The question is
whether these five are the *right* five.

For each, ask: **does this show something the others don't?** Right now three of
the five are Maze projects. That's fine if each shows a different muscle
(0→1 vs. platform vs. IA), but it's worth being deliberate about.

- [ ] Confirm the five, or swap one out
- [ ] For each, write one sentence: "this one is here to show that I can ___"

### Write the excerpts (`excerpt`)

The 1–2 sentences visible on the homepage card. These are already drafted — I
wrote placeholders from the titles. **They're guesses and they read like
marketing.** Replace them with the real story in your words.

A good excerpt states the problem, not the solution: "Mobile was half the
traffic our customers cared about and none of the traffic we could test" beats
"a seamless cross-device testing experience."

- [ ] Five excerpts, 25–40 words each

---

## Priority 2 — the case studies (`body`)

Each `body` is an array of typed blocks. Every block type is documented at the
top of `works.js`. Here's what to put in them, per project.

### The problem — `lead` + `text` + `list`

- What was actually broken, in the user's words rather than the company's
- The evidence you had at the start: support tickets, churn interviews, session
  recordings, analytics. NN/g are explicit that hiring managers want to see how
  research informed the design, not just that research happened
- The constraints: timeline, tech, legal, org politics. Constraints are named
  specifically as something hiring managers look for — they show judgment

### Your role — `text`

Non-negotiable, and the most commonly missed. Hiring managers need to know what
*you* did versus what the team did.

- Your specific role, and who else was involved
- What you personally decided, drew, tested, shipped
- If you led, say what leading meant here

### The messy middle — `figure` blocks

The strongest signal in the whole NN/g dataset. Hiring managers want "the messy
process and all the work and research that was put in to land on that shiny
polished design." They explicitly want:

- Early sketches, whiteboard photos, sticky-note walls
- Research documentation and notes
- Candidate solutions you **rejected**, and why
- What changed from iteration to iteration

**This is the part people skip and it is the part that gets read.** A blurry
whiteboard photo is worth more here than another polished mockup.

### The outcome — `stats` + `text`

- What shipped
- What moved: adoption, completion rate, time to insight, support load, revenue
- If you don't have numbers, say what you do have — qualitative change, a
  decision it unblocked, what the team does differently now. An honest "we
  never instrumented this" beats an invented percentage
- What you'd do differently

---

## Priority 3 — images

Every image slot currently falls back to a generated gradient, so nothing looks
broken while these are missing. Drop files in `public/` and set the path.

| Field | Where it shows | Suggested size |
| --- | --- | --- |
| `cover` on a work | homepage card preview + case-study hero | 1600×1000, JPG |
| `src` on a `figure` block | inside the case study | 1600×1000, JPG |

Notes:

- Screenshots need cropping to a consistent aspect or the case studies will
  look ragged. 16:10 is what the layout expects
- Every `figure` takes a `caption`. Write it as a sentence that says what the
  reader is looking at and why it matters, not "Fig. 3"
- Anything under NDA: blur it, redact numbers, or redraw the flow abstractly.
  Say in the text that you've done so — that reads as professional, not evasive

---

## Priority 4 — the things around the work

- [ ] **Contact.** There's currently no email anywhere on the site. The footer
      exists (`SiteFooter.jsx`) but isn't on the homepage
- [ ] **Social / CV links.** The footer has placeholder `#` hrefs
- [ ] **`role`** per project — one line, shows in the case-study sidebar
- [ ] **`tags`** per project — currently my guesses, make them yours
- [ ] **An about page?** Not built. Worth deciding whether you want one

---

## Two things worth knowing before you write

**Your first reader may not be a designer.** NN/g flag this as a common mistake:
people write to impress other designers, but the first screen is often a
recruiter or hiring manager. Spell out the acronyms. Say what the product does
before you say what you changed about it.

**Proofread.** NN/g list spelling and grammar mistakes as something that
actively derails candidacy. This site is in French-and-English hands — worth a
second pair of eyes on the English copy.

---

## Suggested order of attack

1. The five excerpts — an hour, and the homepage stops looking like a demo
2. One case study end to end — pick your strongest, prove the format works
3. Images for that one project
4. Repeat for the other four
5. Contact details and links

Doing one project completely beats doing five projects halfway. A portfolio with
one real case study and four "coming soon" reads better than five thin ones.

---

## Sources

- [5 Steps to Creating a UX-Design Portfolio](https://www.nngroup.com/articles/ux-design-portfolios/) — NN/g
- [UX Portfolios: What Hiring Managers Look For](https://www.nngroup.com/videos/ux-portfolios-hiring/) — NN/g, survey of 200+ hiring managers
- [Creating a UX Design Portfolio Case Study](https://www.nngroup.com/videos/ux-design-portfolio-case-study/) — NN/g
- [7 Portfolio Mistakes That Could Hurt Your UX Job Search](https://www.nngroup.com/videos/7-portfolio-mistakes/) — NN/g
- [How to Maintain a UX Portfolio Over Time](https://www.nngroup.com/articles/maintain-ux-portfolio/) — NN/g
