import { test, expect, type Page, type Locator } from '@playwright/test'

/**
 * Geometry tests for the scoped grid.
 *
 * These assert *computed layout* (widths, positions, stacking order) rather than
 * class names, so the same specs are meaningful against the Bootstrap 4 build and
 * the Bootstrap 5 build. Keeping them class-agnostic is deliberate: when the
 * Bootstrap 5 upgrade lands, this file passing unchanged is the evidence that the
 * grid still behaves the same way.
 *
 * Widths are compared as ratios of the containing row, not absolute pixels, so
 * results hold across browsers and viewport sizes.
 */

const DESKTOP = { width: 1280, height: 900 }
const TABLET = { width: 768, height: 1024 }
const MOBILE = { width: 500, height: 900 }

/** Bounding box of the first match, failing the test if the element is missing. */
async function boxOf(scope: Page | Locator, selector: string) {
  const locator = ('locator' in scope ? scope.locator(selector) : scope).first()
  await expect(locator).toBeAttached()
  const box = await locator.boundingBox()
  expect(box, `expected a bounding box for ${selector}`).not.toBeNull()
  return box!
}

/** Width of `selector` as a fraction of its demo row's width. */
async function widthRatio(page: Page, demo: string, selector: string) {
  const row = await boxOf(page, `[data-demo="${demo}"] .row`)
  const el = await boxOf(page, `[data-demo="${demo}"] ${selector}`)
  return el.width / row.width
}

/** Bounding boxes for every match, asserting a minimum count first. */
async function boxesOf(locator: Locator, atLeast: number) {
  const elements = await locator.all()
  expect(elements.length, `expected at least ${atLeast} matches`).toBeGreaterThanOrEqual(atLeast)

  const boxes = []
  for (const element of elements) {
    const box = await element.boundingBox()
    expect(box).not.toBeNull()
    boxes.push(box!)
  }
  return boxes
}

/** Nth bounding box from a list, narrowed for `noUncheckedIndexedAccess`. */
function at(boxes: Array<{ x: number; y: number; width: number; height: number }>, i: number) {
  const box = boxes[i]
  if (!box) throw new Error(`expected a bounding box at index ${i}`)
  return box
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize(DESKTOP)
  await page.goto('./')
})

test.describe('columns', () => {
  test('three col-md-4 each occupy a third of the row', async ({ page }) => {
    expect(await widthRatio(page, 'basic', '.col-md-4')).toBeCloseTo(1 / 3, 2)
  })

  test('twelve col-1 widths sum to the row width', async ({ page }) => {
    const row = await boxOf(page, '[data-demo="twelve"] .row')
    const cols = await page.locator('[data-demo="twelve"] .col-1').all()
    expect(cols).toHaveLength(12)

    let total = 0
    for (const col of cols) {
      const box = await col.boundingBox()
      expect(box).not.toBeNull()
      total += box!.width
    }
    // Sub-pixel rounding across 12 columns; 1.5px of slack is plenty.
    expect(Math.abs(total - row.width)).toBeLessThan(1.5)
  })

  test('fractional columns match their denominators', async ({ page }) => {
    expect(await widthRatio(page, 'fractions', '.col-6')).toBeCloseTo(1 / 2, 2)
    expect(await widthRatio(page, 'fractions', '.col-4')).toBeCloseTo(1 / 3, 2)
    expect(await widthRatio(page, 'fractions', '.col-3')).toBeCloseTo(1 / 4, 2)
  })

  test('col-auto is narrower than a flexible col', async ({ page }) => {
    const auto = await boxOf(page, '[data-demo="auto"] .col-auto')
    const flex = await boxOf(page, '[data-demo="auto"] .col')
    expect(auto.width).toBeLessThan(flex.width)
  })
})

test.describe('responsive behaviour', () => {
  test('col-md-4 is a third on desktop and full width on mobile', async ({ page }) => {
    expect(await widthRatio(page, 'basic', '.col-md-4')).toBeCloseTo(1 / 3, 2)

    await page.setViewportSize(MOBILE)
    expect(await widthRatio(page, 'basic', '.col-md-4')).toBeCloseTo(1, 2)
  })

  test('the md breakpoint applies at 768px', async ({ page }) => {
    await page.setViewportSize(TABLET)
    expect(await widthRatio(page, 'basic', '.col-md-4')).toBeCloseTo(1 / 3, 2)
  })
})

test.describe('offsets and ordering', () => {
  test('offset-md-3 pushes the column a quarter of the way in', async ({ page }) => {
    const row = await boxOf(page, '[data-demo="offsets"] .row')
    const col = await boxOf(page, '[data-demo="offsets"] .col-md-6')
    expect((col.x - row.x) / row.width).toBeCloseTo(0.25, 2)
  })

  test('order-* overrides source order', async ({ page }) => {
    const cols = await page.locator('[data-demo="order"] .row').first().locator('.col').all()

    const positioned = []
    for (const col of cols) {
      const box = await col.boundingBox()
      expect(box).not.toBeNull()
      positioned.push({ label: (await col.innerText()).trim().charAt(0), x: box!.x })
    }

    const leftToRight = positioned.sort((a, b) => a.x - b.x).map((c) => c.label)
    // Source order is A, B, C with .order-3, .order-1, .order-2 respectively.
    expect(leftToRight).toEqual(['B', 'C', 'A'])
  })

  test('order-first and order-last swap two columns', async ({ page }) => {
    const boxes = await boxesOf(page.locator('[data-demo="order"] .row').nth(1).locator('.col'), 2)
    // Source order is A (.order-last), B (.order-first): B must render left of A.
    expect(at(boxes, 1).x).toBeLessThan(at(boxes, 0).x)
  })
})

test.describe('gutters', () => {
  /**
   * Bootstrap gutters are horizontal *padding inside* each column, not a gap
   * between them — adjacent column boxes touch in both cases. So the assertion
   * is about column padding and the negative row margin that compensates for it.
   */
  test('the zero-gutter row removes column padding', async ({ page }) => {
    const paddingOf = async (rowSelector: string) => {
      const column = page.locator(rowSelector).locator('[class*="col-"]').first()
      return column.evaluate((el) => {
        const style = getComputedStyle(el)
        return {
          left: Number.parseFloat(style.paddingLeft),
          right: Number.parseFloat(style.paddingRight)
        }
      })
    }

    const normal = await paddingOf('[data-demo="gutters"] .row:not([data-demo-row])')
    const flush = await paddingOf('[data-demo="gutters"] [data-demo-row]')

    expect(normal.left).toBeGreaterThan(0)
    expect(normal.right).toBeGreaterThan(0)
    expect(flush.left).toBe(0)
    expect(flush.right).toBe(0)
  })

  test('the gutter row bleeds wider than the flush row via negative margins', async ({ page }) => {
    // The gutter row uses negative side margins so its columns' padding lines the
    // content up with the container edge; the flush row has no such margins.
    const normal = await boxOf(page, '[data-demo="gutters"] .row:not([data-demo-row])')
    const flush = await boxOf(page, '[data-demo="gutters"] [data-demo-row]')

    expect(normal.width).toBeGreaterThan(flush.width)
    expect(normal.x).toBeLessThan(flush.x)
  })
})

test.describe('nesting', () => {
  test('a nested row divides its parent column, not the page', async ({ page }) => {
    const parent = await boxOf(page, '[data-demo="nesting"] .col-md-8')
    const nested = await boxOf(page, '[data-demo="nesting"] .col-6')

    // Each nested half is about half its parent column, and clearly narrower.
    expect(nested.width / parent.width).toBeCloseTo(0.5, 1)
    expect(nested.width).toBeLessThan(parent.width)
  })
})

test.describe('scoping and isolation', () => {
  /**
   * The reason this package exists over Bootstrap's official grid-only build:
   * grid rules must not apply outside .bootstrap-wrapper. A silently global
   * stylesheet would still pass every other test in this file.
   */
  test('grid rules do not apply outside .bootstrap-wrapper', async ({ page }) => {
    const boxes = await boxesOf(page.locator('[data-demo="isolation-outside"] .col-md-4'), 3)

    // Unstyled block elements: stacked vertically, sharing a left edge.
    expect(at(boxes, 0).y).toBeLessThan(at(boxes, 1).y)
    expect(Math.abs(at(boxes, 0).x - at(boxes, 1).x)).toBeLessThan(2)

    // And each fills its container rather than taking a third of it.
    const row = await boxOf(page, '[data-demo="isolation-outside"] .row')
    expect(at(boxes, 0).width / row.width).toBeGreaterThan(0.9)
  })

  test('the wrapped equivalent does lay out as a grid', async ({ page }) => {
    // Guards against the isolation test passing because the CSS failed to load
    // at all, which would make everything look "isolated".
    const boxes = await boxesOf(page.locator('[data-demo="basic"] .col-md-4'), 2)
    expect(at(boxes, 0).y).toBeCloseTo(at(boxes, 1).y, 0)
    expect(at(boxes, 1).x).toBeGreaterThan(at(boxes, 0).x)
  })
})

test.describe('page health', () => {
  test('loads without console or network errors', async ({ page }) => {
    const problems: string[] = []
    page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`))
    page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`))
    page.on('requestfailed', (r) => problems.push(`requestfailed: ${r.url()}`))

    await page.goto('./', { waitUntil: 'networkidle' })
    expect(problems).toEqual([])
  })

  test('does not scroll horizontally', async ({ page }) => {
    for (const viewport of [MOBILE, TABLET, DESKTOP]) {
      await page.setViewportSize(viewport)
      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1
      )
      expect(overflows, `horizontal overflow at ${viewport.width}px`).toBe(false)
    }
  })
})

test.describe('code snippets', () => {
  test('every example exposes a snippet, collapsed by default', async ({ page }) => {
    const sections = await page.locator('.demo').count()
    const snippets = await page.locator('.snippet').count()
    expect(snippets).toBe(sections)

    const open = await page.locator('.snippet[open]').count()
    expect(open).toBe(0)
  })

  test('a snippet reflects the markup it documents', async ({ page }) => {
    await page.locator('#basic .snippet__summary').click()
    const code = await page.locator('#basic .snippet__pre code').innerText()

    expect(code).toContain('bootstrap-wrapper')
    expect(code).toContain('class="container"')
    expect(code).toContain('col-md-4')
    // Demo-only scaffolding must not leak into copyable output.
    expect(code).not.toContain('data-demo')
    expect(code).not.toContain('class="box')
  })

  test('the isolation snippet omits the wrapper, matching the example', async ({ page }) => {
    await page.locator('#isolation .snippet__summary').click()
    const code = await page.locator('#isolation .snippet__pre code').innerText()
    expect(code).not.toContain('bootstrap-wrapper')
    expect(code).toContain('class="container"')
  })
})
