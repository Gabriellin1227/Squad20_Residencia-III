import { Link } from 'react-router-dom'
import styles from './Breadcrumb.module.scss'

export interface BreadcrumbItem {
  label: string
  /** Sem `to`, o item é o local atual. */
  to?: string
  /** Para telas filhas que compartilham a rota com a lista. */
  onClick?: () => void
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Você está em">
      <ol className={styles.list}>
        {items.map((item) => (
          <li key={item.label} className={styles.item}>
            {item.to ? (
              <Link to={item.to} onClick={item.onClick} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
