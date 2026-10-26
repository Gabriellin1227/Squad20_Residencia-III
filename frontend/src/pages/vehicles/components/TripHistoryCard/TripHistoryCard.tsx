import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { formatShortDateTime } from '@/utils/format'
import type { Trip } from '../../types'
import styles from './TripHistoryCard.module.scss'

export interface TripHistoryCardProps {
  trips: Trip[]
  onViewAll?: () => void
  error?: string | undefined
  onRetry?: () => void
}

export function TripHistoryCard({
  trips,
  onViewAll,
  error,
  onRetry,
}: TripHistoryCardProps) {
  return (
    <Card title="Histórico de Viagens">
      {error ? (
        <Alert
          variant="danger"
          action={
            onRetry ? (
              <Button variant="secondary" onClick={onRetry}>
                Tentar novamente
              </Button>
            ) : undefined
          }
        >
          {error}
        </Alert>
      ) : trips.length === 0 ? (
        <p className={styles.empty}>Nenhuma viagem registrada para este veículo.</p>
      ) : (
        <ul className={styles.list}>
          {(onViewAll ? trips.slice(0, 3) : trips).map((trip) => (
            <li key={trip.id} className={styles.item}>
              <span className={styles.code}>Viagem #{trip.code}</span>
              {trip.origin && trip.destination && (
                <span className={styles.route}>
                  {trip.origin} → {trip.destination}
                </span>
              )}
              {trip.status && <span className={styles.route}>{trip.status}</span>}
              {trip.startedAt ? (
                <time className={styles.time} dateTime={trip.startedAt}>
                  {formatShortDateTime(trip.startedAt)}
                </time>
              ) : (
                <span className={styles.time}>Data de início não informada</span>
              )}
              {trip.mileageStart != null && (
                <span className={styles.route}>
                  KM inicial: {trip.mileageStart}
                  {trip.mileageEnd != null ? ` · KM final: ${trip.mileageEnd}` : ''}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      {onViewAll && !error && (
        <Button variant="secondary" onClick={onViewAll}>
          Ver histórico completo
        </Button>
      )}
    </Card>
  )
}
