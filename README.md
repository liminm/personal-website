# liminm — personal website

Limin M. · Dependable AI systems · Generative computation.

Built with **Vite + TypeScript + vanilla Canvas 2D** (pale editorial, unframed generative study).

## Quick start
```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # -> dist/
npm run preview
```

## Structure
- `index.html` — intro + generative study, about, contact
- `src/main.ts` — canvas lifecycle (seeded, fixed logical space, DPR cap, reduced-motion still)
- `src/growth.ts` — woven flow-field: strands over tension points, graphite + cobalt tension accents
- `src/style.css` — tokens (`--bg #f3f4f2`, `--ink #1e2126`, `--accent #2347ff`), Space Grotesk + IBM Plex Mono
- `public/favicon.svg`, `404.html`
- `?seed=your-word` reproduces a composition at the same viewport shape

## Deploy
Push to `main` → `.github/workflows/deploy.yml` → GitHub Pages. No CNAME yet; `liminm.eu` cutover is future work.

## Accessibility
- `prefers-reduced-motion: reduce` → finished still frame, including runtime changes
- Skip link, semantic landmarks, visible focus outlines
- Canvas is `aria-hidden` with a labelled figure; content reads fully without JavaScript
