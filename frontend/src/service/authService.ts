import type { LoginFormValues } from '@/pages/auth/types'

/**
 * Ponto de integração com o backend de autenticação.
 * Substitua a simulação abaixo pela chamada HTTP real (ex.: POST /auth/login).
 */
export async function login(values: LoginFormValues): Promise<void> {
  void values
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 700)
  })
}
