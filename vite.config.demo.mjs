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
    sourcemap: true,
    // Vite builds only index.html unless told otherwise, so the coexistence pages
    // must be listed explicitly or they silently vanish from the deployed site.
    //
    // Those pages are deliberately unlinked — nothing in the readme or the demo points
    // at them, because listing frameworks alongside this package reads as a suggestion
    // to combine them. They exist as a scoping regression check: each one verifies in
    // the browser that the grid stays inside .bootstrap-wrapper while another
    // framework's stylesheet is live on the same page.
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('./demo/index.html', import.meta.url)),
        tailwind: fileURLToPath(new URL('./demo/examples/tailwind.html', import.meta.url)),
        bulma: fileURLToPath(new URL('./demo/examples/bulma.html', import.meta.url))
      }
    }
  },
  server: {
    // Allow importing the built CSS from ../dist/css, which sits outside `root`.
    fs: { allow: [fileURLToPath(new URL('.', import.meta.url))] }
  }
})
