import { test } from '@nuxt/test-utils/playwright'

import { HomePage } from './pages/home.page'

test('heading & CTA are visible', async ({ page }) => {
  const homePage = new HomePage(page)

  await homePage.goto()

  await homePage.expectHeadingToBeVisible()
  await homePage.expectGetStartedButtonToBeVisible()
})
