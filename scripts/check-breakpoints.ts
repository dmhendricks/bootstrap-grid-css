/**
 * Verify this package's local $grid-breakpoints copy still matches Bootstrap's.
 *
 * scss/_variables.scss duplicates that map out of necessity:
 * `@use "bootstrap/scss/variables"` fails with "Undefined mixin", because the
 * partial depends on files its parent loads first, so it cannot be loaded
 * standalone. The copy exists to re-declare the --bs-breakpoint-* custom
 * properties that cannot survive scoping.
 *
 * Duplication that nothing checks is duplication that drifts. The values have
 * been identical across every 5.x release so far, so this should never fire —
 * but if a future Bootstrap changes them, a failed build beats silently shipping
 * wrong values.
 *
 *   node scripts/check-breakpoints.ts
 */

import { readFileSync } from 'node:fs'

const OURS = 'scss/_variables.scss'
const THEIRS = 'node_modules/bootstrap/scss/_variables.scss'

/** Parse a `$grid-breakpoints: (...)` declaration into name -> value. */
export function parseBreakpoints(scss: string): Map<string, string> {
  const declaration = scss.match(/\$grid-breakpoints:\s*\(([\s\S]*?)\)\s*!default/)
  if (!declaration?.[1]) {
    throw new Error('could not find a $grid-breakpoints map')
  }

  const entries = new Map<string, string>()
  for (const line of declaration[1].split('\n')) {
    // Strip comments before matching so commented-out entries are ignored.
    const match = line.replace(/\/\/.*$/, '').match(/([a-zA-Z0-9_-]+)\s*:\s*([^,]+)/)
    if (match?.[1] && match[2]) entries.set(match[1], match[2].trim())
  }
  return entries
}

const ours = parseBreakpoints(readFileSync(OURS, 'utf8'))
const theirs = parseBreakpoints(readFileSync(THEIRS, 'utf8'))

const problems: string[] = []

for (const [name, value] of theirs) {
  if (!ours.has(name)) {
    problems.push(`missing "${name}: ${value}" — Bootstrap defines it, we do not`)
  } else if (ours.get(name) !== value) {
    problems.push(`"${name}" is ${ours.get(name)} here but ${value} in Bootstrap`)
  }
}

for (const name of ours.keys()) {
  if (!theirs.has(name)) {
    problems.push(`extra "${name}" — we define it, Bootstrap does not`)
  }
}

if (problems.length) {
  console.error(`✗ ${OURS} has drifted from Bootstrap's breakpoints:\n`)
  for (const problem of problems) console.error(`  ${problem}`)
  console.error(`\nUpdate the map in ${OURS} to match, then rebuild.`)
  process.exit(1)
}

console.log(`✓ $grid-breakpoints matches Bootstrap (${ours.size} breakpoints)`)
