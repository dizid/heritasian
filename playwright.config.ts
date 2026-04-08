import { defineConfig } from '@playwright/test'

// PLAYWRIGHT_BASE_URL lets us run tests against a local preview server
// (e.g. http://localhost:4173) before pushing changes that affect the live site.
// Default remains the live production URL for CI / scheduled checks.
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'https://heritasian.netlify.app'

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL,
    headless: true,
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
})
