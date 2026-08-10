/**
 * Fail the build if any rule in the shipped CSS is not scoped beneath the
 * wrapper class.
 *
 * This is the highest-value check in the project: scoping is the only reason
 * this package exists rather than using Bootstrap's official grid-only build.
 * A stylesheet that silently leaked its selectors globally would still look
 * correct in a browser and pass every layout test, so the failure mode this
 * catches is both severe and invisible.
 *
 *   node scripts/check-scope.ts [...cssFiles]
 *
 * Defaults to every .css file in dist/css.
 */

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const WRAPPER = '.bootstrap-wrapper'
const DIST = 'dist/css'

/** At-rules whose children are scoped by their own nested rules, not the at-rule. */
const TRANSPARENT_AT_RULES = /^@(media|supports|layer|container)\b/

interface Offender {
  file: string
  selector: string
}

/**
 * Selectors in `css` that are not scoped beneath the wrapper.
 *
 * Deliberately a hand-rolled scan rather than a PostCSS dependency: this runs on
 * generated, predictable output, and a check that guards the build should not
 * itself depend on the plugin ecosystem it is verifying.
 */
export function findUnscopedSelectors(css: string): string[] {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const offenders: string[] = []

  // Walk top-level blocks, descending through media-style at-rules.
  const scan = (source: string) => {
    let depth = 0
    let prelude = ''
    let blockStart = -1

    for (let i = 0; i < source.length; i += 1) {
      const char = source[i]

      if (char === '{') {
        depth += 1
        if (depth === 1) blockStart = i
        continue
      }

      if (char === '}') {
        depth -= 1
        if (depth === 0) {
          const selector = prelude.trim()
          const body = source.slice(blockStart + 1, i)

          if (selector.startsWith('@')) {
            // Descend into media/supports; ignore @charset, @keyframes, @font-face.
            if (TRANSPARENT_AT_RULES.test(selector)) scan(body)
          } else if (selector && !selector.split(',').every(isScoped)) {
            offenders.push(selector.replace(/\s+/g, ' '))
          }

          prelude = ''
        }
        continue
      }

      // Only text outside any block contributes to the next selector.
      if (depth === 0) prelude += char
    }
  }

  const isScoped = (selector: string) => selector.trim().startsWith(WRAPPER)

  scan(withoutComments)
  return offenders
}

const targets = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(DIST)
      .filter((f) => f.endsWith('.css'))
      .map((f) => join(DIST, f))

const offenders: Offender[] = []

for (const file of targets) {
  for (const selector of findUnscopedSelectors(readFileSync(file, 'utf8'))) {
    offenders.push({ file, selector })
  }
}

if (offenders.length) {
  console.error(`✗ ${offenders.length} unscoped selector(s) — the grid would leak globally:\n`)
  for (const { file, selector } of offenders) {
    console.error(`  ${file}\n    ${selector}`)
  }
  console.error(`\nEvery rule must be nested beneath ${WRAPPER}.`)
  process.exit(1)
}

console.log(`✓ all selectors scoped beneath ${WRAPPER} (${targets.length} file(s))`)
