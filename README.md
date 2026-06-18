# liminm — generative dev portfolio

Limin M. · Python · AI Engineering · Full-Stack (TS) · liminm.eu (future) / GitHub Pages for now.

Generative system built with **Vite + TypeScript + p5.js (instance mode)**. Every visit is a deterministic seed (`?seed=YYYY-MM-DD`). Hero is a flow-field with subtle mouse repulsion, gallery holds three live sketches — all DPR-capped and paused via `IntersectionObserver`.

## Quick start
```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # -> dist/
npm run preview
```

## Structure
- `index.html` — hero + work + sketches + about
- `src/main.ts` — seed hash, hero wiring, gallery thumbnails
- `src/sketches/{flow-field,particles,grid}.ts` — instance-mode p5 modules
- `src/style.css` — tokens (`--bg #faf9f6`, `--fg #0a0a0b`, `--accent #e0ff5a`), responsive, `prefers-reduced-motion` safe
- `public/favicon.svg`, `404.html`

## Seeds
Deterministic hash from URL `?seed=` or current date. Click seed to copy shareable URL. `r` to regenerate, `s` to save PNG.

## Deploy
Push to `main` → `.github/workflows/deploy.yml` → GitHub Pages. Currently deploys to `*.github.io/personal-website/` — add `CNAME=liminm.eu` + A records `185.199.108-111.153` later to cut over domain. HTTPS via Pages.

## Accessibility
- `prefers-reduced-motion: reduce` disables canvas
- `focus-visible` outlines, `aria-label` on controls
- Canvas is `aria-hidden`, content remains readable without it

## History note
Work was developed iteratively spring→summer 2026 as a cohesive generative system (see git log). Live site will continue with real-time commits post-launch.
