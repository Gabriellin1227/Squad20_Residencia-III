import { StatCard } from '@/components/StatCard'
import type { DriverSummary } from '../../types'
import styles from './DriverStats.module.scss'

export interface DriverStatsProps {
  summary: DriverSummary
}

export function DriverStats({ summary }: DriverStatsProps) {
  return (
    <section className={styles.grid} aria-label="Resumo dos motoristas">
      <StatCard
        variant="success"
        label="Motoristas ativos"
        value={summary.active}
        hint={`de ${summary.total} cadastrados`}
      />
      <StatCard
        variant="warning"
        label="CNHs próximas do vencimento"
        value={summary.expiring}
        hint="exigem atenção em 30 dias"
      />
      <StatCard
        variant="danger"
        label="Bloqueios operacionais"
        value={summary.blocked}
        hint={`${summary.expired} CNH vencida${summary.expired === 1 ? '' : 's'}`}
      />
    </section>
  )
}
