# liminm — personal website

Generative dev portfolio for Limin M. — Python · AI Engineering · Full-Stack (TS). Built with Vite + TypeScript + p5.js. Each visit is a seeded generative sketch.

## Stack
- Vite + TypeScript
- p5.js (instance mode, seeded, DPR-capped)
- Vanilla CSS (tokens, responsive, prefers-reduced-motion)

## Develop
```bash
npm install
npm run dev
npm run build
```

## Deploy
Push to `main` → GitHub Actions → GitHub Pages. No `liminm.eu` DNS yet; deploys to `*.github.io/personal-website/`. Add `CNAME` + A records later to cut over.

## Generative system
Seed from `?seed=YYYY-MM-DD` or date hash. `src/main.ts` flow-field is the hero system; sketches in `src/sketches/`.
