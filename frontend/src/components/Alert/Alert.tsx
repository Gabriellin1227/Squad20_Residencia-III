import type { ReactNode } from 'react'
import { classNames } from '@/utils/classNames'
import styles from './Alert.module.scss'

export interface AlertProps {
  children: ReactNode
  variant?: 'info' | 'success' | 'warning' | 'danger'
  /** Ação à direita da mensagem (ex.: um botão). */
  action?: ReactNode
  /** Quando informado, exibe o botão de fechar. */
  onDismiss?: () => void
  className?: string
}

export function Alert({
  children,
  variant = 'info',
  action,
  onDismiss,
  className,
}: AlertProps) {
  const isUrgent = variant === 'danger' || variant === 'warning'

  return (
    <div
      className={classNames(styles.alert, styles[variant], className)}
      role={isUrgent ? 'alert' : 'status'}
    >
      <p className={styles.message}>{children}</p>
      {action}
      {onDismiss && (
        <button
          type="button"
          className={styles.dismiss}
          aria-label="Fechar aviso"
          onClick={onDismiss}
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
