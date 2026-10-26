import { Card } from '@/components/Card'
import { formatShortDateTime } from '@/utils/format'
import type { Trip } from '../../types'
import styles from './TripHistoryCard.module.scss'

export interface TripHistoryCardProps {
  trips: Trip[]
}

export function TripHistoryCard({ trips }: TripHistoryCardProps) {
  return (
    <Card title="Histórico de Viagens">
      {trips.length === 0 ? (
        <p className={styles.empty}>Nenhuma viagem registrada para este veículo.</p>
      ) : (
        <ul className={styles.list}>
          {trips.map((trip) => (
            <li key={trip.id} className={styles.item}>
              <span className={styles.code}>Viagem #{trip.code}</span>
              <span className={styles.route}>
                {trip.origin} <span aria-hidden="true">→</span>
                <span className={styles.srOnly}>para</span> {trip.destination}
              </span>
              <time className={styles.time} dateTime={trip.startedAt}>
                {formatShortDateTime(trip.startedAt)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
