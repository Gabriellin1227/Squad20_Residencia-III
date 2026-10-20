import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { login } from '@/service/authService'
import { BrandPanel } from './components/BrandPanel'
import { LoginForm } from './components/LoginForm'
import type { LoginFormValues } from './types'
import styles from './LoginPage.module.scss'

export function LoginPage() {
  const navigate = useNavigate()

  const handleSubmit = async (values: LoginFormValues) => {
    await login(values)
    navigate('/')
  }

  return (
    <div className={styles.page}>
      <AuthLayout brand={<BrandPanel />}>
        <LoginForm onSubmit={handleSubmit} />
      </AuthLayout>
    </div>
  )
}
