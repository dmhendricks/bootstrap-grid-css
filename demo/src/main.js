// Page chrome for the demo (not part of the shipped package).
import './demo.css'

// The library build under test. Imported from the committed dist/ so the demo
// always exercises the same file consumers download.
import '../../dist/css/bootstrap-grid.css'

import { initSnippets } from './snippets.js'

initSnippets()
