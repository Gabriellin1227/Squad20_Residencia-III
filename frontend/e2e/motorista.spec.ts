import { test, expect } from '@playwright/test'
import { mockApi, signIn } from './auth'

test.beforeEach(async ({ page }) => {
  await mockApi(page)
})

test('app do motorista abre na raiz com a barra de abas', async ({ page }) => {
  await signIn(page)

  await expect(
    page.getByRole('navigation', { name: 'Navegação do motorista' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: /olá/i })).toBeVisible()
})

test('é instalável como PWA (manifest e service worker)', async ({ page, request }) => {
  await page.goto('/')

  const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href')
  expect(manifestHref).toBe('/manifest.webmanifest')

  const manifest = await (await request.get('/manifest.webmanifest')).json()
  expect(manifest.display).toBe('standalone')
  expect(manifest.icons.length).toBeGreaterThanOrEqual(2)

  const sw = await request.get('/sw.js')
  expect(sw.ok()).toBe(true)
})
