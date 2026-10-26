import { test, expect } from '@playwright/test'
import { mockApi, signIn, testCredentials } from './auth'
test.beforeEach(async ({ page }) => {
  await mockApi(page)
})
test('visitante é redirecionado ao login', async ({ page }) => {
  await page.goto('/motoristas')
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('heading', { name: 'Login', exact: true })).toBeVisible()
})
test('credenciais inválidas não liberam o painel', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('E-mail', { exact: true }).fill(testCredentials.email)
  await page.getByLabel('Senha', { exact: true }).fill('senha-incorreta')
  await page.getByRole('button', { name: 'Confirmar', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('Não foi possível entrar')
  await expect(page).toHaveURL(/\/login$/)
})
test('login válido carrega a página inicial', async ({ page }) => {
  await signIn(page)
  await expect(
    page.getByRole('heading', { name: /bem-vindo ao frotamanager/i }),
  ).toBeVisible()
  await expect(page.getByRole('main')).toBeVisible()
  await expect(page.getByText('Motoristas ativos', { exact: true })).toBeVisible()
})
