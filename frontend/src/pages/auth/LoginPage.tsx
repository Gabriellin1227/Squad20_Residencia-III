import { useState } from 'react'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { VehiclesPage } from '@/pages/vehicles/VehiclesPage'
import { login } from '@/service/authService'
import { BrandPanel } from './components/BrandPanel'
import { LoginForm } from './components/LoginForm'
import type { LoginFormValues } from './types'
import styles from './LoginPage.module.scss'

export function LoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleSubmit = async (values: LoginFormValues) => {
    await login(values)
    setIsLoggedIn(true)
  }

  if (isLoggedIn) {
    return (
      <AppLayout>
        <VehiclesPage />
      </AppLayout>
    )
  }

  return (
    <div className={styles.page}>
      <AuthLayout brand={<BrandPanel />}>
        <LoginForm onSubmit={handleSubmit} />
      </AuthLayout>
    </div>
  )
}
