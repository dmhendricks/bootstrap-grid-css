import { defineConfig, devices } from '@playwright/test'

/**
 * Two modes:
 *
 *   npm run test:e2e                 -> builds + serves dist-demo locally
 *   PLAYWRIGHT_BASE_URL=<url> ...    -> smoke-tests an already-deployed site
 *
 * The specs assert computed geometry rather than class names, so the same suite
 * is meaningful against both the Bootstrap 4 build and the Bootstrap 5 build.
 * That is the point: it is the parity evidence for the upgrade.
 */

const LIVE = process.env.PLAYWRIGHT_BASE_URL
const LOCAL_PORT = 4173
const LOCAL_URL = `http://localhost:${LOCAL_PORT}/bootstrap-grid-css/`

export default defineConfig({
  testDir: './test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],

  use: {
    baseURL: LIVE ?? LOCAL_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ],

  // Only spin up a server when testing locally; against a live URL there is
  // nothing to serve.
  webServer: LIVE
    ? undefined
    : {
        command: `npm run build:demo && npx vite preview --config vite.config.demo.mjs --port ${LOCAL_PORT} --strictPort`,
        url: LOCAL_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000
      }
})
