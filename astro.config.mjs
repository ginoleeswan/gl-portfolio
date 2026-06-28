// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import vercel from '@astrojs/vercel';

import mdx from '@astrojs/mdx';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: "https://gl-portfolio.vercel.app",
  integrations: [react(), mdx(), sitemap(), icon()],
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()]
  }
});