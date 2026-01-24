import { expect } from '@nuxt/test-utils/playwright'
import type { Locator, Page } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly heading: Locator
  readonly getStartedButton: Locator

  constructor (page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { name: 'Demo SaaS' })
    this.getStartedButton = page.getByRole('banner').getByRole('link', { name: 'Get started' })
  }

  async goto () {
    await this.page.goto('/', { waitUntil: 'networkidle' })
  }

  async expectHeadingToBeVisible () {
    await expect(this.heading).toBeVisible()
  }

  async expectGetStartedButtonToBeVisible () {
    await expect(this.getStartedButton).toBeVisible()
  }
}
