import { Badge, type BadgeVariant } from '@/components/Badge'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { PageHeader } from '@/components/PageHeader'
import { StateMessage } from '@/components/StateMessage'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { formatKm, formatShortDateTime } from '@/utils/format'
import { useDriverHome } from '../hooks'
import type { DriverTripStatus } from '../types'
import styles from './DriverPages.module.scss'

const STATUS_LABEL: Record<DriverTripStatus, string> = {
  agendada: 'Agendada',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
}

const STATUS_VARIANT: Record<DriverTripStatus, BadgeVariant> = {
  agendada: 'info',
  em_andamento: 'warning',
  concluida: 'success',
}

export function DriverTripsPage() {
  useDocumentTitle('Minhas viagens')
  const request = useDriverHome()

  return (
    <div className={styles.page}>
      <PageHeader title="Minhas viagens" subtitle="Agendadas e concluídas" />

      {request.status === 'loading' && (
        <StateMessage variant="loading" title="Carregando viagens..." />
      )}

      {request.status === 'error' && (
        <StateMessage
          variant="error"
          title="Não foi possível carregar as viagens."
          action={
            <Button variant="secondary" onClick={request.reload}>
              Tentar novamente
            </Button>
          }
        />
      )}

      {request.status === 'success' && (
        <ul className={styles.list}>
          {request.data.trips.map((trip) => (
            <li key={trip.id}>
              <Card>
                <div className={styles.row}>
                  <strong>{trip.code}</strong>
                  <Badge variant={STATUS_VARIANT[trip.status]}>
                    {STATUS_LABEL[trip.status]}
                  </Badge>
                </div>
                <p className={styles.route}>
                  {trip.origin} → {trip.destination}
                </p>
                <p className={styles.muted}>
                  {formatShortDateTime(trip.scheduledAt)} · {formatKm(trip.distanceKm)}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
