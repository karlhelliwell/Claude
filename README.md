# Oakleaf Group — Capabilities microsite

An interactive, one-page digital evolution of the Oakleaf Group Capabilities
document. Premium, editorial, mobile-first — built to feel like a boutique
consultancy microsite rather than a brochure PDF, while keeping Oakleaf's
brand palette, messaging and credibility intact.

## Stack

No framework, no build step. Semantic HTML5, modern CSS (custom properties,
`clamp()` fluid type, CSS grid, scroll-driven reveals) and ~280 lines of
vanilla JS. Serve the repo root with any static server:

```sh
python3 -m http.server 8742
```

Live at **cap.oakleafpartnership.com** (Vercel, auto-deploys from `main`),
with a mirror at karlhelliwell.github.io/Claude (GitHub Pages).

## Structure

```
├── index.html        # one-page site, JSON-LD structured data inline
├── css/styles.css    # design tokens (:root) + components + breakpoints
├── js/main.js        # nav, scrollspy, counters, parallax, carousel, filters
├── assets/           # imagery extracted from the source Capabilities PDF
│   ├── logos/        # 34 client logo tiles (sliced from the PDF logo wall)
│   ├── people/       # testimonial portraits + organisation logos
│   └── community/    # community tiles (Academy, podcast, ProudHR, WOI…)
└── oakleaf-homepage/ # earlier homepage redesign project (separate)
```

## Design system

Palette sampled directly from the Capabilities document:

- **Greens** — Oakleaf green `#69bc90`, accessible text green `#2e6b4e`,
  mint `#a1fed0`
- **Teals/blues** — bright teal `#26b2df`, petrol `#166484`, navy ink
  `#0e3a52`, blue `#1e72c6`, sky `#48bafe`
- **Type** — DM Sans (200 display titles, 300 stat numerals, 500 component
  headings) + Inter Tight (300 body), fluid sizes via `clamp()`

## Sections

Hero (split diagonal, parallax) → About (Founded 2005) → What We Do
(expandable capability cards) → People & Approach (dark, network motif) →
Data 2025 (animated counters) → Market Intelligence (dashboard module) →
Completed Assignments (segmented bar) → Retained Search (98% proof point) →
Global Reach (arc map + region bars) → Community (hover tiles) → Client wall
(sector filtering) → Testimonials (swipeable carousel) → Contact (split CTA
with a follow-up request form: name, email, phone, industry sector).

The form posts via FormSubmit (`formsubmit.co`) to karlhelliwell@oakleaf.group
— the first real submission triggers a one-time activation email to that
address which must be confirmed before messages are forwarded. If the request
fails (offline, blocked), the form falls back to opening the visitor's email
client with a prefilled message to the same address.

## Accessibility & performance

- Landmarks, skip link, single `h1`, aria labels on all controls,
  keyboard-operable carousel and capability cards, `:focus-visible` styles
- `prefers-reduced-motion` disables parallax, counters and reveals
- Lazy-loaded imagery below the fold; hero image `fetchpriority="high"`
- All data points and quotes are taken verbatim from the source document

## Content fidelity

All statistics (347/37/16/26%, 47/30/23, 586/1,108/8,427, 98%,
62.9/32.6/4.5, 70k+/412k+), quotes, names and titles are from the
"Master — Oakleaf Group Cap" PDF. Nothing is invented.
