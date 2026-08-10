/**
 * Compare the built class surface against the Bootstrap 4 baseline.
 *
 * Bootstrap 5 deliberately renamed and removed classes, so this does not assert
 * the two are identical — it asserts every class the 4.x build shipped is either
 * still present, or listed below as a known removal with a documented
 * replacement. A v4 class disappearing without an entry here fails the build.
 *
 * That is what keeps the README's migration table honest: the table and this list
 * describe the same set, so neither can quietly fall out of date.
 *
 *   node scripts/check-parity.ts [cssFile]
 */

import { readFileSync } from 'node:fs'
import { extractClasses } from './extract-classes.ts'

const BASELINE = 'test/fixtures/v4-classes.txt'
const BUILT = process.argv[2] ?? 'dist/css/bootstrap-grid.css'

/**
 * Classes the Bootstrap 4 build shipped that Bootstrap 5 does not, each with the
 * modern equivalent users should migrate to. Keep in sync with the README's
 * "Upgrading from 4.x" table.
 */
const KNOWN_REMOVALS: Array<{ pattern: RegExp; replacement: string }> = [
  { pattern: /^hidden-(xs|sm|md|lg|xl)-(up|down)$/, replacement: 'use .d-*-none / .d-*-block' },
  { pattern: /^visible-print-(block|inline|inline-block)$/, replacement: 'use .d-print-*' },
  { pattern: /^hidden-print$/, replacement: 'use .d-print-none' },
  { pattern: /^no-gutters$/, replacement: 'renamed to .g-0' },
  {
    pattern: /^order-(6|7|8|9|10|11|12)$/,
    replacement: 'Bootstrap 5 generates order-0..5 only'
  },
  {
    pattern: /^order-(sm|md|lg|xl)-(6|7|8|9|10|11|12)$/,
    replacement: 'Bootstrap 5 generates order-*-0..5 only'
  }
]

const baseline = readFileSync(BASELINE, 'utf8').split('\n').filter(Boolean)
const built = new Set(extractClasses(readFileSync(BUILT, 'utf8')))

const undocumented: string[] = []
const documented: Array<{ name: string; replacement: string }> = []

for (const name of baseline) {
  if (built.has(name)) continue

  const removal = KNOWN_REMOVALS.find((r) => r.pattern.test(name))
  if (removal) {
    documented.push({ name, replacement: removal.replacement })
  } else {
    undocumented.push(name)
  }
}

const added = [...built].filter((c) => !baseline.includes(c))

console.log(`Bootstrap 4 baseline: ${baseline.length} classes`)
console.log(`This build:           ${built.size} classes`)
console.log(`  retained:           ${baseline.length - documented.length - undocumented.length}`)
console.log(`  removed (known):    ${documented.length}`)
console.log(`  added:              ${added.length}`)

if (undocumented.length) {
  console.error(`\n✗ ${undocumented.length} class(es) vanished without a documented replacement:\n`)
  for (const name of undocumented) console.error(`  .${name}`)
  console.error('\nEither restore them, or add an entry to KNOWN_REMOVALS in this script')
  console.error("and a row to the README's \"Upgrading from 4.x\" table.")
  process.exit(1)
}

console.log('\n✓ every Bootstrap 4 class is retained or a documented removal')
