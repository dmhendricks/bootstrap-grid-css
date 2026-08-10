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
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('./demo/index.html', import.meta.url)),
        tailwind: fileURLToPath(new URL('./demo/tailwind.html', import.meta.url)),
        bulma: fileURLToPath(new URL('./demo/bulma.html', import.meta.url))
      }
    }
  },
  server: {
    // Allow importing the built CSS from ../dist/css, which sits outside `root`.
    fs: { allow: [fileURLToPath(new URL('.', import.meta.url))] }
  }
})
