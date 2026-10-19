import { render, screen } from '@testing-library/react'
import App from './App'

describe('<App />', () => {
  it('renderiza o título da aplicação', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /frontend/i })).toBeInTheDocument()
  })
})
