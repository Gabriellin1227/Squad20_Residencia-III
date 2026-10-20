import type { ReactNode } from 'react'
import { classNames } from '@/utils/classNames'
import styles from './Badge.module.scss'

export type BadgeVariant = 'success' | 'warning' | 'info' | 'danger' | 'neutral'

export interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span className={classNames(styles.badge, styles[variant], className)}>
      {children}
    </span>
  )
}
