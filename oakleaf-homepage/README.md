# Oakleaf Partnership — homepage redesign

A static, dependency-free rebuild of the Oakleaf Partnership homepage. Editorial,
mobile-first design taking typographic direction from OPUS while keeping Oakleaf's
brand identity (the Oakleaf green `#69BC90`, used selectively).

## Stack

No framework, no build step. Semantic HTML5, modern CSS (custom properties,
`clamp()` fluid type, CSS grid), and ~100 lines of vanilla JS. Open `index.html`
directly or serve the folder with any static server:

```sh
python3 -m http.server 8000 --directory oakleaf-homepage
```

## Structure

```
oakleaf-homepage/
├── index.html        # single homepage document, JSON-LD structured data inline
├── css/styles.css    # design tokens (:root) + components + breakpoints
└── js/main.js        # header state, mobile menu, scroll reveals, carousel
```

## Design system

All tokens live in `:root` at the top of `styles.css`:

- **Colour** — off-white background (`--bg`), deep green-charcoal ink/panels
  (`--ink #14201A`), brand green (`--green #69BC90`, decorative and on dark),
  accessible green for text on light (`--green-ink #2E6B4E`), hairlines (`--line`).
- **Type** — Inter Tight (300–600) for everything; Fraunces italic only for the
  hero accent and testimonial quotes. Fluid sizes via `clamp()`.
- **Spacing** — `--space-1`…`--space-6` scale plus fluid `--space-section`.
- **Breakpoints** — mobile-first; tablet at `48em`, desktop at `64em`.

## Accessibility

- Landmarks, skip link, single `h1`, ordered heading hierarchy.
- Visible `:focus-visible` styles on light and dark surfaces.
- Mobile menu: `aria-expanded`, Escape to close, body scroll lock.
- Carousel: button-driven (no autoplay), `aria-live="polite"` viewport.
- All motion gated behind `prefers-reduced-motion`; content is fully visible
  and functional with JavaScript disabled.

## Notes for handover

- Internal links point at the real site's URL structure (`/jobs/`, `/our-people/`…).
- Insight items are hard-coded with real article titles; wire to the CMS feed
  by reproducing the `.insight` list-item markup.
- No images are used (typographic design + inline SVG mark), so there is nothing
  to optimise; if photography is added later, use `loading="lazy"`, `srcset`
  and meaningful `alt` text.
