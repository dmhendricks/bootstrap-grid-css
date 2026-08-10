import autoprefixer from 'autoprefixer'
import rtlcss from 'rtlcss'
import cssnano from 'cssnano'

/**
 * One config, switched by NODE_ENV, mirroring how Bootstrap builds its own CSS:
 *
 *   (unset)  prefix + strip the dead :root block
 *   RTL      generate the right-to-left variant
 *   MIN      minify
 *
 * See package.json's css:* scripts.
 */

const mode = process.env.NODE_ENV

/**
 * Remove `.bootstrap-wrapper :root { ... }`.
 *
 * Bootstrap declares its `--bs-breakpoint-*` custom properties on `:root`. Nested
 * beneath the wrapper that becomes a descendant selector, and `:root` is always
 * the <html> element, so the rule can never match: it is dead weight in every
 * shipped file and confusing to anyone reading the output.
 *
 * bootstrap-grid.scss re-declares those properties on the wrapper itself, so
 * dropping this block loses nothing.
 */
const removeNestedRoot = {
  postcssPlugin: 'remove-nested-root',
  Rule(rule) {
    if (/:root\b/.test(rule.selector) && rule.selector.includes('bootstrap-wrapper')) {
      rule.remove()
    }
  }
}

const plugins = []

if (mode === 'RTL') {
  plugins.push(rtlcss)
} else if (mode === 'MIN') {
  plugins.push(cssnano({ preset: ['default', { discardComments: { removeAll: false } }] }))
} else {
  plugins.push(autoprefixer, removeNestedRoot)
}

export default { plugins }
