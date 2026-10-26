/** Formato retornado pelo backend em GET /vehicle. */
export interface VehicleResponse {
  id: string
  placa: string
  modelo: string
  tipo_combustivel: string
  ultimo_km_alertado?: number
  teto_gasto_mensal?: number | string | null
  quilometragem?: number
  capacidade_maxima: number
  status: string
  ativo: boolean
}

/** Campos que ainda não existem no backend (mockados por enquanto). */
export interface VehicleExtraInfoResponse {
  identificacao: string
  quilometragem: number
  frota: Fleet
  proxima_vistoria: string // "AAAA-MM"
}

export type VehicleStatus = 'ativo' | 'manutencao' | 'em_viagem' | 'inativo'

export type Fleet = 'Administrativa' | 'Assistencial' | 'Operacional' | 'Não informada'

export interface Vehicle {
  id: string
  identification: string
  plate: string
  model: string
  fuelType: string
  maxCapacity: number
  status: VehicleStatus
  mileageKm: number
  lastAlertedKm?: number
  monthlyCap?: number | null
  fleet: Fleet
  nextInspection: string // "AAAA-MM"
}

export interface Trip {
  id: string
  code: string
  origin: string
  destination: string
  startedAt: string // ISO 8601
}

export type MaintenanceType = 'preventiva' | 'corretiva' | 'impeditiva'

export interface Maintenance {
  id: string
  type: MaintenanceType
  description: string
  date: string // "AAAA-MM-DD"
  mileageKm: number | null
  cost: number
}

export interface InspectionItem {
  id: string
  label: string
  isOk: boolean
}

export interface VehicleDetails {
  availability?: { trips: boolean; checklist: boolean; maintenance: boolean }
  vehicle: Vehicle
  trips: Trip[]
  maintenances: Maintenance[]
  checklist: InspectionItem[]
}

export type VehicleStatusFilter = VehicleStatus | 'todos'

export type FleetFilter = Fleet | 'todas'
