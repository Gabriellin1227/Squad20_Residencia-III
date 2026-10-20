import { Badge } from '@/components/Badge'
import type { BadgeVariant } from '@/components/Badge'
import type { VehicleStatus } from '../../types'

export const VEHICLE_STATUS_LABEL: Record<VehicleStatus, string> = {
  ativo: 'Ativo',
  manutencao: 'Manutenção',
  em_viagem: 'Em viagem',
  inativo: 'Inativo',
}

const VEHICLE_STATUS_VARIANT: Record<VehicleStatus, BadgeVariant> = {
  ativo: 'success',
  manutencao: 'warning',
  em_viagem: 'info',
  inativo: 'danger',
}

export interface VehicleStatusBadgeProps {
  status: VehicleStatus
}

export function VehicleStatusBadge({ status }: VehicleStatusBadgeProps) {
  return (
    <Badge variant={VEHICLE_STATUS_VARIANT[status]}>{VEHICLE_STATUS_LABEL[status]}</Badge>
  )
}
