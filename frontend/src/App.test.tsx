import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, expect, test } from 'vitest'
import { AppRoutes } from './App'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  localStorage.clear()
})

test('renderiza a página de login em /login', () => {
  renderAt('/login')

  expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument()
})

test('renderiza o início dentro do menu lateral', async () => {
  renderAt('/')

  expect(
    screen.getByRole('heading', { name: /bem-vindo ao frotamanager/i }),
  ).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /abrir menu/i })).toBeInTheDocument()
  expect(await screen.findByText(/motoristas ativos/i)).toBeInTheDocument()
})

test('renderiza a página de perfil em /perfil', () => {
  renderAt('/perfil')

  expect(screen.getByRole('heading', { name: 'Perfil de Usuário' })).toBeInTheDocument()
  expect(screen.queryByText(/módulo em construção/i)).not.toBeInTheDocument()
})

test('navega pelo menu lateral e marca o item ativo', async () => {
  const user = userEvent.setup()
  renderAt('/')

  // No mobile o menu fica recolhido até ser aberto.
  await user.click(screen.getByRole('button', { name: /abrir menu/i }))
  await user.click(screen.getByRole('link', { name: 'Viagens' }))

  expect(screen.getByRole('heading', { name: 'Viagens' })).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /abrir menu/i }))
  expect(screen.getByRole('link', { name: 'Viagens' })).toHaveAttribute(
    'aria-current',
    'page',
  )
  expect(screen.getByText(/módulo em construção/i)).toBeInTheDocument()
})

test('mostra a página 404 para rotas desconhecidas', () => {
  renderAt('/rota-que-nao-existe')

  expect(
    screen.getByRole('heading', { name: /página não encontrada/i }),
  ).toBeInTheDocument()
})
