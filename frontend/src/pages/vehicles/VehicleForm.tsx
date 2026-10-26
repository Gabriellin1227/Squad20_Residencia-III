import { useState, type FormEvent } from 'react'
import { Button } from '@/components/Button'
import { TextField } from '@/components/TextField'
import { api } from '@/service/api'
import type { Vehicle } from './types'

interface Props {
  vehicle: Vehicle | null
  onSave: () => void
  onCancel: () => void
}
export function VehicleForm({ vehicle, onSave, onCancel }: Props) {
  const [values, setValues] = useState({
    placa: vehicle?.plate ?? '',
    modelo: vehicle?.model ?? '',
    tipo_combustivel: vehicle?.fuelType ?? '',
    capacidade_maxima: String(vehicle?.maxCapacity ?? ''),
    quilometragem: String(vehicle?.mileageKm ?? 0),
    ultimo_km_alertado: String(vehicle?.lastAlertedKm ?? 0),
    teto_gasto_mensal: vehicle?.monthlyCap == null ? '' : String(vehicle.monthlyCap),
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  async function submit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const body = {
        ...values,
        capacidade_maxima: Number(values.capacidade_maxima),
        quilometragem: Number(values.quilometragem),
        ultimo_km_alertado: Number(values.ultimo_km_alertado),
        teto_gasto_mensal:
          values.teto_gasto_mensal === '' ? undefined : Number(values.teto_gasto_mensal),
      }
      await api(vehicle ? `/vehicles/${encodeURIComponent(vehicle.id)}` : '/vehicles', {
        method: vehicle ? 'PUT' : 'POST',
        body: JSON.stringify(body),
      })
      onSave()
    } catch (cause) {
      setError((cause as Error).message)
    } finally {
      setSaving(false)
    }
  }
  const fields = [
    ['placa', 'Placa', 'text'],
    ['modelo', 'Modelo', 'text'],
    ['tipo_combustivel', 'Combustível', 'text'],
    ['capacidade_maxima', 'Capacidade máxima', 'number'],
    ['quilometragem', 'Quilometragem atual', 'number'],
    ['ultimo_km_alertado', 'Quilometragem do último alerta', 'number'],
    ['teto_gasto_mensal', 'Teto de gasto mensal (opcional)', 'number'],
  ] as const
  return (
    <section>
      <h1>{vehicle ? 'Editar veículo' : 'Cadastrar veículo'}</h1>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={submit}>
        {fields.map(([key, label, type]) => (
          <TextField
            key={key}
            id={`vehicle-${key}`}
            label={label}
            type={type}
            min={key === 'capacidade_maxima' ? 1 : 0}
            step={key === 'teto_gasto_mensal' ? '0.01' : '1'}
            value={values[key]}
            onChange={(value) => setValues({ ...values, [key]: value })}
            disabled={saving}
            required={key !== 'teto_gasto_mensal'}
          />
        ))}
        <Button type="submit" isLoading={saving}>
          Salvar veículo
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
      </form>
    </section>
  )
}
