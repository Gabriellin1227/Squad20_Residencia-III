import { render, screen } from '@testing-library/react'
import { App } from './App'
import { describe, expect, it } from 'vitest'

describe('<App />', () => {
  it('renderiza o layout com a marca e o menu principal', () => {
    render(<App />)

    expect(screen.getByText('FrotaManager')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Menu principal' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Veículos' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})