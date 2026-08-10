/*
 * The grid stylesheet, as a module import.
 *
 * The coexistence pages load it this way rather than with `<style>@import>` so Vite
 * emits ONE shared, hashed stylesheet that browsers cache across pages. Inlining it
 * per page instead cost ~90KB of duplicated CSS in every HTML file.
 *
 * `../../dist/css` sits outside Vite's root (`demo/`), which is why
 * vite.config.demo.mjs grants `server.fs.allow` for the repo root.
 */
import '../../dist/css/bootstrap-grid.css'
