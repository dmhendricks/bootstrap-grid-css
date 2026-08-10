/**
 * Renders a copyable, syntax-highlighted HTML snippet beneath each demo example.
 *
 * The snippet is derived from the live DOM rather than hand-written, so it can
 * never drift out of sync with what the page actually renders. Presentation-only
 * scaffolding (the .box wrappers and data-* hooks) is stripped so the output is
 * the grid markup a user would actually paste.
 */
import { highlight } from 'sugar-high'

/** Attributes that exist for the demo/tests only and should not be shown. */
const isDemoAttr = (name) => name.startsWith('data-demo')

/** Elements that only exist to make the demo visible, not to demonstrate the grid. */
const isPresentational = (el) =>
  el.tagName === 'DIV' && [...el.classList].some((c) => c === 'box' || c.startsWith('box--'))

/**
 * Serialize an element to indented HTML, dropping demo-only scaffolding.
 * @param {Element} el
 * @param {number} depth
 * @returns {string}
 */
function serialize(el, depth = 0) {
  const pad = '  '.repeat(depth)
  const classes = [...el.classList].filter((c) => c !== 'box' && !c.startsWith('box--'))
  const attrs = [...el.attributes]
    .filter((a) => a.name !== 'class' && !isDemoAttr(a.name))
    .map((a) => ` ${a.name}="${a.value}"`)
    .join('')

  const open = `<${el.tagName.toLowerCase()}${classes.length ? ` class="${classes.join(' ')}"` : ''}${attrs}>`
  const close = `</${el.tagName.toLowerCase()}>`

  // Collect children worth rendering, flattening presentational wrappers so their
  // grid-relevant descendants (e.g. a nested .row) are preserved.
  const kids = []
  for (const child of el.children) {
    if (isPresentational(child)) {
      for (const grand of child.children) kids.push(grand)
    } else {
      kids.push(child)
    }
  }

  if (kids.length === 0) {
    const text = el.textContent.trim().replace(/\s+/g, ' ')
    // Keep short labels inline; they show which column is which.
    return `${pad}${open}${text && text.length <= 40 ? text : '...'}${close}`
  }

  const inner = kids.map((k) => serialize(k, depth + 1)).join('\n')
  return `${pad}${open}\n${inner}\n${pad}${close}`
}

/**
 * Build the snippet UI for one example.
 * @param {Element} source root element to serialize
 * @returns {HTMLElement}
 */
function buildSnippetBlock(source) {
  const code = serialize(source)

  const details = document.createElement('details')
  details.className = 'snippet'

  const summary = document.createElement('summary')
  summary.className = 'snippet__summary'
  summary.innerHTML = '<span class="snippet__label">HTML</span>'

  const body = document.createElement('div')
  body.className = 'snippet__body'

  const copy = document.createElement('button')
  copy.type = 'button'
  copy.className = 'snippet__copy'
  copy.textContent = 'Copy'
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code)
      copy.textContent = 'Copied'
    } catch {
      // Clipboard API needs a secure context and permission; fall back to a
      // selection the user can copy manually rather than failing silently.
      const range = document.createRange()
      range.selectNodeContents(pre)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
      copy.textContent = 'Press ⌘/Ctrl+C'
    }
    setTimeout(() => { copy.textContent = 'Copy' }, 2000)
  })

  const pre = document.createElement('pre')
  pre.className = 'snippet__pre'
  const codeEl = document.createElement('code')
  codeEl.className = 'sh__code language-html'
  // Highlighted markup for display; `code` (plain text) remains the copy source.
  codeEl.innerHTML = highlight(code)
  pre.append(codeEl)

  body.append(copy, pre)
  details.append(summary, body)
  return details
}

/** Attach a snippet block to every demo section that has an example. */
export function initSnippets() {
  for (const section of document.querySelectorAll('.demo')) {
    // Prefer the wrapper's .container; fall back to the raw example (isolation
    // demo has no .bootstrap-wrapper by design).
    const example =
      section.querySelector('.bootstrap-wrapper > .container') ??
      section.querySelector('[data-demo] > .container')

    if (!example) continue

    const wrapper = example.closest('.bootstrap-wrapper')
    let root = example

    // Show the wrapper too — it is required for the grid to apply, so omitting
    // it would make the snippet non-functional if pasted.
    if (wrapper) {
      const shell = document.createElement('div')
      shell.className = 'bootstrap-wrapper'
      shell.append(example.cloneNode(true))
      root = shell
    }

    section.append(buildSnippetBlock(root))
  }
}
