/**
 * Bump the pinned Bootstrap version, rebuild, verify, and report what changed.
 *
 *   node scripts/upgrade-bootstrap.ts            # latest 5.x
 *   node scripts/upgrade-bootstrap.ts 5.4.0      # a specific version
 *   node scripts/upgrade-bootstrap.ts --check     # report only, change nothing
 *
 * The point is that a Bootstrap bump should be one command with a readable
 * report, not a sequence someone half-remembers a year later. Every step here
 * already exists as an npm script; this sequences them and classifies the CSS
 * diff so a reviewer sees which selectors appeared or vanished rather than
 * several thousand lines of reformatted output.
 */

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { extractClasses } from './extract-classes.ts'

/** Bootstrap 6 is a project, not a bump: it may move to module-based source. */
const RANGE = '<6'
const BUILT = 'dist/css/bootstrap-grid.css'

/**
 * Run a command, capturing stdout. npm's own progress chatter is silenced so the
 * report at the end is readable; stderr still passes through, so real failures
 * remain visible.
 */
const run = (command: string, args: string[]) =>
  execFileSync(command, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
    env: { ...process.env, npm_config_loglevel: 'error', npm_config_fund: 'false', npm_config_audit: 'false' }
  }).trim()

const currentVersion = () =>
  JSON.parse(readFileSync('package.json', 'utf8')).devDependencies.bootstrap as string

/**
 * Highest published version satisfying RANGE.
 *
 * Resolved by semver range rather than the `latest-5` dist-tag, which is stale:
 * it currently points at 5.3.3 while 5.3.8 is published, so a tag-based check
 * would silently miss releases.
 */
function latestInRange(): string {
  const output = run('npm', ['view', `bootstrap@${RANGE}`, 'version', '--json'])
  const parsed: unknown = JSON.parse(output)

  if (typeof parsed === 'string') return parsed
  if (Array.isArray(parsed)) {
    const stable = parsed.filter((v): v is string => typeof v === 'string' && !v.includes('-'))
    const last = stable.at(-1)
    if (last) return last
  }
  throw new Error(`could not resolve a version for bootstrap@${RANGE}`)
}

/** Group class names by their utility prefix so a diff reads as families. */
function summarize(names: string[]): string[] {
  const families = new Map<string, number>()
  for (const name of names) {
    const family = name.replace(/-(xs|sm|md|lg|xl|xxl)(-|$)/, '-*$2').replace(/-\d+$/, '-N')
    families.set(family, (families.get(family) ?? 0) + 1)
  }
  return [...families.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([family, count]) => (count > 1 ? `${family} (${count})` : family))
}

const args = process.argv.slice(2)
const checkOnly = args.includes('--check')
const requested = args.find((a) => !a.startsWith('--'))

const from = currentVersion()
const to = requested ?? latestInRange()

console.log(`current: bootstrap@${from}`)
console.log(`target:  bootstrap@${to}`)

if (from === to) {
  console.log('\n✓ already up to date')
  process.exit(0)
}

if (checkOnly) {
  console.log(`\n→ bootstrap@${to} is available (run without --check to upgrade)`)
  process.exit(0)
}

// Capture the current class surface before changing anything.
const before = new Set(extractClasses(readFileSync(BUILT, 'utf8')))

console.log(`\n▸ installing bootstrap@${to}`)
run('npm', ['install', '-D', '--save-exact', `bootstrap@${to}`])

console.log('▸ building')
run('npm', ['run', 'build'])

console.log('▸ verifying')
try {
  run('npm', ['run', 'check'])
} catch {
  console.error(`\n✗ verification failed on bootstrap@${to}`)
  console.error('  The build completed but a check rejected it. Inspect the output above,')
  console.error(`  then either fix the cause or revert with:`)
  console.error(`    npm install -D --save-exact bootstrap@${from} && npm run build`)
  process.exit(1)
}

const after = new Set(extractClasses(readFileSync(BUILT, 'utf8')))
const added = [...after].filter((c) => !before.has(c))
const removed = [...before].filter((c) => !after.has(c))

console.log(`\n─── bootstrap ${from} → ${to} ───`)
console.log(`classes: ${before.size} → ${after.size}`)

if (added.length) {
  console.log(`\nadded (${added.length}):`)
  for (const family of summarize(added)) console.log(`  + ${family}`)
}

if (removed.length) {
  console.log(`\nremoved (${removed.length}):`)
  for (const family of summarize(removed)) console.log(`  - ${family}`)
  console.log('\n⚠ Removed classes are a breaking change for consumers. Add each to')
  console.log("  KNOWN_REMOVALS in check-parity.ts and to the readme's migration table,")
  console.log('  or restore them in scss/_extras.scss.')
}

if (!added.length && !removed.length) {
  console.log('\nno change to the class surface — a patch-level bump')
}

console.log('\nNext:')
console.log(`  - update the version in package.json to match (currently ${currentVersion()})`)
console.log('  - run: npm test')
console.log('  - commit package.json, package-lock.json, and any scss/readme changes')
