import { Badge } from '@/components/Badge'
import type { BadgeVariant } from '@/components/Badge'
import type { DriverStatus } from '../../types'

export const DRIVER_STATUS_LABEL: Record<DriverStatus, string> = {
  ativo: 'Ativo',
  em_viagem: 'Em viagem',
  ferias: 'Férias',
  bloqueado: 'Bloqueado',
}

const DRIVER_STATUS_VARIANT: Record<DriverStatus, BadgeVariant> = {
  ativo: 'success',
  em_viagem: 'info',
  ferias: 'warning',
  bloqueado: 'danger',
}

export interface DriverStatusBadgeProps {
  status: DriverStatus
}

export function DriverStatusBadge({ status }: DriverStatusBadgeProps) {
  return (
    <Badge variant={DRIVER_STATUS_VARIANT[status]}>{DRIVER_STATUS_LABEL[status]}</Badge>
  )
}
