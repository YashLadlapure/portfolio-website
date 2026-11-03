import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset paths, so the built site works on GitHub Pages sub-paths too.
  base: './',
  build: {
    // Three.js (~650 kB, ~170 kB gzipped) is loaded lazily after the text paints.
    chunkSizeWarningLimit: 800,
  },
});
