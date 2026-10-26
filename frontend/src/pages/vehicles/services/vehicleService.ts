import { currentUser } from '@/service/authService'
import { api } from '@/service/api'
import type { Vehicle, VehicleDetails, VehicleResponse, VehicleStatus } from '../types'

const toVehicle = (row: VehicleResponse): Vehicle => ({
  id: row.id,
  identification: '—',
  plate: row.placa,
  model: row.modelo,
  fuelType: row.tipo_combustivel,
  maxCapacity: row.capacidade_maxima,
  status: !row.ativo
    ? 'inativo'
    : (({ Disponível: 'ativo', 'Em manutenção': 'manutencao', 'Em viagem': 'em_viagem' }[
        row.status
      ] ??
        (['ativo', 'manutencao', 'em_viagem', 'inativo'].includes(row.status)
          ? row.status
          : 'inativo')) as VehicleStatus),
  mileageKm: Number(row.quilometragem ?? 0),
  lastAlertedKm: row.ultimo_km_alertado ?? 0,
  monthlyCap: row.teto_gasto_mensal == null ? null : Number(row.teto_gasto_mensal),
  fleet: 'Não informada',
  nextInspection: '',
})
export async function getVehicles(): Promise<Vehicle[]> {
  return (await api<{ message: VehicleResponse[] }>('/vehicles')).message.map(toVehicle)
}
export async function getVehicleDetails(id: string): Promise<VehicleDetails> {
  const row = (
    await api<{ message: VehicleResponse }>(`/vehicles/${encodeURIComponent(id)}`)
  ).message
  const user = await currentUser()
  const canReadMaintenance = user.permissoes.includes('manutencoes:ler')
  interface MaintenanceRow {
    id: string
    veiculo_id: string
    tipo_manutencao: 'preventiva' | 'impeditiva'
    descricao: string | null
    data_inicio: string
    km_realizado: number | null
    custo: string | number
  }
  const history = canReadMaintenance
    ? (await api<{ message: MaintenanceRow[] }>('/maintance')).message
    : []
  return {
    vehicle: toVehicle(row),
    trips: [],
    checklist: [],
    availability: { trips: false, checklist: false, maintenance: canReadMaintenance },
    maintenances: history
      .filter((m) => m.veiculo_id === id)
      .map((m) => ({
        id: m.id,
        type: m.tipo_manutencao,
        description: m.descricao ?? '',
        date: m.data_inicio.slice(0, 10),
        mileageKm: m.km_realizado,
        cost: Number(m.custo),
      })),
  }
}
