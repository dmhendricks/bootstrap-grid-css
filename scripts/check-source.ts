/**
 * Guard the SCSS entrypoint's architecture.
 *
 * Two invariants that are easy to break by accident and expensive to notice:
 *
 * 1. **No `@import` in our own source.** `@import` is deprecated in Dart Sass and
 *    scheduled for removal in 3.0. Bootstrap's internals still use it — 238 times
 *    — but that is upstream's problem; this package loads Bootstrap through
 *    `meta.load-css`, so our source stays clear of it and will not break when the
 *    rule is removed. A stray `@import` would quietly reintroduce that exposure.
 *
 * 2. **The grid is loaded inside the wrapper selector.** If `meta.load-css` ever
 *    moved to the top level the build would still succeed, and every selector
 *    would silently become global. check-scope.ts catches that in the output;
 *    this catches it in the source, where the cause is obvious.
 *
 *   node scripts/check-source.ts
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const SCSS_DIR = 'scss'
const ENTRYPOINT = join(SCSS_DIR, 'bootstrap-grid.scss')

/** Every .scss file under `dir`, recursively. */
function scssFiles(dir: string): string[] {
  const found: string[] = []
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) found.push(...scssFiles(path))
    else if (entry.endsWith('.scss')) found.push(path)
  }
  return found
}

/** Strip comments so an `@import` mentioned in prose is not a false positive. */
function withoutComments(scss: string): string {
  return scss.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
}

const problems: string[] = []

// 1. No @import anywhere in our source.
for (const file of scssFiles(SCSS_DIR)) {
  const source = withoutComments(readFileSync(file, 'utf8'))
  source.split('\n').forEach((line, index) => {
    if (/^\s*@import\b/.test(line)) {
      problems.push(
        `${file}:${index + 1}  @import is deprecated in Dart Sass — use @use, or ` +
          'meta.load-css when the load must be nested inside a selector'
      )
    }
  })
}

// 2. The grid must be loaded inside the wrapper selector, not at the top level.
const entry = withoutComments(readFileSync(ENTRYPOINT, 'utf8'))
const loadIndex = entry.indexOf('meta.load-css("bootstrap/scss/bootstrap-grid")')

if (loadIndex === -1) {
  problems.push(`${ENTRYPOINT}  expected meta.load-css("bootstrap/scss/bootstrap-grid")`)
} else {
  // Nested means an unclosed brace precedes the load.
  const before = entry.slice(0, loadIndex)
  const depth = (before.match(/\{/g) ?? []).length - (before.match(/\}/g) ?? []).length
  if (depth < 1) {
    problems.push(
      `${ENTRYPOINT}  the grid is loaded at the top level, so every selector would be ` +
        'global — it must be nested inside the wrapper selector'
    )
  }
}

if (problems.length) {
  console.error(`✗ ${problems.length} problem(s) in ${SCSS_DIR}/:\n`)
  for (const problem of problems) console.error(`  ${problem}`)
  process.exit(1)
}

console.log('✓ scss source: no @import, grid loaded inside the wrapper')
