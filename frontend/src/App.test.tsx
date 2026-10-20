import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { App } from './App'

describe('<App />', () => {
  it('renderiza o layout com a marca e o menu principal', () => {
    render(<App />)

    expect(screen.getByText('FrotaManager')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()

    // O menu fica recolhido por padrão, então inclui elementos escondidos
    expect(
      screen.getByRole('navigation', { name: 'Menu principal', hidden: true }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Veículos', hidden: true }),
    ).toHaveAttribute('aria-current', 'page')
  })
})
