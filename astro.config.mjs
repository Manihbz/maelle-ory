import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://maelleory.fr',
  build: { format: 'file', inlineStylesheets: 'always' },
  compressHTML: true,
});
