import { useState } from 'react'
import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { CheckboxField } from '@/components/CheckboxField'
import { PageHeader } from '@/components/PageHeader'
import { StateMessage } from '@/components/StateMessage'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useDriverHome } from '../hooks'
import { submitChecklist } from '../services/driverAppService'
import styles from './DriverPages.module.scss'

export function DriverChecklistPage() {
  useDocumentTitle('Checklist do veículo')
  const request = useDriverHome()
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [status, setStatus] = useState<'idle' | 'saving' | 'sent' | 'error'>('idle')

  if (request.status === 'loading') {
    return <StateMessage variant="loading" title="Carregando checklist..." />
  }

  if (request.status === 'error') {
    return (
      <StateMessage
        variant="error"
        title="Não foi possível carregar o checklist."
        action={
          <Button variant="secondary" onClick={request.reload}>
            Tentar novamente
          </Button>
        }
      />
    )
  }

  const items = request.data.checklist
  const checkedIds = items.filter((item) => checked[item.id]).map((item) => item.id)

  async function handleSubmit() {
    setStatus('saving')
    try {
      await submitChecklist(checkedIds)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Checklist do veículo"
        subtitle={`${request.data.vehicle.plate} · marque o que está em ordem`}
      />

      <Card>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id}>
              <CheckboxField
                label={item.label}
                checked={checked[item.id] ?? false}
                onChange={(value) => {
                  setChecked((current) => ({ ...current, [item.id]: value }))
                  setStatus('idle')
                }}
              />
            </li>
          ))}
        </ul>
      </Card>

      {status === 'sent' && (
        <Alert variant="success">Checklist enviado. Boa viagem!</Alert>
      )}
      {status === 'error' && (
        <Alert variant="danger">Não foi possível enviar. Tente novamente.</Alert>
      )}

      <Button isFullWidth isLoading={status === 'saving'} onClick={handleSubmit}>
        Enviar checklist ({checkedIds.length}/{items.length})
      </Button>
    </div>
  )
}
