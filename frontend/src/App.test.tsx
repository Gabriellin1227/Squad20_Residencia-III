import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import {App} from './App'

test('renderiza a página de login por padrão', () => {
  render(<App />)

  expect(
    screen.getByRole('heading', { name: /login/i })
  ).toBeInTheDocument()

  expect(
    screen.getByRole('button', { name: /confirmar/i })
  ).toBeInTheDocument()
})