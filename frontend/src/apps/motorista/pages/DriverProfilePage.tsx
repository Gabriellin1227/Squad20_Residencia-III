import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { PageHeader } from '@/components/PageHeader'
import { StateMessage } from '@/components/StateMessage'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useDriverHome } from '../hooks'
import styles from './DriverPages.module.scss'

export function DriverProfilePage() {
  useDocumentTitle('Perfil do motorista')
  const request = useDriverHome()
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <PageHeader title="Perfil" />

      {request.status === 'loading' && (
        <StateMessage variant="loading" title="Carregando perfil..." />
      )}

      {request.status === 'error' && (
        <StateMessage variant="error" title="Não foi possível carregar o perfil." />
      )}

      {request.status === 'success' && (
        <Card>
          <strong>{request.data.driverName}</strong>
          <p className={styles.muted}>
            Veículo: {request.data.vehicle.plate} · {request.data.vehicle.model}
          </p>
        </Card>
      )}

      <Button variant="secondary" isFullWidth onClick={() => navigate('/login')}>
        Sair
      </Button>
    </div>
  )
}
