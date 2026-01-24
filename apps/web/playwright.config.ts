import { fileURLToPath } from 'node:url'

import type { ConfigOptions } from '@nuxt/test-utils/playwright'
import { defineConfig, devices } from '@playwright/test'
import { isCI, isWindows } from 'std-env'

const devicesToTest = [
  'Desktop Chrome',
  // Test against other common browser engines.
  // 'Desktop Firefox',
  // 'Desktop Safari',
  // Test against mobile viewports.
  // 'Pixel 5',
  // 'iPhone 12',
  // Test against branded browsers.
  // { ...devices['Desktop Edge'], channel: 'msedge' },
  // { ...devices['Desktop Chrome'], channel: 'chrome' },
] satisfies Array<string | typeof devices[string]>

/* See https://playwright.dev/docs/test-configuration. */
export default defineConfig<ConfigOptions>({
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!isCI,
  /* Run tests in files in parallel */
  fullyParallel: true,
  projects: devicesToTest.map(p => typeof p === 'string' ? ({ name: p, use: devices[p] }) : p),
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Retry on CI only */
  retries: isCI ? 2 : 0,
  testDir: './app/e2e',
  testMatch: '**/*.e2e.ts',
  timeout: isWindows ? 60000 : undefined,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Nuxt configuration options */
    nuxt: {
      host: 'http://localhost:9009',
      rootDir: fileURLToPath(new URL('.', import.meta.url)),
    },
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  /* Opt out of parallel tests on CI. */
  workers: isCI ? 1 : undefined,
})
