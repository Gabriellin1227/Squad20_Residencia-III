export type DriverTripStatus = 'agendada' | 'em_andamento' | 'concluida'

export interface DriverTrip {
  id: string
  code: string
  origin: string
  destination: string
  scheduledAt: string // ISO 8601
  status: DriverTripStatus
  distanceKm: number
}

export interface DriverVehicle {
  plate: string
  model: string
  mileageKm: number
  fuelType: string
}

export interface DriverChecklistItem {
  id: string
  label: string
}

export interface FuelEntryInput {
  liters: number
  totalCost: number
  mileageKm: number
}

export interface DriverHomeData {
  driverName: string
  vehicle: DriverVehicle
  trips: DriverTrip[]
  checklist: DriverChecklistItem[]
}
