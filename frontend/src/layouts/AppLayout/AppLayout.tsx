import { useEffect, useId, useState } from 'react'
import type { ReactNode } from 'react'
import { classNames } from '@/utils/classNames'
import styles from './AppLayout.module.scss'

interface NavItem {
  key: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { key: 'inicio', label: 'Início' },
  { key: 'veiculos', label: 'Veículos' },
  { key: 'motoristas', label: 'Motoristas' },
  { key: 'abastecimentos', label: 'Abastecimentos' },
  { key: 'manutencoes', label: 'Manutenções' },
  { key: 'viagens', label: 'Viagens' },
  { key: 'relatorios', label: 'Relatórios' },
  { key: 'perfil', label: 'Perfil' },
]

// Por enquanto só a tela de veículos existe.
const ACTIVE_NAV_KEY = 'veiculos'

export interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const panelId = useId()

  useEffect(() => {
    if (!isMenuOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  function handleNavClick(item: NavItem) {
    if (item.key === ACTIVE_NAV_KEY) setIsMenuOpen(false)
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brandRow}>
          <div className={styles.brand}>
            <span className={styles.logo} aria-hidden="true">
              FM
            </span>
            <span className={styles.brandText}>
              <span className={styles.brandName}>FrotaManager</span>
              <span className={styles.brandTagline}>Gestão de Frota · FSPH</span>
            </span>
          </div>

          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={isMenuOpen}
            aria-controls={panelId}
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              {isMenuOpen ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>

        <div
          id={panelId}
          className={classNames(styles.panel, isMenuOpen && styles.panelOpen)}
        >
          <nav aria-label="Menu principal">
            <ul className={styles.navList}>
              {NAV_ITEMS.map((item) => {
                const isActive = item.key === ACTIVE_NAV_KEY
                return (
                  <li key={item.key}>
                    <button
                      type="button"
                      className={classNames(
                        styles.navItem,
                        isActive && styles.navItemActive,
                      )}
                      aria-current={isActive ? 'page' : undefined}
                      aria-disabled={isActive ? undefined : true}
                      title={isActive ? undefined : 'Em breve'}
                      onClick={() => handleNavClick(item)}
                    >
                      {item.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className={styles.userBox}>
            <span className={styles.avatar} aria-hidden="true" />
            <span className={styles.userText}>
              <span className={styles.userName}>Gestor de Frota</span>
              <button type="button" className={styles.logout}>
                Sair
              </button>
            </span>
          </div>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  )
}
