import { Button } from '@/components/Button'
import { ButtonLink } from '@/components/ButtonLink'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { StateMessage } from '@/components/StateMessage'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useDrivers } from '@/pages/drivers/hooks/useDrivers'
import { summarizeDrivers } from '@/pages/drivers/utils/driverRules'
import { useVehicles } from '@/pages/vehicles/hooks/useVehicles'
import styles from './HomePage.module.scss'

export function HomePage() {
  useDocumentTitle('Início')
  const vehiclesRequest = useVehicles()
  const driversRequest = useDrivers()

  function renderSummary() {
    if (vehiclesRequest.status === 'loading' || driversRequest.status === 'loading') {
      return <StateMessage variant="loading" title="Carregando resumo da frota..." />
    }

    if (vehiclesRequest.status === 'error' || driversRequest.status === 'error') {
      return (
        <StateMessage
          variant="error"
          title="Não foi possível carregar o resumo da frota."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                vehiclesRequest.reload()
                driversRequest.reload()
              }}
            >
              Tentar novamente
            </Button>
          }
        />
      )
    }

    const vehicles = vehiclesRequest.data
    const drivers = summarizeDrivers(driversRequest.data)
    const availableVehicles = vehicles.filter(
      (vehicle) => vehicle.status === 'ativo',
    ).length

    return (
      <section className={styles.stats} aria-label="Resumo da frota">
        <StatCard
          variant="info"
          label="Veículos na frota"
          value={vehicles.length}
          hint={`${availableVehicles} disponíveis`}
        />
        <StatCard
          variant="success"
          label="Motoristas ativos"
          value={drivers.active}
          hint={`de ${drivers.total} cadastrados`}
        />
        <StatCard
          variant="warning"
          label="CNHs próximas do vencimento"
          value={drivers.expiring}
          hint="em até 30 dias"
        />
        <StatCard
          variant="danger"
          label="Bloqueios operacionais"
          value={drivers.blocked}
          hint={`${drivers.expired} CNH vencida${drivers.expired === 1 ? '' : 's'}`}
        />
      </section>
    )
  }

  return (
    <div className={styles.page}>
      <PageHeader title="Bem-vindo ao FrotaManager" subtitle="Gestão de Frota · FSPH" />
      {renderSummary()}
      <div className={styles.shortcuts}>
        <ButtonLink to="/veiculos">Ir para Veículos</ButtonLink>
        <ButtonLink to="/motoristas" variant="secondary">
          Ir para Motoristas
        </ButtonLink>
      </div>
    </div>
  )
}
