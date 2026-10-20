import { useId } from 'react'
import type { ReactNode } from 'react'
import { classNames } from '@/utils/classNames'
import styles from './Card.module.scss'

export interface CardProps {
  children: ReactNode
  title?: string
  className?: string
}

export function Card({ children, title, className }: CardProps) {
  const titleId = useId()

  return (
    <section
      className={classNames(styles.card, className)}
      aria-labelledby={title ? titleId : undefined}
    >
      {title && (
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}
