/**
 * Build the release zip attached to each GitHub release.
 *
 * The repository does not track `dist/`, so a tag's source archive contains no CSS.
 * This produces the artifact that the readme's "download the stylesheet directly"
 * link points at.
 *
 * Layout mirrors Bootstrap's own `bootstrap-<version>-dist.zip`: one top-level
 * directory containing `css/`, so unpacked paths match the paths used in docs.
 *
 *   bootstrap-grid-only-css-<version>-dist/
 *     README.md
 *     LICENSE
 *     css/
 *       bootstrap-grid.css              + .map
 *       bootstrap-grid.min.css          + .map
 *       bootstrap-grid.rtl.css          + .map
 *       bootstrap-grid.rtl.min.css      + .map
 *
 * Usage: node scripts/pack-dist.ts
 */

import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const { version } = JSON.parse(readFileSync('package.json', 'utf8')) as { version: string }

const SOURCE = 'dist/css'
const OUT_DIR = 'dist-release'
const STEM = `bootstrap-grid-only-css-${version}-dist`
const ZIP = join(OUT_DIR, `${STEM}.zip`)

if (!existsSync(SOURCE)) {
  console.error(`✗ ${SOURCE} not found — run \`npm run build\` first`)
  process.exit(1)
}

// Staged in a temp directory so the zip contains exactly one top-level folder,
// rather than the repo-relative `dist/css/...` paths.
const staging = mkdtempSync(join(tmpdir(), 'bgoc-pack-'))
const root = join(staging, STEM)

try {
  mkdirSync(root, { recursive: true })
  cpSync(SOURCE, join(root, 'css'), { recursive: true })
  for (const file of ['README.md', 'LICENSE']) cpSync(file, join(root, file))

  rmSync(OUT_DIR, { recursive: true, force: true })
  mkdirSync(OUT_DIR, { recursive: true })

  // -r recurse, -q quiet, -X strip extra file attributes for a reproducible archive.
  execFileSync('zip', ['-rqX', join(process.cwd(), ZIP), STEM], {
    cwd: staging,
    stdio: ['ignore', 'inherit', 'inherit']
  })
} finally {
  rmSync(staging, { recursive: true, force: true })
}

const listing = execFileSync('unzip', ['-l', ZIP], { encoding: 'utf8' })
console.log(listing.trimEnd())
console.log(`\n✓ ${ZIP}`)
