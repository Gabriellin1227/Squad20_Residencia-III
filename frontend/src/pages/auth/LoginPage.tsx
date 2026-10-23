import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { login } from '@/service/authService'
import { BrandPanel } from './components/BrandPanel'
import { LoginForm } from './components/LoginForm'
import type { LoginFormValues } from './types'
import styles from './LoginPage.module.scss'

export interface LoginPageProps {
  /** Rota para onde ir após o login (padrão: painel do gestor). */
  redirectTo?: string
}

export function LoginPage({ redirectTo = '/' }: LoginPageProps) {
  const navigate = useNavigate()

  const handleSubmit = async (values: LoginFormValues) => {
    await login(values)
    navigate(redirectTo)
  }

  return (
    <div className={styles.page}>
      <AuthLayout brand={<BrandPanel />}>
        <LoginForm onSubmit={handleSubmit} />
      </AuthLayout>
    </div>
  )
}
