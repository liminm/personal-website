# liminm — personal website

Limin M. · Python · AI Engineering · Full-Stack (TS) · GitHub Pages (liminm.eu future).

Built with **Vite + TypeScript + p5.js** (dark editorial, single visual system).

## Quick start
```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # -> dist/
npm run preview
```

## Structure
- `index.html` — single-page (hero + about) over fullscreen visual field
- `src/main.ts` — canvas lifecycle (seeded, DPR 1.5, IntersectionObserver)
- `src/sketches/flow-field.ts` — layered ribbons system
- `src/style.css` — tokens (`--bg #101112`, `--fg #f2efe8`, `--accent #d7f65b`), Space Grotesk + IBM Plex Mono
- `public/favicon.svg`, `404.html`

## Deploy
Push to `main` → `.github/workflows/deploy.yml` → GitHub Pages. Deploys to `*.github.io/personal-website/` — add `CNAME=liminm.eu` + A records `185.199.108-111.153` later to cut over domain. HTTPS via Pages.

## Accessibility
- `prefers-reduced-motion: reduce` → static frame
- `focus-visible` outlines, keyboard nav
- Canvas is `aria-hidden`, content remains readable without it
