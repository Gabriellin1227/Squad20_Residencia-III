import { ButtonLink } from '@/components/ButtonLink'
import { SelectField } from '@/components/SelectField'
import type { SelectOption } from '@/components/SelectField'
import { TextField } from '@/components/TextField'
import { Toolbar } from '@/components/Toolbar'
import { DRIVER_FLEETS, DRIVER_STATUSES } from '../../types'
import type { DriverFleetFilter, DriverStatusFilter } from '../../types'
import { DRIVER_STATUS_LABEL } from '../DriverStatusBadge'

const STATUS_OPTIONS: SelectOption<DriverStatusFilter>[] = [
  { value: 'todos', label: 'Status: Todos' },
  ...DRIVER_STATUSES.map((status) => ({
    value: status,
    label: `Status: ${DRIVER_STATUS_LABEL[status]}`,
  })),
]

const FLEET_OPTIONS: SelectOption<DriverFleetFilter>[] = [
  { value: 'todas', label: 'Frota: Todas' },
  ...DRIVER_FLEETS.map((fleet) => ({ value: fleet, label: `Frota: ${fleet}` })),
]

export interface DriverToolbarProps {
  search: string
  status: DriverStatusFilter
  fleet: DriverFleetFilter
  onSearchChange: (value: string) => void
  onStatusChange: (value: DriverStatusFilter) => void
  onFleetChange: (value: DriverFleetFilter) => void
}

export function DriverToolbar({
  search,
  status,
  fleet,
  onSearchChange,
  onStatusChange,
  onFleetChange,
}: DriverToolbarProps) {
  return (
    <Toolbar>
      <TextField
        label="Buscar motoristas"
        isLabelHidden
        type="search"
        placeholder="Buscar por nome ou CNH..."
        value={search}
        onChange={onSearchChange}
        autoComplete="off"
      />
      <SelectField
        label="Filtrar por status"
        isLabelHidden
        value={status}
        options={STATUS_OPTIONS}
        onChange={onStatusChange}
      />
      <SelectField
        label="Filtrar por frota"
        isLabelHidden
        value={fleet}
        options={FLEET_OPTIONS}
        onChange={onFleetChange}
      />
      <ButtonLink
        to="/motoristas/novo"
        iconStart={
          <svg viewBox="0 0 16 16" width="16" height="16">
            <path
              d="M8 3v10M3 8h10"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        }
      >
        Novo Motorista
      </ButtonLink>
    </Toolbar>
  )
}
