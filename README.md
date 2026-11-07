# liminm — personal website

Limin Malek · Software Engineer, Berlin. Backend systems, optimization, production software. Interested in distributed systems, AI infrastructure, agent architectures, and performance engineering.

Built with **Astro + TypeScript + MDX + Tailwind CSS** (static-first, minimal client JS).

## Quick start
```bash
npm install
npm run dev     # http://localhost:4321
npm run check   # astro check (types)
npm run build   # -> dist/
npm run preview
```

## Structure
- `src/pages/` — Home, Work, Notes, About, 404, `rss.xml.ts`
- `src/layouts/Base.astro` — head/meta, theme init, header nav, footer
- `src/content/work/` — anonymized work summaries (MDX)
- `src/content/notes/` — technical notebook (empty until first real note)
- `src/content.config.ts` — collection schemas (zod, validated at build)
- `src/site.ts` — name, links, nav. LinkedIn/email stay `null` until provided; footer renders only set links
- `src/styles/global.css` — Tailwind v4 theme, article typography, Shiki dual-theme code blocks

## Adding a note
Create `src/content/notes/<slug>.mdx`:
```mdx
---
title: '…'
description: '…'
date: 2026-11-07
tags: ['durable-execution']
---
```
Drafts: `draft: true` excludes the entry everywhere including RSS.

## Deploy
Push to `main` → `.github/workflows/deploy.yml` → GitHub Pages. Canonical URL is `https://liminm.eu` (sitemap/RSS/OG); DNS cutover is future work.

## Notes
- No invented content: the notes collection is intentionally empty; the work entry is an anonymized summary marked as such.
- `astro check` currently cannot resolve the generated content-collection registry in this setup (see `src/content-types.ts`); schemas are still validated by `astro build`. Revisit if Astro fixes the type visibility.
