import { useAsync } from '@/hooks/useAsync'
import { getVehicles } from '../services/vehicleService'

export function useVehicles() {
  return useAsync(getVehicles)
}
