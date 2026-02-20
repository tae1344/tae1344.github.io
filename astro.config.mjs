// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import rehypeFigureFromImage from './src/plugins/rehype-figure-from-image.mjs';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
  site: 'https://tae1344.github.io',
  integrations: [react(), sitemap(), partytown(), mdx(), mermaid({autoTheme: true})],
  markdown: {
    rehypePlugins: [rehypeFigureFromImage],
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['math'],
    },
  },
  

  vite: {
    plugins: [tailwindcss()]
  }
});