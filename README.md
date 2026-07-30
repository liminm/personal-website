# liminm — personal website

Limin M. · Python · AI Engineering · Full-Stack (TS) · GitHub Pages (liminm.eu future).

Built with **Vite + TypeScript + p5.js**.

## Quick start
```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # -> dist/
npm run preview
```

## Structure
- `index.html` — hero + about
- `src/main.ts` — canvas wiring
- `src/sketches/flow-field.ts` — p5 instance-mode module
- `src/style.css` — tokens (`--bg #faf9f6`, `--fg #0a0a0b`, `--accent #e0ff5a`), responsive, `prefers-reduced-motion` safe
- `public/favicon.svg`, `404.html`

## Deploy
Push to `main` → `.github/workflows/deploy.yml` → GitHub Pages. Deploys to `*.github.io/personal-website/` — add `CNAME=liminm.eu` + A records `185.199.108-111.153` later to cut over domain. HTTPS via Pages.

## Accessibility
- `prefers-reduced-motion: reduce` disables canvas
- `focus-visible` outlines
- Canvas is `aria-hidden`, content remains readable without it
