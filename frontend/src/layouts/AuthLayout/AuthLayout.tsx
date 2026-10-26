import type { ReactNode } from 'react'
import styles from './AuthLayout.module.scss'

export interface AuthLayoutProps {
  brand: ReactNode
  children: ReactNode
}

export function AuthLayout({ brand, children }: AuthLayoutProps) {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.brandWrap}>{brand}</div>
        <main className={styles.formWrap}>{children}</main>
      </div>
    </div>
  )
}
