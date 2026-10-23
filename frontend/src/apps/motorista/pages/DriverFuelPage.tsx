import { useState, type FormEvent } from 'react'
import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { PageHeader } from '@/components/PageHeader'
import { TextField } from '@/components/TextField'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { submitFuelEntry } from '../services/driverAppService'
import styles from './DriverPages.module.scss'

interface FuelValues {
  liters: string
  totalCost: string
  mileageKm: string
}

type FuelErrors = Partial<Record<keyof FuelValues, string>>

const EMPTY: FuelValues = { liters: '', totalCost: '', mileageKm: '' }

function toNumber(value: string): number {
  return Number(value.replace(',', '.'))
}

function validate(values: FuelValues): FuelErrors {
  const errors: FuelErrors = {}
  if (!(toNumber(values.liters) > 0)) errors.liters = 'Informe os litros.'
  if (!(toNumber(values.totalCost) > 0)) errors.totalCost = 'Informe o valor pago.'
  if (!(toNumber(values.mileageKm) > 0)) errors.mileageKm = 'Informe a quilometragem.'
  return errors
}

export function DriverFuelPage() {
  useDocumentTitle('Registrar abastecimento')
  const [values, setValues] = useState<FuelValues>(EMPTY)
  const [errors, setErrors] = useState<FuelErrors>({})
  const [status, setStatus] = useState<'idle' | 'saving' | 'sent' | 'error'>('idle')

  function update(field: keyof FuelValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setStatus('idle')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(values)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setStatus('saving')
    try {
      await submitFuelEntry({
        liters: toNumber(values.liters),
        totalCost: toNumber(values.totalCost),
        mileageKm: toNumber(values.mileageKm),
      })
      setValues(EMPTY)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader title="Abastecimento" subtitle="Registre o abastecimento realizado" />

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <TextField
          label="Litros"
          inputMode="decimal"
          value={values.liters}
          isInvalid={Boolean(errors.liters)}
          errorMessage={errors.liters}
          onChange={(value) => update('liters', value)}
        />
        <TextField
          label="Valor pago (R$)"
          inputMode="decimal"
          value={values.totalCost}
          isInvalid={Boolean(errors.totalCost)}
          errorMessage={errors.totalCost}
          onChange={(value) => update('totalCost', value)}
        />
        <TextField
          label="Quilometragem atual"
          inputMode="numeric"
          value={values.mileageKm}
          isInvalid={Boolean(errors.mileageKm)}
          errorMessage={errors.mileageKm}
          onChange={(value) => update('mileageKm', value)}
        />

        {status === 'sent' && <Alert variant="success">Abastecimento registrado.</Alert>}
        {status === 'error' && (
          <Alert variant="danger">Não foi possível registrar. Tente novamente.</Alert>
        )}

        <Button type="submit" isFullWidth isLoading={status === 'saving'}>
          Registrar
        </Button>
      </form>
    </div>
  )
}
