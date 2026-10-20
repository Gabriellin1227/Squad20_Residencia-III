import { test, expect } from '@playwright/test'

test('carrega a página inicial', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('FrotaManager', { exact: true })).toBeVisible()
  await expect(page.getByRole('main')).toBeVisible()
})
