import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

/**
 * Demo site build. The library itself is compiled by `npm run build`
 * (sass + postcss) — Vite only ever builds the demo.
 *
 * `base` must match the GitHub Pages project path:
 *   https://dmhendricks.github.io/bootstrap-grid-css/
 */
export default defineConfig({
  root: fileURLToPath(new URL('./demo', import.meta.url)),
  base: '/bootstrap-grid-css/',
  publicDir: false,
  build: {
    outDir: fileURLToPath(new URL('./dist-demo', import.meta.url)),
    emptyOutDir: true,
    sourcemap: true
  },
  server: {
    // Allow importing the built CSS from ../dist/css, which sits outside `root`.
    fs: { allow: [fileURLToPath(new URL('.', import.meta.url))] }
  }
})
