import { test, expect } from '@playwright/test'

test('carrega a página inicial', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: /frontend/i })).toBeVisible()
})
