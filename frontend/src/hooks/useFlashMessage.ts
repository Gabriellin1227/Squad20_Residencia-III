import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface FlashState {
  flash?: string
}

export interface FlashMessage {
  message: string | null
  show: (message: string) => void
  dismiss: () => void
}

/**
 * Mensagem de retorno de uma ação (ex.: "Motorista cadastrado").
 * Pode ser aberta na própria tela (`show`) ou vinda de outra via
 * `navigate(to, { state: { flash: '...' } })`; nesse caso é consumida uma única vez.
 */
export function useFlashMessage(): FlashMessage {
  const location = useLocation()
  const navigate = useNavigate()
  const incoming = (location.state as FlashState | null)?.flash ?? null
  const [message, setMessage] = useState<string | null>(incoming)

  useEffect(() => {
    // Limpa o state do histórico para a mensagem não reaparecer ao recarregar.
    if (incoming) navigate(location.pathname + location.search, { replace: true })
  }, [incoming, location.pathname, location.search, navigate])

  const dismiss = useCallback(() => setMessage(null), [])

  return { message, show: setMessage, dismiss }
}
