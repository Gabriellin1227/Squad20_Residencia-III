import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { ButtonLink } from '@/components/ButtonLink'
import { Card } from '@/components/Card'
import { PageHeader } from '@/components/PageHeader'
import { StateMessage } from '@/components/StateMessage'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { formatKm, formatShortDateTime } from '@/utils/format'
import { useDriverHome } from '../hooks'
import styles from './DriverPages.module.scss'

export function DriverHomePage() {
  useDocumentTitle('Início do motorista')
  const request = useDriverHome()

  if (request.status === 'loading') {
    return <StateMessage variant="loading" title="Carregando seu dia..." />
  }

  if (request.status === 'error') {
    return (
      <StateMessage
        variant="error"
        title="Não foi possível carregar seus dados."
        action={
          <Button variant="secondary" onClick={request.reload}>
            Tentar novamente
          </Button>
        }
      />
    )
  }

  const { driverName, vehicle, trips } = request.data
  const nextTrip = trips.find((trip) => trip.status !== 'concluida')

  return (
    <div className={styles.page}>
      <PageHeader
        title={`Olá, ${driverName.split(' ')[0]}`}
        subtitle="Resumo do seu dia"
      />

      <Card title="Próxima viagem">
        {nextTrip ? (
          <>
            <div className={styles.row}>
              <strong>{nextTrip.code}</strong>
              <Badge variant="info">{formatShortDateTime(nextTrip.scheduledAt)}</Badge>
            </div>
            <p className={styles.route}>
              {nextTrip.origin} → {nextTrip.destination}
            </p>
            <p className={styles.muted}>{formatKm(nextTrip.distanceKm)} previstos</p>
          </>
        ) : (
          <p className={styles.muted}>Nenhuma viagem agendada.</p>
        )}
      </Card>

      <Card title="Meu veículo">
        <div className={styles.row}>
          <strong>{vehicle.plate}</strong>
          <span className={styles.muted}>{vehicle.fuelType}</span>
        </div>
        <p>{vehicle.model}</p>
        <p className={styles.muted}>{formatKm(vehicle.mileageKm)} rodados</p>
      </Card>

      <div className={styles.actions}>
        <ButtonLink to="/checklist" isFullWidth>
          Fazer checklist do veículo
        </ButtonLink>
        <ButtonLink to="/abastecimento" variant="secondary" isFullWidth>
          Registrar abastecimento
        </ButtonLink>
      </div>
    </div>
  )
}
