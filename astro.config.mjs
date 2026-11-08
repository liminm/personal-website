import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Canonical domain (cutover from GitHub Pages project path is future work).
// Project-pages deployment serves here: liminm.github.io/personal-website/.
// When cutting over to liminm.eu (root domain), flip base back to '/'
// and deploy from the liminm.github.io repo instead. Do NOT push a
// subpath-based build to the root remote — its absolute paths would 404.
export default defineConfig({
  site: 'https://liminm.eu',
  base: '/personal-website/',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});
