import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { classNames } from '@/utils/classNames'
import styles from './PageHeader.module.scss'

export interface PageHeaderProps {
  title: string
  subtitle?: string | undefined
  breadcrumb?: ReactNode
  className?: string
}

/** Cabeçalho padrão das telas. Ao montar, leva o foco e a rolagem para o título. */
export function PageHeader({ title, subtitle, breadcrumb, className }: PageHeaderProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    window.scrollTo?.({ top: 0 })
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <header className={classNames(styles.header, className)}>
      {breadcrumb}
      <h1 ref={headingRef} tabIndex={-1} className={styles.title}>
        {title}
      </h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  )
}
